import { PgslBlock } from './flow/pgsl-block';
import { PgslAttributes } from './pgsl-attributes';
import { PgslVariable } from './pgsl-variable';
import { PgslType } from './type/pgsl-type';

export class PgslFunction {
    private readonly mAttributes: PgslAttributes;
    private readonly mBody: PgslBlock;
    private readonly mName: string;
    private readonly mParameterList: Array<PgslVariable>;
    private readonly mReturnType: PgslType;

    /**
     * Function attributes.
     */
    public get attributes(): PgslAttributes {
        return this.mAttributes;
    }

    /**
     * Function body.
     */
    public get body(): PgslBlock {
        return this.mBody;
    }

    /**
     * Get function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get function parameters.
     */
    public get parameter(): Array<PgslVariable> {
        return [...this.mParameterList];
    }

    /**
     * Function return type.
     */
    public get returnType(): PgslType {
        return this.mReturnType;
    }

    /**
     * Constructor.
     * @param pName - Function name.
     * @param pReturnType - Return type.
     * @param pParameter - Parameter.
     */
    public constructor(pName: string, pReturnType: PgslType, pParameter: Array<PgslVariable>, pBody: PgslBlock) {
        this.mName = pName;
        this.mReturnType = pReturnType;
        this.mParameterList = pParameter;
        this.mBody = pBody;

        this.mAttributes = new PgslAttributes();
    }
}