import { InteractionResponseType } from '../enum/interaction-response-type.enum';
import { InteractionReason } from '../interaction-reason';
import { InteractionZone, InteractionZoneStack } from '../interaction-zone';
import { IgnoreInteractionDetection } from './ignore-interaction-detection.decorator';

/**
 * Interaction detection proxy. Detects synchron calls and interactions on the proxy object.
 * Creates a nested detection chain on objects and functions.
 * 
 * @internal
 */
@IgnoreInteractionDetection
export class InteractionDetectionProxy<T extends object> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly IGNORED_CLASSES: WeakSet<InteractionDetectionConstructor> = new WeakSet<InteractionDetectionConstructor>();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly ORIGINAL_TO_INTERACTION_MAPPING: WeakMap<object, InteractionDetectionProxy<any>> = new WeakMap<object, InteractionDetectionProxy<any>>();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly PROXY_TO_ORIGINAL_MAPPING: WeakMap<object, object> = new WeakMap<object, object>();


    public static ignoreClass(pConstructor: InteractionDetectionConstructor): void {
        InteractionDetectionProxy.IGNORED_CLASSES.add(pConstructor);
    }

    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * 
     * @param pProxy - Possible InteractionDetectionProxy object.
     */
    private static getOriginal<TValue extends object>(pProxy: TValue): TValue {
        return <TValue>InteractionDetectionProxy.PROXY_TO_ORIGINAL_MAPPING.get(pProxy) ?? pProxy;
    }

    /**
     * Get wrapper object of proxy.
     * 
     * @param pProxy - Proxy object.
     * @returns InteractionDetectionProxy or null if not a InteractionDetectionProxy-proxy.
     */
    private static getWrapper<TValue extends object>(pProxy: TValue): InteractionDetectionProxy<TValue> | undefined {
        // Get original.
        const lOriginal: TValue = InteractionDetectionProxy.getOriginal(pProxy);

        // Get wrapper from original.
        return InteractionDetectionProxy.ORIGINAL_TO_INTERACTION_MAPPING.get(lOriginal);
    }

    private readonly mListenerZonesStack!: Set<InteractionZoneStack>;
    private readonly mProxyObject!: T;

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
     */
    public constructor(pTarget: T) {
        // Use already created wrapper if it exist.
        const lWrapper: InteractionDetectionProxy<T> | undefined = InteractionDetectionProxy.getWrapper(pTarget);
        if (lWrapper) {
            return lWrapper;
        }

        this.mListenerZonesStack = new Set<InteractionZoneStack>();

        // Prevent interaction zones from beeing proxied.
        if (InteractionDetectionProxy.IGNORED_CLASSES.has(Object.getPrototypeOf(pTarget)?.constructor)) {
            this.mProxyObject = pTarget;
        } else {
            // Create new proxy object.
            if (typeof pTarget === 'object') {
                this.mProxyObject = this.createProxyObject(pTarget);
            } else {
                this.mProxyObject = this.createProxyFunction(pTarget);
            }
        }

        // Map proxy with real object and real object to current class.
        InteractionDetectionProxy.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject, pTarget);
        InteractionDetectionProxy.ORIGINAL_TO_INTERACTION_MAPPING.set(pTarget, this);
    }

    /**
     * Attach zone stack that listens for every interaction dispatched.
     * 
     * @param pZoneStack - Interaction zone stack.
     */
    public addListenerZone(pZoneStack: InteractionZone): void {
        this.mListenerZonesStack.add(pZoneStack);
    }

    /**
     * Convert object and function targets into proxies linked to listener zone stacks.
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
        const lNestedProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(pTarget);
        for (const lCallbackStack of this.mListenerZonesStack) {
            lNestedProxy.addListenerZone(lCallbackStack);
        }

        return lNestedProxy.proxy;
    }

    /**
     * Create interaction detection proxy from object.
     * 
     * @param pTarget - Target object.
     */
    private createProxyFunction(pTarget: T): T {
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
                // Dispatch function call start interaction. 
                this.dispatch(InteractionResponseType.FunctionCallStart, this.mProxyObject);

                // Execute function and dispatch interaction event on synchron exceptions.
                try {
                    const lCallableTarget: CallableObject = <CallableObject>pTargetObject;

                    // Call function.. Get original object of "this"-Scope. and call the functionwith it.
                    try {
                        const lOriginalThisObject: object = InteractionDetectionProxy.getOriginal(pThisArgument);
                        const lResult = lCallableTarget.call(lOriginalThisObject, ...pArgumentsList);

                        // Convert potential object to a linked proxy.
                        return this.convertToProxy(lResult);
                    } finally {
                        // Dispatch special InteractionResponseType.NativeFunctionCall.
                        if (/\{\s+\[native code\]/.test(Function.prototype.toString.call(lCallableTarget))) {
                            this.dispatch(InteractionResponseType.NativeFunctionCall, this.mProxyObject);
                        }
                    }
                } catch (pError) {
                    // Dispatch function error interaction and passthrough error.
                    this.dispatch(InteractionResponseType.FunctionCallError, this.mProxyObject);
                    throw pError;
                } finally {
                    // Dispatches interaction end event before exception passthrough.
                    this.dispatch(InteractionResponseType.FunctionCallEnd, this.mProxyObject);
                }
            }
        });

        return lProxyObject;
    }

    /**
     * Create interaction detection proxy from object.
     * 
     * @param pTarget - Target object.
     */
    private createProxyObject(pTarget: T): T {
        // Create proxy handler.
        const lProxyObject: T = new Proxy(pTarget, {
            /**
             * Add property to object.
             * Triggers interaction event.
             * 
             * @param pTargetObject - Target object.
             * @param pPropertyName - Name of property.
             * @param pNewPropertyValue - New value of property.
             */
            set: (pTargetObject: T, pPropertyName: PropertyKey, pNewPropertyValue: any): boolean => {
                // Dispatch set property start interaction. 
                this.dispatch(InteractionResponseType.PropertySetStart, this.mProxyObject, pPropertyName);

                try {
                    // Prevent original pollution by getting original from value.
                    let lPropertyValue: any = pNewPropertyValue;
                    if (lPropertyValue !== null && typeof lPropertyValue === 'object' || typeof lPropertyValue === 'function') {
                        lPropertyValue = InteractionDetectionProxy.getOriginal(lPropertyValue);
                    }

                    // Set value to original target property.
                    return Reflect.set(pTargetObject, pPropertyName, lPropertyValue);
                } catch (pError) {
                    // Dispatch error interaction and passthrough error.
                    this.dispatch(InteractionResponseType.PropertySetError, this.mProxyObject, pPropertyName);
                    throw pError;
                } finally {
                    // Dispatches interaction end event before exception passthrough.
                    this.dispatch(InteractionResponseType.PropertySetEnd, this.mProxyObject, pPropertyName);
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
                // Dispatch get property start interaction. 
                this.dispatch(InteractionResponseType.PropertyGetStart, this.mProxyObject, pPropertyName);

                try {
                    // Get original value.
                    const lResult: any = Reflect.get(pTarget, pPropertyName);

                    // Convert potential object to a linked proxy.
                    return this.convertToProxy(lResult);
                } catch (pError) {
                    // Dispatch error interaction and passthrough error.
                    this.dispatch(InteractionResponseType.PropertyGetError, this.mProxyObject, pPropertyName);
                    throw pError;
                } finally {
                    // Dispatches interaction end event before exception passthrough.
                    this.dispatch(InteractionResponseType.PropertyGetEnd, this.mProxyObject, pPropertyName);
                }
            },

            /**
             * Remove property from object.
             * 
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            deleteProperty: (pTargetObject: T, pPropertyName: PropertyKey): boolean => {
                // Dispatch delete property start interaction. 
                this.dispatch(InteractionResponseType.PropertyDeleteStart, this.mProxyObject, pPropertyName);

                try {
                    // Remove property from original target and return result.
                    return delete (<any>pTargetObject)[pPropertyName];
                } catch (pError) {
                    // Dispatch error interaction and passthrough error.
                    this.dispatch(InteractionResponseType.PropertyDeleteError, this.mProxyObject, pPropertyName);
                    throw pError;
                } finally {
                    // Dispatches interaction end event before exception passthrough.
                    this.dispatch(InteractionResponseType.PropertyDeleteEnd, this.mProxyObject, pPropertyName);
                }
            }
        });

        return lProxyObject;
    }

    /**
     * Dispatch reason to all attached zones and current zone.
     * 
     * @param pInteractionType - What type of interaction.
     * @param pSource - Object wich was interacted with.
     * @param pProperty - Optional change reason property.
     */
    private dispatch(pInteractionType: InteractionResponseType, pSource: object, pProperty?: PropertyKey | undefined): void {
        const lReason: InteractionReason = new InteractionReason(pInteractionType, pSource, pProperty);

        // Dispatch reason to current zone. When current stack does not support trigger, dont trigger attached zone stacks.
        if (!InteractionZone.dispatchInteractionEvent(lReason)) {
            return;
        }

        // Dispatch reason to all attached zones. Ignore current stack but push attached zone.
        for (const lZoneStack of this.mListenerZonesStack) {
            InteractionZone.restore(lZoneStack, () => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });
        }
    }
}

type CallableObject = (...args: Array<any>) => any;

export type InteractionDetectionConstructor = new (...pParameter: Array<any>) => {};