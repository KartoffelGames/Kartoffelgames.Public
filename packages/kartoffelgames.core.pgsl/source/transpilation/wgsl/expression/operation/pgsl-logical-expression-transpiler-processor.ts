import { LogicalExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class PgslLogicalExpressionTranspilerProcessor implements ITranspilerProcessor<LogicalExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LogicalExpressionAst {
        return LogicalExpressionAst;
    }

    /**
     * Transpiles a PGSL logical expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: LogicalExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.data.leftExpression)}${pInstance.data.operatorName}${pTranspile(pInstance.data.rightExpression)}`;
    }
}
