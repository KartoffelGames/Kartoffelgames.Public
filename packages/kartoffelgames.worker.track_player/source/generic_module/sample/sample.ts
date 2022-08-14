import { Exception } from '@kartoffelgames/core.data';
import { StatefullSerializeable } from '@kartoffelgames/core.serializer';

/**
 * Sample information.
 */
@StatefullSerializeable('217a4b0a-1a1a-4c93-9228-ad04e032f5f9')
export class Sample {
    private mData: Float32Array;
    private mFineTune: number;
    private mName: string;
    private mRepeatLength: number;
    private mRepeatStartOffset: number;
    private mVolume: number;

    /**
     * Get sample byte data.
     */
    public get data(): Float32Array {
        return this.mData;
    }

    /**
     * Set sample byte data.
     */
    public set data(pData: Float32Array) {
        this.mData = pData;
    }

    /**
     * Get samples fine tune.
     */
    public get fineTune(): number {
        return this.mFineTune;
    }

    /**
     * Set samples fine tune.
     */
    public set fineTune(pFineTune: number) {
        this.mFineTune = pFineTune;
    }

    /**
     * Get sample name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Set sample name.
     */
    public set name(pName: string) {
        this.mName = pName;
    }

    /**
     * Get sample repeat length.
     */
    public get repeatLength(): number {
        return this.mRepeatLength;
    }

    /**
     * Get sample repeat offset.
     */
    public get repeatOffset(): number {
        return this.mRepeatStartOffset;
    }

    /**
     * Get samples volume. 0..1
     */
    public get volume(): number {
        return this.mVolume;
    }

    /**
     * Set samples volume. 0..1
     */
    public set volume(pVolume: number) {
        if (pVolume > 1 || pVolume < 0) {
            throw new Exception('Volume out of range [0..1]', this);
        }

        this.mVolume = pVolume;
    }

    /**
     * Constructor.
     * Set defaults.
     */
    public constructor() {
        // Empty values.
        this.mName = '';
        this.mData = new Float32Array(1);
        this.mVolume = 0;
        this.mFineTune = 0;
        this.mRepeatLength = 1;
        this.mRepeatStartOffset = 0;
    }

    /**
     * Set repeat information.
     * @param pRepeatOffset - Repeat offset, where the repeat should start.
     * @param pRepeatLength - Repeat byte length.
     */
    public setRepeatInformation(pRepeatOffset: number, pRepeatLength: number): void {
        this.mRepeatStartOffset = pRepeatOffset;
        this.mRepeatLength = pRepeatLength;
    }
}