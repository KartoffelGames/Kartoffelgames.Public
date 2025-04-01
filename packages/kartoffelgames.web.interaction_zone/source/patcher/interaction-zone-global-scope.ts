import { Dictionary } from '@kartoffelgames/core';
import { ErrorAllocation } from '../zone/error-allocation.ts';
import { InteractionZone } from '../zone/interaction-zone.ts';

export class InteractionZoneGlobalScope {
    /**
     * Enable zones in the global scope.
     */
    public static enable(pTarget: InteractionZoneGlobalScopeTarget): boolean {
        // Guard to not patch twice.
        if ((<any>pTarget.target).globalPatched) {
            return false;
        }
        (<any>pTarget.target).globalPatched = true;

        const lGlobalScope: Record<string, any> = pTarget.target;

        // Create local patcher instance.
        const lPatcher: InteractionZoneGlobalScope = new InteractionZoneGlobalScope();

        // Patch Promise
        if (pTarget.patches.promise) {
            const lPromiseName: string = pTarget.patches.promise;
            lGlobalScope[lPromiseName] = lPatcher.patchPromise(lGlobalScope[lPromiseName]);
        }

        // Patch EventTarget
        if (pTarget.patches.eventTarget) {
            const lEventTargetName: string = pTarget.patches.eventTarget;
            lGlobalScope[lEventTargetName] = lPatcher.patchEventTarget(lGlobalScope[lEventTargetName]);
        }

        // Patch global scope events.
        lPatcher.patchEvents(lGlobalScope);

        // Patch functions.
        for (const lFunctionName of pTarget.patches.functions ?? []) {
            lGlobalScope[lFunctionName] = lPatcher.patchFunctionCallbacks(lGlobalScope[lFunctionName]);
        }

        // Patch all classes.
        for (const lClassName of pTarget.patches.classes ?? []) {
            let lClass: Function = lGlobalScope[lClassName];

            // Patch class.
            lClass = lPatcher.patchClass(lClass);

            // Patch properties.
            lPatcher.patchEvents(lClass.prototype);

            // TODO: Patch all classes. Might need a little extra code to catch any none inheritanceable classes or so.
            lGlobalScope[lClassName] = lClass;
        }

        return true;
    }

    /**
     * Default settings of the global scope of the runtime.
     */
    public static get globalDefaultTarget(): InteractionZoneGlobalScopeTarget {
        // Create default globalThis target.
        const lTarget = {
            target: globalThis,
            patches: {
                promise: globalThis.Promise?.name,
                eventTarget: globalThis.EventTarget?.name,
                classes: new Array<string>(),
                functions: new Array<string>()
            }
        } satisfies InteractionZoneGlobalScopeTarget;

        // Add all asyncron functions.
        const lAsyncFunctionNames: Array<string | undefined> = [
            globalThis.requestAnimationFrame?.name,
            globalThis.setInterval?.name,
            globalThis.setTimeout?.name
        ];
        lTarget.patches.functions.push(...lAsyncFunctionNames.filter(lClass => !!lClass) as Array<string>);

        // Add all global classes with events.
        const lDomClassNames: Array<string | undefined> = [
            globalThis.XMLHttpRequestEventTarget?.name,
            globalThis.XMLHttpRequest?.name,
            globalThis.Document?.name,
            globalThis.SVGElement?.name,
            globalThis.Element?.name,
            globalThis.HTMLElement?.name,
            globalThis.HTMLMediaElement?.name,
            globalThis.HTMLFrameSetElement?.name,
            globalThis.HTMLBodyElement?.name,
            globalThis.HTMLFrameElement?.name,
            globalThis.HTMLIFrameElement?.name,
            globalThis.HTMLMarqueeElement?.name,
            globalThis.Worker?.name,
            globalThis.IDBRequest?.name,
            globalThis.IDBOpenDBRequest?.name,
            globalThis.IDBDatabase?.name,
            globalThis.IDBTransaction?.name,
            globalThis.WebSocket?.name,
            globalThis.FileReader?.name,
            globalThis.Notification?.name,
            globalThis.RTCPeerConnection?.name
        ];
        lTarget.patches.classes.push(...lDomClassNames.filter(lClass => !!lClass) as Array<string>);

        // Add all global classes with async callbacks.
        const lObserverClassNames: Array<string | undefined> = [
            globalThis.ResizeObserver?.name,
            globalThis.MutationObserver?.name,
            globalThis.IntersectionObserver?.name
        ];
        lTarget.patches.classes.push(...lObserverClassNames.filter(lClass => !!lClass) as Array<string>);

        return lTarget;
    }

