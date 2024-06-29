export enum UpdateTrigger {
    /**
     * Ignore all interactions.
     */
    None = 0,

    /*
     * Synchron Proxy 
     */
    PropertySet = 1 << 2,
    PropertyDelete = 1 << 3,
    UntrackableFunctionCall = 1 << 4,

    /**
     * Manual
     */
    Manual = 1 << 5,

    /**
     * Manual
     */
    InputChange = 1 << 6,

    /**
     * All
     */
    Any = (1 << 7) - 1
}