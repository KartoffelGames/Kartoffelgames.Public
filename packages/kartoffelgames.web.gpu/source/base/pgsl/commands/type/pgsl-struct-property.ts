import { PgslAttributes } from '../pgsl-attributes';
import { PgslType } from './pgsl-type';

export class PgslStructProperty {
    private readonly mAttributes: PgslAttributes;
    private readonly mName: string;
    private readonly mType: PgslType;

    /**
     * Strunct property attributes.
     */
    public get attributes(): PgslAttributes {
        return this.mAttributes;
    }

    /**
     * Struct property name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Struct property type.
     */
    public get type(): PgslType {
        return this.mType;
    }

    /**
     * Constructor.
     * @param pName - Struct property name.
     * @param pType - Struct property type.
     */
    public constructor(pName: string, pType: PgslType) {
        this.mName = pName;
        this.mType = pType;

        this.mAttributes = new PgslAttributes();
    }
}