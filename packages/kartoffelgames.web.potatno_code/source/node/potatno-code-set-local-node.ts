import { PotatnoCodeNode } from './potatno-code-node.ts';

/**
 * Code generation node for "Set Local" variable nodes.
 * Assigns a value to a local variable.
 */
export class PotatnoCodeSetLocalNode extends PotatnoCodeNode {
    public override generateCode(): string {
        const lVarName: string = this.properties.get('variableName') ?? 'undefined';
        const lInput = this.inputs.values().next().value;
        const lValueId: string = lInput?.valueId ?? 'undefined';
        return `${lVarName} = ${lValueId};`;
    }
}
