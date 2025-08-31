import { Dictionary } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslLiteralValueExpressionSyntaxTree } from '../expression/single_value/pgsl-literal-value-expression-syntax-tree.ts';
import { PgslStringValueExpressionSyntaxTree } from '../expression/single_value/pgsl-string-value-expression-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree } from "../type/base-pgsl-type-definition-syntax-tree.ts";
import { PgslNumericTypeName } from '../type/enum/pgsl-numeric-type-name.enum.ts';
import { PgslNumericTypeDefinitionSyntaxTree } from "../type/pgsl-numeric-type-definition-syntax-tree.ts";
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree.ts';

/**
 * PGSL syntax tree of a enum declaration.
 */
export class PgslEnumDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslEnumDeclarationSyntaxTreeValidationAttachment> {
    private readonly mName: string;
    private readonly mValues: PgslEnumDeclarationSyntaxTreeValues;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constructor.
     * 
     * @param pName - Enum name.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pValue: PgslEnumDeclarationSyntaxTreeValues, pAttributes: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mName = pName;
        this.mValues = pValue;

        // Add all values as child.
        for (const pItem of pValue) {
            this.appendChild(pItem.value);
        }
    }

    /**
     * Transpile current enum declaration into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // Transpile attribute list.
        let lResult: string = this.attributes.transpile();

        // Create a const declaration for each enum value.
        for(const lProperty of this.mValues) {
            lResult += `const ENUM__${this.mName}__${lProperty.name}: u32 = ${lProperty.value.transpile()};\n`;
        }
        
        return lResult;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): PgslEnumDeclarationSyntaxTreeValidationAttachment {
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate attributes.
        this.attributes.validate(pValidationTrace);

        // Validate that the enum has no dublicate names.
        const lPropertyList: Dictionary<string, BasePgslExpressionSyntaxTree> = new Dictionary<string, BasePgslExpressionSyntaxTree>();
        for (const lItem of this.mValues) {
            // Validate dublicates.
            if (lPropertyList.has(lItem.name)) {
                pValidationTrace.pushError(`Value "${lItem.name}" was already added to enum "${this.mName}"`, this.meta, this);
            }

            lPropertyList.set(lItem.name, lItem.value);
        }

        let lFirstPropertyType: typeof PgslLiteralValueExpressionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree | null = null;
        for (const lProperty of this.mValues) {
            // Only literals are allowed.
            if (!(lProperty.value instanceof PgslLiteralValueExpressionSyntaxTree) && !(lProperty.value instanceof PgslStringValueExpressionSyntaxTree)) {
                pValidationTrace.pushError(`Value on enum "${this.mName}" invalid. Only literal values are allowed.`, this.meta, this);
            }

            // All values need to be string or integer.
            if (lProperty.value instanceof PgslLiteralValueExpressionSyntaxTree) {
                // Read attachment of literal value.
                const lPropertyAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lProperty.value);

                if (lPropertyAttachment.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree) {
                    if (lPropertyAttachment.resolveType.numericType !== PgslNumericTypeName.UnsignedInteger) {
                        pValidationTrace.pushError(`Enum "${this.mName}" can only hold unsigned integer values.`, this.meta, this);
                    }
                }
            }

            // Init on first value.
            if (lFirstPropertyType === null) {
                lFirstPropertyType = lProperty.constructor as (typeof PgslLiteralValueExpressionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree);
                continue;
            }

            // Property is the same type as the others.
            if (lProperty instanceof lFirstPropertyType) {
                continue;
            }

            pValidationTrace.pushError(`Enum "${this.mName}" has mixed value types. Expected all values to be of the same type.`, this.meta, this);
        }

        // Empty enums are not allowed.
        if (this.mValues.length === 0) {
            pValidationTrace.pushError(`Enum ${this.mName} has no values`, this.meta, this);

            // Create empty enum value.
            return {
                type: new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, { range: [0, 0, 0, 0] }),
                values: lPropertyList
            };
        }

        // Read attachment of literal value.
        const lPropertyAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mValues[0].value);

        return {
            type: lPropertyAttachment.resolveType,
            values: lPropertyList
        };
    }
}

export type PgslEnumDeclarationSyntaxTreeValues = Array<{ name: string; value: BasePgslExpressionSyntaxTree; }>;

export type PgslEnumDeclarationSyntaxTreeValidationAttachment = {
    /**
     * Underlying type of the enum.
     */
    type: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Values of the enum.
     */
    values: Dictionary<string, BasePgslExpressionSyntaxTree>;
};