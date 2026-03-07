import { BufferUsage, GpuBuffer, GpuLimit } from '@kartoffelgames/web-gpu';
import { LightComponent } from '../component/light/light-component.ts';
import type { AmbientLight } from '../component/light/type/ambient-light.ts';
import type { AreaLight } from '../component/light/type/area-light.ts';
import type { ILightComponentItem } from '../component/light/type/i-light-component-item.interface.ts';
import { LightComponentItemType } from '../component/light/type/light-component-item-type.enum.ts';
import type { PointLight } from '../component/light/type/point-light.ts';
import type { SpotLight } from '../component/light/type/spot-light.ts';
import { TransformationComponent } from '../component/transformation-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironment } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../core/game-system.ts';
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
    private static readonly LIGHT_STRUCT_STRIDE: number = 16;

    private readonly mActiveLights: Array<LightComponent>;
    private readonly mActiveLightsIndexMap: WeakMap<LightComponent, number>;
    private readonly mBuffers: LightSystemBuffer;

    /**
     * Gets the system types this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [GpuSystem, TransformationSystem];
    }

    /**
     * Gets the component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [LightComponent];
    }

    /**
     * Gets the GPU buffer containing tightly packed light data.
     */
    public get lightBuffer(): GpuBuffer {
        this.lockGate();
        return this.mBuffers.dynamicLightGpuBuffer!;
    }

    /**
     * Gets the number of currently lights.
     */
    public get lights(): ReadonlyArray<LightComponent> {
        this.lockGate();
        return this.mActiveLights;
    }

    /**
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('Light', pEnvironment);

        // Null any buffer and views and setup maps for component to buffer index tracking.
        this.mBuffers = {
            // Dynamic light buffer management:
            dynamicLightAvailableIndices: new Array<number>(),
            componentIndexMap: new WeakMap<LightComponent, number>(),
            dynamicLightDataBuffer: null,
            dynamicLightDataBufferView: null,
            dynamicLightDataBufferFloatView: null,
            dynamicLightGpuBuffer: null,
        };

        // Init active lists.
        this.mActiveLights = new Array<LightComponent>();
        this.mActiveLightsIndexMap = new WeakMap<LightComponent, number>();
    }

    /**
     * Gets the index in the buffer for a given light component.
     * 
     * @param pComponent - The light component to get the index for.
     * 
     * @returns The index of the light component in the buffer.
     */
    public indexOfLight(pComponent: LightComponent): number {
        this.lockGate();

        return this.mBuffers.componentIndexMap.get(pComponent)!;
    }

    /**
     * Initializes the light system by creating a GPU buffer for light data storage.
     */
    protected override async onCreate(): Promise<void> {
        const lGpuSystem: GpuSystem = this.environment.getSystem(GpuSystem);

        // Read gpu system max storage buffer limit.
        const lMaxStorageBufferBindingSize: number = lGpuSystem.gpuLimit(GpuLimit.MaxStorageBufferBindingSize);

        // Create the shared buffer for all light struct data.
        this.mBuffers.dynamicLightDataBuffer = new SharedArrayBuffer(0, { maxByteLength: lMaxStorageBufferBindingSize });
        this.mBuffers.dynamicLightDataBufferView = new DataView(this.mBuffers.dynamicLightDataBuffer);
        this.mBuffers.dynamicLightDataBufferFloatView = new Float32Array(this.mBuffers.dynamicLightDataBuffer);

        // Create GPU buffer for dynamic light data.
        const lDynamicLightGpuBuffer: GpuBuffer = new GpuBuffer(lGpuSystem.gpu, this.mBuffers.dynamicLightDataBuffer.byteLength);
        lDynamicLightGpuBuffer.extendUsage(BufferUsage.Storage | BufferUsage.CopySource | BufferUsage.CopyDestination);
        this.mBuffers.dynamicLightGpuBuffer = lDynamicLightGpuBuffer;
    }

    /**
     * Processes state changes for light components.
     * Manages tightly packed buffer allocation, data writing, and GPU synchronization.
     *
     * @param pStateChanges - Map of component types to state change events.
     */
    protected override async onUpdate(pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        const lUpdateBounds: LightSystemBufferUpdateRange = {
            lowerBoundIndex: Number.MAX_SAFE_INTEGER,
            upperBoundIndex: 0
        };

        for (const lStateChange of pStateChanges.componentChanges.get(LightComponent)!) {
            const lLightComponent: LightComponent = lStateChange.component as LightComponent;

            switch (lStateChange.type) {
                case 'add': {
                    // Assign light to buffer if not already assigned.
                    this.assignLight(lLightComponent);

                    // When light is enabled, add to active list and update buffer.
                    if (lLightComponent.enabled) {
                        this.activateLight(lLightComponent);

                        // Update light to buffer.
                        const lChangedBufferIndex: number = this.updateLightBuffer(lLightComponent);
                        if (lChangedBufferIndex < lUpdateBounds.lowerBoundIndex) {
                            lUpdateBounds.lowerBoundIndex = lChangedBufferIndex;
                        }
                        if (lChangedBufferIndex > lUpdateBounds.upperBoundIndex) {
                            lUpdateBounds.upperBoundIndex = lChangedBufferIndex;
                        }
                    }

                    break;
                }
                case 'update': {
                    // Only update if the component is currently active in the buffer.
                    if (!lLightComponent.enabled) {
                        break;
                    }

                    const lChangedBufferIndex: number = this.updateLightBuffer(lLightComponent);
                    if (lChangedBufferIndex < lUpdateBounds.lowerBoundIndex) {
                        lUpdateBounds.lowerBoundIndex = lChangedBufferIndex;
                    }
                    if (lChangedBufferIndex > lUpdateBounds.upperBoundIndex) {
                        lUpdateBounds.upperBoundIndex = lChangedBufferIndex;
                    }

                    break;
                }
                case 'activate': {
                    this.activateLight(lLightComponent);

                    // Update light buffer on activation.
                    const lChangedBufferIndex: number = this.updateLightBuffer(lLightComponent);
                    if (lChangedBufferIndex < lUpdateBounds.lowerBoundIndex) {
                        lUpdateBounds.lowerBoundIndex = lChangedBufferIndex;
                    }
                    if (lChangedBufferIndex > lUpdateBounds.upperBoundIndex) {
                        lUpdateBounds.upperBoundIndex = lChangedBufferIndex;
                    }

                    break;
                }
                case 'deactivate': {
                    this.deactivateLight(lLightComponent);
                    break;
                }
                case 'remove': {
                    // Deactivate light if it's active.
                    this.deactivateLight(lLightComponent);

                    // Just remove the light from buffer. Buffer does not have to be updated.
                    this.removeLightFromBuffer(lLightComponent);

                    break;
                }
            }
        }

        // Sync changed region to GPU buffer when the lower bound index is updated.
        if (lUpdateBounds.lowerBoundIndex !== Number.MAX_SAFE_INTEGER) {
            // Resize GPU buffer if the shared buffer has grown.
            if (this.mBuffers.dynamicLightGpuBuffer!.size < this.mBuffers.dynamicLightDataBuffer!.byteLength) {
                this.mBuffers.dynamicLightGpuBuffer!.size = this.mBuffers.dynamicLightDataBuffer!.byteLength;
            }

            // Calculate byte offsets for the updated buffer range based on the lower and upper bound light indices.
            let lLowerBoundByteIndex: number = lUpdateBounds.lowerBoundIndex * LightSystem.LIGHT_STRUCT_STRIDE * 4;

            // Align lower bound to 8 bytes.
            lLowerBoundByteIndex &= ~7;

            // Calculate the length of the data to be updated in bytes based on the upper and lower bound indices.
            let lDataLength: number = (lUpdateBounds.upperBoundIndex - lUpdateBounds.lowerBoundIndex + 1) * LightSystem.LIGHT_STRUCT_STRIDE * 4;

            // Align data length to 4 bytes.
            lDataLength = (lDataLength + 3) & ~3;

            // Write changed byte range to GPU buffer.
            this.mBuffers.dynamicLightGpuBuffer!.write(this.mBuffers.dynamicLightDataBuffer!, lLowerBoundByteIndex, lLowerBoundByteIndex, lDataLength);
        }
    }

    /**
     * Activates a light component by adding it to the active lights list and index map.
     *
     * @param pComponent - The light component to activate.
     */
    private activateLight(pComponent: LightComponent): void {
        this.mActiveLights.push(pComponent);
        this.mActiveLightsIndexMap.set(pComponent, this.mActiveLights.length - 1);
    }

    /**
     * Assign a light component to the next available index in the buffer.
     * 
     * @param pComponent - The light component to add.
     * 
     * @returns The byte range of the updated region in the buffer.
     */
    private assignLight(pComponent: LightComponent): void {
        // Assign an index for this component in the buffer.
        if (this.mBuffers.dynamicLightAvailableIndices.length === 0) {
            // Extend buffer by one block (4 components) if no indices are available.
            this.extendBuffer(4);
        }

        // Get next available index.
        const lIndex: number = this.mBuffers.dynamicLightAvailableIndices.pop()!;

        // Map the component to the next available index in the buffer.
        this.mBuffers.componentIndexMap.set(pComponent, lIndex);
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
        // No range and no falloff means no range restriction.
        if (pRange <= 0 && pDropOff <= 0) {
            return Number.MAX_VALUE;
        }

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
     * Deactivates a light component by removing it from the active lights list and index map.
     *
     * @param pComponent - The light component to deactivate.
     */
    private deactivateLight(pComponent: LightComponent): void {
        if (!this.mActiveLightsIndexMap.has(pComponent)) {
            return;
        }

        // Get indices to swap and remove.
        const lIndex: number = this.mActiveLightsIndexMap.get(pComponent)!;
        const lLastIndex: number = this.mActiveLights.length - 1;

        // Swap the last active light into the removed light's slot to maintain tight packing.
        const lLastLight: LightComponent = this.mActiveLights[lLastIndex];
        this.mActiveLights[lIndex] = lLastLight;
        this.mActiveLights.pop();

        // Update index map for the swapped light.
        this.mActiveLightsIndexMap.set(lLastLight, lIndex);
        this.mActiveLightsIndexMap.delete(pComponent);
    }

    /**
     * Extends the buffer to accommodate more lights.
     *
     * @param pCountOfNewLights - Number of lights to add.
     *
     * @returns The byte range of the newly allocated region.
     */
    private extendBuffer(pCountOfNewLights: number): void {
        const lLightSizeInBytes: number = LightSystem.LIGHT_STRUCT_STRIDE * 4;
        const lOldBufferByteLength: number = this.mBuffers.dynamicLightDataBuffer!.byteLength;

        // Grow buffer and update views.
        this.mBuffers.dynamicLightDataBuffer!.grow(lOldBufferByteLength + (lLightSizeInBytes * pCountOfNewLights));
        this.mBuffers.dynamicLightDataBufferFloatView = new Float32Array(this.mBuffers.dynamicLightDataBuffer!);
        this.mBuffers.dynamicLightDataBufferView = new DataView(this.mBuffers.dynamicLightDataBuffer!);

        // Calculate current last index.
        const lOldLightCount: number = lOldBufferByteLength / lLightSizeInBytes;

        // Add the new light index to the available indices list.
        for (let lNewIndex = lOldLightCount; lNewIndex < lOldLightCount + pCountOfNewLights; lNewIndex++) {
            this.mBuffers.dynamicLightAvailableIndices.push(lNewIndex);
        }
    }

    /**
     * Removes a light from the buffer by swapping it with the last active light to maintain tight packing.
     *
     * @param pComponent - The light component to remove.
     *
     * @returns The byte range that was modified, or null if no buffer data changed.
     */
    private removeLightFromBuffer(pComponent: LightComponent): void {
        // Read current index of the component to remove.
        const lIndex: number = this.mBuffers.componentIndexMap.get(pComponent)!;

        // Remove component index mapping.
        this.mBuffers.componentIndexMap.delete(pComponent);

        // Add index back to available indices.
        this.mBuffers.dynamicLightAvailableIndices.push(lIndex);
    }

    /**
     * Writes a light component's data to the buffer at the specified index.
     * Reads world position from TransformationSystem and forward direction from the rotation quaternion.
     * Type-specific properties (dropOff, angles, area size) are packed and written based on the light implementation.
     *
     * @param pComponent - The light component to write.
     *
     * @returns Index in the buffer that got updated.
     */
    private updateLightBuffer(pComponent: LightComponent): number {
        // Get light index.
        const lIndex: number = this.mBuffers.componentIndexMap.get(pComponent)!;

        const lTransformationSystem: TransformationSystem = this.environment.getSystem(TransformationSystem);
        const lTransformation: TransformationComponent = pComponent.gameEntity.getComponent(TransformationComponent);
        const lLight: ILightComponentItem = pComponent.light;
        const lOffset: number = lIndex * LightSystem.LIGHT_STRUCT_STRIDE;

        // Read world position from TransformationSystem world matrix (column 3 = translation).
        const lWorldMatrix = lTransformationSystem.worldMatrixOfTransformation(lTransformation);
        const lWorldData = lWorldMatrix.dataArray;

        // Get range and dropOff for applicable light types.
        let lRange: number = 0;
        let lDropOff: number = 0;
        if (lLight.type !== LightComponentItemType.Directional) {
            // Convert into a point/spot/area/ambient light to read range and dropOff properties.
            const lNonDirectionalLight: PointLight | SpotLight | AreaLight | AmbientLight = lLight as PointLight | SpotLight | AreaLight | AmbientLight;
            lRange = lNonDirectionalLight.range;
            lDropOff = lNonDirectionalLight.dropOff;
        }

        const lDataBufferFloatView: Float32Array = this.mBuffers.dynamicLightDataBufferFloatView!;

        // Position + calculatedRange (vec4<f32>, indices 0-3).
        lDataBufferFloatView[lOffset + 0] = lWorldData[12]; // x
        lDataBufferFloatView[lOffset + 1] = lWorldData[13]; // y
        lDataBufferFloatView[lOffset + 2] = lWorldData[14]; // z

        // Calculated range on w component of vec4.
        if (lLight.type !== LightComponentItemType.Directional) {
            lDataBufferFloatView[lOffset + 3] = this.calculateRange(lRange, lLight.intensity, lDropOff);
        }

        // Color + intensity (vec4<f32>, indices 4-7).
        lDataBufferFloatView[lOffset + 4] = lLight.color.r;
        lDataBufferFloatView[lOffset + 5] = lLight.color.g;
        lDataBufferFloatView[lOffset + 6] = lLight.color.b;
        lDataBufferFloatView[lOffset + 7] = lLight.intensity;

        // Rotation + dropOff (vec4<f32>, indices 8-11).
        const lForward = lTransformation.rotation.vectorForward;
        lDataBufferFloatView[lOffset + 8] = lForward.x;
        lDataBufferFloatView[lOffset + 9] = lForward.y;
        lDataBufferFloatView[lOffset + 10] = lForward.z;

        // Drop-off factor for attenuation (point, spot, area) or shadow softness (directional).
        lDataBufferFloatView[lOffset + 11] = lDropOff;

        const lDataBufferView: DataView = this.mBuffers.dynamicLightDataBufferView!;

        // Light type (i32, index 12).
        lDataBufferView.setInt32((lOffset + 12) * 4, lLight.type, true);

        // Packed innerAngle/outerAngle (2xf16, index 13).
        if (lLight.type === LightComponentItemType.Spot) {
            // "Convert" light into a spot light.
            const lSpotLight: SpotLight = lLight as SpotLight;

            lDataBufferView.setFloat16((lOffset + 13) * 4, lSpotLight.innerAngle, true);
            lDataBufferView.setFloat16((lOffset + 13) * 4 + 2, lSpotLight.outerAngle, true);
        }

        // Packed width/height (2xf16, index 14).
        if (lLight.type === LightComponentItemType.Area) {
            lDataBufferView.setFloat16((lOffset + 14) * 4, lTransformation.scaleWidth, true);
            lDataBufferView.setFloat16((lOffset + 14) * 4 + 2, lTransformation.scaleHeight, true);
        }

        return lIndex;
    }
}

type LightSystemBuffer = {
    readonly dynamicLightAvailableIndices: Array<number>;
    readonly componentIndexMap: WeakMap<LightComponent, number>;
    dynamicLightDataBuffer: SharedArrayBuffer | null;
    dynamicLightDataBufferFloatView: Float32Array | null;
    dynamicLightDataBufferView: DataView | null;
    dynamicLightGpuBuffer: GpuBuffer | null;
};

type LightSystemBufferUpdateRange = {
    /**
     * Lower bound of the buffer range that has been updated (inclusive, in bytes).
     */
    lowerBoundIndex: number;

    /**
     * Upper bound of the buffer range that has been updated (inclusive, in bytes).
     */
    upperBoundIndex: number;
};
