/**
 * Types of interaction the interaction detection should respond to.
 */
export enum InteractionResponseType {
    /**
     * Ignore all interactions.
     */
    None = 0,

    /**
     * Synchron calls and callbacks.
     */
    SyncronCall = 1,

    /**
     * Synchron property changes.
     */
    SyncronProperty = 2,

    /**
     * Any synchron interactions.
     */
    Syncron = 3,

    /**
     * Synchron {@link Promise} calls after they resolve or rejection.
     */
    AsnychronPromise = 4,

    /**
     * Asynchron callbacks.
     */
    AsnychronCallback = 8,

    /**
     * Events triggered on {@link EventTarget}s
     */
    AsnychronEvent = 16,

    /**
     * Any asynchon interactions.
     */
    Asnychron = 28,

    /**
     * Any interaction.
     */
    Any = 31
}