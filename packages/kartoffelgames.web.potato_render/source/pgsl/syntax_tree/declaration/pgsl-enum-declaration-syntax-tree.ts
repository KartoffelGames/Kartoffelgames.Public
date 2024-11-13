import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslLiteralValueExpressionSyntaxTree } from '../expression/single_value/pgsl-literal-value-expression-syntax-tree';
import { PgslStringValueExpressionSyntaxTree } from '../expression/single_value/pgsl-string-value-expression-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslTypeName } from '../type/enum/pgsl-type-name.enum';
import { SyntaxTreeMeta } from '../base-pgsl-syntax-tree';

/**
 * PGSL syntax tree of a enum declaration.
 */
export class PgslEnumDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslEnumDeclarationSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mValues: Dictionary<string, PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree>;

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
        const lExpression: PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree = this.mValues.values().next().value;

        // Get type of value.
        return lExpression.resolveType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslEnumDeclarationSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pData.attributes, pMeta, pBuildIn);

        // Set data.
        this.mName = pData.name;

        // Add each item to enum.
        this.mValues = new Dictionary<string, PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree>();
        for (const lItem of pData.items) {
            // Validate dublicates.
            if (this.mValues.has(lItem.name)) {
                throw new Exception(`Value "${lItem.name}" was already added to enum "${this.mName}"`, this);
            }

            this.mValues.set(lItem.name, lItem.value);
        }
    }

    /**
     * Get value of property. Return null when the property is not defined.
     * 
     * @param pName - Property name.
     * 
     * @returns Value of property or null when the property is not defined.
     */
    public property(pName: string): PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree | null {
        return this.mValues.get(pName) ?? null;
    }

    /**
     * Determinate if declaration is a constant.
     */
    protected determinateIsConstant(): boolean {
        return true;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Empty enums not allows.
        if (this.mValues.size) {
            throw new Exception(`Enum ${this.mName} has no values`, this);
        }

        let lFirstPropertyType: typeof PgslLiteralValueExpressionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree | null = null;
        for (const lProperty of this.mValues.values()) {
            // All values need to be string or integer.
            if (lProperty instanceof PgslLiteralValueExpressionSyntaxTree) {
                if (lProperty.type !== PgslTypeName.UnsignedInteger) {
                    throw new Exception(`Enum can only hold string or unsigned integer values.`, this);
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

export type PgslEnumDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    name: string;
    items: Array<{
        name: string;
        value: PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree;
    }>;
};