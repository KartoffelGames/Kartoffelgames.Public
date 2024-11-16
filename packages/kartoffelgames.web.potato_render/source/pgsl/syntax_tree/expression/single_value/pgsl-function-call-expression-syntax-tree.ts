import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslFunctionDeclarationSyntaxTree } from '../../declaration/pgsl-function-declaration-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class PgslFunctionCallExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslFunctionCallExpressionSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mParameterList: Array<BasePgslExpressionSyntaxTree>;

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter.
     */
    public get parameter(): Array<BasePgslExpressionSyntaxTree> {
        return this.mParameterList;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pName: string, pParameterList: Array<BasePgslExpressionSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mName = pName;
        this.mParameterList = pParameterList;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        const lFunctionDeclaration: PgslFunctionDeclarationSyntaxTree = this.document.resolveFunction(this.mName)!;

        // Set call expression as constant when all parameter are constants and the function itself is a constant.
        // When the function is not a constant, the parameters doesn't matter.
        if (!lFunctionDeclaration.isConstant) {
            return false;
        } else {
            // When one parameter is not a constant then nothing is a constant.
            for (const lParameter of this.mParameterList) {
                if (!lParameter.isConstant) {
                    return false;
                }
            }

            // Function is constant, parameters need to be to.
            return true;
        }
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        const lFunctionDeclaration: PgslFunctionDeclarationSyntaxTree = this.document.resolveFunction(this.mName)!;

        // Set call expression as constant when all parameter are constants and the function itself is a constant.
        // When the function is not a constant, the parameters doesn't matter.
        if (!lFunctionDeclaration.isConstant) {
            return false;
        } else {
            // When one parameter is not a constant then nothing is a constant.
            for (const lParameter of this.mParameterList) {
                if (!lParameter.isCreationFixed) {
                    return false;
                }
            }

            // Function is constant, parameters need to be to.
            return true;
        }
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
        return this.document.resolveFunction(this.mName)!.returnType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        const lFunctionDeclaration: PgslFunctionDeclarationSyntaxTree | null = this.document.resolveFunction(this.mName);
        if (!lFunctionDeclaration) {
            throw new Exception(`Function "${this.mName}" is not defined.`, this);
        }

        // TODO: Validate function parameter.
    }
}

type PgslFunctionCallExpressionSyntaxTreeStructureData = {
    name: string;
    parameterList: Array<BasePgslExpressionSyntaxTree>;
};