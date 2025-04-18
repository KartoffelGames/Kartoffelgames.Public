import { Dictionary } from '@kartoffelgames/core';
import { InteractionZoneErrorAllocation } from './interaction-zone-error-allocation.ts';
import { InteractionZone } from './interaction-zone.ts';

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

        // Requirement patches. 
        {
            // Patch promise.
            const lPromiseName: string = pTarget.patches.requirements.promise;
            lGlobalScope[lPromiseName] = lPatcher.patchPromise(lGlobalScope[lPromiseName]);

            // Patch event target.
            const lEventTargetName: string = pTarget.patches.requirements.eventTarget;
            lGlobalScope[lEventTargetName] = lPatcher.patchEventTarget(lGlobalScope[lEventTargetName]);
        }

        // Patch global scope events.
        lPatcher.patchOnEvents(lGlobalScope);

        // Patch functions.
        for (const lFunctionName of pTarget.patches.functions ?? []) {
            lGlobalScope[lFunctionName] = lPatcher.patchFunctionCallbacks(lGlobalScope[lFunctionName]);
        }

        // Patch classes.
        if(!pTarget.patches.classes) {
            return true;
        }

        // Patch all class callbacks.
        for (const lClassName of pTarget.patches.classes.callback ?? []) {
            let lClass: any = lGlobalScope[lClassName];

            // Patch class.
            lClass = lPatcher.patchClass(lClass);

            // Patch all classes. Might need a little extra code to catch any none inheritanceable classes or so.
            lGlobalScope[lClassName] = lClass;
        }

        // Patch all class on events.
        for (const lClassName of pTarget.patches.classes.eventTargets ?? []) {
            const lClass: any = lGlobalScope[lClassName];

            // Patch properties.
            lPatcher.patchOnEvents(lClass.prototype);
        }

        return true;
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
        // Skip undefined or not found constructor.
        if (typeof pConstructor !== 'function') {
            return pConstructor;
        }

        const lSelf: this = this;

        // Extend class to path constructor.
        const lPatchedClass = class extends pConstructor {
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

        // Patch method callbacks of class.
        this.patchMethods(lPatchedClass);

        return lPatchedClass;
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
        Object.defineProperty(lProto, 'addEventListener', {
            configurable: false,
            writable: false,
            value: function (pType: string, pCallback: EventListenerOrEventListenerObject | null, pOptions?: boolean | AddEventListenerOptions | undefined): void {
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
            }
        });

        // Patch remove event listener
        Object.defineProperty(lProto, 'removeEventListener', {
            configurable: false,
            writable: false,
            value: function (pType: string, pCallback: EventListenerOrEventListenerObject, pOptions?: EventListenerOptions | boolean): void {
                // When event listener is not a function. Let the browser decide the error.
                if (pCallback === null || typeof pCallback !== 'function' && !(typeof pCallback === 'object' && 'handleEvent' in pCallback)) {
                    lOriginalRemoveEventListener.call(this, pType, pCallback, pOptions);
                    return;
                }

                // Get patched version of event listener the callback has no patched version, use the original.
                const lUsedEventListener: EventListenerOrEventListenerObject = lOriginalListener.get(pCallback) ?? pCallback;

                // Remove event listener, eighter patched or original, from event target.
                lOriginalRemoveEventListener.call(this, pType, lUsedEventListener, pOptions);
            }
        });

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

        const lFindFunctionProperties = (pTargetObject: any): Dictionary<string, PropertyDescriptor> => {
            // Skip search on base class.
            if (pTargetObject === null || pTargetObject.constructor === Object) {
                return new Dictionary<string, PropertyDescriptor>();
            }

            const lFunctionProperties: Dictionary<string, PropertyDescriptor> = new Dictionary<string, PropertyDescriptor>();
            for (const lPropertyName of Object.getOwnPropertyNames(pTargetObject)) {
                // Skip constructor.
                if (lPropertyName === 'constructor') {
                    continue;
                }

                // Read property desciptor.
                const lPropertyDescriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(pTargetObject, lPropertyName);
                if (!lPropertyDescriptor) {
                    continue; // Skip if no property descriptor found.
                }

                // Skip if not function.
                if (typeof lPropertyDescriptor.value !== 'function') {
                    continue;
                }

                // Skip all properties that are not starting with on.
                lFunctionProperties.set(lPropertyName, lPropertyDescriptor);
            }

            // Search all function properties in inheritance chain.
            for (const [lPropertyName, lPropertyDescriptor] of lFindFunctionProperties(Object.getPrototypeOf(pTargetObject))) {
                // Prevent overriding of properties that are already overridden.
                if (lFunctionProperties.has(lPropertyName)) {
                    continue; // Skip if already defined.
                }

                lFunctionProperties.set(lPropertyName, lPropertyDescriptor);
            }

            return lFunctionProperties;
        };

        const lPrototype = pConstructor.prototype;
        const lMethods = lFindFunctionProperties(lPrototype);

        // For each prototype property.
        for (const [lClassMemberName, lClassMemberDescriptor] of lMethods) {
            // If the descriptor is not configurable skip the method patch.
            if (!lClassMemberDescriptor.configurable) {
                continue;
            }

            // Patch function of decriptor.
            lClassMemberDescriptor.value = this.patchFunctionCallbacks(lClassMemberDescriptor.value);

            // Set property descriptor to class prototype.
            Object.defineProperty(lPrototype, lClassMemberName, lClassMemberDescriptor);
        }
    }

    /**
     * Patch every onproperty of an object.
     * Adds and remove listener as {@link EventTarget} eventlistener. 
     */
    private patchOnEvents(pObject: object): void {
        // Check for correct object type.
        if (!pObject || !(pObject instanceof EventTarget)) {
            return;
        }

        // Recursive function to find all on properties of the object.
        const lFindOnProperties = (pTargetObject: any): Dictionary<string, PropertyDescriptor> => {
            // Skip search on base class.
            if (pTargetObject === null) {
                return new Dictionary<string, PropertyDescriptor>();
            }

            const lOnProperties: Dictionary<string, PropertyDescriptor> = new Dictionary<string, PropertyDescriptor>();
            for (const lPropertyName of Object.getOwnPropertyNames(pTargetObject)) {
                // Skip all properties that are not starting with on.
                if (!lPropertyName.startsWith('on')) {
                    continue;
                }

                // Read property desciptor.
                const lPropertyDescriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(pTargetObject, lPropertyName);
                if (!lPropertyDescriptor) {
                    continue; // Skip if no property descriptor found.
                }

                // Skip functions.
                if (typeof lPropertyDescriptor.value === 'function') {
                    continue;
                }

                // Skip all properties that are not starting with on.
                lOnProperties.set(lPropertyName.substring(2), lPropertyDescriptor);
            }

            // Search all on properties in inheritance chain.
            for (const [lPropertyName, lPropertyDescriptor] of lFindOnProperties(Object.getPrototypeOf(pTargetObject))) {
                // Prevent overriding of properties that are already overridden.
                if (lOnProperties.has(lPropertyName)) {
                    continue;
                }

                lOnProperties.set(lPropertyName, lPropertyDescriptor);
            }

            return lOnProperties;
        };

        // Find all on events. Desinct list by swip and swap some cozzy sets.
        const lEventNames: Dictionary<string, PropertyDescriptor> = lFindOnProperties(pObject);

        // Patch every event.
        for (const [lEventName, lDescriptorInformation] of lEventNames) {
            // If the descriptor is not configurable skip the property patch.
            if (!lDescriptorInformation.configurable) {
                continue;
            }

            const lPropertyName: string = `on${lEventName}`;

            // Remove set value and writable flag to be able to add set and get.
            delete lDescriptorInformation.writable;
            delete lDescriptorInformation.value;

            // Storage to save all patched events by name.
            const lEventFunctions: WeakMap<EventTarget, EventListener> = new WeakMap<EventTarget, EventListener>();

            // Override set behaviour.
            lDescriptorInformation.set = function (this: EventTarget, pEventListener: EventListener): void {
                // Remove current added listener can be null.
                const lCurrentValue: unknown = lEventFunctions.get(this);
                if (typeof lCurrentValue === 'function' || typeof lCurrentValue === 'object') {
                    this.removeEventListener(lEventName, lCurrentValue as EventListener);
                }

                // Save listener for event type. No need to patch, addEventListener should be patched anyway.
                lEventFunctions.set(this, pEventListener);

                // Add new listener if defined.
                if (typeof pEventListener === 'function' || typeof pEventListener === 'object') {
                    this.addEventListener(lEventName, pEventListener);
                }
            };

            // Override get gebaviour.
            lDescriptorInformation.get = function (this: EventTarget): any {
                // Return set listener, or what ever value was set.
                return lEventFunctions.get(this);
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

        // Promise executor type definitions.
        type ExecutorResolve<T> = (pResult: T) => void;
        type ExecutorReject = (pResult: any) => void;
        type Executor<T> = (pResolve?: ExecutorResolve<T>, pReject?: ExecutorReject) => any;

        // Patch only the constructor.
        class PatchedPromise<T> extends lOriginalPromiseConstructor {
            public constructor(pExecutor: Executor<T>) {
                super(pExecutor);

                // Set zone of promise.
                InteractionZoneErrorAllocation.allocateAsyncronError(this as any as Promise<unknown>, InteractionZone.current);
            }
        }

        // Promise methods needs to be patched. They dont create own promises.
        this.patchMethods(PatchedPromise);

        return PatchedPromise;
    }
}

export type InteractionZoneGlobalScopeTarget = {
    target: object;
    patches: {
        requirements: {
            promise: string;
            eventTarget: string;
        };
        classes?: {
            callback?: Array<string>;
            eventTargets?: Array<string>;
        };
        functions?: Array<string>;
    };
};