import { Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../enum/pgsl-operator.enum';
import { PgslExpression } from './base-pgsl-expression-syntax-tree';

export class PgslArithmeticExpression extends PgslExpression {
    private mLeftExpression: PgslExpression | null;
    private mOperator: PgslOperator | null;
    private mRightExpression: PgslExpression | null;

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
     * Expression operator.
     */
    public get operator(): PgslOperator {
        if (this.mOperator === null) {
            throw new Exception('Arithmetic operator not set.', this);
        }

        return this.mOperator;
    } set operator(pOperator: PgslOperator) {
        if (this.mOperator !== null) {
            throw new Exception('Arithmetic operator can not be changed.', this);
        }

        this.mOperator = pOperator;
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
        this.mOperator = null;
        this.mRightExpression = null;
    }
}