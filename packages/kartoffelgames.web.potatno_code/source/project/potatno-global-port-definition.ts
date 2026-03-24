/**
 * Definition of a global input or output port visible in every function.
 */
export interface PotatnoGlobalPortDefinition {
    /** Display name of the global port. */
    readonly name: string;
    /** Data type of the global port. */
    readonly type: string;
}
