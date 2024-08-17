import { Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../enum/pgsl-operator.enum';
import { PgslExpression } from './pgsl-expression-syntax-tree';

export class PgslComparisonExpression extends PgslExpression {
    private mComparison: PgslOperator | null;
    private mLeftExpression: PgslExpression | null;
    private mRightExpression: PgslExpression | null;

    /**
     * Expression operator.
     */
    public get comparison(): PgslOperator {
        if (this.mComparison === null) {
            throw new Exception('Comparison not set.', this);
        }

        return this.mComparison;
    } set comparison(pComparison: PgslOperator) {
        if (this.mComparison !== null) {
            throw new Exception('Comparison can not be changed.', this);
        }

        this.mComparison = pComparison;
    }

    /**
     * Left expression reference.
     */
    public get leftExpression(): PgslExpression {
        if (this.mLeftExpression === null) {
            throw new Exception('Left expression not set.', this);
        }

        return this.mLeftExpression;
    } set leftExpression(pVariable: PgslExpression) {
        if (this.mLeftExpression !== null) {
            throw new Exception('Left expression can not be changed.', this);
        }

        this.mLeftExpression = pVariable;
    }

    /**
     * Right expression reference.
     */
    public get rightExpression(): PgslExpression {
        if (this.mRightExpression === null) {
            throw new Exception('Right expression not set.', this);
        }

        return this.mRightExpression;
    } set rightExpression(pVariable: PgslExpression) {
        if (this.mRightExpression !== null) {
            throw new Exception('Right expression can not be changed.', this);
        }

        this.mRightExpression = pVariable;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mLeftExpression = null;
        this.mComparison = null;
        this.mRightExpression = null;
    }
}