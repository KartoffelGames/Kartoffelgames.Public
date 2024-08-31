import { Exception } from '@kartoffelgames/core';
import { PgslSyntaxTreeInitData, SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../../type/pgsl-type-declaration-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class PgslNewCallExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslNewExpressionSyntaxTreeStructureData> {
    private readonly mParameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
    private readonly mType: PgslTypeDeclarationSyntaxTree;

    /**
     * Function parameter.
     */
    public get parameter(): Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>> {
        return this.mParameterList;
    }

    /**
     * Type of new call.
     */
    public get type(): PgslTypeDeclarationSyntaxTree {
        return this.mType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslNewExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Set data.
        this.mType = pData.type;
        this.mParameterList = pData.parameterList;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
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
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // When one parameter is not a creation fixed then nothing is a creation fixed.
        for (const lParameter of this.mParameterList) {
            if (!lParameter.isCreationFixed) {
                return false;
            }
        }

        // Function is constant, parameters need to be to.
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
        // Set resolve type to return type.
        return this.mType.type;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be fixed.
        if(!this.mType.type.isFixed){
            throw new Exception(`New expression must be a length fixed type.`, this);
        }

        // Must be constructable.
        if(!this.mType.type.isConstructable){
            throw new Exception(`New expression must be a length fixed type.`, this);
        }

        // TODO: Validate function parameter and template.
    }
}

type PgslNewExpressionSyntaxTreeStructureData = {
    type: PgslTypeDeclarationSyntaxTree;
    parameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
};