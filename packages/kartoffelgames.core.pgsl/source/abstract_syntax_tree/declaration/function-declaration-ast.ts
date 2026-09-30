import type { FunctionDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import { BaseDeclarationAst, type DeclarationAstData } from './base-declaration-ast.ts';
import { FunctionOverloadDeclarationAst } from "./function-overload-declaration-ast.ts";

/**
 * PGSL syntax tree for a alias declaration.
 */
export class FunctionDeclarationAst extends BaseDeclarationAst<FunctionDeclarationCst, FunctionDeclarationAstData> {
    /**
     * Variable name.
     */
    public get name(): string {
        return this.data.name;
    }

    /**
     * Register function without registering its content.
     * 
     * @param pContext - Processing context.
     */
    public override register(pContext: AbstractSyntaxTreeContext): this {
        // Check if function is already defined in current scope.
        if (pContext.getFunction(this.name)) {
            pContext.pushIncident(`Function "${this.name}" is already defined.`, this);
        }

        // Register function in current scope.
        pContext.registerFunction(this.name, this);

        return this;
    }

    /**
     * Process and build data of current structure.
     * 
     * @param pContext - Build context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: FunctionDeclarationCst): FunctionDeclarationAstData {
        // If it is a function with multiple headers no attributelist is allowed.
        if (pCst.declarations.length > 1) {
            for (const lDeclarations of pCst.declarations) {
                if (lDeclarations.attributeList.attributes.length > 0) {
                    pContext.pushIncident(`Functions with multiple headers cannot have generic parameters.`, this);
                    break;
                }
            }
        }

        // Build return data.
        return {
            isConstant: pCst.isConstant,
            name: pCst.name,
            implicitGenerics: pCst.implicitGenerics,

            // Create empty attributes list to satisfy type.
            attributes: new AttributeListAst({
                type: 'AttributeList',
                attributes: [],
                range: pCst.range,
            }, this).process(pContext),

            // Map each declaration into a new overload ast.
            declarations: pCst.declarations.map((pOverloadDeclarationCst) => {
                return new FunctionOverloadDeclarationAst(pCst.name, pOverloadDeclarationCst).process(pContext);
            }),
        } satisfies FunctionDeclarationAstData;
    }
}

/**
 * Function declaration parameter containing type and name.
 */
export type FunctionDeclarationAstDataParameter = {
    /**
     * Function parameter type.
     * Number indicates generic parameter type of the header.
     */
    readonly type: TypeDeclarationAst | string;

    /**
     * Function parameter name.
     */
    readonly name: string;
};

export type FunctionDeclarationAstData = {
    /**
     * Function declaration can be used to create constant expressions.
     */
    isConstant: boolean;

    /**
     * Function name.
     */
    name: string;

    /**
     * Whether generic types are implicitly defined.
     */
    implicitGenerics: boolean;

    /**
     * Function parameter list.
     */
    declarations: ReadonlyArray<FunctionOverloadDeclarationAst>;
} & DeclarationAstData;