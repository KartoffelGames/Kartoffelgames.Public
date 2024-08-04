import { BasePgslStructure } from '../base-pgsl-structure';

export class PgslVariableExpression extends BasePgslStructure {
    private readonly mName: string;

    public get name(): string {
        return this.mName;
    }

    public constructor(pName: string) {
        super();
        
        this.mName = pName;
    }
}