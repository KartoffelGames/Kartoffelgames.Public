import { BufferUsage, GpuBuffer } from '@kartoffelgames/web-gpu';
import { TransformationComponent } from '../component/transformation-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironmentStateChange } from '../core/environment/game-environment-transmittion.ts';
import { GameSystem, type GameSystemConstructor } from '../core/game-system.ts';
import { GameEntity } from '../core/hierarchy/game-entity.ts';
import { GpuSystem } from './gpu-system.ts';

/**
 * System that manages transformation components, their hierarchical relationships, and their data storage in a shared buffer.
 * Handles component addition, updates, and removal by maintaining a mapping of components to buffer indices, managing parent-child relationships, and writing transformation data to a shared buffer for efficient access.
 */
export class TransformationSystem extends GameSystem {
    /**
     * Number of 32bit elements in each 4x transformation block in the buffer (4 for parent indices + 16 for transformation matrix).
     */
    private static readonly BLOCK_SIZE: number = 80;

    private readonly mAvailableIndices: Array<number>;
    private readonly mComponentToIndexMap: WeakMap<TransformationComponent, number>;
    private readonly mDataBuffer: SharedArrayBuffer;
    private mGpuBuffer: GpuBuffer | null;
    private mMatrixDataView: Float32Array;
    private readonly mParentToChildrenMap: WeakMap<TransformationComponent, Set<TransformationComponent>>;

    /**
     * Gets the system types that this system depends on for its operation, such as required systems that must be initialized before this system.
     *
     * @returns Array of system constructor types that this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [GpuSystem];
    }

    /**
     * Gets the GPU buffer that contains transformation data for all components managed by this system.
     */
    public get gpuBuffer(): GpuBuffer {
        this.lockGate();
        return this.mGpuBuffer!;
    }

    /**
     * Gets the component types that this system handles and processes.
     *
     * @returns Array of component constructor types this system is interested in.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [TransformationComponent];
    }

    /**
     * Gets the shared buffer containing transformation data for all components managed by this system.
     * The buffer is structured to allow efficient access to parent indices and transformation matrices for each component.
     * 
     * @return The shared array buffer containing transformation data.
     */
    public get transformationData(): SharedArrayBuffer {
        this.lockGate();
        return this.mDataBuffer;
    }

    /**
     * Creates a new transformation system that manages component transformations and hierarchical relationships.
     */
    public constructor() {
        super();

        // Create the shared buffer for all transformations data.
        this.mDataBuffer = new SharedArrayBuffer(0, { maxByteLength: TransformationSystem.BLOCK_SIZE * 1000 }); // TODO: Initial size for 1000 components, should be set to a gpu limit.

        /*
         * Buffer layout in bytes so alignment matches:
         * struct TransformationData {
         *   parents: Array<int32, 4>,
         *   transformationMatrix: Array<Matrix44<float32>, 4>
         * }
         */

        // Create views into the buffer for count and data.
        this.mMatrixDataView = new Float32Array(this.mDataBuffer);
        this.mGpuBuffer = null;

        // Initialize the available indices list.
        this.mAvailableIndices = new Array<number>();

        // Create a weak map to track which component is at which index in the buffer.
        this.mComponentToIndexMap = new WeakMap<TransformationComponent, number>();
        this.mParentToChildrenMap = new WeakMap<TransformationComponent, Set<TransformationComponent>>();
    }

    /**
     * Initializes the transformation system by creating a GPU buffer for storing transformation data and setting up necessary resources.
     */
    protected override async onCreate(): Promise<void> {
        // Get gpu system from dependency.
        const lGpuSystem: GpuSystem = this.getDependency(GpuSystem);

        // Create GPU buffer for transformation data.
        const lGpuBuffer: GpuBuffer = new GpuBuffer(lGpuSystem.gpu, this.mDataBuffer.byteLength);
        lGpuBuffer.extendUsage(BufferUsage.Storage | BufferUsage.CopySource | BufferUsage.CopyDestination);

        // Store reference to GPU buffer.
        this.mGpuBuffer = lGpuBuffer;
    }

    /**
     * Processes state changes for transformation components in the game environment.
     * Handles component addition, removal, and updates by managing buffer allocation, index mapping, and parent-child relationships.
     *
     * @param pStateChanges - Map containing component types and their corresponding state change events.
     *
     * @returns Promise that resolves when all state changes have been processed.
     */
    protected override async onUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        const lUpdateBounds: TransformationSystemBufferUpdateRange = {
            lowerBound: 0,
            upperBound: 0
        };

