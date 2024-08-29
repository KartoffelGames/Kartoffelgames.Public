import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslArrayTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslArrayTypeDefinitionSyntaxTreeStructureData> {
    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mLengthExpression: BasePgslExpressionSyntaxTree | null;

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
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslArrayTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        this.mLengthExpression = pData.lengthExpression ?? null;
        this.mInnerType = pData.type;
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
     * On equal check of type definitions
     * 
     * @param pTarget - Target type definition.
     */
    protected override onEqual(pTarget: this): boolean {
        // Validate same inner type.
        if(!this.mInnerType.equals(pTarget.innerType)) {
            return false;
        }

        // TODO: Same length???

        return true;
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