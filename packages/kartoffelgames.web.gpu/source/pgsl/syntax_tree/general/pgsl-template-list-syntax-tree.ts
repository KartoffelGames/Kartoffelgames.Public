import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from './pgsl-type-declaration-syntax-tree';

/**
 * Template list parameter.
 */
export class PgslTemplateListSyntaxTree extends BasePgslSyntaxTree<PgslTemplateListSyntaxTreeStructureData> {
    private readonly mItems: Array<PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;

    /**
     * Parameter list.
     */
    public get items(): Array<PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>> {
        return [...this.mItems];
    }

    /**
     * List size.
     */
    public get size(): number {
        return this.mItems.length;
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
    public constructor(pData: PgslTemplateListSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mItems = pData.parameterList;
    }

    /**
     * Validate template with multiple validation expressions.
     * 
     * @param pValidation - Validation expression.
     * 
     * @returns true when template validates. 
     */
    public validateWithExpression(pValidation: TemplateValidations): boolean {
        for (const lTemplateValidation of pValidation) {
            // Parameter length not matched.
            if (lTemplateValidation.length !== this.mItems.length) {
                continue;
            }

            // Match every single template parameter.
            let lTemplateMatches: boolean = true;
            for (let lIndex = 0; lIndex < lTemplateValidation.length; lIndex++) {
                const lExpectedTemplateType: 'Expression' | 'Type' = lTemplateValidation[lIndex];

                const lActualTemplateParameter: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> = this.mItems[lIndex];
                const lActualTemplateType: 'Expression' | 'Type' = (lActualTemplateParameter instanceof PgslTypeDeclarationSyntaxTree) ? 'Type' : 'Expression';

                // Need to have same parameter type.
                if (lExpectedTemplateType !== lActualTemplateType) {
                    lTemplateMatches = false;
                    break;
                }
            }

            // All templates matches.
            if (lTemplateMatches) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing really to validate.
    }
}

type TemplateValidations = Array<Array<'Expression' | 'Type'>>;

type PgslTemplateListSyntaxTreeStructureData = {
    parameterList: Array<PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
};