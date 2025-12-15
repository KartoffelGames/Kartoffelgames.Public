import { BinaryExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/binary-expression-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslBinaryExpressionTranspilerProcessor implements IPgslTranspilerProcessor<BinaryExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BinaryExpressionAst {
        return BinaryExpressionAst;
    }

    /**
     * Transpiles a PGSL binary expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: BinaryExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.data.leftExpression)} ${pInstance.data.operatorName} ${pTranspile(pInstance.data.rightExpression)}`;
    }
}
