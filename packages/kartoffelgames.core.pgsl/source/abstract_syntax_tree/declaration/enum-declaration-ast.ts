import type { EnumDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import type { BasePgslType } from '../type/definition/base-pgsl-type.ts';
import { PgslInvalidType } from '../type/definition/pgsl-invalid-type.ts';
import { PgslNumericType } from '../type/definition/pgsl-numeric-type.ts';
import { PgslStringType } from '../type/definition/pgsl-string-type.ts';
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
        // Check if enum is already defined.
        if (pContext.getEnum(this.name)) {
            pContext.pushIncident(`Enum "${this.name}" is already defined.`, this);
        }

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

        const lProperties: ReadonlyMap<string, IExpressionAst> = this.processProperties(pContext, pCst);

        let lFirstPropertyType: BasePgslType;

        // Fallback to invalid type.
        if (lProperties.size === 0) {
            pContext.pushIncident(`Enum ${pCst.name} has no values`, this);
            lFirstPropertyType = new PgslInvalidType();
        } else {
            // Get first property type.
            lFirstPropertyType = lProperties.values().next().value!.data.resolveType;
        }

        return {
            attributes: lAttributes,
            name: pCst.name,
            values: lProperties,
            underlyingType: lFirstPropertyType
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
    private processProperties(pContext: AbstractSyntaxTreeContext, pCst: EnumDeclarationCst): Map<string, IExpressionAst> {
        // Validate that the enum has no dublicate names.
        const lPropertyList: Map<string, IExpressionAst> = new Map<string, IExpressionAst>();

        let lFirstPropertyType: BasePgslType | null = null;
        for (const lProperty of pCst.values) {
            // Create expression ast.
            const lExpressionAst: IExpressionAst = ExpressionAstBuilder.build(lProperty.value).process(pContext);

            // Validate dublicates.
            if (lPropertyList.has(lProperty.name)) {
                pContext.pushIncident(`Value "${lProperty.name}" was already added to enum "${pCst.name}"`, this);
            }

            // Add property.
            lPropertyList.set(lProperty.name, lExpressionAst);

            // Validate property type.
            const lIsNumeric: boolean = lExpressionAst.data.resolveType.conversionRankTo(new PgslNumericType(PgslNumericType.typeName.unsignedInteger)) !== Number.POSITIVE_INFINITY;
            const lIsString: boolean = lExpressionAst.data.resolveType.conversionRankTo(new PgslStringType()) !== Number.POSITIVE_INFINITY;

            // All values need to be string or integer.
            if (!lIsNumeric && !lIsString) {
                pContext.pushIncident(`Enum "${pCst.name}" can only hold unsigned integer values.`, this);
            }

            // Init on first value.
            if (lFirstPropertyType === null) {
                lFirstPropertyType = lExpressionAst.data.resolveType;
            }

            // Property is the same type as the others.
            if (!lExpressionAst.data.resolveType.equals(lFirstPropertyType)) {
                pContext.pushIncident(`Enum "${pCst.name}" has mixed value types. Expected all values to be of the same type.`, this);
            }
        }

        return lPropertyList;
    }
}

export type EnumDeclarationAstData = {
    name: string;
    underlyingType: BasePgslType;
    values: ReadonlyMap<string, IExpressionAst>;
} & DeclarationAstData;