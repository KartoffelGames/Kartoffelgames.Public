import { InteractionResponseType } from '../enum/interaction-response-type.enum';
import { InteractionReason } from '../interaction-reason';
import { InteractionZone } from '../interaction-zone';

/**
 * Interaction detection proxy. Detects synchron calls and interactions on the proxy object.
 * Creates a nested detection chain on objects and functions.
 * 
 * @internal
 */
export class InteractionDetectionProxy<T extends object> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly ORIGINAL_TO_INTERACTION_MAPPING: WeakMap<object, object> = new WeakMap<object, object>();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly PROXY_TO_ORIGINAL_MAPPING: WeakMap<object, object> = new WeakMap<object, object>();

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
        return <InteractionDetectionProxy<TValue> | undefined>InteractionDetectionProxy.ORIGINAL_TO_INTERACTION_MAPPING.get(lOriginal);
    }

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

        // Create new proxy object.
        this.mProxyObject = this.createProxyObject(pTarget);

        // Map proxy with real object and real object to current class.
        InteractionDetectionProxy.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject, pTarget);
        InteractionDetectionProxy.ORIGINAL_TO_INTERACTION_MAPPING.set(pTarget, this);
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
                // Set value to original target property.
                const lResult: boolean = Reflect.set(pTargetObject, pPropertyName, pNewPropertyValue);

                // Call interaction event with synchron property response type.
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.SyncronProperty, this.mProxyObject, pPropertyName));

                return lResult;
            },

            /**
             * Get property from object.
             * Returns Proxy element on function or object types.
             * 
             * @param pTarget - The target object.
             * @param pProperty - The name or Symbol  of the property to get.
             * @param lReceiver - Either the proxy or an object that inherits from the proxy.
             */
            get: (pTarget, pProperty: PropertyKey, _pReceiver) => {
                // Get original value.
                const lResult: any = Reflect.get(pTarget, pProperty);

                // When the value is not a object or a function these values can not be observed.
                if (lResult === null || typeof lResult !== 'object' && typeof lResult !== 'function') {
                    return lResult;
                }

                // But when it is a object or a function, than wrap it into another detection proxy and passthrough any interaction.
                return new InteractionDetectionProxy(lResult).proxy;
            },

            /**
             * Remove property from object.
             * 
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            deleteProperty: (pTargetObject: T, pPropertyName: PropertyKey): boolean => {
                // Remove property from original target and save result.
                const lPropertyExisted: boolean = Reflect.deleteProperty(pTargetObject, pPropertyName);

                // Call interaction event with synchron property interaction type.
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.SyncronProperty, this.mProxyObject, pPropertyName));

                // Passthrough original remove result.
                return lPropertyExisted;
            },

            /**
             * Called on function call.
             * 
             * @param pTargetObject - Function that was called.
             * @param pThisArgument - This argument of call.
             * @param pArgumentsList - All arguments of call.
             */
            apply: (pTargetObject: T, pThisArgument: any, pArgumentsList: Array<any>): void => {
                // Execute function and dispatch interaction event on synchron exceptions.
                let lFunctionResult: any;
                try {
                    lFunctionResult = (<CallableObject>pTargetObject).call(pThisArgument, ...pArgumentsList);
                } catch (pError) {
                    // Rethrow error when it is not related to any type errors.
                    // Type errors occure when js internal functions cant be called with a proxy.
                    if (!(pError instanceof TypeError)) {
                        throw pError;
                    }

                    // Get original object of "this"-Scope. and call the function again with it.
                    const lOriginalThisObject: object = InteractionDetectionProxy.getOriginal(pThisArgument);
                    lFunctionResult = (<CallableObject>pTargetObject).call(lOriginalThisObject, ...pArgumentsList);
                } finally {
                    // Dispatch interaction event before exception passthrough.
                    InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.SyncronCall, this.mProxyObject));
                }

                return lFunctionResult;
            }
        });

        return lProxyObject;
    }
}

type CallableObject = (...args: Array<any>) => any;