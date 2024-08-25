import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { PgslTypeDefinitionSyntaxTree } from '../../general/pgsl-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class PgslNewCallExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslNewExpressionSyntaxTreeStructureData> {
    private readonly mParameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
    private readonly mType: PgslTypeDefinitionSyntaxTree;

    /**
     * Function parameter.
     */
    public get parameter(): Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>> {
        return this.mParameterList;
    }

    /**
     * Type of new call.
     */
    public get type(): PgslTypeDefinitionSyntaxTree {
        return this.mType;
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
    public constructor(pData: PgslNewExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mType = pData.type;
        this.mParameterList = pData.parameterList;
    }

    /**
     * On constant state request.
     */
    protected onConstantStateSet(): boolean {
        // When one parameter is not a constant then nothing is a constant.
        for (const lParameter of this.mParameterList) {
            if (!lParameter.isConstant) {
                return false;
            }
        }

        // Function is constant, parameters need to be to.
        return true;
    }

    /**
     * On type resolve of expression
     */
    protected onResolveType(): PgslTypeDefinitionSyntaxTree {
        // Set resolve type to return type.
        return this.mType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate function parameter and template.
    }
}

type PgslNewExpressionSyntaxTreeStructureData = {
    type: PgslTypeDefinitionSyntaxTree;
    parameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
};