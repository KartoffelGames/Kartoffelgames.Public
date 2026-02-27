import { BufferUsage, GpuBuffer } from '@kartoffelgames/web-gpu';
import { LightComponent } from '../component/light/light-component.ts';
import { AreaLight } from '../component/light/type/area-light.ts';
import { DirectionalLight } from '../component/light/type/directional-light.ts';
import type { ILightComponentItem } from '../component/light/type/i-light-component-item.interface.ts';
import { PointLight } from '../component/light/type/point-light.ts';
import { SpotLight } from '../component/light/type/spot-light.ts';
import { TransformationComponent } from '../component/transformation-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';
import { TransformationSystem } from './transformation-system.ts';

/**
 * System that manages light components and their data storage in a tightly packed auto-scaling buffer.
 * Light data is stored contiguously as a WGSL-aligned struct array so the GPU can iterate over all active lights efficiently.
 * The struct alignment is 16 bytes (max member alignment from vec4<f32>).
 *
 * Buffer layout per light (16 x 32bit values = 64 bytes):
 *   Offset  Index   Type              Field
 *   0       0-3     vec4<f32>         position, calculatedRange   - World position (x, y, z, calculatedRange)
 *   16      4-7     vec4<f32>         color, intensity            - (r, g, b, intensity)
 *   32      8-11    vec4<f32>         rotation, dropOff           - (x,y,z, dropOff) Forward direction vector (directional, spot, area only), Falloff curve factor
 *   48      12      i32               lightType                   - 0 = point, 1 = directional, 2 = spot, 3 = area
 *   52      13      2xPacked<f16>     innerAngle, outerAngle      - Inner and outer cone angles in degrees (spot only)
 *   56      14      2xPacked<f16>     width, height               - Area light width and height from transformation scale (area only)
 *   60      15      x32               reserved                    - Reserved for future use and padding
 *
 * Lights are tightly packed: active lights occupy indices 0..activeLightCount-1 with no gaps.
 * On removal, the last active light is swapped into the freed slot to maintain compactness.
 * Buffer expands in blocks of 4 lights whenever a new light has no room.
 */
export class LightSystem extends GameSystem {
    private static readonly LIGHT_STRIDE: number = 24;
    private static readonly LIGHTS_PER_BLOCK: number = 4;
    private static readonly BLOCK_SIZE: number = LightSystem.LIGHT_STRIDE * LightSystem.LIGHTS_PER_BLOCK;

    private readonly mActiveComponents: Array<LightComponent>;
    private mCapacity: number;
    private readonly mComponentToIndex: WeakMap<LightComponent, number>;
    private readonly mDataBuffer: SharedArrayBuffer;
    private mDataView: Float32Array;
    private mGpuBuffer: GpuBuffer | null;
    private mIntView: Int32Array;

    /**
     * Gets the number of currently active lights.
     */
    public get activeLightCount(): number {
        this.lockGate();
        return this.mActiveComponents.length;
    }

    /**
     * Gets the system types this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [GpuSystem, TransformationSystem];
    }

    /**
     * Gets the GPU buffer containing tightly packed light data.
     */
    public get lightBuffer(): GpuBuffer {
        this.lockGate();
        return this.mGpuBuffer!;
    }

    /**
     * Gets the component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [LightComponent];
    }

    /**
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('Light', pEnvironment);

        // Initialize buffer with 1 block (4 lights) so the GPU always has a valid buffer to bind.
        const lInitialBytes: number = LightSystem.BLOCK_SIZE * 4; // 96 floats * 4 bytes = 384 bytes.
        this.mDataBuffer = new SharedArrayBuffer(lInitialBytes, { maxByteLength: LightSystem.BLOCK_SIZE * 4 * 250 });
        this.mDataView = new Float32Array(this.mDataBuffer);
        this.mIntView = new Int32Array(this.mDataBuffer);
        this.mGpuBuffer = null;
        this.mActiveComponents = [];
        this.mComponentToIndex = new WeakMap<LightComponent, number>();
        this.mCapacity = LightSystem.LIGHTS_PER_BLOCK;
    }

    /**
     * Initializes the light system by creating a GPU buffer for light data storage.
     */
    protected override async onCreate(): Promise<void> {
        const lGpuSystem: GpuSystem = this.environment.getSystem(GpuSystem);

        const lGpuBuffer: GpuBuffer = new GpuBuffer(lGpuSystem.gpu, this.mDataBuffer.byteLength);
        lGpuBuffer.extendUsage(BufferUsage.Storage | BufferUsage.CopySource | BufferUsage.CopyDestination);

        this.mGpuBuffer = lGpuBuffer;
    }

