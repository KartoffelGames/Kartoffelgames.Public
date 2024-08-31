import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslLiteralValueExpressionSyntaxTree } from '../../expression/single_value/pgsl-literal-value-expression-syntax-tree';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslArrayTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslArrayTypeDefinitionSyntaxTreeStructureData> {
    private readonly mInnerType!: BasePgslTypeDefinitionSyntaxTree;
    private readonly mLengthExpression!: BasePgslExpressionSyntaxTree | null;

    /**
     * Inner type of array.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Length expression of array.
     */
    public get length(): BasePgslExpressionSyntaxTree | null {
        return this.mLengthExpression;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslArrayTypeDefinitionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, PgslTypeName.Array, pMeta, pBuildIn);
        if (this.loadedFromCache) {
            return this;
        }

        this.mLengthExpression = pData.lengthExpression ?? null;
        this.mInnerType = pData.type;
    }

    /**
     * Determinate structures identifier.
     */
    protected determinateIdentifier(this: null, pData: PgslArrayTypeDefinitionSyntaxTreeStructureData): string {
        // Convert template list into identifier list.
        let lTemplateListIdentifier: string = pData.type.identifier;
        if (pData.lengthExpression) {
            // Set literal value as length identifier.
            if (pData.lengthExpression instanceof PgslLiteralValueExpressionSyntaxTree) {
                lTemplateListIdentifier += pData.lengthExpression.value;
            }

            // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
            lTemplateListIdentifier += (Math.random() * 0xffffffffffffff).toFixed(32);
        }

        // Create identifier
        return `ID:TYPE-DEF_ARRAY->[${lTemplateListIdentifier}]`;
    }

    /**
     * Determinate if declaration is a composite type.
     */
    protected override determinateIsComposite(): boolean {
        return false;
    }

    /**
     * Determinate if declaration is a constructable.
     */
    protected determinateIsConstructable(): boolean {
        // Must have a fixed footprint so must have a second length template parameter.
        if (!this.isFixed) {
            return false;
        }

        return this.mInnerType.isConstructable;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected determinateIsFixed(): boolean {
        // Allways variable when no length expression is set.
        if (!this.mLengthExpression) {
            return false;
        }

        return this.mLengthExpression.isConstant;
    }

    /**
     * Determinate if composite value with properties that can be access by index.
     */
    protected override determinateIsIndexable(): boolean {
        return true;
    }

    /**
     * Determinate if declaration is a plain type.
     */
    protected override determinateIsPlain(): boolean {
        return this.mInnerType.isPlainType;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        return this.mInnerType.isShareable;
    }

    /**
     * Determinate if value is storable in a variable.
     */
    protected override determinateIsStorable(): boolean {
        return this.mInnerType.isStorable;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Fixed length from const expressions are only valid on workgroup variables. ??? How.
        //       Do we need to split expressions into isConstant and isCompileConstant or so????
    }
}

export type PgslArrayTypeDefinitionSyntaxTreeStructureData = {
    type: BasePgslTypeDefinitionSyntaxTree;
    lengthExpression?: BasePgslExpressionSyntaxTree;
};