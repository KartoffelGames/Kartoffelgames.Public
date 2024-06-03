/**
 * Types of interaction the interaction detection should respond to.
 */
export enum InteractionResponseType {
    /**
     * Ignore all interactions.
     */
    None = 0,

    /*
     * Function calls.
     */
    FunctionCallStart = 1 << 0,
    FunctionCallEnd = 1 << 1,
    FunctionCallError = 1 << 2,

    /*
     * Function callbacks.
     */
    CallbackCallStart = 1 << 3,
    CallbackCallEnd = 1 << 4,
    CallbackCallError = 1 << 5,

    /**
     * Property reads and writes.
     */
    PropertyGetStart = 1 << 6,
    PropertyGetEnd = 1 << 7,
    PropertyGetError = 1 << 8,
    
    PropertySetStart = 1 << 9,
    PropertySetEnd = 1 << 10,
    PropertySetError = 1 << 11,
    
    PropertyDeleteStart = 1 << 12,
    PropertyDeleteEnd = 1 << 13,
    PropertyDeleteError = 1 << 14,

    /**
     * Synchron {@link Promise} calls after they resolve or rejection.
     */
    PromiseStart = 1 << 15,
    PromiseEnd = 1 << 16,
    PromiseResolve = 1 << 17,
    PromiseReject = 1 << 18,

    /**
     * Events triggered on {@link EventTarget}s
     */
    EventlistenerStart = 1 << 19,
    EventlistenerEnd = 1 << 20,
    EventlistenerError = 1 << 21,

    /**
     * Any interaction.
     */
    Any = (1 << 22) - 1,
}