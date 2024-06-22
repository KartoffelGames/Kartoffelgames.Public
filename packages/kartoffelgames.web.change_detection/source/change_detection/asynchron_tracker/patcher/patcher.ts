import { Dictionary } from '@kartoffelgames/core.data';
import { InteractionResponseType } from '../../enum/interaction-response-type.enum';
import { ErrorAllocation } from '../../error-allocation';
import { InteractionReason } from '../../interaction-reason';
import { InteractionZone } from '../../interaction-zone';
import { EventNames } from './event-names';

export class Patcher {
    private static mIsPatched: boolean = false;
    private static readonly mPatchedElements: WeakMap<Element, WeakSet<InteractionZone>> = new WeakMap<Element, WeakSet<InteractionZone>>();

    /**
     * Listen on all change events and trigger interactions for the set {@link pInteractionZone}.
     * 
     * @param pObject - EventTarget.
     * @param pInteractionZone - InteractionZone.
     */
    public static attachZone(pObject: Element, pInteractionZone: InteractionZone): void {
        // Do not patch twice for the same zone.
        if (Patcher.mPatchedElements.get(pObject)?.has(pInteractionZone)) {
            return;
        }

        // Init interaction zone storage.
        if (!Patcher.mPatchedElements.has(pObject)) {
            Patcher.mPatchedElements.set(pObject, new WeakSet<InteractionZone>());
        }

        // Add all events without function.
        for (const lEventName of EventNames.changeCriticalEvents) {
            // Add empty event to element. This should trigger an interaction every time the event and therefore the listener is called.
            pInteractionZone.execute(() => {
                pObject.addEventListener(lEventName, () => { });
            });

        }

        // Add element as patched entity.
        Patcher.mPatchedElements.get(pObject)!.add(pInteractionZone);
    }

    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * 
     * @param pGlobalObject - Global enviroment object
     */
    public static patch(pGlobalObject: typeof globalThis): void {
        if (!Patcher.mIsPatched) {
            Patcher.mIsPatched = true;

            const lPatcher: Patcher = new Patcher();
            lPatcher.patchGlobals(pGlobalObject);
        }
    }

    /**
     * Dispatch reason to current zone.
     * 
     * @param pInteractionType - What type of interaction.
     * @param pSource - Object wich was interacted with.
     * @param pProperty - Optional change reason property.
     */
    private dispatch(pInteractionType: InteractionResponseType, pSource: object, pProperty?: PropertyKey | undefined): void {
        // Skip all None interaction types.
        if (pInteractionType === InteractionResponseType.None) {
            return;
        }

        // Dispatch reason to current zone.
        InteractionZone.dispatchInteractionEvent(new InteractionReason(pInteractionType, pSource, pProperty));
    }

    /**
     * Patch function, so function gets always executed inside specified zone.
     * Dispatches interaction event on function call.
     * 
     * @param pFunction - Function.
     * @param pZone - Zone in which the interaction should be triggered.
     * @param pStartInteractionType - Interaction type for function call start interactions.
     * @param pEndInteractionType - Interaction type for function call end interactions.
     * @param pErrorInteractionType - Interaction type for function call error interactions.
     */
    private interactionOnFunctionCall(pFunction: (...pArgs: Array<any>) => any, pZone: InteractionZone, pStartInteractionType: InteractionResponseType, pEndInteractionType: InteractionResponseType, pErrorInteractionType: InteractionResponseType): (...pArgs: Array<any>) => any {
        const lSelf: this = this;

        return function (...pArgs: Array<any>) {
            return pZone.execute(() => {
                // Dispatch delete property start interaction. 
                lSelf.dispatch(pStartInteractionType, pFunction);

                try {
                    // Call original function.
                    return pFunction(...pArgs);
                } catch (pError) {
                    // Dispatch error interaction and passthrough error.
                    lSelf.dispatch(pErrorInteractionType, pFunction);
                    throw pError;
                } finally {
                    // Dispatches interaction end event before exception passthrough.
                    lSelf.dispatch(pEndInteractionType, pFunction);
                }
            });
        };
    }

