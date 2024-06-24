import { InteractionResponseType } from '@kartoffelgames/web.change-detection';

export enum UpdateTrigger {
    /**
     * Anything. Pure chaos. Dont use when you dont know what it does.
     * Triggers updates even on read calls.
     */
    Any = InteractionResponseType.Any,

    /**
     * Nothing triggers. Endless silence.
     */
    None = InteractionResponseType.None,

    /**
     * Default update trigger.
     * Triggers updates on any call and change.
     */
    Default = InteractionResponseType.PatchedCallback
    | InteractionResponseType.Custom
    | InteractionResponseType.PatchedEventlistener
    | InteractionResponseType.RegisteredUntrackableFunction
    | InteractionResponseType.RegisteredFunction
    | InteractionResponseType.PatchedPromise
    | InteractionResponseType.RegisteredPropertyDelete
    | InteractionResponseType.RegisteredPropertySet,

    /**
     * Async update trigger.
     * Only triggers on async calls.
     */
    Async = InteractionResponseType.PatchedCallback
    | InteractionResponseType.Custom
    | InteractionResponseType.PatchedEventlistener
    | InteractionResponseType.PatchedPromise,

    /**
     * Sync update trigger.
     * Triggers only on sync changes.
     */
    Sync = InteractionResponseType.Custom
    | InteractionResponseType.RegisteredUntrackableFunction
    | InteractionResponseType.RegisteredFunction
    | InteractionResponseType.RegisteredPropertyDelete
    | InteractionResponseType.RegisteredPropertySet,

    /**
     * Update trigger without any syncron call trigger.
     * Prevents update trigger on function calls with only read actions.
     */
    NoSyncCalls = InteractionResponseType.PatchedCallback
    | InteractionResponseType.Custom
    | InteractionResponseType.PatchedEventlistener
    | InteractionResponseType.RegisteredUntrackableFunction
    | InteractionResponseType.PatchedPromise
    | InteractionResponseType.RegisteredPropertyDelete
    | InteractionResponseType.RegisteredPropertySet,
}