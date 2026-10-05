import type { AbstractSyntaxTree, AbstractSyntaxTreeConstructor } from '../../abstract_syntax_tree/abstract-syntax-tree.ts';
import { FunctionDeclarationAst } from '../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { StructDeclarationAst } from '../../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import { VariableDeclarationAst } from '../../abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import { DocumentAst } from '../../abstract_syntax_tree/document-ast.ts';
import { AttributeListAst } from '../../abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslBuildInType } from '../../abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslNumericType } from '../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { TranspilerProcessor } from '../transpiler-processor.ts';

export class DocumentAstTranspilerProcessor extends TranspilerProcessor<DocumentAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DocumentAst {
        return DocumentAst;
    }

    /**
     * Processes the PGSL document syntax tree.
     * 
     * @param pInstance - The syntax tree instance to transpile.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: DocumentAst): string {
        // List of transpileable child nodes.
        const lTranspileableChildren: Array<AbstractSyntaxTreeConstructor> = [
            FunctionDeclarationAst, VariableDeclarationAst, StructDeclarationAst
        ];
        const lIsTranspileable = (pChild: AbstractSyntaxTree): boolean => {
            for (const lTranspileableChild of lTranspileableChildren) {
                if (pChild instanceof lTranspileableChild) {
                    return true;
                }
            }
            return false;
        };

        let lResult: string = '';

        // Transpile the document by processing all child nodes.
        for (const lChild of pInstance.data.content) {
            // Ignore some declarations as their values gets inlined.
            if (!lIsTranspileable(lChild)) {
                continue;
            }

            lResult += this.transpileAst(lChild);
        }

        // Prepend used extensions.
        lResult = this.registerUsedExtensions(pInstance) + lResult;

        return lResult;
    }

    /**
     * Registers the used WGSL extensions based on the symbols used in the document.
     * 
     * @param pInstance - The document AST instance.
     * 
     * @returns A string containing the WGSL extension enable statements.
     */
    private registerUsedExtensions(pInstance: DocumentAst): string {
        const lUsedExtensions: Array<string> = new Array<string>();

        // F16 extension.
        if (pInstance.data.symbolUsages.has(PgslNumericType.typeName.float16)) {
            lUsedExtensions.push('f16');
        }

        // Clip distances extension.
        if (pInstance.data.symbolUsages.has(PgslBuildInType.typeName.clipDistances)) {
            lUsedExtensions.push('clip_distances');
        }

        // Dual source blend extension.
        if (pInstance.data.symbolUsages.has(AttributeListAst.attributeNames.blendSource)) {
            lUsedExtensions.push('dual_source_blending');
        }

        // Subgroups are omitted for now.

        // Primitive index.
        if (pInstance.data.symbolUsages.has(PgslBuildInType.typeName.primitiveIndex)) {
            lUsedExtensions.push('primitive_index');
        }

        // Merge and return extension enable statements.
        return lUsedExtensions.map(pExtension => {
            return `enable ${pExtension};`;
        }).join('');
    }
}