    /**
     * Patch class and its methods.
     * 
     * @param pConstructor - Class constructor.
     * @param pStartInteractionType - Interaction type for callback call start interactions.
     * @param pEndInteractionType - Interaction type for callback call end interactions.
     * @param pErrorInteractionType - Interaction type for callback call error interactions.
     * 
     * @returns patched {@link pConstructor}
     */
    private patchClass(pConstructor: any, pStartInteractionType: InteractionResponseType, pEndInteractionType: InteractionResponseType, pErrorInteractionType: InteractionResponseType): any {
        // Patch method callbacks of class.
        this.patchMethods(pConstructor, pStartInteractionType, pEndInteractionType, pErrorInteractionType);

        // Patch constructor callbacks
        return this.patchConstructor(pConstructor, pStartInteractionType, pEndInteractionType, pErrorInteractionType);
    }

    /**
     * Patch constructor callbacks.
     * 
     * @param pConstructor - Class constructor.
     * @param pStartInteractionType - Interaction type for constructor callback call start interactions.
     * @param pEndInteractionType - Interaction type for constructor callback call end interactions.
     * @param pErrorInteractionType - Interaction type for constructor callback call error interactions.
     * 
     * @returns patched {@link pConstructor}
     */
    private patchConstructor(pConstructor: any, pStartInteractionType: InteractionResponseType, pEndInteractionType: InteractionResponseType, pErrorInteractionType: InteractionResponseType): any {
        // Skip undefined or not found constructor.
        if (typeof pConstructor !== 'function') {
            return pConstructor;
        }

        const lSelf: this = this;

        // Extend class to path constructor.
        return class PatchedClass extends pConstructor {
            /**
             * Patch all arguments of constructor.
             * @param pArgs - Any argument.
             */
            public constructor(...pArgs: Array<any>) {
                // Get zone.
                const lCurrentZone: InteractionZone = InteractionZone.current;

                // Replace all function parameter with a patched version.
                for (let lParameterIndex: number = 0; lParameterIndex < pArgs.length; lParameterIndex++) {
                    const lParameter: any = pArgs[lParameterIndex];

                    // Patch all arguments that are function. 
                    if (typeof lParameter === 'function') {
                        pArgs[lParameterIndex] = lSelf.interactionOnFunctionCall(lSelf.patchFunctionCallbacks(lParameter, pStartInteractionType, pEndInteractionType, pErrorInteractionType), lCurrentZone, pStartInteractionType, pEndInteractionType, pErrorInteractionType);
                    }
                }

                super(...pArgs);
            }
        };
    }

    /**
     * Patch EventTarget class for executing event listener in zone the listener was created.
     * 
     * @param pGlobalObject - Global this object.
     */
    private patchEventTarget(pGlobalObject: typeof globalThis): void {
        const lProto = pGlobalObject.EventTarget.prototype;
        const lSelf: this = this;

        const lOriginalListener: WeakMap<EventListenerOrEventListenerObject, EventListener> = new WeakMap<EventListenerOrEventListenerObject, EventListener>();

        // Save original functions.
        const lOriginalAddEventListener = lProto.addEventListener;
        const lOriginalRemoveEventListener = lProto.removeEventListener;

        // Patch add event listener.
        lProto.addEventListener = function (pType: string, pCallback: EventListenerOrEventListenerObject | null, pOptions?: boolean | AddEventListenerOptions | undefined): void {
            // When event listener is not a function. Let the browser decide the error.
            if (pCallback === null || typeof pCallback !== 'function' && !(typeof pCallback === 'object' && 'handleEvent' in pCallback)) {
                lOriginalAddEventListener.call(this, pType, pCallback, pOptions);
                return;
            }

            // Get already patched event listener or patch it for the current interaction zone.
            let lPatchedEventListener: EventListener | undefined = lOriginalListener.get(pCallback);
            if (!lPatchedEventListener) {
                // Save interaction zone of this execution.
                const lCurrentZone: InteractionZone = InteractionZone.current;

                if (typeof pCallback === 'function') {
                    lPatchedEventListener = lSelf.interactionOnFunctionCall(pCallback, lCurrentZone, InteractionResponseType.EventlistenerStart, InteractionResponseType.EventlistenerEnd, InteractionResponseType.EventlistenerError);
                } else {
                    lPatchedEventListener = lSelf.interactionOnFunctionCall(pCallback.handleEvent.bind(pCallback), lCurrentZone, InteractionResponseType.EventlistenerStart, InteractionResponseType.EventlistenerEnd, InteractionResponseType.EventlistenerError);
                }
            }

            // Save patched function of original.
            lOriginalListener.set(pCallback, lPatchedEventListener);

            // Set patched function as new event listener.
            lOriginalAddEventListener.call(this, pType, lPatchedEventListener, pOptions);
        };

        // Patch remove event listener
        lProto.removeEventListener = function (pType: string, pCallback: EventListenerOrEventListenerObject, pOptions?: EventListenerOptions | boolean): void {
            // When event listener is not a function. Let the browser decide the error.
            if (pCallback === null || typeof pCallback !== 'function' && !(typeof pCallback === 'object' && 'handleEvent' in pCallback)) {
                lOriginalRemoveEventListener.call(this, pType, pCallback, pOptions);
                return;
            }

            // Get patched version of event listener the callback has no patched version, use the original.
            const lUsedEventListener: EventListenerOrEventListenerObject = lOriginalListener.get(pCallback) ?? pCallback;

            // Remove event listener, eighter patched or original, from event target.
            lOriginalRemoveEventListener.call(this, pType, lUsedEventListener, pOptions);
        };
    }

