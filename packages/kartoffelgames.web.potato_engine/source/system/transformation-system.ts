import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { TransformationComponent } from "../component/transformation-component.ts";
import { GameComponentConstructor } from "../core/component/game-component.ts";
import { GameEnvironmentStateChange } from "../core/environment/game-environment-transmittion.ts";
import { GameSystem } from "../core/game-system.ts";
import { GameEntity } from "../core/hierarchy/game-entity.ts";
import { Matrix } from "../math/matrix.ts";

// TODO: GpuSystem should be nice, reading limits, creating the adapter and so on.

export class TransformationSystem extends GameSystem {
    /**
     * Number of 32bit elements in each 4x transformation block in the buffer (4 for parent indices + 16 for transformation matrix).
     */
    private static readonly BLOCK_SIZE: number = 80;

    private readonly mAvailableIndices: Array<number>;
    private readonly mDataBuffer: SharedArrayBuffer;
    private mMatrixDataView: Float32Array;
    private readonly mComponentToIndexMap: WeakMap<TransformationComponent, number>;
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
                case "add": {
                    // Get an available index or create a new one.
                    if (this.mAvailableIndices.length === 0) {
                        // Extend buffer by one block (4 components) if no indices are available.
                        this.extendBuffer(1);
                    }

                    // Map the component to the next available index in the buffer.
                    this.mComponentToIndexMap.set(lTransformationComponent, this.mAvailableIndices.pop()!);

                    // Write the component data to buffer and update parent indices.
                    this.writeMatrixToBuffer(lTransformationComponent);
                    this.updateParentIndices(lTransformationComponent);

                    break;
                }
                case "update": {
                    this.writeMatrixToBuffer(lTransformationComponent);
                    break;
                }
                case "remove": {
                    // Get current index.
                    const lExistingIndex: number = this.mComponentToIndexMap.get(lTransformationComponent)!;

                    // Remove from map and add index to available list.
                    this.mComponentToIndexMap.delete(lTransformationComponent);
                    this.mAvailableIndices.push(lExistingIndex);

                    // TODO: Reconnect children to new parent.

                    break;
                }

                case "activate":
                case "deactivate": {
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
     * Writes a transformation component's matrix data to the shared buffer.
     * Calculates the correct buffer offset based on the component's assigned index and writes the transformation matrix data.
     *
     * @param pComponent - The transformation component whose matrix data should be written.
     */
    private writeMatrixToBuffer(pComponent: TransformationComponent): void {
        // Get index for this component.
        const lIndex: number = this.mComponentToIndexMap.get(pComponent)!;

        // Calculate the byte offset for this component's data in the buffer.
        const lTransformationBlock: number = Math.trunc(lIndex / 4);
        const lTransformationBlockMatrixIndex = lIndex % 4;
        const lBufferMatrixOffset: number = (lTransformationBlock * TransformationSystem.BLOCK_SIZE) + 4 + (lTransformationBlockMatrixIndex * 16);

        // Update components transformation matrix in buffer.
        this.mMatrixDataView.set(pComponent.matrix.dataArray, lBufferMatrixOffset);
    }

    /**
     * Updates the parent index for a transformation component and registers it in the parent-child relationship mapping.
     * Finds the component's parent entity, writes the parent index to the buffer, and maintains the parent-to-children tracking map.
     * If no parent exists, writes -1 to indicate a root-level component.
     *
     * @param pComponent - The transformation component whose parent indices should be updated.
     */
    private updateParentIndices(pComponent: TransformationComponent): void {
        // Get index for this component.
        const lIndex: number = this.mComponentToIndexMap.get(pComponent)!;

        // Calculate the byte offset for this component's data in the buffer.
        const lTransformationBlock: number = Math.trunc(lIndex / 4);
        const lTransformationBlockMatrixIndex = lIndex % 4;

        // Calculate parent index buffer offset.
        const lBufferParentOffset: number = (lTransformationBlock * TransformationSystem.BLOCK_SIZE) + lTransformationBlockMatrixIndex;

        // Find parent component.
        let lParentComponent: TransformationComponent | null = null;
        if (pComponent.parent && pComponent.parent instanceof GameEntity) {
            lParentComponent = pComponent.parent.getComponent(TransformationComponent);
        }

        // Component has no parent, so write -1 to parent index buffer.
        if (!lParentComponent) {
            this.mMatrixDataView[lBufferParentOffset] = -1;
            return;
        }

        // Get parent component index.
        const lParentIndex: number = this.mComponentToIndexMap.get(lParentComponent)!;

        // Write parent index to buffer.
        this.mMatrixDataView[lBufferParentOffset] = lParentIndex;

        // Read current children for this parent.
        let lChildren: Set<TransformationComponent> | undefined = this.mParentToChildrenMap.get(lParentComponent);
        if (!lChildren) {
            lChildren = new Set<TransformationComponent>();
            this.mParentToChildrenMap.set(lParentComponent, lChildren);
        }

        // Add this component to the children set of the parent.
        lChildren.add(pComponent);
    }
}