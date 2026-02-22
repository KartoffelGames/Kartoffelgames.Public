import type { Matrix } from '@kartoffelgames/core';
import { BufferUsage, GpuBuffer, GpuLimit } from '@kartoffelgames/web-gpu';
import { TransformationComponent } from '../component/transformation-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../core/environment/game-environment.ts';
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
    private static readonly MATRIX_SIZE: number = 16;

    private readonly mAvailableIndices: Array<number>;
    private readonly mComponentChildrenMap: WeakMap<TransformationComponent, Set<TransformationComponent>>;
    private readonly mComponentIndexMap: WeakMap<TransformationComponent, number>;
    private readonly mComponentParentMap: WeakMap<TransformationComponent, TransformationComponent>;
    private readonly mComponentWorldMatrixMap: WeakMap<TransformationComponent, Matrix>;
    private mDataBuffer: SharedArrayBuffer | null;
    private mGpuBuffer: GpuBuffer | null;
    private mMatrixDataView: Float32Array | null;


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
        return this.mDataBuffer!;
    }

    /**
     * Creates a new transformation system that manages component transformations and hierarchical relationships.
     * 
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('Transformation', pEnvironment);

        this.mDataBuffer = null;
        this.mMatrixDataView = null;
        this.mGpuBuffer = null;

        // Initialize the available indices list.
        this.mAvailableIndices = new Array<number>();

        // Create a weak map to track which component is at which index in the buffer.
        this.mComponentIndexMap = new WeakMap<TransformationComponent, number>();
        this.mComponentWorldMatrixMap = new WeakMap<TransformationComponent, Matrix>();
        this.mComponentParentMap = new WeakMap<TransformationComponent, TransformationComponent>();
        this.mComponentChildrenMap = new WeakMap<TransformationComponent, Set<TransformationComponent>>();
    }

    /**
     * Gets the index in the buffer for a given transformation component.
     * 
     * @param pComponent - The transformation component to get the index for.
     * 
     * @returns The index of the transformation component in the buffer.
     */
    public indexOfTransformation(pComponent: TransformationComponent): number {
        this.lockGate();

        return this.mComponentIndexMap.get(pComponent)!;
    }

    /**
     * Gets the world matrix for a given transformation component.
     * 
     * @param pComponent - The transformation component to get the world matrix for.
     * 
     * @returns The world matrix of the transformation component.
     */
    public worldMatrixOfTransformation(pComponent: TransformationComponent): Matrix {
        this.lockGate();

        return this.mComponentWorldMatrixMap.get(pComponent)!;
    }

    /**
     * Initializes the transformation system by creating a GPU buffer for storing transformation data and setting up necessary resources.
     */
    protected override async onCreate(): Promise<void> {
        // Get gpu system from dependency.
        const lGpuSystem: GpuSystem = this.environment.getSystem(GpuSystem);

        // Read gpu system max storage buffer limit.
        const lMaxStorageBufferBindingSize: number = lGpuSystem.gpuLimit(GpuLimit.MaxStorageBufferBindingSize);

        // Create the shared buffer for all transformations data.
        this.mDataBuffer = new SharedArrayBuffer(0, { maxByteLength: lMaxStorageBufferBindingSize });

        // Create views into the buffer for count and data.
        this.mMatrixDataView = new Float32Array(this.mDataBuffer);

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
        const lChangedTransformations: Set<TransformationComponent> = new Set<TransformationComponent>();

        // Process state changes for TransformationComponent
        for (const lStateChange of pStateChanges.get(TransformationComponent)!) {
            // Get component reference from state change.
            const lTransformationComponent = lStateChange.component as TransformationComponent;

            switch (lStateChange.type) {
                case 'add': {
                    // Add and link new transformation component to the system, then map it and its children as affected transformations to update their buffer data.
                    this.addTransformation(lTransformationComponent);

                    // Map transformation for potential buffer update.
                    if (lTransformationComponent.enabled) {
                        lChangedTransformations.add(lTransformationComponent);
                    }
                    break;
                }
                case 'activate':
                case 'update': {
                    // Map transformation for potential buffer update.
                    if (lTransformationComponent.enabled) {
                        lChangedTransformations.add(lTransformationComponent);
                    }
                    break;
                }
                case 'remove': {
                    const lAffectedChildren: Iterable<TransformationComponent> | null = this.removeTransformation(lTransformationComponent);
                    if (!lAffectedChildren) {
                        break;
                    }

                    // Map all affected children transformations for potential buffer update as their parent index will change after the removal of their parent component.
                    for (const lChildComponent of lAffectedChildren) {
                        if (lChildComponent.enabled) {
                            lChangedTransformations.add(lChildComponent);
                        }
                    }

                    break;
                }

                case 'deactivate': {
                    // NOP
                }
            }
        }

        // Skip processing if there are no changed transformations to update.
        if (lChangedTransformations.size === 0) {
            return;
        }

        // Cache: node -> is it covered by a changed ancestor?
        const lCoverageCache: Map<TransformationComponent, boolean> = new Map<TransformationComponent, boolean>();
        const lIsCoveredByAncestor = (pTransformation: TransformationComponent): boolean => {
            // Try to get next transformation parent of current transformation.
            const lParent: TransformationComponent | undefined = this.mComponentParentMap.get(pTransformation);
            if (!lParent) {
                return false;
            }

            if (lCoverageCache.has(lParent)) {
                return lCoverageCache.get(lParent)!;
            }

            // Parent itself is a changed node -> covered
            if (lChangedTransformations.has(lParent)) {
                lCoverageCache.set(lParent, true);
                return true;
            }

            const lParentCovered: boolean = lIsCoveredByAncestor(lParent);
            lCoverageCache.set(lParent, lParentCovered);
            return lParentCovered;
        };

        const lUpdateBounds: TransformationSystemBufferUpdateRange = {
            lowerBoundIndex: Number.MAX_SAFE_INTEGER,
            upperBoundIndex: 0
        };

        const lRecalculateWorldMatrix = (pNode: TransformationComponent, pParentWorldMatrix: Matrix | null): void => {
            // Calculate the world matrix: parentWorldMatrix * localMatrix, or just localMatrix if no parent.
            const lWorldMatrix: Matrix = pParentWorldMatrix ? pParentWorldMatrix.mult(pNode.matrix) : pNode.matrix;

            // Store the world matrix for this node.
            this.mComponentWorldMatrixMap.set(pNode, lWorldMatrix);

            // Write the world matrix to the shared buffer and track the updated range.
            const lBufferIndex: number = this.writeTransformationMatrixToBuffer(pNode, lWorldMatrix);
            if (lBufferIndex < lUpdateBounds.lowerBoundIndex) {
                lUpdateBounds.lowerBoundIndex = lBufferIndex;
            }
            if (lBufferIndex > lUpdateBounds.upperBoundIndex) {
                lUpdateBounds.upperBoundIndex = lBufferIndex;
            }

            // Recursively update all children since their world matrices depend on this node.
            const lChildren: Set<TransformationComponent> | undefined = this.mComponentChildrenMap.get(pNode);
            if (lChildren && lChildren.size > 0) {
                for (const lChild of lChildren) {
                    lRecalculateWorldMatrix(lChild, lWorldMatrix);
                }
            }
        };

        // Recalculate world matrices for all changed transformations that are not covered by an ancestor to avoid redundant calculations.
        for (const lTransformation of lChangedTransformations) {
            if (!lIsCoveredByAncestor(lTransformation)) {
                // Read parent world matrix.
                const lParent: TransformationComponent | undefined = this.mComponentParentMap.get(lTransformation);

                // Read parent world matrix if parent exists, otherwise null.
                let lParentWorldMatrix: Matrix | null = null;
                if (lParent) {
                    lParentWorldMatrix = this.mComponentWorldMatrixMap.get(lParent) ?? null;
                }

                lRecalculateWorldMatrix(lTransformation, lParentWorldMatrix);
            }
        }

        // Resize buffer if size does not match current data buffer size.
        if (this.mGpuBuffer!.size < this.mDataBuffer!.byteLength) {
            this.mGpuBuffer!.size = this.mDataBuffer!.byteLength;
        }

        // Calculate byte offsets for the updated buffer range based on the lower and upper bound matrix indices.
        let lLowerBoundByteIndex: number = lUpdateBounds.lowerBoundIndex * TransformationSystem.MATRIX_SIZE * 4;

        // Align lower bound to 8 bytes.
        lLowerBoundByteIndex &= ~7;

        // Calculate the length of the data to be updated in bytes based on the upper and lower bound indices.
        let lDataLength: number = (lUpdateBounds.upperBoundIndex - lUpdateBounds.lowerBoundIndex + 1) * TransformationSystem.MATRIX_SIZE * 4;

        // Align data length to 4 bytes.
        lDataLength = (lDataLength + 3) & ~3;

        // Update GPU buffer with new data from shared buffer. +1 to upper bound because it is inclusive.
        this.mGpuBuffer!.write(this.mDataBuffer!, lLowerBoundByteIndex, lLowerBoundByteIndex, lDataLength);
    }

    /**
     * Add a transformation component to the system by assigning it an index in the shared buffer,
     * mapping it for quick access, and establishing parent-child relationships based on the component's parent entity.
     * 
     * @param pComponent - The transformation component to be added to the system.
     */
    private addTransformation(pComponent: TransformationComponent): void {
        // Assign an index for this component in the buffer.
        if (this.mAvailableIndices.length === 0) {
            // Extend buffer by one block (4 components) if no indices are available.
            this.extendBuffer(4);
        }

        // Map the component to the next available index in the buffer.
        this.mComponentIndexMap.set(pComponent, this.mAvailableIndices.pop()!);

        // Get parent entity of this component.
        const lGameObject: GameEntity = pComponent.gameEntity;

        // Find parent component.
        let lParentComponent: TransformationComponent | null = null;
        if (lGameObject.parent instanceof GameEntity) {
            lParentComponent = lGameObject.parent.getParentComponent(TransformationComponent);
        }

        // Set parent component reference for this component and register as child of parent.
        if (lParentComponent) {
            this.mComponentParentMap.set(pComponent, lParentComponent);
            this.getChildTransformations(lParentComponent).add(pComponent);
        }
    }

    /**
     * Extends the shared buffer to accommodate additional transformation components.
     * Buffer is extended in blocks of 4 components (80 numbers per block) to maintain alignment and minimize fragmentation.
     *
     * @param pCountOfNewMatrices - Number of matrices to add to the buffer. Each matrix accommodates 4 components.
     */
    private extendBuffer(pCountOfNewMatrices: number = 1): void {
        // Calculate size of a single transformation matrix in bytes.
        // MATRIX_SIZE is in number of 32bit elements, so multiply by 4 for bytes.
        const lMatrixSizeInBytes: number = TransformationSystem.MATRIX_SIZE * 4;

        // Read current length of 32bit buffer.
        const lOldBufferByteLength: number = this.mDataBuffer!.byteLength;

        // Grow the buffer by the specified number of matrices.
        this.mDataBuffer!.grow(lOldBufferByteLength + (lMatrixSizeInBytes * pCountOfNewMatrices));

        // Create a new Float32Array view for the new buffer.
        this.mMatrixDataView = new Float32Array(this.mDataBuffer!);

        // Calculate current last index.
        const lOldMatrixCount: number = lOldBufferByteLength / lMatrixSizeInBytes;

        // Add the new matrix index to the available indices list.
        for (let lNewIndex = lOldMatrixCount; lNewIndex < lOldMatrixCount + pCountOfNewMatrices; lNewIndex++) {
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
    private getChildTransformations(pComponent: TransformationComponent): Set<TransformationComponent> {
        // Read current children for this parent.
        let lChildren: Set<TransformationComponent> | undefined = this.mComponentChildrenMap.get(pComponent);
        if (!lChildren) {
            lChildren = new Set<TransformationComponent>();
            this.mComponentChildrenMap.set(pComponent, lChildren);
        }

        return lChildren;
    }

    /**
     * Removes a transformation component's reference from the system when it is removed from the game environment.
     * 
     * @param pComponent - The transformation component that is being removed and whose reference should be cleaned up.
     */
    private removeTransformation(pComponent: TransformationComponent): Iterable<TransformationComponent> | null {
        // Get index for this component.
        const lIndex: number = this.mComponentIndexMap.get(pComponent)!;

        // Remove from map and add index to available list.
        this.mComponentIndexMap.delete(pComponent);
        this.mAvailableIndices.push(lIndex);

        // Get current parent component and children of this component.
        const lParentComponent: TransformationComponent | undefined = this.mComponentParentMap.get(pComponent);
        const lChildren: Set<TransformationComponent> = this.getChildTransformations(pComponent);

        // Remove this component from its parent's children set if it has a parent.
        if (lParentComponent) {
            const lChildrenOfParent: Set<TransformationComponent> = this.getChildTransformations(lParentComponent);

            // Delete this component from its parent's children.
            lChildrenOfParent.delete(pComponent);

            // Append this component's children to the parent's children set to maintain the hierarchy after this component is removed.
            for (const lChildComponent of lChildren) {
                // Add child component to the children set of the parent.
                lChildrenOfParent.add(lChildComponent);

                // Update the parent index of the child component to point to the parent of the removed component.
                this.mComponentParentMap.set(lChildComponent, lParentComponent);
            }
        }

        // Empty result return if there are no children to update.
        if (lChildren.size === 0) {
            return null;
        }

        return lChildren;
    }

    /**
     * Writes a transformation component's matrix data to the shared buffer.
     * Calculates the correct buffer offset based on the component's assigned index and writes the transformation matrix data.
     *
     * @param pComponent - The transformation component whose matrix data should be written.
     * @param pMatrix - The matrix data to be written to the buffer.
     * 
     * @returns the index of the changed buffer matrix.
     */
    private writeTransformationMatrixToBuffer(pComponent: TransformationComponent, pMatrix: Matrix): number {
        // Get index for this component.
        const lIndex: number = this.mComponentIndexMap.get(pComponent)!;

        // Calculate the float32 offset for this component's data in the buffer.
        const lBufferMatrixOffset: number = lIndex * TransformationSystem.MATRIX_SIZE;

        // Update components transformation matrix in buffer.
        this.mMatrixDataView!.set(pMatrix.dataArray, lBufferMatrixOffset);

        return lIndex;
    }
}

type TransformationSystemBufferUpdateRange = {
    /**
     * Lower bound matrix index of the buffer range that has been updated and needs to be written to the GPU buffer.
     * Inclusive index in bytes.
     */
    lowerBoundIndex: number;

    /**
     * Upper bound matrix index of the buffer range that has been updated and needs to be written to the GPU buffer.
     * Inclusive index in bytes.
     */
    upperBoundIndex: number;
};