import { Exception } from '@kartoffelgames/core';
import { PgslVariableExpression } from './pgsl-variable-expression';

export class PgslCompositeValueDecompositionVariableExpression extends PgslVariableExpression {
    private mProperty: string | null;
    private mVariable: PgslVariableExpression | null;
    
    /**
     * Index expression of variable index expression.
     */
    public get property(): string {
        if (this.mProperty === null) {
            throw new Exception('Decomposition property not set.', this);
        }

        return this.mProperty;
    } set property(pProperty: string) {
        if (this.mProperty !== null) {
            throw new Exception('Decomposition property can not be changed.', this);
        }

        this.mProperty = pProperty;
    }

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

        this.mProperty = null;
        this.mVariable = null;
    }
}