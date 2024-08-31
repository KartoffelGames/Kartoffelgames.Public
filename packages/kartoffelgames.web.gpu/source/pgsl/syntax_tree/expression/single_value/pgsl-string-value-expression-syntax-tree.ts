import { Exception } from '@kartoffelgames/core';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslStringTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-string-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class PgslStringValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslStringValueExpressionSyntaxTreeStructureData> {
    private readonly mValue: string;

    /**
     * Never resolve to any type.
     */
    public override get resolveType(): never {
        throw new Exception(`String type cant have a resolve type.`, this);
    }

    /**
     * Value of literal.
     */
    public get value(): string {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslStringValueExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Set data.
        this.mValue = pData.textValue.substring(1, pData.textValue.length - 1);
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // A string is allways a constant.
        return true;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // A string is allways a creation fixed value.
        return true;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return false;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Create type declaration.
        const lTypeDeclaration: PgslStringTypeDefinitionSyntaxTree = new PgslStringTypeDefinitionSyntaxTree({}, this.meta);

        // Set parent to this tree.
        lTypeDeclaration.setParent(this);

        // Validate type.
        lTypeDeclaration.validateIntegrity();

        return lTypeDeclaration;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate.
    }
}

export type PgslStringValueExpressionSyntaxTreeStructureData = {
    textValue: string;
};