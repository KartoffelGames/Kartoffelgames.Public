export enum DetectionCatchType {
    None = 0,

    SyncronCall = 1,
    SyncronProperty = 2,
    Syncron = 3,

    AsnychronPromise = 4,
    AsnychronCallback = 8,
    AsnychronEvent = 16,
    Asnychron = 28,

    All = 31
}