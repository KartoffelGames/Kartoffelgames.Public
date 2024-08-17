import { Exception } from '@kartoffelgames/core';
import { PgslExpression } from './pgsl-expression-syntax-tree';
import { PgslVariableExpression } from './variable/pgsl-variable-expression';

export class PgslPointerExpression extends PgslExpression {
    private mVariable: PgslVariableExpression | null;

    /**
     * Variable name reference.
     */
    public get variable(): PgslVariableExpression {
        if (this.mVariable === null) {
            throw new Exception('Variable not set.', this);
        }

        return this.mVariable;
    } set variable(pVariable: PgslVariableExpression) {
        if (this.mVariable !== null) {
            throw new Exception('Variable can not be changed.', this);
        }

        this.mVariable = pVariable;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mVariable = null;
    }
}