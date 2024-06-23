/**
 * Types of interaction the interaction detection should respond to.
 */
export enum InteractionResponseType {
    /**
     * Ignore all interactions.
     */
    None = 0,

    /*
     * Synchron Proxy 
     */
    RegisteredFunction = 1 << 1,
    RegisteredPropertyGet = 1 << 2,
    RegisteredPropertySet = 1 << 3,
    RegisteredPropertyDelete = 1 << 4,
    RegisteredUntrackableFunction = 1 << 5,

    /*
     * Patcher 
     */
    PatchedCallback = 1 << 6,
    PatchedPromise = 1 << 7,
    PatchedEventlistener = 1 << 8,


    /**
     * Custom.
     */
    Custom = 1 << 9,
    
    /**
     * Any interaction.
     */
    Any = (1 << 10) - 1,
}