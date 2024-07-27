import { PgslAttributes } from './pgsl-attributes';
import { PgslType } from './type/pgsl-type';

export class PgslVariable {
    private readonly mName!: string;
    private readonly mType!: PgslType;
    private readonly mModifier!: PxslVariableModifier;
    private readonly mAttributes!: Array<PgslAttributes>;

    /**
     * Get variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get variable type.
     */
    public get type(): PgslType {
        return this.mType;
    }
}

enum PxslVariableModifier {
    Var = 'var',
    Let = 'let',
    Const = 'const',
    Uniform = 'uniform',
    ReadStorage = 'readstorage',
    WriteStorage = 'writestorage',
    ReadWriteStorage = 'readwritestorage',
}