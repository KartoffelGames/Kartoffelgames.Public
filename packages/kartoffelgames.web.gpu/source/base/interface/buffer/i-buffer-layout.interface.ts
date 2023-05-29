export interface IBufferLayout {
    /**
     * Layout byte alignment.
     */
    readonly alignment: number;

    /**
     * Location of layout.
     * References bind location or attribute location based on layout context.
     */
    readonly location: number | null;

    /**
     * Layout size in bytes.
     */
    readonly size: number;

    /**
     * Name of layout used for path tracing.
     */
    readonly name: string;

    /**
     * Get location of path.
     * @param pPathName - Path name.
     */
    locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};