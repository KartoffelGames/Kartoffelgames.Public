import { IBufferLayout } from '../../interface/buffer/i-buffer-layout.interface';
import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';

export abstract class BufferLayout implements IBufferLayout {
    private readonly mAccessMode: AccessMode;
    private readonly mBindType: BindType;
    private readonly mLocation: number | null;
    private readonly mName: string;
    private readonly mParent: BufferLayout | null;

    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Buffer size in bytes.
     */
    public abstract readonly size: number;

    /**
     * Buffer type access mode.
     */
    public get accessMode(): AccessMode {
        return this.mAccessMode;
    }

    /**
     * Buffer bind type.
     */
    public get bindType(): BindType {
        return this.mBindType;
    }

    /**
     * Get buffer location index as parameter.
     */
    public get location(): number | null {
        return this.mLocation;
    }

    /**
     * Variable name of buffer.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Parent type. Stuct or Array.
     */
    public get parent(): BufferLayout | null {
        return this.mParent;
    }

    /**
     * Constructor.
     */
    public constructor(pName: string, pParent?: BufferLayout, pAccessMode: AccessMode = AccessMode.Read | AccessMode.Write, pBindType: BindType = BindType.Uniform, pLocation: number | null = null) {
        // Static properties.
        this.mName = pName;
        this.mParent = pParent ?? null;
        this.mAccessMode = pAccessMode;
        this.mBindType = pBindType;
        this.mLocation = pLocation;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public abstract locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};