import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';

/**
 * PGSL base expression.
 */
export abstract class BasePgslExpressionSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    private mIsConstant: boolean | null;

    /**
     * If expression is a constant expression.
     */
    public get isConstant(): boolean {
        this.ensureValidity();

        // Constant was not set.
        if (this.mIsConstant === null) {
            throw new Exception('Constant state of expression was not set.', this);
        }

        return this.mIsConstant;
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
    public constructor(pData: TData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

        this.mIsConstant = null;
    }

    /**
     * Set the expressions constant state.
     * 
     * @param pConstant - Constant state.
     */
    protected setConstantState(pConstant: boolean): void {
        this.mIsConstant = pConstant;
    }
}