import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { TransformationComponent } from "../component/transformation-component.ts";
import { GameComponentConstructor } from "../core/component/game-component.ts";
import { GameEnvironmentStateChange } from "../core/environment/game-environment-transmittion.ts";
import { GameSystem } from "../core/game-system.ts";
import { Matrix } from "../math/matrix.ts";

// TODO: GpuSystem should be nice, reading limits, creating the adapter and so on.

export class TransformationSystem extends GameSystem {
    private readonly mAvailableIndices: Array<number>;
    private readonly mDataBuffer: SharedArrayBuffer;
    private readonly mMatrixDataView: Float32Array;
    private readonly mComponentToIndexMap: WeakMap<TransformationComponent, number>;

    /**
     * Define which component types this system is interested in.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [TransformationComponent];
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        // Create the shared buffer for all transformations data.
        this.mDataBuffer = new SharedArrayBuffer(0);

        /*
         * Buffer layout in bytes: Repeated after 68 bytes for each component
         * [0 - 3] int32: Parent index (or -1 if no parent)
         * [4 - 67] float32: Local transformation matrix (16 floats)
         */

        // Create views into the buffer for count and data.
        this.mMatrixDataView = new Float32Array(this.mDataBuffer);

        // Initialize the available indices list.
        this.mAvailableIndices = new Array<number>();

        // Create a weak map to track which component is at which index in the buffer.
        this.mComponentToIndexMap = new WeakMap<TransformationComponent, number>();
    }

    protected override onUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        // Process state changes for TransformationComponent
        for (const lStateChange of pStateChanges.get(TransformationComponent)!) {
            const lTransformationComponent = lStateChange.component as TransformationComponent;

            switch (lStateChange.type) {
                case "add": {
                    // Get an available index or create a new one.
                    if (this.mAvailableIndices.length === 0) {
                        // TODO: Special logic.
                        break;
                    }

                }
                case "update": {
                    // Get current index.
                    const lIndex: number = this.mComponentToIndexMap.get(lTransformationComponent)!;

                    // Update the transformation matrix in the buffer.
                    const lMatrix: Matrix = lTransformationComponent.matrix;
                    for (let lFloat32Index = 0; lFloat32Index < 16; lFloat32Index++) {
                        // Write the matrix data to the buffer at the correct offset.
                        // IndexOffset + CurrentMatrixItemOffset + Int32ParentIdOffset
                        this.mMatrixDataView[(lIndex * 17) + lFloat32Index + 1] = lMatrix.dataArray[lFloat32Index];
                    }
                }
                case "remove": {
                    // Get current index.
                    const lExistingIndex: number = this.mComponentToIndexMap.get(lTransformationComponent)!;

                    // Remove from map and add index to available list.
                    this.mComponentToIndexMap.delete(lTransformationComponent);
                    this.mAvailableIndices.push(lExistingIndex);

                    break;
                }

                case "activate":
                case "deactivate": {
                    // NOP
                }
            }
        }
    }

    private writeMatrixToBuffer(pComponent: TransformationComponent, pIndex: number): void {
        // TODO: GameEntity needs a "FirstXofParent" toi read the first instance of a component in the parent hierarchy to get the correct parent index for the buffer.
    }
}