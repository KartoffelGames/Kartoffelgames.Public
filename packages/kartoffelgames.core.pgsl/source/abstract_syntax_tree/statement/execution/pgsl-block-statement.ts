import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVoidType } from '../../../type/pgsl-void-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import { PgslStatement } from '../pgsl-statement.ts';
import { PgslBreakStatement } from '../single/pgsl-break-statement.ts';
import { PgslContinueStatement } from '../single/pgsl-continue-statement.ts';
import { PgslReturnStatement } from '../single/pgsl-return-statement.ts';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class PgslBlockStatement extends PgslStatement {
    private readonly mStatementList: Array<PgslStatement>;
    private mReturnType: PgslType | null;
    private mIsContinuing: boolean | null;
    private mIsBreaking: boolean | null;

    /**
     * Indicates if the block is continuing.
     */
    public get isContinuing(): boolean {
        if (this.mIsContinuing === null) {
            throw new Error('Block statement not traced yet.');
        }

        return this.mIsContinuing;
    }

    /**
     * Indicates if the block is breaking.
     */
    public get isBreaking(): boolean {
        if (this.mIsBreaking === null) {
            throw new Error('Block statement not traced yet.');
        }

        return this.mIsBreaking;
    }

    /**
     * Indicates if the block is returning.
     */
    public get returnType(): PgslType {
        if (this.mReturnType === null) {
            throw new Error('Block statement not traced yet.');
        }

        return this.mReturnType;
    }

    /**
     * Statements of block.
     */
    public get statements(): Array<PgslStatement> {
        return this.mStatementList;
    }

    /**
     * Constructor.
     * 
     * @param pStatements - Block statements.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pStatements: Array<PgslStatement>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mStatementList = pStatements;
        this.mReturnType = null;
        this.mIsContinuing = null;
        this.mIsBreaking = null;

        // Add statements as child trees.
        this.appendChild(...pStatements);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Create new scope and validate all statements.
        pTrace.newScope('inherit', () => {
            for (const lStatement of this.mStatementList) {
                lStatement.trace(pTrace);

                // Check for return statement.
                if (lStatement instanceof PgslReturnStatement) {
                    // When the statement has no expression, the return type is void.
                    if (!lStatement.expression) {
                        this.mReturnType = new PgslVoidType(pTrace);
                        continue;
                    }

                    this.mReturnType = pTrace.getExpression(lStatement.expression).resolveType;
                    continue;
                }

                // Check for continuing or breaking statements.
                if (lStatement instanceof PgslContinueStatement) {
                    this.mIsContinuing = true;
                    continue;
                }

                // Check for breaking statements.
                if (lStatement instanceof PgslBreakStatement) {
                    this.mIsBreaking = true;
                    continue;
                }
            }
        }, this);
    }
}