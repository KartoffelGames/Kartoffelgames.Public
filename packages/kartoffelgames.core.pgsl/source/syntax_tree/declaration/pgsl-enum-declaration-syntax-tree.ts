import { Dictionary, Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslLiteralValueExpressionSyntaxTree } from '../expression/single_value/pgsl-literal-value-expression-syntax-tree.ts';
import { PgslStringValueExpressionSyntaxTree } from '../expression/single_value/pgsl-string-value-expression-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree.ts';
import type { PgslNumericTypeDefinitionSyntaxTree } from '../type/definition/pgsl-numeric-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from '../type/enum/pgsl-base-type-name.enum.ts';
import { PgslNumericTypeName } from '../type/enum/pgsl-numeric-type-name.enum.ts';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree.ts';

/**
 * PGSL syntax tree of a enum declaration.
 */
export class PgslEnumDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslEnumDeclarationSyntaxTreeSetupData> {
    private readonly mName: string;
    private readonly mValues: PgslEnumDeclarationSyntaxTreeValues;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Underlying type of enum.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        this.ensureSetup();

        // The best way of getting the first value.
        const lExpression: BasePgslExpressionSyntaxTree = this.mValues.values().next().value;

        // Get type of value.
        return lExpression.resolveType;
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
    }

    /**
     * Get value of property. Return null when the property is not defined.
     * 
     * @param pName - Property name.
     * 
     * @returns Value of property or null when the property is not defined.
     */
    public property(pName: string): PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree | null {
        this.ensureSetup();

        if (this.setupData.values.has(pName)) {
            return this.setupData.values.get(pName)! as PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree;
        }

        return null;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data. 
     */
    protected override onSetup(): PgslEnumDeclarationSyntaxTreeSetupData {
        // Push enum definition to current scope.
        this.pushScopedValue(this.mName, this);

        // Add each item to enum.
        const lValueList = new Dictionary<string, BasePgslExpressionSyntaxTree>();
        for (const lItem of this.mValues) {
            // Validate dublicates.
            if (lValueList.has(lItem.name)) {
                throw new Exception(`Value "${lItem.name}" was already added to enum "${this.mName}"`, this);
            }

            lValueList.set(lItem.name, lItem.value);
        }

        return {
            values: lValueList
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        this.ensureSetup();

        // Empty enums are not allowed.
        if (this.setupData.values.size) {
            throw new Exception(`Enum ${this.mName} has no values`, this);
        }

        let lFirstPropertyType: typeof PgslLiteralValueExpressionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree | null = null;
        for (const lProperty of this.setupData.values.values()) {
            // Only literals are allowed.
            if (!(lProperty instanceof PgslLiteralValueExpressionSyntaxTree) && !(lProperty instanceof PgslStringValueExpressionSyntaxTree)) {
                throw new Exception(`Value on enum "${this.mName}" invalid. Only literal values are allowed.`, this);
            }

            // All values need to be string or integer.
            if (lProperty instanceof PgslLiteralValueExpressionSyntaxTree) {
                if (lProperty.resolveType.baseType !== PgslBaseTypeName.Numberic) {
                    if ((<PgslNumericTypeDefinitionSyntaxTree>lProperty.resolveType).numericType !== PgslNumericTypeName.UnsignedInteger) {
                        throw new Exception(`Enum can only hold string or unsigned integer values.`, this);
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

            throw new Exception(`Enum can't have mixed values.`, this);
        }
    }
}

export type PgslEnumDeclarationSyntaxTreeValues = Array<{ name: string; value: BasePgslExpressionSyntaxTree; }>;

type PgslEnumDeclarationSyntaxTreeSetupData = {
    values: Dictionary<string, BasePgslExpressionSyntaxTree>;
};