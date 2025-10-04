import { Dictionary } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression.ts';
import { PgslLiteralValueExpression } from '../expression/single_value/pgsl-literal-value-expression.ts';
import { PgslStringValueExpression } from '../expression/single_value/pgsl-string-value-expression.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition } from "../type/base-pgsl-type-definition.ts";
import { PgslNumericTypeName } from '../type/enum/pgsl-numeric-type-name.enum.ts';
import { PgslNumericTypeDefinition } from "../type/pgsl-numeric-type-definition.ts";
import { BasePgslDeclaration } from './base-pgsl-declaration.ts';
import { PgslFileMetaInformation } from "../pgsl-build-result.ts";

/**
 * PGSL syntax tree of a enum declaration.
 */
export class PgslEnumDeclaration extends BasePgslDeclaration<PgslEnumDeclarationSyntaxTreeValidationAttachment> {
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
    public constructor(pName: string, pValue: PgslEnumDeclarationSyntaxTreeValues, pAttributes: PgslAttributeList, pMeta?: BasePgslSyntaxTreeMeta) {
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
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        // Transpile attribute list.
        let lResult: string = this.attributes.transpile(pTrace);

        // Create a const declaration for each enum value.
        for(const lProperty of this.mValues) {
            lResult += `const ENUM__${this.mName}__${lProperty.name}: u32 = ${lProperty.value.transpile(pTrace)};\n`;
        }
        
        return lResult;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): PgslEnumDeclarationSyntaxTreeValidationAttachment {
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate attributes.
        this.attributes.validate(pValidationTrace);

        // Validate that the enum has no dublicate names.
        const lPropertyList: Dictionary<string, BasePgslExpression> = new Dictionary<string, BasePgslExpression>();

        let lFirstPropertyType: typeof PgslLiteralValueExpression | typeof PgslStringValueExpression | null = null;
        for (const lProperty of this.mValues) {
            // Validate property.
            lProperty.value.validate(pValidationTrace);

            // Validate dublicates.
            if (lPropertyList.has(lProperty.name)) {
                pValidationTrace.pushError(`Value "${lProperty.name}" was already added to enum "${this.mName}"`, this.meta, this);
            }

            lPropertyList.set(lProperty.name, lProperty.value);

            // Only literals are allowed.
            if (!(lProperty.value instanceof PgslLiteralValueExpression) && !(lProperty.value instanceof PgslStringValueExpression)) { // TODO: Cant do this, as alias types could be that as well.
                pValidationTrace.pushError(`Value on enum "${this.mName}" invalid. Only literal values are allowed.`, this.meta, this);
            }

            // All values need to be string or integer.
            if (lProperty.value instanceof PgslLiteralValueExpression) {
                // Read attachment of literal value.
                const lPropertyAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lProperty.value);

                if (lPropertyAttachment.resolveType instanceof PgslNumericTypeDefinition) { // TODO: Cant do this, as alias types could be that as well.
                    if (lPropertyAttachment.resolveType.numericType !== PgslNumericTypeName.UnsignedInteger) {
                        pValidationTrace.pushError(`Enum "${this.mName}" can only hold unsigned integer values.`, this.meta, this);
                    }
                }
            }

            // Init on first value.
            if (lFirstPropertyType === null) {
                lFirstPropertyType = lProperty.constructor as (typeof PgslLiteralValueExpression | typeof PgslStringValueExpression);
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
                type: PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger),
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

export type PgslEnumDeclarationSyntaxTreeValues = Array<{ name: string; value: BasePgslExpression; }>;

export type PgslEnumDeclarationSyntaxTreeValidationAttachment = {
    /**
     * Underlying type of the enum.
     */
    type: BasePgslTypeDefinition;

    /**
     * Values of the enum.
     */
    values: Dictionary<string, BasePgslExpression>;
};