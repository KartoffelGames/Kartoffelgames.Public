import type { PotatnoHistoryAction } from './potatno-history-action.ts';

/**
 * Undo/redo history manager using the command pattern.
 */
export class PotatnoHistory {
    private readonly mMaxSize: number;
    private readonly mRedoStack: Array<PotatnoHistoryAction>;
    private readonly mUndoStack: Array<PotatnoHistoryAction>;

    public get canRedo(): boolean {
        return this.mRedoStack.length > 0;
    }

    public get canUndo(): boolean {
        return this.mUndoStack.length > 0;
    }

    public constructor(pMaxSize: number = 100) {
        this.mUndoStack = new Array<PotatnoHistoryAction>();
        this.mRedoStack = new Array<PotatnoHistoryAction>();
        this.mMaxSize = pMaxSize;
    }

    /**
     * Execute an action and push it to the undo stack.
     */
    public push(pAction: PotatnoHistoryAction): void {
        pAction.apply();
        this.mUndoStack.push(pAction);

        // Clear the redo stack on new action.
        this.mRedoStack.length = 0;

        // Trim if beyond max size.
        if (this.mUndoStack.length > this.mMaxSize) {
            this.mUndoStack.shift();
        }
    }

    /**
     * Undo the last action.
     */
    public undo(): void {
        const lAction: PotatnoHistoryAction | undefined = this.mUndoStack.pop();
        if (lAction) {
            lAction.revert();
            this.mRedoStack.push(lAction);
        }
    }

    /**
     * Redo the last undone action.
     */
    public redo(): void {
        const lAction: PotatnoHistoryAction | undefined = this.mRedoStack.pop();
        if (lAction) {
            lAction.apply();
            this.mUndoStack.push(lAction);
        }
    }

    /**
     * Clear all history.
     */
    public clear(): void {
        this.mUndoStack.length = 0;
        this.mRedoStack.length = 0;
    }
}
