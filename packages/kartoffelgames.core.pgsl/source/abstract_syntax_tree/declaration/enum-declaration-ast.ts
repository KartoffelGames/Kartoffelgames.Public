import type { EnumDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import type { IType } from '../type/i-type.interface.ts';
import { PgslInvalidType } from '../type/pgsl-invalid-type.ts';
import { PgslNumericType } from '../type/pgsl-numeric-type.ts';
import { PgslStringType } from '../type/pgsl-string-type.ts';
import type { DeclarationAstData, IDeclarationAst } from './i-declaration-ast.interface.ts';

/**
 * PGSL syntax tree of a enum declaration.
 */
export class EnumDeclarationAst extends AbstractSyntaxTree<EnumDeclarationCst, EnumDeclarationAstData> implements IDeclarationAst {
    /**
     * Register enum without registering its content.
     * 
     * @param pContext - Processing context.
     */
    public register(pContext: AbstractSyntaxTreeContext): this {
        // Check if enum is already defined.
        if (pContext.getEnum(this.cst.name)) {
            pContext.pushIncident(`Enum "${this.cst.name}" is already defined.`, this);
        }

        // Register enum.
        pContext.registerEnum(this.cst.name, this);

        return this;
    }

    /**
     * Validate data of current structure.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): EnumDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this).process(pContext);

        const lProperties: ReadonlyMap<string, IExpressionAst> = this.processProperties(pContext);

        let lFirstPropertyType: IType;

        // Fallback to invalid type.
        if (lProperties.size === 0) {
            pContext.pushIncident(`Enum ${this.cst.name} has no values`, this);
            lFirstPropertyType = new PgslInvalidType().process(pContext);
        } else {
            // Get first property type.
            lFirstPropertyType = lProperties.values().next().value!.data.resolveType;
        }

        return {
            attributes: lAttributes,
            name: this.cst.name,
            values: lProperties,
            underlyingType: lFirstPropertyType
        };
    }

    /**
     * 
     * @param pContext - 
     * @returns 
     */
    private processProperties(pContext: AbstractSyntaxTreeContext): Map<string, IExpressionAst> {
        // Validate that the enum has no dublicate names.
        const lPropertyList: Map<string, IExpressionAst> = new Map<string, IExpressionAst>();

        let lFirstPropertyType: IType | null = null;
        for (const lProperty of this.cst.values) {
            // Create expression ast.
            const lExpressionAst: IExpressionAst = ExpressionAstBuilder.build(lProperty.value).process(pContext);

            // Validate dublicates.
            if (lPropertyList.has(lProperty.name)) {
                pContext.pushIncident(`Value "${lProperty.name}" was already added to enum "${this.cst.name}"`, this);
            }

            // Add property.
            lPropertyList.set(lProperty.name, lExpressionAst);

            // Validate property type.
            const lIsNumeric: boolean = lExpressionAst.data.resolveType.isImplicitCastableInto(new PgslNumericType(PgslNumericType.typeName.unsignedInteger).process(pContext));
            const lIsString: boolean = lExpressionAst.data.resolveType.isImplicitCastableInto(new PgslStringType().process(pContext));

            // All values need to be string or integer.
            if (!lIsNumeric && !lIsString) {
                pContext.pushIncident(`Enum "${this.cst.name}" can only hold unsigned integer values.`, this);
            }

            // Init on first value.
            if (lFirstPropertyType === null) {
                lFirstPropertyType = lExpressionAst.data.resolveType;
            }

            // Property is the same type as the others.
            if (!lExpressionAst.data.resolveType.equals(lFirstPropertyType)) {
                pContext.pushIncident(`Enum "${this.cst.name}" has mixed value types. Expected all values to be of the same type.`, this);
            }
        }

        return lPropertyList;
    }
}

export type EnumDeclarationAstData = {
    name: string;
    underlyingType: IType;
    values: ReadonlyMap<string, IExpressionAst>;
} & DeclarationAstData;