import { TransformationComponent } from '../component/transformation-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironmentStateChange } from '../core/environment/game-environment-transmittion.ts';
import { GameSystem } from '../core/game-system.ts';
import { GameEntity } from '../core/hierarchy/game-entity.ts';

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
    private mMatrixDataView: Float32Array;
    private readonly mParentToChildrenMap: WeakMap<TransformationComponent, Set<TransformationComponent>>;

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
        this.mDataBuffer = new SharedArrayBuffer(0);

        /*
         * Buffer layout in bytes so alignment matches:
         * struct TransformationData {
         *   parents: Array<int32, 4>,
         *   transformationMatrix: Array<Matrix44<float32>, 4>
         * }
         */

        // Create views into the buffer for count and data.
        this.mMatrixDataView = new Float32Array(this.mDataBuffer);

        // Initialize the available indices list.
        this.mAvailableIndices = new Array<number>();

        // Create a weak map to track which component is at which index in the buffer.
        this.mComponentToIndexMap = new WeakMap<TransformationComponent, number>();
        this.mParentToChildrenMap = new WeakMap<TransformationComponent, Set<TransformationComponent>>();
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
        // Process state changes for TransformationComponent
        for (const lStateChange of pStateChanges.get(TransformationComponent)!) {
            const lTransformationComponent = lStateChange.component as TransformationComponent;

            switch (lStateChange.type) {
                case 'add': {
                    // Get an available index or create a new one.
                    if (this.mAvailableIndices.length === 0) {
                        // Extend buffer by one block (4 components) if no indices are available.
                        this.extendBuffer(1);
                    }

                    // Map the component to the next available index in the buffer.
                    this.mComponentToIndexMap.set(lTransformationComponent, this.mAvailableIndices.pop()!);

                    // Write the component data to buffer and update parent indices.
                    this.writeTransformationMatrixToBuffer(lTransformationComponent);
                    this.updateParentIndices(lTransformationComponent);

                    break;
                }
                case 'update': {
                    this.writeTransformationMatrixToBuffer(lTransformationComponent);
                    break;
                }
                case 'remove': {
                    this.removeReference(lTransformationComponent);
                    break;
                }

                case 'activate':
                case 'deactivate': {
                    // NOP
                }
            }
        }
    }

    /**
     * Extends the shared buffer to accommodate additional transformation components.
     * Buffer is extended in blocks of 4 components (80 numbers per block) to maintain alignment and minimize fragmentation.
     *
     * @param pCountOfNewBlocks - Number of blocks to add to the buffer. Each block accommodates 4 components.
     */
    private extendBuffer(pCountOfNewBlocks: number = 1): void {
        // Calculate size of a single transformation block in bytes (4 int32 for parents + 4 Matrix44<float32> = 4 * 4 bytes + 16 * 4 bytes = 80 bytes).
        const lBlockSizeInBytes: number = TransformationSystem.BLOCK_SIZE * pCountOfNewBlocks;

        // Read current length of 32bit buffer.
        const lCurrentLengthInBytes: number = this.mMatrixDataView.length;
        const lCurrentBlocks: number = lCurrentLengthInBytes / lBlockSizeInBytes;

        // Grow the buffer by the specified number of blocks.
        this.mDataBuffer.grow(lBlockSizeInBytes);

        // Create a new Float32Array view for the new buffer.
        this.mMatrixDataView = new Float32Array(this.mDataBuffer);

        // Calculate current last index.
        const lNextIndex: number = lCurrentBlocks * 4;

        // Add the new block index to the available indices list.
        for (let lNewIndex = lNextIndex; lNewIndex < lNextIndex + (4 * pCountOfNewBlocks); lNewIndex++) {
            this.mAvailableIndices.push(lNewIndex);
        }
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
    private removeReference(pComponent: TransformationComponent): void {
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
        for (const lChildComponent of lChildren) {
            // Update parent index for child components to this component's parent index.
            this.writeParentIdToBuffer(lChildComponent, lParentIndex);

            // Add child to new parent child list if parent exists.
            if (lParentChildren) {
                lParentChildren.add(lChildComponent);
            }
        }
    }

    /**
     * Updates the parent index for a transformation component and registers it in the parent-child relationship mapping.
     * Finds the component's parent entity, writes the parent index to the buffer, and maintains the parent-to-children tracking map.
     * If no parent exists, writes -1 to indicate a root-level component.
     *
     * @param pComponent - The transformation component whose parent indices should be updated.
     */
    private updateParentIndices(pComponent: TransformationComponent): void {
        // Find parent component.
        const lParentComponent: TransformationComponent | null = this.getParentComponent(pComponent);

        // Component has no parent, so write -1 to parent index buffer.
        if (!lParentComponent) {
            this.writeParentIdToBuffer(pComponent, -1);
            return;
        }

        // Get parent component index.
        const lParentIndex: number = this.mComponentToIndexMap.get(lParentComponent)!;

        // Write parent index to buffer.
        this.writeParentIdToBuffer(pComponent, lParentIndex);

        // Add this component to the children set of the parent.
        this.getChildComponents(lParentComponent).add(pComponent);
    }

    /**
     * Writes the parent index for a transformation component to the shared buffer.
     * 
     * @param pComponent - Component reference.
     * @param pParentIndex - The index of the parent component in the buffer, or -1 if the component has no parent.
     */
    private writeParentIdToBuffer(pComponent: TransformationComponent, pParentIndex: number): void {
        // Get index for this component.
        const lIndex: number = this.mComponentToIndexMap.get(pComponent)!;

        // Calculate the byte offset for this component's data in the buffer.
        const lBlockIndex: number = Math.trunc(lIndex / 4);
        const lBlockSubIndex = lIndex % 4;

        // Calculate parent index buffer offset.
        const lBufferParentOffset: number = (lBlockIndex * TransformationSystem.BLOCK_SIZE) + lBlockSubIndex;

        // Write parent index to buffer.
        this.mMatrixDataView[lBufferParentOffset] = pParentIndex;
    }

    /**
     * Writes a transformation component's matrix data to the shared buffer.
     * Calculates the correct buffer offset based on the component's assigned index and writes the transformation matrix data.
     *
     * @param pComponent - The transformation component whose matrix data should be written.
     */
    private writeTransformationMatrixToBuffer(pComponent: TransformationComponent): void {
        // Get index for this component.
        const lIndex: number = this.mComponentToIndexMap.get(pComponent)!;

        // Calculate the byte offset for this component's data in the buffer.
        const lBlockIndex: number = Math.trunc(lIndex / 4);
        const lBlockSubIndex = lIndex % 4;
        const lBufferMatrixOffset: number = (lBlockIndex * TransformationSystem.BLOCK_SIZE) + 4 + (lBlockSubIndex * 16);

        // Update components transformation matrix in buffer.
        this.mMatrixDataView.set(pComponent.matrix.dataArray, lBufferMatrixOffset);
    }
}