import { ComponentStateType } from "./component-state-type.enum.ts";

/**
 * Interaction detection proxy. Detects synchron calls and interactions on the proxy object.
 * Creates a nested detection chain on objects and functions.
 * 
 * @internal
 */
export class ComponentStateProxy<T extends object> {
    /**
     * Map of original object to proxy wrapper object.
     */
    private static readonly ORIGINAL_TO_INTERACTION_MAPPING: WeakMap<object, ComponentStateProxy<any>> = new WeakMap<object, ComponentStateProxy<any>>();

    /**
     * Map of proxy object to original object.
     */
    private static readonly PROXY_TO_ORIGINAL_MAPPING: WeakMap<object, object> = new WeakMap<object, object>();

    /**
     * List of untraceable functions. Those functions can not be tracked but report a special interaction type.
     */
    private static readonly UNTRACEABLE_FUNCTION_UPDATE_TRIGGER: WeakMap<Function, ComponentStateType> = (() => {
        const lUntraceableFunctionList = new WeakMap<Function, ComponentStateType>();
        
        // Array
        lUntraceableFunctionList.set(Array.prototype.fill, ComponentStateType.set);
        lUntraceableFunctionList.set(Array.prototype.pop, ComponentStateType.get);
        lUntraceableFunctionList.set(Array.prototype.push, ComponentStateType.set);
        lUntraceableFunctionList.set(Array.prototype.shift, ComponentStateType.get);
        lUntraceableFunctionList.set(Array.prototype.unshift, ComponentStateType.set);
        lUntraceableFunctionList.set(Array.prototype.splice, ComponentStateType.set);
        lUntraceableFunctionList.set(Array.prototype.reverse, ComponentStateType.set);
        lUntraceableFunctionList.set(Array.prototype.sort, ComponentStateType.set);
        lUntraceableFunctionList.set(Array.prototype.concat, ComponentStateType.set);

        // Map
        lUntraceableFunctionList.set(Map.prototype.clear, ComponentStateType.set);
        lUntraceableFunctionList.set(Map.prototype.delete, ComponentStateType.set);
        lUntraceableFunctionList.set(Map.prototype.set, ComponentStateType.set);

        // Set
        lUntraceableFunctionList.set(Set.prototype.clear, ComponentStateType.set);
        lUntraceableFunctionList.set(Set.prototype.delete, ComponentStateType.set);
        lUntraceableFunctionList.set(Set.prototype.add, ComponentStateType.set);

        return lUntraceableFunctionList;
    })();

    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * 
     * @param pProxy - Possible InteractionDetectionProxy object.
     */
    private static getOriginal<TValue extends object>(pProxy: TValue): TValue {
        return <TValue>ComponentStateProxy.PROXY_TO_ORIGINAL_MAPPING.get(pProxy) ?? pProxy;
    }

    /**
     * Get wrapper object of proxy.
     * 
     * @param pProxy - Proxy object.
     * @returns InteractionDetectionProxy or null if not a InteractionDetectionProxy-proxy.
     */
    private static getWrapper<TValue extends object>(pProxy: TValue): ComponentStateProxy<TValue> | undefined {
        // Get original.
        const lOriginal: TValue = ComponentStateProxy.getOriginal(pProxy);

        // Get wrapper from original.
        return ComponentStateProxy.ORIGINAL_TO_INTERACTION_MAPPING.get(lOriginal);
    }

    private readonly mProxyObject!: T;
    private readonly mStateChangeCallback!: ComponentStateChangeCallback;

    /**
     * Get proxy object for target.
     */
    public get proxy(): T {
        return this.mProxyObject;
    }

