import { BufferUsage, GpuBuffer, GpuLimit } from '@kartoffelgames/web-gpu';
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
import { LightComponentItemType } from "../component/light/type/light-component-item-type.enum.ts";

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
    private static readonly LIGHT_STRUCT_STRIDE: number = 16;

    private readonly mActiveComponents: Array<LightComponent>;
    private mCapacity: number;
    private readonly mComponentToIndex: WeakMap<LightComponent, number>;
    private mDataBuffer: SharedArrayBuffer | null;
    private mDataBufferFloatView: Float32Array | null;
    private mDataBufferView: DataView | null;
    private mGpuBuffer: GpuBuffer | null;

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
        this.mDataBuffer = null;
        this.mDataBufferView = null;
        this.mDataBufferFloatView = null;

        this.mGpuBuffer = null;
        this.mActiveComponents = [];
        this.mComponentToIndex = new WeakMap<LightComponent, number>();
        this.mCapacity = 0;
    }

    /**
     * Initializes the light system by creating a GPU buffer for light data storage.
     */
    protected override async onCreate(): Promise<void> {
        const lGpuSystem: GpuSystem = this.environment.getSystem(GpuSystem);

        // Read gpu system max storage buffer limit.
        const lMaxStorageBufferBindingSize: number = lGpuSystem.gpuLimit(GpuLimit.MaxStorageBufferBindingSize);

        // Create the shared buffer for all light struct data.
        this.mDataBuffer = new SharedArrayBuffer(0, { maxByteLength: lMaxStorageBufferBindingSize });
        this.mDataBufferView = new DataView(this.mDataBuffer);
        this.mDataBufferFloatView = new Float32Array(this.mDataBuffer);

        // Create GPU buffer for light data.
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
                        const lExtendRange: LightSystemBufferUpdateRange = this.extendBuffer(4);
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
            if (this.mGpuBuffer!.size < this.mDataBuffer!.byteLength) {
                this.mGpuBuffer!.size = this.mDataBuffer!.byteLength;
            }

            // Align lower bound to 8 bytes.
            lUpdateBounds.lowerBound = lUpdateBounds.lowerBound & ~7;

            // Align upper bound to 4 bytes (add 1 for inclusive, then round up to next multiple of 4).
            lUpdateBounds.upperBound = (lUpdateBounds.upperBound + 1 + 3) & ~3;

            // Write changed byte range to GPU buffer.
            this.mGpuBuffer!.write(this.mDataBuffer!, lUpdateBounds.lowerBound, lUpdateBounds.lowerBound, lUpdateBounds.upperBound - lUpdateBounds.lowerBound);
        }
    }

    /**
     * Extends the buffer to accommodate more lights.
     *
     * @param pLightCount - Number of lights to add.
     *
     * @returns The byte range of the newly allocated region.
     */
    private extendBuffer(pLightCount: number): LightSystemBufferUpdateRange {
        const lBlockSizeInBytes: number = LightSystem.LIGHT_STRUCT_STRIDE * 4 * pLightCount;
        const lOldByteLength: number = this.mDataBuffer!.byteLength;

        this.mDataBuffer!.grow(lOldByteLength + lBlockSizeInBytes);
        this.mDataBufferFloatView = new Float32Array(this.mDataBuffer!);
        this.mDataBufferView = new DataView(this.mDataBuffer!);
        this.mCapacity += pLightCount;

        return {
            lowerBound: lOldByteLength,
            upperBound: this.mDataBuffer!.byteLength - 1
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
            const lSrcOffset: number = lLastIndex * LightSystem.LIGHT_STRUCT_STRIDE;
            const lDstOffset: number = lIndex * LightSystem.LIGHT_STRUCT_STRIDE;
            for (let lElement = 0; lElement < LightSystem.LIGHT_STRUCT_STRIDE; lElement++) {
                this.mDataBufferFloatView![lDstOffset + lElement] = this.mDataBufferFloatView![lSrcOffset + lElement];
            }

            lUpdateRange = {
                lowerBound: lDstOffset * 4,
                upperBound: (lDstOffset + LightSystem.LIGHT_STRUCT_STRIDE) * 4
            };
        }

        // Pop the last element (either the removed component or the swapped one).
        this.mActiveComponents.pop();
        this.mComponentToIndex.delete(pComponent);

        return lUpdateRange;
    }

    /**
     * Calculates the effective range where light intensity drops to the 0.1% threshold.
     * Attenuation model: 1 / (1 + d^(2 * dropOff)).
     * At 0.1% threshold: d = (1000 * intensity - 1) ^ (1 / (2 * dropOff)).
     *
     * @param pRange - Maximum user-defined range.
     * @param pIntensity - Light intensity multiplier.
     * @param pDropOff - Drop-off exponent factor. 0 = no falloff, 1 = inverse square law.
     *
     * @returns The calculated effective range, clamped by the user-defined range.
     */
    private calculateRange(pRange: number, pIntensity: number, pDropOff: number): number {
        // No falloff means full intensity across entire range.
        if (pDropOff <= 0) {
            return pRange;
        }

        // Solve: intensity / (1 + d^(2*dropOff)) = 0.001
        // => d^(2*dropOff) = (intensity / 0.001) - 1 = 1000*intensity - 1
        const lNumerator: number = 1000 * pIntensity - 1;
        if (lNumerator <= 0) {
            // Intensity too low for attenuation to reach 0.1% even at distance 0.
            return 0;
        }

        const lCalculatedRange: number = Math.pow(lNumerator, 1 / (2 * pDropOff));

        return Math.min(pRange, lCalculatedRange);
    }

    /**
     * Writes a light component's data to the buffer at the specified index.
     * Reads world position from TransformationSystem and forward direction from the rotation quaternion.
     * Type-specific properties (dropOff, angles, area size) are packed and written based on the light implementation.
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
        const lOffset: number = pIndex * LightSystem.LIGHT_STRUCT_STRIDE;

        // Read world position from TransformationSystem world matrix (column 3 = translation).
        const lWorldMatrix = lTransformationSystem.worldMatrixOfTransformation(lTransformation);
        const lWorldData = lWorldMatrix.dataArray;

        // Get range and dropOff for applicable light types.
        let lRange: number = 0;
        let lDropOff: number = 0;
        if (lLight.type !== LightComponentItemType.Directional) {
            // Convert into a point/spot/area light to read range and dropOff properties.
            const lNonDirectionalLight: PointLight | SpotLight | AreaLight = lLight as PointLight | SpotLight | AreaLight;
            lRange = lNonDirectionalLight.range;
            lDropOff = lNonDirectionalLight.dropOff;
        }

        // Position + calculatedRange (vec4<f32>, indices 0-3).
        this.mDataBufferFloatView![lOffset + 0] = lWorldData[12]; // x
        this.mDataBufferFloatView![lOffset + 1] = lWorldData[13]; // y
        this.mDataBufferFloatView![lOffset + 2] = lWorldData[14]; // z

        // Calculated range on w component of vec4.
        if (lLight.type !== LightComponentItemType.Directional) {
            this.mDataBufferFloatView![lOffset + 3] = this.calculateRange(lRange, lLight.intensity, lDropOff);
        }

        // Color + intensity (vec4<f32>, indices 4-7).
        this.mDataBufferFloatView![lOffset + 4] = lLight.color.r;
        this.mDataBufferFloatView![lOffset + 5] = lLight.color.g;
        this.mDataBufferFloatView![lOffset + 6] = lLight.color.b;
        this.mDataBufferFloatView![lOffset + 7] = lLight.intensity;

        // Rotation + dropOff (vec4<f32>, indices 8-11).
        const lForward = lTransformation.rotation.vectorForward;
        this.mDataBufferFloatView![lOffset + 8] = lForward.x;
        this.mDataBufferFloatView![lOffset + 9] = lForward.y;
        this.mDataBufferFloatView![lOffset + 10] = lForward.z;

        // Drop-off factor for attenuation (point, spot, area) or shadow softness (directional).
        this.mDataBufferFloatView![lOffset + 11] = lDropOff;

        // Light type (i32, index 12).
        this.mDataBufferView!.setInt32((lOffset + 12) * 4, lLight.type, true);

        // Packed innerAngle/outerAngle (2xf16, index 13).
        if (lLight.type === LightComponentItemType.Spot) {
            // "Convert" light into a spot light.
            const lSpotLight: SpotLight = lLight as SpotLight;

            this.mDataBufferView!.setFloat16((lOffset + 13) * 4, lSpotLight.innerAngle, true);
            this.mDataBufferView!.setFloat16((lOffset + 13) * 4 + 2, lSpotLight.outerAngle, true);
        }

        // Packed width/height (2xf16, index 14).
        if (lLight.type === LightComponentItemType.Area) {
            this.mDataBufferView!.setFloat16((lOffset + 14) * 4, lTransformation.scaleWidth, true);
            this.mDataBufferView!.setFloat16((lOffset + 14) * 4 + 2, lTransformation.scaleHeight, true);
        }

        return {
            lowerBound: lOffset * 4,
            upperBound: (lOffset + LightSystem.LIGHT_STRUCT_STRIDE) * 4
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
