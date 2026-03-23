/**
 * Definition of a global value available in all functions.
 */
export interface PotatnoGlobalValueDefinition {
    /** Internal name of the global value. */
    readonly name: string;
    /** Data type of the global value. */
    readonly type: string;
    /** Display label of the global value. */
    readonly label: string;
}
