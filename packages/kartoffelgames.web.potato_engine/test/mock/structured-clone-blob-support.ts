/**
 * Recursively clone a value, preserving Blob instances by reference.
 */
function gClonePreservingBlobs(pValue: unknown): unknown {
    if (pValue instanceof Blob) {
        return pValue;
    }

    if (pValue === null || pValue === undefined || typeof pValue !== 'object') {
        return pValue;
    }

    if (Array.isArray(pValue)) {
        return pValue.map(gClonePreservingBlobs);
    }

    // Clone plain objects property by property.
    const lClone: Record<string, unknown> = {};
    for (const lKey of Object.keys(pValue as Record<string, unknown>)) {
        lClone[lKey] = gClonePreservingBlobs((pValue as Record<string, unknown>)[lKey]);
    }

    return lClone;
}

globalThis.structuredClone = <T>(pValue: T, _pOptions?: StructuredSerializeOptions): T => {
    return gClonePreservingBlobs(pValue) as T;
};
