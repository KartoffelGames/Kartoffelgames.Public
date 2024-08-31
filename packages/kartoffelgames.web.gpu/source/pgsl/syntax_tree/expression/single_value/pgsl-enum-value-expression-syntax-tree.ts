import { Exception } from '@kartoffelgames/core';
import { PgslEnumDeclarationSyntaxTree } from '../../declaration/pgsl-enum-declaration-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';

/**
 * PGSL structure holding single enum value.
 */
export class PgslEnumValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslEnumValueExpressionSyntaxTreeStructureData> {
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslEnumValueExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Set data.
        this.mName = pData.name;
        this.mProperty = pData.property;
    }

    /**
     * On constant state request.
     */
    protected override determinateIsConstant(): boolean {
        // Enums are allways constant.
        return true;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // Enums are allways creation fixed.
        return true;
    }

    /**
     * On is storage set.
     */
    protected override determinateIsStorage(): boolean {
        return false;
    }

    /**
     * On type resolve of expression
     */
    protected override determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
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