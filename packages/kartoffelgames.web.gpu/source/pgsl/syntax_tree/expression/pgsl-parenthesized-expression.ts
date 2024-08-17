import { Exception } from '@kartoffelgames/core';
import { PgslExpression } from './pgsl-expression-syntax-tree';

export class PgslParenthesizedExpression extends PgslExpression {
    private mExpression: PgslExpression | null;

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
     * Constructor.
     */
    public constructor() {
        super();

        this.mExpression = null;
    }
}