    /**
     * Processes state changes for light components.
     * Manages tightly packed buffer allocation, data writing, and GPU synchronization.
     *
     * @param pStateChanges - Map of component types to state change events.
     */
    protected override async onUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        const lUpdateBounds: LightSystemBufferUpdateRange = {
            lowerBound: 0,
            upperBound: 0
        };

        for (const lStateChange of pStateChanges.get(LightComponent)!) {
            const lLightComponent: LightComponent = lStateChange.component as LightComponent;

            switch (lStateChange.type) {
                case 'add':
                case 'activate': {
                    // Ensure capacity by extending buffer if needed.
                    if (this.mActiveComponents.length >= this.mCapacity) {
                        const lExtendRange: LightSystemBufferUpdateRange = this.extendBuffer(1);
                        lUpdateBounds.lowerBound = Math.min(lUpdateBounds.lowerBound, lExtendRange.lowerBound);
                        lUpdateBounds.upperBound = Math.max(lUpdateBounds.upperBound, lExtendRange.upperBound);
                    }

                    // Assign slot at the end of the active range for tight packing.
                    const lIndex: number = this.mActiveComponents.length;
                    this.mActiveComponents.push(lLightComponent);
                    this.mComponentToIndex.set(lLightComponent, lIndex);

                    // Write light data to buffer.
                    const lWriteRange: LightSystemBufferUpdateRange = this.writeLightToBuffer(lLightComponent, lIndex);
                    lUpdateBounds.lowerBound = Math.min(lUpdateBounds.lowerBound, lWriteRange.lowerBound);
                    lUpdateBounds.upperBound = Math.max(lUpdateBounds.upperBound, lWriteRange.upperBound);

                    break;
                }
                case 'update': {
                    // Only update if the component is currently active in the buffer.
                    if (!this.mComponentToIndex.has(lLightComponent)) {
                        break;
                    }

                    const lIndex: number = this.mComponentToIndex.get(lLightComponent)!;
                    const lWriteRange: LightSystemBufferUpdateRange = this.writeLightToBuffer(lLightComponent, lIndex);
                    lUpdateBounds.lowerBound = Math.min(lUpdateBounds.lowerBound, lWriteRange.lowerBound);
                    lUpdateBounds.upperBound = Math.max(lUpdateBounds.upperBound, lWriteRange.upperBound);

                    break;
                }
                case 'remove':
                case 'deactivate': {
                    const lRemoveRange: LightSystemBufferUpdateRange | null = this.removeLightFromBuffer(lLightComponent);
                    if (lRemoveRange) {
                        lUpdateBounds.lowerBound = Math.min(lUpdateBounds.lowerBound, lRemoveRange.lowerBound);
                        lUpdateBounds.upperBound = Math.max(lUpdateBounds.upperBound, lRemoveRange.upperBound);
                    }

                    break;
                }
            }
        }

