import { Exception } from '@kartoffelgames/core';
import { PgslVariableExpression } from './pgsl-variable-expression';

/**
 * PGSL structure holding single variable name.
 */
export class PgslVariableNameExpression extends PgslVariableExpression {
    private mName: string;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    } set name(pVariableName: string) {
        if (this.mName !== '') {
            throw new Exception('Variable name can not be changed.', this);
        }

        this.mName = pVariableName;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mName = '';
    }
}