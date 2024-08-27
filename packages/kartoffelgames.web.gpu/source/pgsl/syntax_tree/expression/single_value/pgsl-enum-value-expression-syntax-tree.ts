import { Exception } from '@kartoffelgames/core';
import { PgslEnumDeclarationSyntaxTree } from '../../declarations/pgsl-enum-declaration-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/base-pgsl-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL structure holding single enum value.
 */
export class PgslEnumValueExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslEnumValueExpressionSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mProperty: string;

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
        this.ensureValidity();
        return this.document.resolveEnum(this.mName)!.property(this.mProperty)!;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslEnumValueExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
        this.mProperty = pData.property;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // Enums are allways constant.
        return true;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Set resolve type.
        return this.document.resolveEnum(this.mName)!.property(this.mProperty)!.resolveType;
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

type PgslEnumValueExpressionSyntaxTreeStructureData = {
    name: string;
    property: string;
};