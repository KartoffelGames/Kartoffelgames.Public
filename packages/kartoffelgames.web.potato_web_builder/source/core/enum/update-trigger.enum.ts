export enum UpdateTrigger {
    /**
     * Ignore all interactions.
     */
    None = 0,

    /*
     * Synchron Proxy 
     */
    FunctionCall = 1 << 1,
    PropertySet = 1 << 3,
    PropertyDelete = 1 << 4,
    UntrackableFunctionCall = 1 << 5,

    /**
     * Manual
     */
    Manual = 1 << 6,

    /**
     * All
     */
    Any = (1 << 7) - 1
}