    /**
     * Wrap function so all callbacks gets executed inside the zone the function was called.
     * 
     * @param pFunction - Function.
     * @param pStartInteractionType - Interaction type for function callback start interactions.
     * @param pEndInteractionType - Interaction type for function callback end interactions.
     * @param pErrorInteractionType - Interaction type for function callback error interactions.
     */
    private patchFunctionCallbacks(pFunction: (...pArgs: Array<any>) => any, pStartInteractionType: InteractionResponseType, pEndInteractionType: InteractionResponseType, pErrorInteractionType: InteractionResponseType): (...pArgs: Array<any>) => any {
        const lSelf: this = this;

        // Wrap function parameters into current interaction zone.
        return function (this: any, ...pArgs: Array<any>) {
            // Save current zone.
            const lCurrentZone: InteractionZone = InteractionZone.current;

            for (let lParameterIndex: number = 0; lParameterIndex < pArgs.length; lParameterIndex++) {
                const lParameter: any = pArgs[lParameterIndex];

                // Patch all arguments that are function. 
                if (typeof lParameter === 'function') {
                    // Recursive patch all callbacks.
                    pArgs[lParameterIndex] = lSelf.interactionOnFunctionCall(lSelf.patchFunctionCallbacks(lParameter, pStartInteractionType, pEndInteractionType, pErrorInteractionType), lCurrentZone, pStartInteractionType, pEndInteractionType, pErrorInteractionType);
                }
            }

            return pFunction.call(this, ...pArgs);
        };
    }

    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    private patchGlobals(pGlobalObject: typeof globalThis): void {
        // Timer
        pGlobalObject.requestAnimationFrame = this.patchFunctionCallbacks(pGlobalObject.requestAnimationFrame, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
        pGlobalObject.setInterval = <any>this.patchFunctionCallbacks(pGlobalObject.setInterval, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
        pGlobalObject.setTimeout = <any>this.patchFunctionCallbacks(pGlobalObject.setTimeout, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);

        // Promise
        pGlobalObject.Promise = this.patchPromise(pGlobalObject);

        // Observer
        pGlobalObject.ResizeObserver = this.patchClass(pGlobalObject.ResizeObserver, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
        pGlobalObject.MutationObserver = this.patchClass(pGlobalObject.MutationObserver, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
        pGlobalObject.IntersectionObserver = this.patchClass(pGlobalObject.IntersectionObserver, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);

        // Event target !!!before patching onEvents. 
        this.patchEventTarget(pGlobalObject);

        // Patch onEvents
        /* istanbul ignore next */
        {
            // Global context.
            this.patchOnEventProperties(pGlobalObject, ['messageerror', ...EventNames.eventNames]);

            // XHR
            this.patchOnEventProperties(pGlobalObject.XMLHttpRequestEventTarget?.prototype, EventNames.xmlHttpRequestEventNames);
            this.patchOnEventProperties(pGlobalObject.XMLHttpRequest?.prototype, EventNames.xmlHttpRequestEventNames);

            // Patch HTML elements
            this.patchOnEventProperties(pGlobalObject.Document?.prototype, EventNames.eventNames);
            this.patchOnEventProperties(pGlobalObject.SVGElement?.prototype, EventNames.eventNames);
            this.patchOnEventProperties(pGlobalObject.Element?.prototype, EventNames.eventNames);
            this.patchOnEventProperties(pGlobalObject.HTMLElement?.prototype, EventNames.eventNames);
            this.patchOnEventProperties(pGlobalObject.HTMLMediaElement?.prototype, EventNames.mediaElementEventNames);
            this.patchOnEventProperties(pGlobalObject.HTMLFrameSetElement?.prototype, [...EventNames.windowEventNames, ...EventNames.frameSetEventNames]);
            this.patchOnEventProperties(pGlobalObject.HTMLBodyElement?.prototype, [...EventNames.windowEventNames, ...EventNames.frameSetEventNames]);
            this.patchOnEventProperties(pGlobalObject.HTMLFrameElement?.prototype, EventNames.frameEventNames);
            this.patchOnEventProperties(pGlobalObject.HTMLIFrameElement?.prototype, EventNames.frameEventNames);
            this.patchOnEventProperties(pGlobalObject.HTMLMarqueeElement?.prototype, EventNames.marqueeEventNames);

            // Worker.
            this.patchOnEventProperties(pGlobalObject.Worker && Worker?.prototype, EventNames.workerEventNames);

            // Index DB.
            this.patchOnEventProperties(pGlobalObject.IDBRequest?.prototype, EventNames.idbIndexEventNames);
            this.patchOnEventProperties(pGlobalObject.IDBOpenDBRequest?.prototype, EventNames.idbIndexEventNames);
            this.patchOnEventProperties(pGlobalObject.IDBDatabase?.prototype, EventNames.idbIndexEventNames);
            this.patchOnEventProperties(pGlobalObject.IDBTransaction?.prototype, EventNames.idbIndexEventNames);

            // Websocket.
            this.patchOnEventProperties(pGlobalObject.WebSocket?.prototype, EventNames.websocketEventNames);

            // Filereader
            this.patchOnEventProperties(pGlobalObject.FileReader?.prototype, EventNames.xmlHttpRequestEventNames);

            // Notification
            this.patchOnEventProperties(pGlobalObject.Notification?.prototype, EventNames.notificationEventNames);

            // RTCPeerConnection
            this.patchOnEventProperties(pGlobalObject.RTCPeerConnection?.prototype, EventNames.rtcPeerConnectionEventNames);
        }

        // HTMLCanvasElement.toBlob
        pGlobalObject.HTMLCanvasElement.prototype.toBlob = this.patchFunctionCallbacks(pGlobalObject.HTMLCanvasElement.prototype.toBlob, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
    }

    /**
     * Patch class methods parameter.
     * Any callback parameter triggers an interaction.
     * 
     * @param pConstructor - Class constructor.
     * @param pStartInteractionType - Interaction type for method callback call start interactions.
     * @param pEndInteractionType - Interaction type for method callback call end interactions.
     * @param pErrorInteractionType - Interaction type for method callback call error interactions.
     */
    private patchMethods(pConstructor: any, pStartInteractionType: InteractionResponseType, pEndInteractionType: InteractionResponseType, pErrorInteractionType: InteractionResponseType): void {
        // Skip undefined or not found constructor.
        if (typeof pConstructor !== 'function') {
            return pConstructor;
        }

        const lPrototype = pConstructor.prototype;

        // For each prototype property.
        for (const lClassMemberName of Object.getOwnPropertyNames(lPrototype)) {
            // Skip constructor.
            if (lClassMemberName === 'constructor') {
                continue;
            }

            const lDescriptor: PropertyDescriptor = <PropertyDescriptor>Object.getOwnPropertyDescriptor(lPrototype, lClassMemberName);
            const lValue: any = lDescriptor.value;

            // Only try to patch methods.
            if (typeof lValue === 'function') {
                lPrototype[lClassMemberName] = this.patchFunctionCallbacks(<any>lValue, pStartInteractionType, pEndInteractionType, pErrorInteractionType);
            }
        }
    }

    /**
     * Patch every onproperty of an object.
     * Adds and remove listener as {@link EventTarget} eventlistener. 
     */
    private patchOnEventProperties(pObject: EventTarget, pEventNames: Array<string>): void {
        // Check for correct object type.
        if (!pObject || !(pObject instanceof EventTarget)) {
            return;
        }

        // Storage to save all patched events by name.
        const lEventFunctions: Dictionary<string, (...pArgs: Array<any>) => any> = new Dictionary<string, (...pArgs: Array<any>) => any>();

        // Patch every event.
        for (const lEventName of pEventNames) {
            const lPropertyName: string = `on${lEventName}`;
            const lDescriptorInformation: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(pObject, lPropertyName);

            // If the descriptor not exists or is not configurable skip the property patch.
            if (!lDescriptorInformation || !lDescriptorInformation.configurable) {
                continue;
            }

            // Remove set value and writable flag to be able to add set and get.
            delete lDescriptorInformation.writable;
            delete lDescriptorInformation.value;

            // Override set behaviour.
            lDescriptorInformation.set = function (this: EventTarget, pEventListener: (...pArgs: Array<any>) => any): void {
                // Remove current added listener can be null.
                const lCurrentValue: unknown = lEventFunctions.get(lEventName);
                if (typeof lCurrentValue === 'function' || typeof lCurrentValue === 'object') {
                    this.removeEventListener(lEventName, lEventFunctions.get(lEventName)!);
                }

                // Save listener for event type. No need to patch, addEventListener should be patched anyway.
                lEventFunctions.set(lEventName, pEventListener);

                // Add new listener if defined.
                if (typeof pEventListener === 'function' || typeof pEventListener === 'object') {
                    this.addEventListener(lEventName, pEventListener);
                }
            };

            // Override get gebaviour.
            lDescriptorInformation.get = function (this: EventTarget): any {
                // Return set listener, or what ever value was set.
                return lEventFunctions.get(lEventName);
            };

            // Set descriptor to event target.
            Object.defineProperty(pObject, lPropertyName, lDescriptorInformation);
        }
    }

    /**
     * Patch promise to dispatch promise interaction events on executor start, end and error.
     * 
     * @param pConstructor - Promise constructor.
     */
    private patchPromise(pGlobalObject: typeof globalThis): any {
        const lSelf: this = this;
        const lOriginalPromiseConstructor: any = pGlobalObject.Promise;

        // Promise executor type definitions.
        type ExecutorResolve<T> = (pResult: T) => void;
        type ExecutorReject = (pResult: any) => void;
        type Executor<T> = (pResolve?: ExecutorResolve<T>, pReject?: ExecutorReject) => any;

        // Patch only the constructor.
        class PatchedPromise<T> extends lOriginalPromiseConstructor {
            public constructor(pExecutor: Executor<T>) {
                // Patch executor function.
                const lPatchedExecutor = function (this: any, pResolve: ExecutorResolve<T>, pReject: ExecutorReject) {
                    // Dispatch delete property start interaction. 
                    lSelf.dispatch(InteractionResponseType.PromiseStart, this);

                    // Get current zone of synchron execution.
                    const lCurrentZone: InteractionZone = InteractionZone.current;

                    try {
                        const lExecutorResolve: ExecutorResolve<T> | undefined = lSelf.interactionOnFunctionCall(pResolve, lCurrentZone, InteractionResponseType.None, InteractionResponseType.PromiseResolve, InteractionResponseType.None);
                        const lExecutorReject: ExecutorReject | undefined = lSelf.interactionOnFunctionCall(pReject, lCurrentZone, InteractionResponseType.None, InteractionResponseType.PromiseReject, InteractionResponseType.None);

                        // Call original executor.
                        return pExecutor.call(this, lExecutorResolve, lExecutorReject);
                    } catch (pError) {
                        // Dispatch error interaction and passthrough error.
                        lSelf.dispatch(InteractionResponseType.PromiseReject, this);
                        throw pError;
                    } finally {
                        // Dispatches interaction end event before exception passthrough.
                        lSelf.dispatch(InteractionResponseType.PromiseEnd, this);
                    }
                };

                // Wrap executor and dispatch call start and end interaction
                super(lPatchedExecutor);

                // Set zone of promise.
                ErrorAllocation.allocateAsyncronError(this as any as Promise<unknown>, InteractionZone.current);
            }
        }

        // Promise methods don't need to be patched because they all create new promises.
        // this.patchMethods(PatchedPromise);

        return PatchedPromise;
    }
}