import { ClassAccessorDecorator, Exception } from "@kartoffelgames/core";
import { InteractionZone } from "@kartoffelgames/core-interaction-zone";
import { ComponentStateType } from "./component-state-type.enum.ts";
import { ComponentStateProxy } from "./component-state-proxy.ts";
import { ComponentProcessor } from "../../component/component.ts";

/**
 * State of a component.
 * On value get links the interaction zones so they can be updated on set.
 */
export class ComponentState<TValue = unknown> {
    /**
     * AtScript. Creates a component state decorator for a property.
     * @param pIdChildName - Name of id child.
     */
    public static State<TValue>(pConfiguration?: Partial<ComponentStateConfiguration>): ClassAccessorDecorator<any, TValue> {
        return (_pTarget: ClassAccessorDecoratorTarget<any, TValue>, pContext: ClassAccessorDecoratorContext): ClassAccessorDecoratorResult<any, TValue> => {
            // Check if real decorator on static property.
            if (pContext.static) {
                throw new Exception('Event target is not for a static property.', ComponentState);
            }

            // Create internal component state.
            let lComponentState: ComponentState<TValue | undefined>;
            const lInitComponentState = (pValue: any) => {
                lComponentState = new ComponentState<TValue>(pValue, pConfiguration);
            };

            // Define getter accessor that returns id child.
            return {
                set(this: ComponentProcessor, pValue: TValue) {
                    // When the state is not initialized, initialize it with the set value.
                    if (!lComponentState) {
                        lInitComponentState(pValue);
                    } else {
                        lComponentState.set(pValue);
                    }
                },
                get(this: ComponentProcessor) {
                    // When the state is not initialized, initialize it with undefined.
                    if (!lComponentState) {
                        lInitComponentState(undefined);
                    }

                    return lComponentState.get()!;
                }
            };
        };
    }

    private mLinkedZones: Set<InteractionZone>;
    private mLinkedZonesArray: Array<InteractionZone>;
    private readonly mConfiguration: ComponentStateConfiguration;
    private mValue: TValue;

    public constructor(pValue: TValue, pConfiguration?: Partial<ComponentStateConfiguration>) {
        // Init linked zones. Keep a seperate array for faster iteration on set, as the get can be called more often than set.
        this.mLinkedZones = new Set<InteractionZone>();
        this.mLinkedZonesArray = new Array<InteractionZone>();

        // Set configuration with default values.
        this.mConfiguration = {
            complexValue: pConfiguration?.complexValue ?? false,
            proxy: pConfiguration?.proxy ?? false,
        };

        // Implement proxy for complex values.
        if (this.mConfiguration.proxy) {
            // A proxy value must be a object.
            if (typeof pValue !== 'object' || pValue === null) {
                throw new Exception('Proxied component state value must be an object.', this);
            }

            // Create proxy for value. The proxy will dispatch changes on set and link zones on get.
            this.mValue = new ComponentStateProxy(pValue, (pStateType: ComponentStateType) => {
                switch (pStateType) {
                    case ComponentStateType.set: return this.dispatchChange();
                    case ComponentStateType.get: return this.linkCurrentZone();
                }
            }).proxy;
        } else {
            // Set native value
            this.mValue = pValue;
        }
    }

    /**
     * Get the state value.
     * 
     * @returns State value.
     */
    public get(): TValue {
        // Link current interaction zone to the state.
        this.linkCurrentZone();

        return this.mValue;
    }

    /**
     * Set the state value.
     * When the value is changed, all linked zones are marked as dirty.
     * 
     * @param pValue - New state value.
     */
    public set(pValue: TValue): void {
        // When proxy is enabled, the set method is not used, as changes on the value are detected by the proxy and not by reference.
        if (this.mConfiguration.proxy) {
            throw new Exception('Proxy is not implemented yet.', this);
        }

        // When the value is not complex and did not change, do nothing.
        if (!this.mConfiguration.complexValue && this.mValue === pValue) {
            return;
        }

        // Set new value.
        this.mValue = pValue;

        // Mark linked zones as dirty.
        this.dispatchChange();
    }

    /**
     * Dispatch change to all linked zones.
     */
    private dispatchChange(): void {
        // Create interaction zone update event for each linked zone.
        for (const lZone of this.mLinkedZonesArray) {
            lZone.pushInteraction(ComponentStateType.set, this);
        }
    }

    /**
     * Link the current interaction zone to the state.
     */
    private linkCurrentZone(): void {
        const lCurrentZone = InteractionZone.current;

        // When there is a current zone, link it to the state.
        if (!this.mLinkedZones.has(lCurrentZone)) {
            this.mLinkedZones.add(lCurrentZone);
            this.mLinkedZonesArray.push(lCurrentZone);
        }
    }
}

type ComponentStateConfiguration = {
    /**
     * When the value is complex, it is not checked for changes by reference and is always treated as changed.
     */
    complexValue: boolean;

    /**
     * Creates and links a proxy to the value. The proxy is used to detect changes on complex values, that are not detected by reference.
     * Prevents the set method from being used, as changes on the value are detected by the proxy and not by reference.
     */
    proxy: boolean;
};