import { ChangeDetection } from '../change-detection';
import { ChangeReason } from '../change-reason';
import { DetectionCatchType } from '../enum/detection-catch-type.enum';
import { Patcher } from '../execution_zone/patcher/patcher';

export class InteractionDetectionProxy<T extends object> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly ORIGINAL_TO_INTERACTION_MAPPING: WeakMap<object, object> = new WeakMap<object, object>();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly PROXY_TO_ORIGINAL_MAPPING: WeakMap<object, object> = new WeakMap<object, object>();

    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pProxy - Possible ChangeDetectionProxy object.
     */
    private static getOriginal<TValue>(pProxy: TValue): TValue {
        // None object cant be an proxy.
        if (typeof pProxy !== 'object' && typeof pProxy !== 'function' || pProxy === null) {
            return pProxy;
        }

        return <TValue>InteractionDetectionProxy.PROXY_TO_ORIGINAL_MAPPING.get(pProxy) ?? pProxy;
    }

    /**
     * Get wrapper object of proxy.
     * @param pProxy - Proxy object.
     * @returns InteractionDetectionProxy or null if not a InteractionDetectionProxy-proxy.
     */
    private static getWrapper<TValue extends object>(pProxy: TValue): InteractionDetectionProxy<TValue> | undefined {
        // Get original.
        const lOriginal: TValue = <TValue>InteractionDetectionProxy.PROXY_TO_ORIGINAL_MAPPING.get(pProxy) ?? pProxy;

        // Get wrapper from original.
        return <InteractionDetectionProxy<TValue> | undefined>InteractionDetectionProxy.ORIGINAL_TO_INTERACTION_MAPPING.get(lOriginal);
    }

    private readonly mAllreadySendChangeReasons!: WeakSet<ChangeReason>;
    private mChangeCallback!: ChangeEventListener | null;
    private readonly mProxyObject!: T;

    /**
     * Change callback.
     * // TODO: Able to multi chain with addChangeListener(ChangeEventListener)
     */
    public get onChange(): ChangeEventListener | null {
        return this.mChangeCallback;
    } set onChange(pChangeCallback: ChangeEventListener | null) {
        this.mChangeCallback = pChangeCallback;
    }

    /**
     * Get proxy object for target.
     */
    public get proxy(): T {
        return this.mProxyObject;
    }

    /**
     * Constructor.
     * Create observation
     * @param pTarget - Target object or function.
     */
    public constructor(pTarget: T) {
        // Use already created wrapper if it exist.
        const lWrapper: InteractionDetectionProxy<T> | undefined = InteractionDetectionProxy.getWrapper(pTarget);
        if (lWrapper) {
            return lWrapper;
        }

        // Initialize values.
        this.mAllreadySendChangeReasons = new WeakSet<ChangeReason>();
        this.mChangeCallback = null;

        // Create new proxy object.
        this.mProxyObject = this.createProxyObject(pTarget);

        // Map proxy with real object and real object to current class.
        InteractionDetectionProxy.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject, pTarget);
        InteractionDetectionProxy.ORIGINAL_TO_INTERACTION_MAPPING.set(pTarget, this);
    }

    /**
     * Create change detection proxy from object.
     * @param pTarget - Target object.
     */
    private createProxyObject(pTarget: T): T {
        // Create proxy handler.
        const lProxyObject: T = new Proxy(pTarget, {
            /**
             * Add property to object.
             * Triggers change event.
             * 
             * @param pTargetObject - Target object.
             * @param pPropertyName - Name of property.
             * @param pNewPropertyValue - New value of property.
             */
            set: (pTargetObject: T, pPropertyName: PropertyKey, pNewPropertyValue: any): boolean => {
                // Set value to original target property.
                const lResult: boolean = Reflect.set(pTargetObject, pPropertyName, pNewPropertyValue);

                // Call change event with synchron property change type.
                this.dispatchChangeEvent(new ChangeReason(DetectionCatchType.SyncronProperty, pTargetObject, pPropertyName));

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

                // But when it is a object or a function, than wrap it into another detection proxy and passthrough any change.
                // Creates a dependency chain.
                const lProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lResult);
                lProxy.onChange = (pChangeReason: ChangeReason) => {
                    this.dispatchChangeEvent(pChangeReason);
                };

                return lProxy.proxy;
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

                // Call change event with synchron property change type.
                this.dispatchChangeEvent(new ChangeReason(DetectionCatchType.SyncronProperty, pTargetObject, pPropertyName));

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
                // Execute function and dispatch change event on synchron exceptions.
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
                    // Dispatch change event before exception passthrough.
                    this.dispatchChangeEvent(new ChangeReason(DetectionCatchType.SyncronCall, pTargetObject));
                }

                // Get original promise constructor. // TODO: Possible a better way to cache this information instead of search for every call.
                let lPromiseConstructor: typeof Promise = Promise;
                /* istanbul ignore next */
                while (Patcher.ORIGINAL_CLASS_KEY in lPromiseConstructor) {
                    lPromiseConstructor = Reflect.get(lPromiseConstructor, Patcher.ORIGINAL_CLASS_KEY);
                }

                // Result is not a promise. So nothing needs to be overridden.
                if (!(lFunctionResult instanceof lPromiseConstructor)) {
                    return lFunctionResult;
                }

                // Override possible system promise by waiting for promise result and passthrough exceptions.
                const lOverriddenPromise: any = new globalThis.Promise<any>(async (pResolve, pReject) => {
                    let lPromiseResult: any;
                    let lPromiseError: any;
                    let lPromiseErrorTriggered: boolean = false;

                    // Wait for original promise and save result or exceptions.
                    try {
                        lPromiseResult = await lFunctionResult;
                    } catch (pError) {
                        lPromiseErrorTriggered = true;
                        lPromiseError = pError;
                    } finally {
                        this.dispatchChangeEvent(new ChangeReason(DetectionCatchType.AsnychronPromise, lFunctionResult));
                    }

                    // When an exception occurred reject the promise.
                    if (lPromiseErrorTriggered) {
                        pReject(lPromiseError);
                    } else {
                        pResolve(lPromiseResult);
                    }
                });

                return lOverriddenPromise;
            }
        });

        return lProxyObject;
    }

    /**
     * Trigger change event.
     */
    private dispatchChangeEvent(pChangeReason: ChangeReason) {
        // Prevents the same change reason be dispatched over and over again.
        // Happens when a event target is triggered by a change reason.
        if (this.mAllreadySendChangeReasons.has(pChangeReason)) {
            return;
        }

        this.mAllreadySendChangeReasons.add(pChangeReason);

        // Only trigger if current change detection is not silent. // TODO: Remove silent protection. Why do we need it anyway.
        if (!ChangeDetection.current.isSilent) {
            this.onChange?.(pChangeReason);
        }
    }
}

type CallableObject = (...args: Array<any>) => any;
type ChangeEventListener = (pChangeReason: ChangeReason) => void;