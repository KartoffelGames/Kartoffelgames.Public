import { InteractionZone } from "@kartoffelgames/core-interaction-zone";
import { CoreEntityExtendable, CoreEntityExtendableConstructorParameter } from "./core-entity-extendable.ts";
import { CoreEntityProcessor } from "./core-entity.ts";
import { CoreEntityUpdater } from "./updater/core-entity-updater.ts";

/**
 * Core entity with a internal interaction zone that triggers an update on interaction.
 * Also initializes extensions.
 */
export abstract class CoreEntityUpdateable<TProcessor extends CoreEntityProcessor> extends CoreEntityExtendable<TProcessor> {
    private readonly mUpdater: CoreEntityUpdater;

    /**
     * Updater of module.
     */
    public get updater(): CoreEntityUpdater {
        return this.mUpdater;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Constructor parameter. 
     */
    public constructor(pParameter: CoreEntityUpdateableConstructorParameter<TProcessor>) {
        super(pParameter);

        // Create a new interaction zone for updates.
        const lInteractionZone = InteractionZone.create(`${pParameter.constructor.name}-Update-Zone`);

        this.mUpdater = new CoreEntityUpdater({
            label: pParameter.constructor.name,
            zone: lInteractionZone,
            onUpdate: () => {
                return this.onUpdate();
            }
        });
    }

    /**
     * Call function of processor in updater zone.
     * When the function is not found nothing will be called.
     * 
     * @param pProperyKey - Propertykey of processor leading to a function.
     * @param pParameter - Parameter of function of {@link pProperyKey}.
     * 
     * @returns function call result.
     */
    public override call<TTargetInterface extends object, TProperty extends keyof TTargetInterface>(pProperyKey: TProperty, ...pParameter: PropertyFunctionParameter<TTargetInterface, TProperty>): PropertyFunctionResult<TTargetInterface, TProperty> | null {
        // Call function in update trigger zone.
        return this.mUpdater.executeInZone(() => {
            return super.call(pProperyKey, ...pParameter);
        });
    }

    /**
     * Deconstruct update zone.
     */
    public override deconstruct(): void {
        this.mUpdater.deconstruct();
        super.deconstruct();
    }

    /**
     * Create module object.
     */
    protected override createProcessor(): TProcessor {
        // Create processor in update trigger zone.
        return this.mUpdater.executeInZone(() => {
            return super.createProcessor();
        });
    }

    /**
     * Called on update.
     * 
     * @returns true when a update happened and false when nothing was updated.
     */
    protected abstract onUpdate(): boolean;
}

// Call types.
type PropertyFunction<TProcessor extends object, TProperty extends keyof TProcessor> = TProcessor[TProperty] extends ((...pArgs: Array<any>) => any) ? TProcessor[TProperty] : never;
type PropertyFunctionResult<TProcessor extends object, TProperty extends keyof TProcessor> = ReturnType<PropertyFunction<TProcessor, TProperty>>;
type PropertyFunctionParameter<TProcessor extends object, TProperty extends keyof TProcessor> = Parameters<PropertyFunction<TProcessor, TProperty>>;

/*
 * Constructor parameter.
 */
export type CoreEntityUpdateableConstructorParameter<TProcessor extends CoreEntityProcessor> = CoreEntityExtendableConstructorParameter<TProcessor>;
