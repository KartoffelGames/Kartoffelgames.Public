import { EnumDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { PgslInvalidType } from '../../type/pgsl-invalid-type.ts';
import { PgslNumericType } from '../../type/pgsl-numeric-type.ts';
import { PgslStringType } from '../../type/pgsl-string-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from "../abstract-syntax-tree.ts";
import { ExpressionAstBuilder } from "../expression/expression-ast-builder.ts";
import { IExpressionAst } from "../expression/i-expression-ast.interface.ts";
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { DeclarationAstData } from "./i-declaration-ast.interface.ts";

/**
 * PGSL syntax tree of a enum declaration.
 */
export class EnumDeclarationAst extends AbstractSyntaxTree<EnumDeclarationCst, EnumDeclarationAstData> {
    /**
     * Validate data of current structure.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): EnumDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this).process(pContext);

        const lProperties: ReadonlyMap<string, IExpressionAst> = this.processProperties(pContext);

        let lFirstPropertyType: PgslType;

        // Fallback to invalid type.
        if (lProperties.size === 0) {
            pContext.pushIncident(`Enum ${this.cst.name} has no values`, this);
            lFirstPropertyType = new PgslInvalidType(pContext);
        } else {
            // Get first property type.
            lFirstPropertyType = lProperties.values().next().value!.data.resolveType;
        }

        // Check if enum is already defined.
        if (pContext.getEnum(this.cst.name)) {
            pContext.pushIncident(`Enum "${this.cst.name}" is already defined.`, this);
        }

        // Register enum.
        pContext.registerEnum(this.cst.name, this);

        return {
            attributes: lAttributes,
            name: this.cst.name,
            values: lProperties,
            underlyingType: lFirstPropertyType
        };
    }

    private processProperties(pContext: AbstractSyntaxTreeContext): Map<string, IExpressionAst> {
        // Validate that the enum has no dublicate names.
        const lPropertyList: Map<string, IExpressionAst> = new Map<string, IExpressionAst>();

        let lFirstPropertyType: PgslType | null = null;
        for (const lProperty of this.cst.values) {
            // Create expression ast.
            const lExpressionAst: IExpressionAst = ExpressionAstBuilder.build(lProperty.value, pContext);

            // Validate dublicates.
            if (lPropertyList.has(lProperty.name)) {
                pContext.pushIncident(`Value "${lProperty.name}" was already added to enum "${this.cst.name}"`, this);
            }

            // Add property.
            lPropertyList.set(lProperty.name, lExpressionAst);

            // Validate property type.
            const lIsNumeric: boolean = lExpressionAst.data.resolveType.isImplicitCastableInto(new PgslNumericType(pContext, PgslNumericType.typeName.unsignedInteger));
            const lIsString: boolean = lExpressionAst.data.resolveType.isImplicitCastableInto(new PgslStringType(pContext));

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

        // Register enum declaration.
        pContext.registerEnum(this.cst.name, this);

        return lPropertyList;
    }
}

export type EnumDeclarationAstData = {
    name: string;
    underlyingType: PgslType;
    values: ReadonlyMap<string, IExpressionAst>;
} & DeclarationAstData;