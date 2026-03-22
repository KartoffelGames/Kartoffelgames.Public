import type { PotatnoPortDefinition } from './potatno-port-definition.ts';

/**
 * Definition of a main function (fixed entry point) for the editor.
 */
export interface PotatnoMainFunctionDefinition {
    readonly name: string;
    readonly label: string;
    readonly inputs: Array<PotatnoPortDefinition>;
    readonly outputs: Array<PotatnoPortDefinition>;
    readonly editableByUser?: boolean;
}
