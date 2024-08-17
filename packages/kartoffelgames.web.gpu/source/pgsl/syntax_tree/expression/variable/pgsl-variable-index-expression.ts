import { Exception } from '@kartoffelgames/core';
import { PgslVariableExpression } from './pgsl-variable-expression';
import { PgslExpression } from '../pgsl-expression-syntax-tree';

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslVariableIndexNameExpression extends PgslVariableExpression {
    private mIndex: PgslExpression | null;
    private mVariable: PgslVariableExpression | null;
    
    /**
     * Index expression of variable index expression.
     */
    public get index(): PgslExpression {
        if (this.mIndex === null) {
            throw new Exception('Variable not set.', this);
        }

        return this.mIndex;
    }

    /**
     * Variable name reference.
     */
    public get variable(): PgslVariableExpression {
        if (this.mVariable === null) {
            throw new Exception('Variable not set.', this);
        }

        return this.mVariable;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mIndex = null;
        this.mVariable = null;
    }
}