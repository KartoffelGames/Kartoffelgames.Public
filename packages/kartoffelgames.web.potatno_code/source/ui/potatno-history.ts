import type { PotatnoHistoryAction } from './potatno-history-action.ts';

/**
 * Undo/redo history manager using the command pattern.
 * Maintains separate undo and redo stacks with a configurable maximum size.
 */
export class PotatnoHistory {
    private readonly mMaxSize: number;
    private readonly mRedoStack: Array<PotatnoHistoryAction>;
    private readonly mUndoStack: Array<PotatnoHistoryAction>;

    /**
     * Whether there are any actions available to redo.
     */
    public get canRedo(): boolean {
        return this.mRedoStack.length > 0;
    }

    /**
     * Whether there are any actions available to undo.
     */
    public get canUndo(): boolean {
        return this.mUndoStack.length > 0;
    }

    /**
     * Constructor.
     *
     * @param pMaxSize - Maximum number of undo steps to retain. Defaults to 100.
     */
    public constructor(pMaxSize: number = 100) {
        this.mUndoStack = new Array<PotatnoHistoryAction>();
        this.mRedoStack = new Array<PotatnoHistoryAction>();
        this.mMaxSize = pMaxSize;
    }

    /**
     * Execute an action and push it to the undo stack.
     * Clears the redo stack and trims the undo stack if it exceeds the maximum size.
     *
     * @param pAction - The history action to execute and record.
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
     * Undo the last action. Reverts it and moves it to the redo stack.
     */
    public undo(): void {
        const lAction: PotatnoHistoryAction | undefined = this.mUndoStack.pop();
        if (lAction) {
            lAction.revert();
            this.mRedoStack.push(lAction);
        }
    }

    /**
     * Redo the last undone action. Re-applies it and moves it back to the undo stack.
     */
    public redo(): void {
        const lAction: PotatnoHistoryAction | undefined = this.mRedoStack.pop();
        if (lAction) {
            lAction.apply();
            this.mUndoStack.push(lAction);
        }
    }

    /**
     * Clear all history, emptying both the undo and redo stacks.
     */
    public clear(): void {
        this.mUndoStack.length = 0;
        this.mRedoStack.length = 0;
    }
}
