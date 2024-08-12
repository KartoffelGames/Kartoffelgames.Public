import { Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../enum/pgsl-operator.enum';
import { PgslExpression } from './pgsl-expression';

export class PgslUnaryExpression extends PgslExpression {
    private mExpression: PgslExpression | null;
    private mOperator: PgslOperator | null;

    /**
     * Expression reference.
     */
    public get expression(): PgslExpression {
        if (this.mExpression === null) {
            throw new Exception('Expression not set.', this);
        }

        return this.mExpression;
    } set expression(pVariable: PgslExpression) {
        if (this.mExpression !== null) {
            throw new Exception('Expression can not be changed.', this);
        }

        this.mExpression = pVariable;
    }

    /**
     * Expression operator.
     */
    public get operator(): PgslOperator {
        if (this.mOperator === null) {
            throw new Exception('Unary operator not set.', this);
        }

        return this.mOperator;
    } set operator(pVariable: PgslOperator) {
        if (this.mOperator !== null) {
            throw new Exception('Unary operator can not be changed.', this);
        }

        this.mOperator = pVariable;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mExpression = null;
        this.mOperator = null;
    }
}