import { DiscardStatementAst } from '../../../../abstract_syntax_tree/statement/single/pgsl-discard-statement.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslDiscardStatementTranspilerProcessor implements IPgslTranspilerProcessor<DiscardStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DiscardStatementAst {
        return DiscardStatementAst;
    }

    /**
     * Transpiles a PGSL discard statement into WGSL code.
     * 
     * @param _pInstance - Processor syntax tree instance.
     * @param _pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(_pInstance: DiscardStatementAst, _pTranspile: PgslTranspilerProcessorTranspile): string {
        return `discard;`;
    }
}