    /**
     * Patch function, so function gets always executed inside specified zone.
     * 
     * @param pFunction - Function.
     * @param pZone - Zone in which the interaction should be triggered.
     */
    private callInZone(pFunction: (...pArgs: Array<any>) => any, pZone: InteractionZone): (...pArgs: Array<any>) => any {
        return function (...pArgs: Array<any>) {
            return pZone.execute(() => {
                // Call original function.
                return pFunction(...pArgs);
            });
        };
    }

    /**
     * Patch class and its methods.
     * 
     * @param pConstructor - Class constructor.
     * 
     * @returns patched {@link pConstructor}
     */
    private patchClass(pConstructor: any): any {
        // Patch method callbacks of class.
        this.patchMethods(pConstructor);

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
                        pArgs[lParameterIndex] = lSelf.callInZone(lSelf.patchFunctionCallbacks(lParameter), lCurrentZone);
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
    private patchEventTarget(pEventTargetType: typeof EventTarget): any {
        const lProto = pEventTargetType.prototype;
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
                    lPatchedEventListener = lSelf.callInZone(pCallback, lCurrentZone);
                } else {
                    lPatchedEventListener = lSelf.callInZone(pCallback.handleEvent.bind(pCallback), lCurrentZone);
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

        return pEventTargetType;
    }

    /**
     * Wrap function so all callbacks gets executed inside the zone the function was called.
     * 
     * @param pFunction - Function.
     * @param pInteractionType - Interaction type for function callback end interactions.
     */
    private patchFunctionCallbacks(pFunction: (...pArgs: Array<any>) => any): (...pArgs: Array<any>) => any {
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
                    pArgs[lParameterIndex] = lSelf.callInZone(lSelf.patchFunctionCallbacks(lParameter), lCurrentZone);
                }
            }

            return lCurrentZone.execute(() => {
                return pFunction.call(this, ...pArgs);
            });
        };
    }

    /**
     * Patch class methods parameter.
     * Any callback parameter triggers an interaction.
     * 
     * @param pConstructor - Class constructor.
     * @param pInteractionType - Interaction type for method callback call end interactions.
     */
    private patchMethods(pConstructor: any): void {
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
                lPrototype[lClassMemberName] = this.patchFunctionCallbacks(<any>lValue);
            }
        }
    }

    /**
     * Patch every onproperty of an object.
     * Adds and remove listener as {@link EventTarget} eventlistener. 
     */
    private patchEvents(pObject: object): void {
        // Check for correct object type.
        if (!pObject || !(pObject instanceof EventTarget)) {
            return;
        }

        // Find all on events.
        const lEventNames: Array<string> = new Array<string>();
        for (const lPropertyName of Object.getOwnPropertyNames(pObject)) {
            if (lPropertyName.startsWith('on')) {
                lEventNames.push(lPropertyName.substring(2));
            }
        }

        // Storage to save all patched events by name.
        const lEventFunctions: Dictionary<string, (...pArgs: Array<any>) => any> = new Dictionary<string, (...pArgs: Array<any>) => any>();

        // Patch every event.
        for (const lEventName of lEventNames) {
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
     * Patch promise to keep zone active during asyncron calls and errors.
     * Allocates asyncron errors to zone.
     * 
     * @param pConstructor - Promise constructor.
     */
    private patchPromise(pPromiseType: typeof Promise): any {
        const lOriginalPromiseConstructor: any = pPromiseType;

        // Promise methods needs to be patched. They dont create own promises.
        this.patchMethods(lOriginalPromiseConstructor);

        // Promise executor type definitions.
        type ExecutorResolve<T> = (pResult: T) => void;
        type ExecutorReject = (pResult: any) => void;
        type Executor<T> = (pResolve?: ExecutorResolve<T>, pReject?: ExecutorReject) => any;

        // Patch only the constructor.
        class PatchedPromise<T> extends lOriginalPromiseConstructor {
            public constructor(pExecutor: Executor<T>) {
                super(pExecutor);

                // Set zone of promise.
                ErrorAllocation.allocateAsyncronError(this as any as Promise<unknown>, InteractionZone.current);
            }
        }

        return PatchedPromise;
    }
}

declare global {
    var globalPatched: boolean;
}

type InteractionZoneGlobalScopeTarget = {
    target: object;
    patches: {
        promise?: string;
        eventTarget?: string;
        classes?: Array<string>;
        functions?: Array<string>;
    };
};