        // Process state changes for TransformationComponent
        for (const lStateChange of pStateChanges.get(TransformationComponent)!) {
            // Get component reference from state change.
            const lTransformationComponent = lStateChange.component as TransformationComponent;

            switch (lStateChange.type) {
                case 'add': {
                    // Get an available index or create a new one.
                    if (this.mAvailableIndices.length === 0) {
                        // Extend buffer by one block (4 components) if no indices are available.
                        const lUpdateRange: TransformationSystemBufferUpdateRange = this.extendBuffer(1);

                        lUpdateBounds.lowerBound = Math.min(lUpdateBounds.lowerBound, lUpdateRange.lowerBound);
                        lUpdateBounds.upperBound = Math.max(lUpdateBounds.upperBound, lUpdateRange.upperBound);
                    }

                    // Map the component to the next available index in the buffer.
                    this.mComponentToIndexMap.set(lTransformationComponent, this.mAvailableIndices.pop()!);

                    // Write the component data to buffer and update parent indices.
                    const lMatrixUpdateRange: TransformationSystemBufferUpdateRange = this.writeTransformationMatrixToBuffer(lTransformationComponent);
                    const lParentUpdateRange: TransformationSystemBufferUpdateRange = this.updateParentIndices(lTransformationComponent);

                    // Update the overall update bounds.
                    lUpdateBounds.lowerBound = Math.min(lUpdateBounds.lowerBound, lMatrixUpdateRange.lowerBound, lParentUpdateRange.lowerBound);
                    lUpdateBounds.upperBound = Math.max(lUpdateBounds.upperBound, lMatrixUpdateRange.upperBound, lParentUpdateRange.upperBound);

                    break;
                }
                case 'update': {
                    const lMatrixUpdateRange: TransformationSystemBufferUpdateRange = this.writeTransformationMatrixToBuffer(lTransformationComponent);

                    // Update the overall update bounds.
                    lUpdateBounds.lowerBound = Math.min(lUpdateBounds.lowerBound, lMatrixUpdateRange.lowerBound);
                    lUpdateBounds.upperBound = Math.max(lUpdateBounds.upperBound, lMatrixUpdateRange.upperBound);

                    break;
                }
                case 'remove': {
                    const lMatrixUpdateRange: TransformationSystemBufferUpdateRange | null = this.removeReference(lTransformationComponent);
                    if (!lMatrixUpdateRange) {
                        break;
                    }

                    // Update the overall update bounds.
                    lUpdateBounds.lowerBound = Math.min(lUpdateBounds.lowerBound, lMatrixUpdateRange.lowerBound);
                    lUpdateBounds.upperBound = Math.max(lUpdateBounds.upperBound, lMatrixUpdateRange.upperBound);

                    break;
                }

                case 'activate':
                case 'deactivate': {
                    // NOP
                }
            }
        }

