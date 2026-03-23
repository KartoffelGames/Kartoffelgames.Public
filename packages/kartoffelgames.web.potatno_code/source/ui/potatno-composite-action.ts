import type { PotatnoHistoryAction } from './potatno-history-action.ts';

/**
 * Groups multiple history actions into a single undo/redo step.
 * When applied, all contained actions are executed in order.
 * When reverted, all contained actions are undone in reverse order.
 */
export class CompositeAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mActions: Array<PotatnoHistoryAction>;

    /**
     * Constructor.
     *
     * @param pDescription - Human-readable description for this composite action.
     * @param pActions - Array of history actions to group together.
     */
    public constructor(pDescription: string, pActions: Array<PotatnoHistoryAction>) {
        this.description = pDescription;
        this.mActions = pActions;
    }

    /**
     * Apply all contained actions in forward order.
     */
    public apply(): void {
        for (const lAction of this.mActions) {
            lAction.apply();
        }
    }

    /**
     * Revert all contained actions in reverse order.
     */
    public revert(): void {
        // Revert in reverse order.
        for (let lI: number = this.mActions.length - 1; lI >= 0; lI--) {
            this.mActions[lI].revert();
        }
    }
}
