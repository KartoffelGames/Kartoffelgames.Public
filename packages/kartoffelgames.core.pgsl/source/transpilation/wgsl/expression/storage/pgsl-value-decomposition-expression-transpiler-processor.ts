import { Exception } from '@kartoffelgames/core';
import { ValueDecompositionExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import { PgslEnumType } from '../../../../type/pgsl-enum-type.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';
import { IExpressionAst } from "../../../../abstract_syntax_tree/expression/i-expression-ast.interface.ts";
import { EnumDeclarationAst } from "../../../../abstract_syntax_tree/declaration/enum-declaration-ast.ts";

export class PgslValueDecompositionExpressionTranspilerProcessor implements IPgslTranspilerProcessor<ValueDecompositionExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ValueDecompositionExpressionAst {
        return ValueDecompositionExpressionAst;
    }

    /**
     * Transpiles a PGSL value decomposition expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: ValueDecompositionExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        // When the value is a enum, transpille as constant.
        if (pInstance.data.resolveType instanceof PgslEnumType) {
            // Read enum declaration.
            const lPgslEnumTrace: EnumDeclarationAst | null = pInstance.data.resolveType.enumDeclaration;
            if (!lPgslEnumTrace) {
                throw new Exception(`Enum type for "${pInstance.data.resolveType.enumName}" not found but was traced.`, this);
            }

            // Read enum value. If not found, transpile as normal property value decomposition.
            const lEnumValueExpression: IExpressionAst | undefined = lPgslEnumTrace.data.values.get(pInstance.data.property); // Ensure property exists.
            if (lEnumValueExpression) {
                return pTranspile(lEnumValueExpression);
            }

            // Add incident when property not found.
            throw new Exception(`Enum "${lPgslEnumTrace.data.name}" does not contain a value for property "${pInstance.data.property}".`, pInstance);
        }

        // Transpile value and property.
        return `${pTranspile(pInstance.data.value)}.${pInstance.data.property}`;
    }
}
