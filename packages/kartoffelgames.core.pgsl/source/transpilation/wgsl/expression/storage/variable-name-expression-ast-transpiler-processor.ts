import { Exception } from '@kartoffelgames/core';
import { VariableNameExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts';
import type { ITranspilerProcessor } from '../../../i-transpiler-processor.interface.ts';
import { PgslEnumType } from '../../../../abstract_syntax_tree/type/pgsl-enum-type.ts';

export class VariableNameExpressionAstTranspilerProcessor implements ITranspilerProcessor<VariableNameExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof VariableNameExpressionAst {
        return VariableNameExpressionAst;
    }

    /**
     * Transpiles a PGSL variable name expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: VariableNameExpressionAst): string {
        // Throw when resolve type is an enum.
        if (pInstance.data.resolveType instanceof PgslEnumType) {
            throw new Exception(`Cannot transpile variable name expression for enum type "${pInstance.data.resolveType.enumName}".`, this);
        }

        return pInstance.data.variableName;
    }
}
