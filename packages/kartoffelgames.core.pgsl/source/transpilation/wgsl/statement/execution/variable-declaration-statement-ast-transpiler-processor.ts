import { VariableDeclarationStatementAst } from '../../../../abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslValueFixedState } from '../../../../enum/pgsl-value-fixed-state.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class VariableDeclarationStatementAstTranspilerProcessor extends TranspilerProcessor<VariableDeclarationStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof VariableDeclarationStatementAst {
        return VariableDeclarationStatementAst;
    }

    /**
     * Transpiles a PGSL variable declaration statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: VariableDeclarationStatementAst): string {
        // Depending on the declaration fixed type decide declaration keyword.
        let lDeclarationName: string = 'var';
        if(pInstance.data.fixedState === PgslValueFixedState.Constant) {
            lDeclarationName = 'const';
        } else if(pInstance.data.fixedState === PgslValueFixedState.ScopeFixed) {
            lDeclarationName = 'let';
        } else {
            lDeclarationName = 'var';
        }

        // Depending on the expression presence, create the declaration with or without an initialization value.
        if(pInstance.data.expression){
            return `${lDeclarationName} ${pInstance.data.name}:${this.transpileAst(pInstance.data.typeDeclaration)}=${this.transpileAst(pInstance.data.expression)};`;
        } else {
            return `${lDeclarationName} ${pInstance.data.name}:${this.transpileAst(pInstance.data.typeDeclaration)};`;
        }
    }
}
