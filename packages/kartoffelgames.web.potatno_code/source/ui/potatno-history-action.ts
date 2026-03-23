/**
 * Interface for a reversible history action (command pattern).
 */
export interface PotatnoHistoryAction {
    readonly description: string;

    /**
     * Apply the action, executing the forward operation.
     */
    apply(): void;

    /**
     * Revert the action, undoing its effects.
     */
    revert(): void;
}
