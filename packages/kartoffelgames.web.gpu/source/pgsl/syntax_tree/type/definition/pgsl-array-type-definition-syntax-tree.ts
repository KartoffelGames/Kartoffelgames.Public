import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslArrayTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslArrayTypeDefinitionSyntaxTreeStructureData> {
    private readonly mLengthExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mType: BasePgslTypeDefinitionSyntaxTree;


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
        this.mType = pData.type;
    }

    /**
     * Determinate if declaration is a constructable.
     */
    protected determinateIsConstructable(): boolean {
        // Must have a fixed footprint so must have a second length template parameter.
        if (!this.isFixed) {
            return false;
        }

        return this.mType.isConstructable;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected determinateIsFixed(): boolean {
        // TODO: a fixed-size array type, when: its element count is a const-expression
        // When it is a param, it is not fixed, it is creation fixed and only valid in a workgroup variable. 
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