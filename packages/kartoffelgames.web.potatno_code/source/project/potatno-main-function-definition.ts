import type { PotatnoPortDefinition } from '../node/potatno-port-definition.ts';

/**
 * Definition of a main function (fixed entry point) for the editor.
 */
export interface PotatnoMainFunctionDefinition {
    /** Internal name of the main function. */
    readonly name: string;
    /** Display label of the main function. */
    readonly label: string;
    /** Input port definitions for the main function. */
    readonly inputs: Array<PotatnoPortDefinition>;
    /** Output port definitions for the main function. */
    readonly outputs: Array<PotatnoPortDefinition>;
    /** Whether the user can edit this function definition. */
    readonly editableByUser?: boolean;
}
