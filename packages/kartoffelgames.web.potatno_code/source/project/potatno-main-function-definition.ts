import type { PotatnoEventDefinition } from './potatno-event-definition.ts';

/**
 * Definition of a main function (fixed entry point) for the editor.
 * Inputs and outputs are defined as Record<name, type> for type safety.
 */
export interface PotatnoMainFunctionDefinition {
    /** Internal name of the main function. */
    readonly name: string;
    /** Display label of the main function. */
    readonly label: string;
    /** Optional input value node definitions. Keys are names, values are type strings. */
    readonly inputs?: Readonly<Record<string, string>>;
    /** Optional output value node definitions. Keys are names, values are type strings. */
    readonly outputs?: Readonly<Record<string, string>>;
    /** Event entry points (non-deletable flow entry nodes). */
    readonly events?: Array<PotatnoEventDefinition>;
    /** Whether the user can edit this function definition. */
    readonly editableByUser?: boolean;
}
