import { StructDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import type { StructPropertyDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
import { TranspilerProcessor } from '../../transpiler-processor.ts';
import { WgslTranspiler } from '../wgsl-transpiler.ts';

export class StructDeclarationAstTranspilerProcessor extends TranspilerProcessor<StructDeclarationAst> {
    /**
     * Returns the target type for this processor.
     */
    public get target(): typeof StructDeclarationAst {
        return StructDeclarationAst;
    }

    /**
     * Transpile current struct declaration into a string.
     * 
     * @param pInstance - Instance to process.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: StructDeclarationAst): string {
        // Transpile properties and escape name.
        const lProperties: string = pInstance.data.properties.map((pProperty: StructPropertyDeclarationAst) => this.transpileAst(pProperty)).join(',');
        const lEscapedName: string = WgslTranspiler.escapeName(pInstance.data.name);

        return `struct ${lEscapedName}{${lProperties}}`;
    }
}