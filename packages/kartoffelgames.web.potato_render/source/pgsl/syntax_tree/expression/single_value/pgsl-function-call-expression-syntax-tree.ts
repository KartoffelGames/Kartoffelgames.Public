import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslFunctionDeclarationSyntaxTree } from '../../declaration/pgsl-function-declaration-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class PgslFunctionCallExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslFunctionCallExpressionSyntaxTreeSetupData> {
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

        // Add data as child tree.
        this.appendChild(...this.mParameterList);
    }

    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<PgslFunctionCallExpressionSyntaxTreeSetupData> {
        const lFunctionDeclaration: PgslFunctionDeclarationSyntaxTree = this.document.resolveFunction(this.mName);

        // Determinate fixed state of function.
        const lIsFixed = (() => {
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
        })();

        // Determinate constant state of function.
        const lIsConstant = (() => {
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
        })();

        return {
            expression: {
                isFixed: lIsFixed,
                isStorage: false,
                resolveType: lFunctionDeclaration.returnType,
                isConstant: lIsConstant
            },
            data: {
                function: lFunctionDeclaration
            }
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        //const lFunctionDeclaration: PgslFunctionDeclarationSyntaxTree = this.document.resolveFunction(this.mName);
        

        // TODO: Validate function parameter.
    }
}

type PgslFunctionCallExpressionSyntaxTreeSetupData = {
    function: PgslFunctionDeclarationSyntaxTree;
};