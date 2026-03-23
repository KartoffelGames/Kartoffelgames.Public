/**
 * Definition of a port type used when registering node definitions.
 */
export interface PotatnoPortDefinition {
    /** Display name of the port. */
    readonly name: string;
    /** Data type identifier for the port. */
    readonly type: string;
}
