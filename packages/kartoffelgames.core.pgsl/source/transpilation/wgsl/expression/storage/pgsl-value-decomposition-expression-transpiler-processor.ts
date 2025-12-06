import { Exception } from '@kartoffelgames/core';
import type { PgslExpression } from '../../../../abstract_syntax_tree/expression/pgsl-expression.ts';
import { PgslValueDecompositionExpression } from '../../../../abstract_syntax_tree/expression/storage/pgsl-value-decomposition-expression.ts';
import type { PgslEnumTrace } from '../../../../trace/pgsl-enum-trace.ts';
import type { PgslExpressionTrace } from '../../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import { PgslEnumType } from '../../../../type/pgsl-enum-type.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslValueDecompositionExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslValueDecompositionExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslValueDecompositionExpression {
        return PgslValueDecompositionExpression;
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
    public process(pInstance: PgslValueDecompositionExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(pInstance.value);

        // When the value is a enum, transpille as constant.
        if (lExpressionTrace.resolveType instanceof PgslEnumType) {
            // Read enum declaration.
            const lPgslEnumTrace: PgslEnumTrace | undefined = pTrace.getEnum(lExpressionTrace.resolveType.enumName);
            if (!lPgslEnumTrace) {
                throw new Exception(`Enum type for "${lExpressionTrace.resolveType.enumName}" not found but was traced.`, this);
            }

            // Read enum value. If not found, transpile as normal property value decomposition.
            const lEnumValueExpression: PgslExpression | undefined = lPgslEnumTrace.values.get(pInstance.property); // Ensure property exists.
            if (lEnumValueExpression) {
                return pTranspile(lEnumValueExpression);
            }

            // Add incident when property not found.
            pTrace.pushIncident(`Enum "${lPgslEnumTrace.name}" does not contain a value for property "${pInstance.property}".`, pInstance);

            return "0";
        }

        // Transpile value and property.
        return `${pTranspile(pInstance.value)}.${pInstance.property}`;
    }
}
