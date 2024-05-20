import { Dictionary } from '@kartoffelgames/core.data';
import { InteractionResponseType } from '../../enum/interaction-response-type.enum';
import { InteractionReason } from '../../interaction-reason';
import { InteractionZone } from '../../interaction-zone';
import { EventNames } from './event-names';

export class Patcher {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly PATCHED_PROMISE_ZONE_KEY: symbol = Symbol('_PatchedPromiseZoneKey');


    private static mIsPatched: boolean = false;

    // TODO: Better structure pls.
    private static readonly mPatchedElements: WeakSet<object> = new WeakSet<object>();

    /**
     * Listen on all event.
     * 
     * @param pObject - EventTarget.
     * @param pZone - Zone.
     */
    public static attachZoneEvent(pObject: Element, pZone: InteractionZone): void {
        if (Patcher.mPatchedElements.has(pObject)) {
            return;
        }

        // Add all events without function.
        for (const lEventName of EventNames.changeCriticalEvents) {
            pObject.addEventListener(lEventName, () => {
                pZone.execute(() => {
                    InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.AsnychronEvent, pObject));
                });
            });
        }

        // Add element as patched entity.
        Patcher.mPatchedElements.add(pObject);
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
     * Patch class and its methods.
     * @param pConstructor - Class constructor.
     */
    private patchClass(pConstructor: any): any {
        // Skip undefined or not found constructor.
        if (typeof pConstructor !== 'function') {
            return pConstructor;
        }

        const lSelf: this = this;
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
                lPrototype[lClassMemberName] = this.patchFunctionCallbacks(<any>lValue);
            }
        }

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
                        pArgs[lParameterIndex] = lSelf.wrapFunctionInZone(lSelf.patchFunctionCallbacks(lParameter), lCurrentZone);
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

        // TODO: Callbacks can be objects with handeEvent methods. Make it work.

        const lOriginalListener: WeakMap<EventListenerOrEventListenerObject, EventListenerOrEventListenerObject> = new WeakMap<EventListenerOrEventListenerObject, EventListenerOrEventListenerObject>();

        // Patch add event listener.
        const lOriginalAddEventListener = lProto.addEventListener;
        lProto.addEventListener = function (pType: string, pCallback: EventListenerOrEventListenerObject | null, pOptions?: boolean | AddEventListenerOptions | undefined): void {
            // When event listener is not a function. Let the browser decide the error.
            if (typeof pCallback !== 'function') {
                lOriginalRemoveEventListener.call(this, pType, pCallback, pOptions);
                return;
            }

            // Get already patched event listener or patch it for the current interaction zone.
            const lPatchedEventListener = lOriginalListener.get(pCallback) ?? lSelf.wrapFunctionInZone(pCallback, InteractionZone.current);

            // Save patched function of original.
            lOriginalListener.set(pCallback, lPatchedEventListener);

            // Set patched function as new event listener.
            lOriginalAddEventListener.call(this, pType, lPatchedEventListener, pOptions);
        };

        // Patch remove event listener
        const lOriginalRemoveEventListener = lProto.removeEventListener;
        lProto.removeEventListener = function (pType: string, pCallback: EventListenerOrEventListenerObject, pOptions?: EventListenerOptions | boolean): void {
            // When event listener is not a function. Let the browser decide the error.
            if (typeof pCallback !== 'function') {
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
     */
    private patchFunctionCallbacks(pFunction: (...pArgs: Array<any>) => any): (...pArgs: Array<any>) => any {
        const lSelf: this = this;

        // Wrap function parameters into current interaction zone.
        return function (this: any, ...pArgs: Array<any>) {
            // Get zone.
            const lCurrentZone = InteractionZone.current;

            for (let lParameterIndex: number = 0; lParameterIndex < pArgs.length; lParameterIndex++) {
                const lParameter: any = pArgs[lParameterIndex];

                // Patch all arguments that are function. 
                if (typeof lParameter === 'function') {
                    pArgs[lParameterIndex] = lSelf.wrapFunctionInZone(lSelf.patchFunctionCallbacks(lParameter), lCurrentZone);
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
        pGlobalObject.requestAnimationFrame = this.patchFunctionCallbacks(pGlobalObject.requestAnimationFrame);
        pGlobalObject.setInterval = <any>this.patchFunctionCallbacks(pGlobalObject.setInterval);
        pGlobalObject.setTimeout = <any>this.patchFunctionCallbacks(pGlobalObject.setTimeout);

        // Promise
        pGlobalObject.Promise = this.patchPromise(pGlobalObject.Promise);

        // Observer
        pGlobalObject.ResizeObserver = this.patchClass(pGlobalObject.ResizeObserver);
        pGlobalObject.MutationObserver = this.patchClass(pGlobalObject.MutationObserver);
        pGlobalObject.IntersectionObserver = this.patchClass(pGlobalObject.IntersectionObserver);

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
            this.patchOnEventProperties(pGlobalObject.IDBIndex?.prototype, EventNames.idbIndexEventNames);
            this.patchOnEventProperties(pGlobalObject.IDBRequest?.prototype, EventNames.idbIndexEventNames);
            this.patchOnEventProperties(pGlobalObject.IDBOpenDBRequest?.prototype, EventNames.idbIndexEventNames);
            this.patchOnEventProperties(pGlobalObject.IDBDatabase?.prototype, EventNames.idbIndexEventNames);
            this.patchOnEventProperties(pGlobalObject.IDBTransaction?.prototype, EventNames.idbIndexEventNames);
            this.patchOnEventProperties(pGlobalObject.IDBCursor?.prototype, EventNames.idbIndexEventNames);

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
        pGlobalObject.HTMLCanvasElement.prototype.toBlob = this.patchFunctionCallbacks(pGlobalObject.HTMLCanvasElement.prototype.toBlob);
    }

    /**
     * Patch every onproperty of XHR.
     * Does not patch twice.
     */
    private patchOnEventProperties(pObject: any, pEventNames: Array<string>): void {
        // Check for correct object type.
        if (typeof pObject !== 'object' || pObject === null) {
            return;
        }

        // Save current context.
        const lSelf: this = this;

        // Storage to save all patched events by name.
        const lPatchedEventFunctions: Dictionary<string, (...pArgs: Array<any>) => any> = new Dictionary<string, (...pArgs: Array<any>) => any>();
        const lOriginalEventFunctions: WeakMap<(...pArgs: Array<any>) => any, (...pArgs: Array<any>) => any> = new WeakMap<(...pArgs: Array<any>) => any, (...pArgs: Array<any>) => any>();

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
            lDescriptorInformation.set = function (this: EventTarget, pOriginalEventListener: (...pArgs: Array<any>) => any): void {
                // Remove current added listener.
                const lCurrentValue: unknown = lPatchedEventFunctions.get(lPropertyName);
                if (typeof lCurrentValue === 'function') {
                    this.removeEventListener(lEventName, lPatchedEventFunctions.get(lPropertyName)!);
                }

                // Replace value unknown value and exit.
                if (typeof pOriginalEventListener !== 'function') {
                    lPatchedEventFunctions.set(lPropertyName, pOriginalEventListener);
                    return;
                }

                // Patch event listener.
                const lPatchedEventListener = lSelf.wrapFunctionInZone(pOriginalEventListener, InteractionZone.current);

                // Save patched listener
                lPatchedEventFunctions.set(lPropertyName, lPatchedEventListener);
                lOriginalEventFunctions.set(lPatchedEventListener, pOriginalEventListener);

                // Add new listener if defined.
                this.addEventListener(lEventName, lPatchedEventListener);
            };

            // Override get gebaviour.
            lDescriptorInformation.get = function (this: EventTarget): any {
                // Return unknown value when it is not a function. Unknown values are not patched.
                const lCurrentValue: any | ((...pArgs: Array<any>) => any) = lPatchedEventFunctions.get(lPropertyName);
                if (typeof lCurrentValue !== 'function') {
                    return lCurrentValue;
                }

                return lOriginalEventFunctions.get(lCurrentValue)!;
            };

            // Set descriptor to event target.
            Object.defineProperty(pObject, lPropertyName, lDescriptorInformation);
        }
    }

    /**
     * Patch promise.
     * @param pConstructor - Promise constructor.
     */
    private patchPromise(pConstructor: any): any {
        const lConstructor: any = this.patchClass(pConstructor);

        // Patch only the constructor.
        return class PatchedClass extends lConstructor {
            public constructor(...pArgs: Array<any>) {
                super(...pArgs);

                // Set zone of promise. // TODO: Replace these garbage.
                Reflect.set(this, Patcher.PATCHED_PROMISE_ZONE_KEY, InteractionZone.current);
            }
        };
    }

    /**
     * Patch function, so function gets always executed inside specified zone.
     * @param pFunction - Function.
     * @param pZone - Zone.
     */
    private wrapFunctionInZone(pFunction: (...pArgs: Array<any>) => any, pZone: InteractionZone): (...pArgs: Array<any>) => any {
        return function (...pArgs: Array<any>) {
            return pZone.execute(() => {
                const lResult: any = pFunction(...pArgs);

                // Dispatch interaction event in current zone. // TODO: Set correct interaction response type.
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.Any, pFunction));

                return lResult;
            });
        };
    }
}