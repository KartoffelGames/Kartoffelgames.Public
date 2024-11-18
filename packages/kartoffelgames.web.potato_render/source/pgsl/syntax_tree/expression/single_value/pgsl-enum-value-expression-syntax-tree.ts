import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from '../../declaration/pgsl-enum-declaration-syntax-tree';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree';
import { PgslLiteralValueExpressionSyntaxTree } from './pgsl-literal-value-expression-syntax-tree';
import { PgslStringValueExpressionSyntaxTree } from './pgsl-string-value-expression-syntax-tree';

/**
 * PGSL structure holding single enum value.
 */
export class PgslEnumValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslEnumValueExpressionSyntaxTreeSetupData> {
    private readonly mName: string;
    private readonly mProperty: string;

    /**
     * Enum of expression.
     */
    public get enum(): PgslEnumDeclarationSyntaxTree {
        this.ensureSetup();

        return this.setupData.data.enum;
    }

    /**
     * Enum name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Enum property name.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Value of enum expression.
     */
    public get value(): BasePgslExpressionSyntaxTree {
        this.ensureSetup();

        return this.setupData.data.property;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pName: string, pProperty: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mName = pName;
        this.mProperty = pProperty;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<PgslEnumValueExpressionSyntaxTreeSetupData> {
        // Catch undefined enum names.
        const lReferencedEnum: PgslEnumDeclarationSyntaxTree | null = this.document.resolveEnum(this.mName);
        if (!lReferencedEnum) {
            throw new Exception(`Enum "${this.mName}" not defined.`, this);
        }

        // Catch undefined enum properties.
        const lProperty: PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree | null = lReferencedEnum.property(this.mProperty);
        if (lProperty === null) {
            throw new Exception(`Enum property"${this.mName}.${this.mProperty}" not defined.`, this);
        }

        return {
            expression: {
                isFixed: true,
                isStorage: false,
                resolveType: lProperty.resolveType,
                isConstant: true
            },
            data: {
                enum: lReferencedEnum,
                property: lProperty
            }
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        const lReferencedEnum: PgslEnumDeclarationSyntaxTree | null = this.document.resolveEnum(this.mName);

        // Catch undefined enum names.
        if (!lReferencedEnum) {
            throw new Exception(`Enum "${this.mName}" not defined.`, this);
        }

        // Catch undefined enum properties.
        if (lReferencedEnum.property(this.mProperty) === null) {
            throw new Exception(`Enum property"${this.mName}.${this.mProperty}" not defined.`, this);
        }
    }
}

type PgslEnumValueExpressionSyntaxTreeSetupData = {
    enum: PgslEnumDeclarationSyntaxTree,
    property: PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree;
};