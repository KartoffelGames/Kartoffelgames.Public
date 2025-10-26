import { Exception } from '@kartoffelgames/core';
import { PgslEnumDeclaration } from '../../../syntax_tree/declaration/pgsl-enum-declaration.ts';
import type { PgslEnumTrace } from '../../../trace/pgsl-enum-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-pgsl-transpiler-processor.interface.ts';

export class PgslEnumDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<PgslEnumDeclaration> {
    /**
     * Gets the target class this processor can handle.
     *
     * @returns The constructor of the target class.
     */
    public get target(): typeof PgslEnumDeclaration {
        return PgslEnumDeclaration;
    }

    /**
     * Process a PGSL enum declaration and transpile it to WGSL.
     * 
     * @param pInstance - The enum declaration instance to process.
     * @param pTrace - The current trace context for semantic information.
     * @param pSendResult - Callback to send transpiled WGSL code.
     * @param pTranspile - Callback to transpile nested expressions.
     */
    public process(pInstance: PgslEnumDeclaration, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Get trace information for the enum.
        const lTrace: PgslEnumTrace | undefined = pTrace.getEnum(pInstance.name);
        if (!lTrace) {
            throw new Exception(`No trace information found for enum '${pInstance.name}'.`, this);
        }

        // Create a const declaration for each enum value.
        let lResult: string = '';
        for (const [lPropertyName, lPropertyValueExpression] of lTrace.values) {
            lResult += `const ENUM__${lTrace.name}__${lPropertyName}: u32 = ${pTranspile(lPropertyValueExpression)};\n`;
        }

        return lResult;
    }
}