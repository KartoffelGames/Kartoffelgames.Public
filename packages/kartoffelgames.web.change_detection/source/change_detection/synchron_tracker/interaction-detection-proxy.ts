import { ObjectFieldPathPart } from '@kartoffelgames/core.data';
import { ChangeDetection } from '../change-detection';
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
    public static getOriginal<TValue>(pProxy: TValue): TValue {
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

    private mChangeCallback: ChangeCallback | null;
    private readonly mOriginalObject: T;
    private readonly mProxyObject: T;

    /**
     * Get change callback.
     */
    public get onChange(): ChangeCallback | null {
        return this.mChangeCallback;
    }

    /**
     * Set change callback.
     */
    public set onChange(pChangeCallback: ChangeCallback | null) {
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
     * @param pChangeDetectionCallback 
     */
    public constructor(pTarget: T) {
        // Initialize values. Set to null as long as other wrapper was found. 
        this.mChangeCallback = null;
        this.mOriginalObject = <any>null;
        this.mProxyObject = <any>null;

        // Use already created wrapper if it exist.
        const lWrapper: InteractionDetectionProxy<T> | undefined = InteractionDetectionProxy.getWrapper(pTarget);
        if (lWrapper) {
            return lWrapper;
        }

        // Create new wrapper.
        this.mOriginalObject = InteractionDetectionProxy.getOriginal(pTarget);

        // Create new proxy object.
        this.mProxyObject = this.createProxyObject(pTarget);
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
             * @param pTargetObject - Target object.
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            set: (pTargetObject: T, pPropertyName: ObjectFieldPathPart, pNewPropertyValue: any): boolean => {
                const lResult: boolean = Reflect.set(pTargetObject, pPropertyName, pNewPropertyValue);
                this.dispatchChangeEvent(pTargetObject, pPropertyName, <string>Error().stack);
                return lResult;
            },

            /**
             * Get property from object.
             * Returns Proxy element on function or object type.
             * @param pTarget - The target object.
             * @param pProperty - The name or Symbol  of the property to get.
             * @param lReceiver - Either the proxy or an object that inherits from the proxy.
             */
            get: (pTarget, pProperty: ObjectFieldPathPart, _pReceiver) => {
                const lResult: any = Reflect.get(pTarget, pProperty);

                if (typeof lResult === 'object' && lResult !== null || typeof lResult === 'function') {
                    const lProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lResult);
                    lProxy.onChange = (pSourceObject: object, pProperty: ObjectFieldPathPart | ((...pArgs: Array<any>) => any)) => {
                        this.dispatchChangeEvent(pSourceObject, pProperty, <string>Error().stack);
                    };

                    return lProxy.proxy;
                } else {
                    return lResult;
                }
            },

            /**
             * Remove property from object.
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            deleteProperty: (pTargetObject: T, pPropertyName: ObjectFieldPathPart): boolean => {
                Reflect.deleteProperty(pTargetObject, pPropertyName);
                this.dispatchChangeEvent(pTargetObject, pPropertyName, <string>Error().stack);
                return true;
            },

            /**
             * Called on function call.
             * @param pTargetObject - Function that was called.
             * @param pThisArgument - This argument of call.
             * @param pArgumentsList - All arguments of call.
             */
            apply: (pTargetObject: T, pThisArgument: any, pArgumentsList: Array<any>): void => {
                const lOriginalThisObject: object = InteractionDetectionProxy.getOriginal(pThisArgument);
                let lResult: any;
                let lFunctionResult: any;

                // Execute function and dispatch change event on synchron exceptions.
                try {
                    lFunctionResult = (<(...args: Array<any>) => any>pTargetObject).call(lOriginalThisObject, ...pArgumentsList);
                } catch (e) {
                    this.dispatchChangeEvent(lOriginalThisObject, <(...args: Array<any>) => any>pTargetObject, <string>Error().stack);
                    throw e;
                }

                // Get original promise constructor.
                let lPromiseConstructor: typeof Promise = Promise;
                /* istanbul ignore next */
                while (Patcher.ORIGINAL_CLASS_KEY in lPromiseConstructor) {
                    lPromiseConstructor = Reflect.get(lPromiseConstructor, Patcher.ORIGINAL_CLASS_KEY);
                }

                // Override possible system promise. 
                if (lFunctionResult instanceof lPromiseConstructor) {
                    lResult = new globalThis.Promise<any>((pResolve, pReject) => {
                        // Can't call finally because wrong execution queue.
                        // Wrong: await THIS() -> Code after THIS() -> Dispatched Event.
                        // Right: await THIS() -> Dispatched Event -> Code after THIS().
                        lFunctionResult.then((pResult: any) => {
                            this.dispatchChangeEvent(lOriginalThisObject, <(...args: Array<any>) => any>pTargetObject, <string>Error().stack);
                            pResolve(pResult);
                        }).catch((pReason: any) => {
                            this.dispatchChangeEvent(lOriginalThisObject, <(...args: Array<any>) => any>pTargetObject, <string>Error().stack);
                            pReject(pReason);
                        });
                    });
                } else {
                    this.dispatchChangeEvent(lOriginalThisObject, <(...args: Array<any>) => any>pTargetObject, <string>Error().stack);
                    lResult = lFunctionResult;
                }

                return lResult;
            }
        });

        // Map proxy with real object and real object to current class.
        InteractionDetectionProxy.PROXY_TO_ORIGINAL_MAPPING.set(lProxyObject, pTarget);
        InteractionDetectionProxy.ORIGINAL_TO_INTERACTION_MAPPING.set(pTarget, this);

        return lProxyObject;
    }

    /**
     * Trigger change event.
     */
    private dispatchChangeEvent(pSourceObject: object, pProperty: ObjectFieldPathPart | ((...pArgs: Array<any>) => any), pStacktrace: string) {
        // Only trigger if current change detection is not silent.
        if (!ChangeDetection.current.isSilent) {
            this.onChange?.(pSourceObject, pProperty, pStacktrace);
        }
    }
}

type ChangeCallback = (pSourceObject: object, pProperty: ObjectFieldPathPart | ((...pArgs: Array<any>) => any), pStacktrace: string) => void;