    /**
     * Constructor.
     * Creates observation proxy object.
     * 
     * @param pTarget - Target object or function.
     * @param pStateChangeCallback - Callback function for state changes.
     */
    public constructor(pTarget: T, pStateChangeCallback: ComponentStateChangeCallback) {
        // Use already created wrapper if it exist.
        const lWrapper: ComponentStateProxy<T> | undefined = ComponentStateProxy.getWrapper(pTarget);
        if (lWrapper) {
            return lWrapper;
        }

        // Create new proxy object.
        this.mProxyObject = this.createProxyObject(pTarget);
        this.mStateChangeCallback = pStateChangeCallback;

        // Map proxy with real object and real object to current class.
        ComponentStateProxy.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject, pTarget);
        ComponentStateProxy.ORIGINAL_TO_INTERACTION_MAPPING.set(pTarget, this);
    }

    /**
     * Convert object and function targets into proxies linked to listener zones.
     * 
     * @param pTarget - Target value.
     *  
     * @returns InteractionDetectionProxy object. 
     */
    private convertToProxy<T>(pTarget: T): T {
        // When the value is not a object or a function these values can not be observed.
        if (pTarget === null || typeof pTarget !== 'object' && typeof pTarget !== 'function') {
            return pTarget;
        }

        // But when it is a object or a function, than wrap it into another detection proxy and passthrough any interaction.
        return new ComponentStateProxy(pTarget, this.mStateChangeCallback).proxy;
    }

    /**
     * Create interaction detection proxy from object.
     * 
     * @param pTarget - Target object.
     */
    private createProxyObject(pTarget: T): T {
        // Function to call with original object.
        const lCallWithOriginalThisContext = (pCallableTarget: CallableObject, pThisArgument: any, pArgumentsList: Array<any>): any => {
            const lOriginalThisObject: object = ComponentStateProxy.getOriginal(pThisArgument);
            try {
                // Call and convert potential object to a linked proxy.
                const lResult = pCallableTarget.call(lOriginalThisObject, ...pArgumentsList);
                return this.convertToProxy(lResult);
            } finally {
                // Dispatch special set state type.
                if (ComponentStateProxy.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(pCallableTarget)) {
                    // Dispatch mapped UpdateTrigger for some untraceable functions. 
                    this.dispatch(ComponentStateProxy.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(pCallableTarget)!);
                }
            }
        };

        // Create proxy handler.
        const lProxyObject: T = new Proxy(pTarget, {
            /**
             * Called on function call.
             * 
             * @param pTargetObject - Function that was called.
             * @param pThisArgument - This argument of call.
             * @param pArgumentsList - All arguments of call.
             */
            apply: (pTargetObject: T, pThisArgument: any, pArgumentsList: Array<any>): void => {
                // Type convert to callable object.
                const lCallableTarget: CallableObject = <CallableObject>pTargetObject;

                // Only on non native calls, try to use proxied this context.
                try {
                    // Call function and convert potential object to a linked proxy.
                    const lResult = lCallableTarget.call(pThisArgument, ...pArgumentsList);
                    return this.convertToProxy(lResult);
                } catch (pError) {
                    // Only type errors are capable to be fixed with the original object.
                    if (!(pError instanceof TypeError)) {
                        throw pError;
                    }

                    // Read original object.
                    return lCallWithOriginalThisContext(lCallableTarget, pThisArgument, pArgumentsList);
                }
            },

            /**
             * Add property to object.
             * Triggers interaction event.
             * 
             * @param pTargetObject - Target object.
             * @param pPropertyName - Name of property.
             * @param pNewPropertyValue - New value of property.
             */
            set: (pTargetObject: T, pPropertyName: PropertyKey, pNewPropertyValue: any): boolean => {
                try {
                    // Prevent original pollution by getting original from value.
                    let lPropertyValue: any = pNewPropertyValue;
                    if (lPropertyValue !== null && typeof lPropertyValue === 'object' || typeof lPropertyValue === 'function') {
                        lPropertyValue = ComponentStateProxy.getOriginal(lPropertyValue);
                    }

                    // Set value to original target property.
                    return Reflect.set(pTargetObject, pPropertyName, lPropertyValue);
                } finally {
                    // Dispatches interaction end event before exception passthrough.
                    this.dispatch(ComponentStateType.set);
                }
            },

            /**
             * Get property from object.
             * Returns Proxy element on function or object types.
             * 
             * @param pTarget - The target object.
             * @param pPropertyName - The name or Symbol  of the property to get.
             * @param lReceiver - Either the proxy or an object that inherits from the proxy.
             */
            get: (pTarget, pPropertyName: PropertyKey, _pReceiver) => {
                try {
                    // Convert potential object to a linked proxy.
                    return this.convertToProxy(Reflect.get(pTarget, pPropertyName));
                } finally {
                    // Send state change to callback.
                    this.dispatch(ComponentStateType.get);
                }
            },

            /**
             * Remove property from object.
             * 
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            deleteProperty: (pTargetObject: T, pPropertyName: PropertyKey): boolean => {
                try {
                    // Remove property from original target and return result.
                    return delete (<any>pTargetObject)[pPropertyName];
                } finally {
                    // Dispatches interaction end event before exception passthrough.
                    this.dispatch(ComponentStateType.set);
                }
            }
        });

        return lProxyObject;
    }

    /**
     * Dispatch state type to callback.
     * 
     * @param pComponentStateType - What type of state was changed.
     */
    private dispatch(pComponentStateType: ComponentStateType): void {
        // Send state type to callback.
        this.mStateChangeCallback(pComponentStateType);
    }
}

type CallableObject = (...args: Array<any>) => any;

export type ComponentStateChangeCallback = (pInteractionType: ComponentStateType) => void;

