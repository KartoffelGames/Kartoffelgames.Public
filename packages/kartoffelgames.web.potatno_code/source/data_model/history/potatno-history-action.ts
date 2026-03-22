/**
 * Interface for a reversible history action (command pattern).
 */
export interface PotatnoHistoryAction {
    readonly description: string;
    apply(): void;
    revert(): void;
}
