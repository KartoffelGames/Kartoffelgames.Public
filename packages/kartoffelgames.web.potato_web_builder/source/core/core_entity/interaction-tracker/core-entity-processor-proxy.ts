import { InteractionEvent, InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * Interaction detection proxy. Detects synchron calls and interactions on the proxy object.
 * Creates a nested detection chain on objects and functions.
 * 
 * @internal
 */
export class CoreEntityProcessorProxy<T extends object> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly IGNORED_CLASSES: WeakSet<IgnoreableConstructor> = (() => {
        // Create ignore list and add itself first.
        const lIgnoreList = new WeakSet<IgnoreableConstructor>();
        lIgnoreList.add(CoreEntityProcessorProxy);
        lIgnoreList.add(InteractionZone as any as IgnoreableConstructor);
        lIgnoreList.add(InteractionEvent);

        return lIgnoreList;
    })();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly ORIGINAL_TO_INTERACTION_MAPPING: WeakMap<object, CoreEntityProcessorProxy<any>> = new WeakMap<object, CoreEntityProcessorProxy<any>>();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly PROXY_TO_ORIGINAL_MAPPING: WeakMap<object, object> = new WeakMap<object, object>();

    /**
     * Create CoreEntityInteractionData for interaction events.
     * 
     * @param pSource - Source object.
     * @param pProperty - Property.
     * 
     * @returns CoreEntityInteractionData with toString method.
     */
    public static createCoreEntityCreationData(pSource: object, pProperty: PropertyKey | undefined): CoreEntityInteractionData {
        return {
            source: pSource,
            property: pProperty,
            toString: function (): string {
                // Find constructor name of source or default to typeof.
                let lSourceName: string = typeof this.source;
                if ('constructor' in this.source) {
                    lSourceName = this.source.constructor.name;
                }

                // When property is set, output property name.
                if (this.property) {
                    return `[ ${lSourceName} => ${this.property.toString()} ]`;
                }

                return `[ ${lSourceName} ]`;
            }
        };
    }

    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * 
     * @param pProxy - Possible InteractionDetectionProxy object.
     */
    public static getOriginal<TValue extends object>(pProxy: TValue): TValue {
        return <TValue>CoreEntityProcessorProxy.PROXY_TO_ORIGINAL_MAPPING.get(pProxy) ?? pProxy;
    }

    /**
     * Add constructor class to the list of ignored classes.
     * Those classes will not be tracked or altered.
     * 
     * @param pConstructor - Some constructor.
     */
    public static ignoreClass(pConstructor: IgnoreableConstructor): void {
        CoreEntityProcessorProxy.IGNORED_CLASSES.add(pConstructor);
    }

    /**
     * Get wrapper object of proxy.
     * 
     * @param pProxy - Proxy object.
     * @returns InteractionDetectionProxy or null if not a InteractionDetectionProxy-proxy.
     */
    private static getWrapper<TValue extends object>(pProxy: TValue): CoreEntityProcessorProxy<TValue> | undefined {
        // Get original.
        const lOriginal: TValue = CoreEntityProcessorProxy.getOriginal(pProxy);

        // Get wrapper from original.
        return CoreEntityProcessorProxy.ORIGINAL_TO_INTERACTION_MAPPING.get(lOriginal);
    }

    private readonly mListenerZones!: Set<InteractionZone>;
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
        const lWrapper: CoreEntityProcessorProxy<T> | undefined = CoreEntityProcessorProxy.getWrapper(pTarget);
        if (lWrapper) {
            return lWrapper;
        }

        this.mListenerZones = new Set<InteractionZone>();

        // Prevent interaction zones from beeing proxied.
        if (CoreEntityProcessorProxy.IGNORED_CLASSES.has(Object.getPrototypeOf(pTarget)?.constructor)) {
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
        CoreEntityProcessorProxy.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject, pTarget);
        CoreEntityProcessorProxy.ORIGINAL_TO_INTERACTION_MAPPING.set(pTarget, this);
    }

    /**
     * Attach zone that listens for every interaction dispatched.
     * 
     * @param pZone - Interaction zone.
     */
    public addListenerZone(pZone: InteractionZone): void {
        this.mListenerZones.add(pZone);
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
        const lNestedProxy: CoreEntityProcessorProxy<any> = new CoreEntityProcessorProxy(pTarget);
        for (const lCallbackZones of this.mListenerZones) {
            lNestedProxy.addListenerZone(lCallbackZones);
        }

        return lNestedProxy.proxy;
    }

    /**
     * Create interaction detection proxy from object.
     * 
     * @param pTarget - Target object.
     */
    private createProxyFunction(pTarget: T): T {
        const lDetectUntrackableFunction = (pCallableTarget: CallableObject): boolean => {
            // Skip proxy execute and use original this context on native code.
            if (/\{\s+\[native code\]/.test(Function.prototype.toString.call(pCallableTarget))) {
                return true;
            }

            // Special case for event targets.
            if ((<any>EventTarget.prototype)[pCallableTarget.name] === pCallableTarget) {
                return true;
            }

            return false;
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
                const lCallableTarget: CallableObject = <CallableObject>pTargetObject;

                // Function to call with original object.
                const lCallWithOriginalThisContext = (): any => {
                    const lOriginalThisObject: object = CoreEntityProcessorProxy.getOriginal(pThisArgument);

                    try {
                        // Call and convert potential object to a linked proxy.
                        const lResult = lCallableTarget.call(lOriginalThisObject, ...pArgumentsList);
                        return this.convertToProxy(lResult);
                    } finally {
                        // Dispatch special InteractionResponseType.NativeFunctionCall.
                        this.dispatch(UpdateTrigger.UntrackableFunctionCall, this.mProxyObject);
                    }
                };

                // Skip proxy execute and use original this context on native code.
                if (lDetectUntrackableFunction(lCallableTarget)) {
                    return lCallWithOriginalThisContext();
                }

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
                    return lCallWithOriginalThisContext();
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
                try {
                    // Prevent original pollution by getting original from value.
                    let lPropertyValue: any = pNewPropertyValue;
                    if (lPropertyValue !== null && typeof lPropertyValue === 'object' || typeof lPropertyValue === 'function') {
                        lPropertyValue = CoreEntityProcessorProxy.getOriginal(lPropertyValue);
                    }

                    // Set value to original target property.
                    return Reflect.set(pTargetObject, pPropertyName, lPropertyValue);
                } finally {
                    // Dispatches interaction end event before exception passthrough.
                    this.dispatch(UpdateTrigger.PropertySet, this.mProxyObject, pPropertyName);
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
                // Get original value.
                const lResult: any = Reflect.get(pTarget, pPropertyName);

                // Convert potential object to a linked proxy.
                return this.convertToProxy(lResult);
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
                    this.dispatch(UpdateTrigger.PropertyDelete, this.mProxyObject, pPropertyName);
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
    private dispatch(pInteractionType: UpdateTrigger, pSource: object, pProperty?: PropertyKey | undefined): void {
        // Push interaction to current zone.
        const lIsZoneSilent = !InteractionZone.pushInteraction<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, pInteractionType, CoreEntityProcessorProxy.createCoreEntityCreationData(pSource, pProperty));

        //  When current stack does not support trigger, dont trigger attached zone stacks.
        if (lIsZoneSilent) {
            return;
        }

        // Dispatch reason to all attached zones.
        for (const lZone of this.mListenerZones) {
            lZone.execute(() => {
                InteractionZone.pushInteraction<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, pInteractionType, CoreEntityProcessorProxy.createCoreEntityCreationData(pSource, pProperty));
            });
        }
    }
}

type CallableObject = (...args: Array<any>) => any;
type IgnoreableConstructor = new (...pParameter: Array<any>) => {};

export type CoreEntityInteractionData = {
    source: object,
    property?: PropertyKey | undefined;
    toString: () => string;
};

export type CoreEntityInteractionEvent = InteractionEvent<UpdateTrigger, CoreEntityInteractionData>;