        // Sync changed region to GPU buffer.
        if (lUpdateBounds.lowerBound !== 0 || lUpdateBounds.upperBound !== 0) {
            // Resize GPU buffer if the shared buffer has grown.
            if (this.mGpuBuffer!.size < this.mDataBuffer.byteLength) {
                this.mGpuBuffer!.size = this.mDataBuffer.byteLength;
            }

            // Align lower bound to 8 bytes.
            lUpdateBounds.lowerBound = lUpdateBounds.lowerBound & ~7;

            // Align upper bound to 4 bytes (add 1 for inclusive, then round up to next multiple of 4).
            lUpdateBounds.upperBound = (lUpdateBounds.upperBound + 1 + 3) & ~3;

            // Write changed byte range to GPU buffer.
            this.mGpuBuffer!.write(this.mDataBuffer, lUpdateBounds.lowerBound, lUpdateBounds.lowerBound, lUpdateBounds.upperBound - lUpdateBounds.lowerBound);
        }
    }

    /**
     * Extends the buffer to accommodate more lights.
     *
     * @param pBlockCount - Number of blocks to add. Each block holds LIGHTS_PER_BLOCK lights.
     *
     * @returns The byte range of the newly allocated region.
     */
    private extendBuffer(pBlockCount: number): LightSystemBufferUpdateRange {
        const lBlockSizeInBytes: number = LightSystem.BLOCK_SIZE * 4;
        const lOldByteLength: number = this.mDataBuffer.byteLength;

        this.mDataBuffer.grow(lOldByteLength + lBlockSizeInBytes * pBlockCount);
        this.mDataView = new Float32Array(this.mDataBuffer);
        this.mIntView = new Int32Array(this.mDataBuffer);
        this.mCapacity += LightSystem.LIGHTS_PER_BLOCK * pBlockCount;

        return {
            lowerBound: lOldByteLength,
            upperBound: this.mDataBuffer.byteLength - 1
        };
    }

    /**
     * Removes a light from the buffer by swapping it with the last active light to maintain tight packing.
     *
     * @param pComponent - The light component to remove.
     *
     * @returns The byte range that was modified, or null if no buffer data changed.
     */
    private removeLightFromBuffer(pComponent: LightComponent): LightSystemBufferUpdateRange | null {
        const lIndex: number = this.mComponentToIndex.get(pComponent)!;
        const lLastIndex: number = this.mActiveComponents.length - 1;

        let lUpdateRange: LightSystemBufferUpdateRange | null = null;

        if (lIndex !== lLastIndex) {
            // Swap last light into the removed slot to maintain contiguous packing.
            const lLastComponent: LightComponent = this.mActiveComponents[lLastIndex];
            this.mActiveComponents[lIndex] = lLastComponent;
            this.mComponentToIndex.set(lLastComponent, lIndex);

            // Copy buffer data from last slot to removed slot (raw float32 copy preserves i32 bits).
            const lSrcOffset: number = lLastIndex * LightSystem.LIGHT_STRIDE;
            const lDstOffset: number = lIndex * LightSystem.LIGHT_STRIDE;
            for (let lElement = 0; lElement < LightSystem.LIGHT_STRIDE; lElement++) {
                this.mDataView[lDstOffset + lElement] = this.mDataView[lSrcOffset + lElement];
            }

            lUpdateRange = {
                lowerBound: lDstOffset * 4,
                upperBound: (lDstOffset + LightSystem.LIGHT_STRIDE) * 4
            };
        }

        // Pop the last element (either the removed component or the swapped one).
        this.mActiveComponents.pop();
        this.mComponentToIndex.delete(pComponent);

        return lUpdateRange;
    }

    /**
     * Determines the numeric light type identifier for a given light component item.
     * 0 = point, 1 = directional, 2 = spot, 3 = area.
     *
     * @param pLight - The light component item.
     *
     * @returns numeric type identifier.
     */
    private resolveLightType(pLight: ILightComponentItem): number {
        if (pLight instanceof PointLight) {
            return 0;
        } else if (pLight instanceof DirectionalLight) {
            return 1;
        } else if (pLight instanceof SpotLight) {
            return 2;
        } else if (pLight instanceof AreaLight) {
            return 3;
        }

        return 0;
    }

    /**
     * Writes a light component's data to the buffer at the specified index.
     * Reads world position from TransformationSystem and forward direction from the rotation quaternion.
     * Type-specific properties (range, dropOff, angles, area size) are written based on the light implementation.
     *
     * @param pComponent - The light component to write.
     * @param pIndex - The slot index in the tightly packed buffer.
     *
     * @returns The byte range that was written.
     */
    private writeLightToBuffer(pComponent: LightComponent, pIndex: number): LightSystemBufferUpdateRange {
        const lTransformationSystem: TransformationSystem = this.environment.getSystem(TransformationSystem);
        const lTransformation: TransformationComponent = pComponent.gameEntity.getComponent(TransformationComponent);
        const lLight: ILightComponentItem = pComponent.light;
        const lOffset: number = pIndex * LightSystem.LIGHT_STRIDE;
        const lLightType: number = this.resolveLightType(lLight);

        // Read world position from TransformationSystem world matrix (column 3 = translation).
        const lWorldMatrix = lTransformationSystem.worldMatrixOfTransformation(lTransformation);
        const lWorldData = lWorldMatrix.dataArray;

        // Position (vec4<f32>, indices 0-3).
        this.mDataView[lOffset + 0] = lWorldData[12]; // x
        this.mDataView[lOffset + 1] = lWorldData[13]; // y
        this.mDataView[lOffset + 2] = lWorldData[14]; // z
        this.mDataView[lOffset + 3] = 0;              // w unused

        // Color (vec4<f32>, indices 4-7). Alpha = intensity.
        this.mDataView[lOffset + 4] = lLight.color.r;
        this.mDataView[lOffset + 5] = lLight.color.g;
        this.mDataView[lOffset + 6] = lLight.color.b;
        this.mDataView[lOffset + 7] = lLight.intensity;

        // Light type (i32, index 8).
        this.mIntView[lOffset + 8] = lLightType;

        // Reserved (f32, index 9). Previously intensity.
        this.mDataView[lOffset + 9] = 0;

        // Range and dropOff (f32, indices 10-11).
        let lRange: number = 0;
        let lDropOff: number = 0;
        if (lLight instanceof PointLight || lLight instanceof SpotLight || lLight instanceof AreaLight) {
            lRange = lLight.range;
            lDropOff = lLight.dropOff;
        }
        this.mDataView[lOffset + 10] = lRange;
        this.mDataView[lOffset + 11] = lDropOff;

        // Rotation / forward direction (vec4<f32>, indices 12-15). For directional, spot, and area lights.
        if (lLight instanceof DirectionalLight || lLight instanceof SpotLight || lLight instanceof AreaLight) {
            const lForward = lTransformation.rotation.vectorForward;
            this.mDataView[lOffset + 12] = lForward.x;
            this.mDataView[lOffset + 13] = lForward.y;
            this.mDataView[lOffset + 14] = lForward.z;
            this.mDataView[lOffset + 15] = 0;
        } else {
            this.mDataView[lOffset + 12] = 0;
            this.mDataView[lOffset + 13] = 0;
            this.mDataView[lOffset + 14] = 0;
            this.mDataView[lOffset + 15] = 0;
        }

        // Calculated range (f32, index 16). Equals range. Not needed for directional lights.
        if (lLightType !== 1) {
            this.mDataView[lOffset + 16] = lRange;
        } else {
            this.mDataView[lOffset + 16] = 0;
        }

        // Inner/outer angle (f32, indices 17-18). Spot only.
        if (lLight instanceof SpotLight) {
            this.mDataView[lOffset + 17] = lLight.innerAngle;
            this.mDataView[lOffset + 18] = lLight.outerAngle;
        } else {
            this.mDataView[lOffset + 17] = 0;
            this.mDataView[lOffset + 18] = 0;
        }

        // Width/height (f32, indices 19-20). Area only, read from transformation scale.
        if (lLight instanceof AreaLight) {
            this.mDataView[lOffset + 19] = lTransformation.scaleWidth;
            this.mDataView[lOffset + 20] = lTransformation.scaleHeight;
        } else {
            this.mDataView[lOffset + 19] = 0;
            this.mDataView[lOffset + 20] = 0;
        }

        // Reserved padding (indices 21-23).
        this.mDataView[lOffset + 21] = 0;
        this.mDataView[lOffset + 22] = 0;
        this.mDataView[lOffset + 23] = 0;

        return {
            lowerBound: lOffset * 4,
            upperBound: (lOffset + LightSystem.LIGHT_STRIDE) * 4
        };
    }
}

type LightSystemBufferUpdateRange = {
    /**
     * Lower bound of the buffer range that has been updated (inclusive, in bytes).
     */
    lowerBound: number;

    /**
     * Upper bound of the buffer range that has been updated (inclusive, in bytes).
     */
    upperBound: number;
};
