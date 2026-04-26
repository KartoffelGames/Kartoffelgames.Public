import type { PotatnoCodeFileSerializationResult } from '../serialization/potatno-serialization.type.ts';

/**
 * Snapshot-based undo/redo history manager.
 * Stores serialization snapshots and allows moving backwards/forwards through them.
 */
export class PotatnoHistory {
    private readonly mMaxSize: number;
    private mCurrentIndex: number;
    private readonly mSnapshots: Array<PotatnoCodeFileSerializationResult>;

    /**
     * Whether there are any snapshots available to redo.
     */
    public get canRedo(): boolean {
        return this.mCurrentIndex < this.mSnapshots.length - 1;
    }

    /**
     * Whether there are any snapshots available to undo.
     */
    public get canUndo(): boolean {
        return this.mCurrentIndex > 0;
    }

    /**
     * Constructor.
     *
     * @param pMaxSize - Maximum number of snapshots to retain. Defaults to 100.
     */
    public constructor(pMaxSize: number = 100) {
        this.mSnapshots = new Array<PotatnoCodeFileSerializationResult>();
        this.mCurrentIndex = -1;
        this.mMaxSize = pMaxSize;
    }

    /**
     * Push a new snapshot onto the history stack.
     * Discards any redo snapshots beyond the current index.
     * Trims the oldest entries if the stack exceeds the maximum size.
     *
     * @param pSnapshot - The serialization snapshot to record.
     */
    public push(pSnapshot: PotatnoCodeFileSerializationResult): void {
        // Discard any redo history beyond current position.
        this.mSnapshots.splice(this.mCurrentIndex + 1);

        this.mSnapshots.push(pSnapshot);
        this.mCurrentIndex = this.mSnapshots.length - 1;

        // Trim if beyond max size.
        if (this.mSnapshots.length > this.mMaxSize) {
            this.mSnapshots.shift();
            this.mCurrentIndex = this.mSnapshots.length - 1;
        }
    }

    /**
     * Step back one snapshot. Returns the snapshot to restore, or null if none.
     */
    public undo(): PotatnoCodeFileSerializationResult | null {
        if (!this.canUndo) {
            return null;
        }

        this.mCurrentIndex--;
        return this.mSnapshots[this.mCurrentIndex];
    }

    /**
     * Step forward one snapshot. Returns the snapshot to restore, or null if none.
     */
    public redo(): PotatnoCodeFileSerializationResult | null {
        if (!this.canRedo) {
            return null;
        }

        this.mCurrentIndex++;
        return this.mSnapshots[this.mCurrentIndex];
    }

    /**
     * Clear all history.
     */
    public clear(): void {
        this.mSnapshots.length = 0;
        this.mCurrentIndex = -1;
    }
}
