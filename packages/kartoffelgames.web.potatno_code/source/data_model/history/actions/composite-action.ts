import type { PotatnoHistoryAction } from '../potatno-history-action.ts';

/**
 * Groups multiple history actions into a single undo step.
 */
export class CompositeAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mActions: Array<PotatnoHistoryAction>;

    public constructor(pDescription: string, pActions: Array<PotatnoHistoryAction>) {
        this.description = pDescription;
        this.mActions = pActions;
    }

    public apply(): void {
        for (const lAction of this.mActions) {
            lAction.apply();
        }
    }

    public revert(): void {
        // Revert in reverse order.
        for (let lI: number = this.mActions.length - 1; lI >= 0; lI--) {
            this.mActions[lI].revert();
        }
    }
}
