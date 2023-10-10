import { PgslStructProperty } from './pgsl-struct-property';

export class PgslStruct {
    private readonly mName: string;
    private readonly mProperies: Array<PgslStructProperty>;

    /**
     * Struct name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Struct properties.
     */
    public get properties(): Array<PgslStructProperty> {
        return [...this.mProperies];
    }

    /**
     * Constructor.
     * @param pName - Struct name.
     */
    public constructor(pName: string) {
        this.mName = pName;
        this.mProperies = new Array<PgslStructProperty>();
    }

    /**
     * Add property.
     * @param pProperty - Struct property.
     */
    public addProperty(pProperty: PgslStructProperty): void {
        this.mProperies.push(pProperty);
    }
}