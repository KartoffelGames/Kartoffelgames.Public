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
    Default = InteractionResponseType.CallbackCallEnd
    | InteractionResponseType.Custom
    | InteractionResponseType.EventlistenerEnd
    | InteractionResponseType.NativeFunctionCall
    | InteractionResponseType.FunctionCallEnd
    | InteractionResponseType.PromiseReject
    | InteractionResponseType.PromiseResolve
    | InteractionResponseType.PropertyDeleteEnd
    | InteractionResponseType.PropertySetEnd,

    /**
     * Async update trigger.
     * Only triggers on async calls.
     */
    Async = InteractionResponseType.CallbackCallEnd
    | InteractionResponseType.Custom
    | InteractionResponseType.EventlistenerEnd
    | InteractionResponseType.PromiseReject
    | InteractionResponseType.PromiseResolve,

    /**
     * Sync update trigger.
     * Triggers only on sync changes.
     */
    Sync = InteractionResponseType.Custom
    | InteractionResponseType.NativeFunctionCall
    | InteractionResponseType.FunctionCallEnd
    | InteractionResponseType.PropertyDeleteEnd
    | InteractionResponseType.PropertySetEnd,

    /**
     * Update trigger without any syncron call trigger.
     * Prevents update trigger on function calls with only read actions.
     */
    NoSyncCalls = InteractionResponseType.CallbackCallEnd
    | InteractionResponseType.Custom
    | InteractionResponseType.EventlistenerEnd
    | InteractionResponseType.NativeFunctionCall
    | InteractionResponseType.PromiseReject
    | InteractionResponseType.PromiseResolve
    | InteractionResponseType.PropertyDeleteEnd
    | InteractionResponseType.PropertySetEnd,
}