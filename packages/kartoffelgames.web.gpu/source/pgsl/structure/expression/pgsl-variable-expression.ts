import { PgslExpression } from './pgsl-expression';

export class PgslVariableExpression extends PgslExpression {
    private readonly mName: string;

    public get name(): string {
        return this.mName;
    }

    public constructor(pName: string) {
        super();

        this.mName = pName;
    }
}