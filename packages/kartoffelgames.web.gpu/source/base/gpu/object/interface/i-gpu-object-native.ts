export interface IGpuObjectNative<TNativeObject> {
    /**
     * Native gpu object.
     * Exposes internal native.
     */
    readonly native: TNativeObject;
}