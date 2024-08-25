import { Exception } from '@kartoffelgames/core';
import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { PgslFunctionDeclarationSyntaxTree } from '../../declarations/pgsl-function-declaration-syntax-tree';
import { PgslTemplateListSyntaxTree } from '../../general/pgsl-template-list-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';
import { PgslTypeDefinitionSyntaxTree } from '../../general/pgsl-type-definition-syntax-tree';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class PgslFunctionCallExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslFunctionCallExpressionSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mParameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
    private readonly mTemplateList: PgslTemplateListSyntaxTree | null;

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter.
     */
    public get parameter(): Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>> {
        return this.mParameterList;
    }

    /**
     * Function template.
     */
    public get templateList(): PgslTemplateListSyntaxTree | null {
        return this.mTemplateList;
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
    public constructor(pData: PgslFunctionCallExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
        this.mParameterList = pData.parameterList;
        this.mTemplateList = pData.template ?? null;
    }

    /**
     * On constant state request.
     */
    protected onConstantStateSet(): boolean {
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
     * On type resolve of expression
     */
    protected onResolveType(): PgslTypeDefinitionSyntaxTree {
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

        // TODO: Validate function parameter and template.
    }
}

type PgslFunctionCallExpressionSyntaxTreeStructureData = {
    name: string;
    parameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
    template?: PgslTemplateListSyntaxTree;
};