        // If any changes were made that require a GPU buffer update, perform the update now.
        if (lUpdateBounds.lowerBound !== 0 || lUpdateBounds.upperBound !== 0) {
            // Resize buffer if size does not match current data buffer size.
            if (this.mGpuBuffer!.size < this.mDataBuffer.byteLength) {
                this.mGpuBuffer!.size = this.mDataBuffer.byteLength;
            }

            // Align lower bound to 8 bytes.
            lUpdateBounds.lowerBound = lUpdateBounds.lowerBound & ~7;

            // Align upper bound to 4 bytes as the data length must be a multiple of 4 bytes.
            // Add an additional 1 byte to make the upper bound inclusive in the length calculation and then align to 4 bytes.
            lUpdateBounds.upperBound = (lUpdateBounds.upperBound + 1 + 3) & ~3;

            // Update GPU buffer with new data from shared buffer. +1 to upper bound because it is inclusive.
            this.mGpuBuffer!.write(this.mDataBuffer, lUpdateBounds.lowerBound, lUpdateBounds.lowerBound, lUpdateBounds.upperBound - lUpdateBounds.lowerBound);
        }
    }

    /**
     * Extends the shared buffer to accommodate additional transformation components.
     * Buffer is extended in blocks of 4 components (80 numbers per block) to maintain alignment and minimize fragmentation.
     *
     * @param pCountOfNewBlocks - Number of blocks to add to the buffer. Each block accommodates 4 components.
     */
    private extendBuffer(pCountOfNewBlocks: number = 1): TransformationSystemBufferUpdateRange {
        // Calculate size of a single transformation block in bytes.
        // BLOCK_SIZE is in number of 32bit elements, so multiply by 4 for bytes.
        const lBlockSizeInBytes: number = TransformationSystem.BLOCK_SIZE * 4;

        // Read current length of 32bit buffer.
        const lOldBufferByteLength: number = this.mDataBuffer.byteLength;

        // Grow the buffer by the specified number of blocks.
        this.mDataBuffer.grow(lOldBufferByteLength + (lBlockSizeInBytes * pCountOfNewBlocks));

        // Create a new Float32Array view for the new buffer.
        this.mMatrixDataView = new Float32Array(this.mDataBuffer);

        // Calculate current last index.
        const lOldBlockCount: number = lOldBufferByteLength / lBlockSizeInBytes;
        const lFollowingIndex: number = lOldBlockCount * 4;

        // Add the new block index to the available indices list.
        for (let lNewIndex = lFollowingIndex; lNewIndex < lFollowingIndex + (4 * pCountOfNewBlocks); lNewIndex++) {
            this.mAvailableIndices.push(lNewIndex);
        }

        return {
            lowerBound: lOldBufferByteLength,
            upperBound: this.mDataBuffer.byteLength - 1
        };
    }

    /**
     * Retrieves the child transformation components for a given parent transformation component from the parent-to-children mapping.
     * 
     * @param pComponent - The parent transformation component whose child components should be retrieved.
     * 
     * @returns A set of child transformation components associated with the given parent component.
     */
    private getChildComponents(pComponent: TransformationComponent): Set<TransformationComponent> {
        // Read current children for this parent.
        let lChildren: Set<TransformationComponent> | undefined = this.mParentToChildrenMap.get(pComponent);
        if (!lChildren) {
            lChildren = new Set<TransformationComponent>();
            this.mParentToChildrenMap.set(pComponent, lChildren);
        }

        return lChildren;
    }

    /**
     * Finds the parent transformation component for a given transformation component by checking its parent entity.
     * 
     * @param pComponent - The transformation component whose parent component should be found.
     * 
     * @returns The parent transformation component if found, or null if no parent component exists.
     */
    private getParentComponent(pComponent: TransformationComponent): TransformationComponent | null {
        // Find parent component.
        if (pComponent.parent && pComponent.parent instanceof GameEntity) {
            return pComponent.parent.getComponent(TransformationComponent);
        }

        return null;
    }

    /**
     * Removes a transformation component's reference from the system when it is removed from the game environment.
     * 
     * @param pComponent - The transformation component that is being removed and whose reference should be cleaned up.
     */
    private removeReference(pComponent: TransformationComponent): TransformationSystemBufferUpdateRange | null {
        // Get index for this component.
        const lIndex: number = this.mComponentToIndexMap.get(pComponent)!;

        // Remove from map and add index to available list.
        this.mComponentToIndexMap.delete(pComponent);
        this.mAvailableIndices.push(lIndex);

        // Get current parent component.
        const lParentComponent: TransformationComponent | null = this.getParentComponent(pComponent);

        // Remove this component from its parent's children set if it has a parent.
        if (lParentComponent) {
            this.getChildComponents(lParentComponent).delete(pComponent);
        }

        // Get parent index if parent component exists or -1 if no parent.
        const lParentIndex: number = lParentComponent ? this.mComponentToIndexMap.get(lParentComponent)! : -1;
        const lParentChildren: Set<TransformationComponent> | null = lParentComponent ? this.getChildComponents(lParentComponent) : null;

        // Get children of this component.
        const lChildren: Set<TransformationComponent> = this.getChildComponents(pComponent);
        if (lChildren.size === 0) {
            return null;
        }

        // Create update range to update parent indices of children to -1 since they will become root components.
        const lUpdateRange: TransformationSystemBufferUpdateRange = {
            lowerBound: Number.POSITIVE_INFINITY,
            upperBound: Number.NEGATIVE_INFINITY
        };

        // Update parent index for all children to this component's parent index and update parent-child relationships.
        for (const lChildComponent of lChildren) {
            // Update parent index for child components to this component's parent index.
            const lChildUpdateRange: TransformationSystemBufferUpdateRange = this.writeParentIdToBuffer(lChildComponent, lParentIndex);

            // Update the overall update range.
            lUpdateRange.lowerBound = Math.min(lUpdateRange.lowerBound, lChildUpdateRange.lowerBound);
            lUpdateRange.upperBound = Math.max(lUpdateRange.upperBound, lChildUpdateRange.upperBound);

            // Add child to new parent child list if parent exists.
            if (lParentChildren) {
                lParentChildren.add(lChildComponent);
            }
        }

        return lUpdateRange;
    }

    /**
     * Updates the parent index for a transformation component and registers it in the parent-child relationship mapping.
     * Finds the component's parent entity, writes the parent index to the buffer, and maintains the parent-to-children tracking map.
     * If no parent exists, writes -1 to indicate a root-level component.
     *
     * @param pComponent - The transformation component whose parent indices should be updated.
     */
    private updateParentIndices(pComponent: TransformationComponent): TransformationSystemBufferUpdateRange {
        // Find parent component.
        const lParentComponent: TransformationComponent | null = this.getParentComponent(pComponent);

        // Component has no parent, so write -1 to parent index buffer.
        if (!lParentComponent) {
            return this.writeParentIdToBuffer(pComponent, -1);
        }

        // Get parent component index.
        const lParentIndex: number = this.mComponentToIndexMap.get(lParentComponent)!;

        // Add this component to the children set of the parent.
        this.getChildComponents(lParentComponent).add(pComponent);

        // Write parent index to buffer.
        return this.writeParentIdToBuffer(pComponent, lParentIndex);
    }

    /**
     * Writes the parent index for a transformation component to the shared buffer.
     * 
     * @param pComponent - Component reference.
     * @param pParentIndex - The index of the parent component in the buffer, or -1 if the component has no parent.
     */
    private writeParentIdToBuffer(pComponent: TransformationComponent, pParentIndex: number): TransformationSystemBufferUpdateRange {
        // Get index for this component.
        const lIndex: number = this.mComponentToIndexMap.get(pComponent)!;

        // Calculate the byte offset for this component's data in the buffer.
        const lBlockIndex: number = Math.trunc(lIndex / 4);
        const lBlockSubIndex = lIndex % 4;

        // Calculate parent index buffer offset.
        const lBufferParentOffset: number = (lBlockIndex * TransformationSystem.BLOCK_SIZE) + lBlockSubIndex;

        // Write parent index to buffer.
        this.mMatrixDataView[lBufferParentOffset] = pParentIndex;

        return {
            lowerBound: lBufferParentOffset * 4,
            upperBound: (lBufferParentOffset + 1) * 4
        };
    }

    /**
     * Writes a transformation component's matrix data to the shared buffer.
     * Calculates the correct buffer offset based on the component's assigned index and writes the transformation matrix data.
     *
     * @param pComponent - The transformation component whose matrix data should be written.
     */
    private writeTransformationMatrixToBuffer(pComponent: TransformationComponent): TransformationSystemBufferUpdateRange {
        // Get index for this component.
        const lIndex: number = this.mComponentToIndexMap.get(pComponent)!;

        // Calculate the byte offset for this component's data in the buffer.
        const lBlockIndex: number = Math.trunc(lIndex / 4);
        const lBlockSubIndex = lIndex % 4;
        const lBufferMatrixOffset: number = (lBlockIndex * TransformationSystem.BLOCK_SIZE) + 4 + (lBlockSubIndex * 16);

        // Update components transformation matrix in buffer.
        this.mMatrixDataView.set(pComponent.matrix.dataArray, lBufferMatrixOffset);

        return {
            lowerBound: lBufferMatrixOffset * 4,
            upperBound: (lBufferMatrixOffset + 16) * 4
        };
    }
}

type TransformationSystemBufferUpdateRange = {
    /**
     * Lower bound of the buffer range that has been updated and needs to be written to the GPU buffer.
     * Inclusive index in bytes.
     */
    lowerBound: number;

    /**
     * Upper bound of the buffer range that has been updated and needs to be written to the GPU buffer.
     * Inclusive index in bytes.
     */
    upperBound: number;
};