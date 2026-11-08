import type { EnumDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import type { BasePgslType } from '../type/definition/base-pgsl-type.ts';
import { PgslInvalidType } from '../type/definition/pgsl-invalid-type.ts';
import { BaseDeclarationAst, type DeclarationAstData } from './base-declaration-ast.ts';

/**
 * PGSL syntax tree of a enum declaration.
 */
export class EnumDeclarationAst extends BaseDeclarationAst<EnumDeclarationCst, EnumDeclarationAstData> {
    /**
     * Enum name.
     */
    public get name(): string {
        return this.data.name;
    }

    /**
     * Register enum without registering its content.
     * 
     * @param pContext - Processing context.
     */
    public override register(pContext: AbstractSyntaxTreeContext): this {
        // Register enum.
        pContext.registerEnum(this.name, this);

        return this;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pContext - Build context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: EnumDeclarationCst): EnumDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(pCst.attributeList, this).process(pContext);

        // Read and convert enum values.
        const lEnumValues: Array<[string, IExpressionAst]> = this.processProperties(pContext, pCst);

        // Read first value of enum. That defines the types for all other enum values.
        const lFirstPropertyType: BasePgslType = (() => {
            // Fallback to invalid type.
            if (lEnumValues.length === 0) {
                return pContext.types.create(PgslInvalidType);
            }

            // Get first property type.
            return lEnumValues[0][1].data.resolveType;
        })();

        return {
            attributes: lAttributes,
            name: pCst.name,
            values: new Map<string, IExpressionAst>(lEnumValues),
            valuesType: lFirstPropertyType,
            propertyList: lEnumValues
        };
    }

    /**
     * Process all properties of the enum.
     * 
     * @param pContext - Build context.
     * @param pCst - Cst data.
     * 
     * @returns Map of all build properties. 
     */
    private processProperties(pContext: AbstractSyntaxTreeContext, pCst: EnumDeclarationCst): Array<[string, IExpressionAst]> {
        // Validate that the enum has no dublicate names.
        const lPropertyList: Array<[string, IExpressionAst]> = new Array<[string, IExpressionAst]>();

        for (const lProperty of pCst.values) {
            // Create expression ast.
            const lExpressionAst: IExpressionAst = ExpressionAstBuilder.build(lProperty.value).process(pContext);

            // Add property.
            lPropertyList.push([lProperty.name, lExpressionAst]);
        }

        return lPropertyList;
    }
}

export type EnumDeclarationAstData = {
    name: string;
    valuesType: BasePgslType;
    values: ReadonlyMap<string, IExpressionAst>;
    propertyList: Array<[string, IExpressionAst]>;
} & DeclarationAstData;