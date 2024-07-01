import { Dictionary, Exception, IDeconstructable, Stack } from '@kartoffelgames/core';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { CoreEntityUpdater } from './core-entity-updater';
import { PwbDebugLogLevel } from '../configuration/pwb-configuration';
import { Processor } from './processor';
import { CoreEntityProcessorProxy } from './interaction-tracker/core-entity-processor-proxy';

export abstract class CoreEntity<TProcessor extends Processor = Processor> implements IDeconstructable {
    private readonly mHooks: CoreEntityHooks<TProcessor>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mIsLocked: boolean;
    private mIsSetup: boolean;
    private mProcessor: TProcessor | null;
    private readonly mProcessorConstructor: CoreEntityProcessorConstructor<TProcessor>;
    private readonly mTrackChanges: boolean;
    private readonly mUpdater: CoreEntityUpdater;

    /**
     * If processor is created or not.
     */
    public get isProcessorCreated(): boolean {
        return !!this.mProcessor;
    }

    /**
     * Processor of module.
     * Initialize processor when it hasn't already.
     */
    public get processor(): TProcessor {
        // Forbid creation of processor when the core entity is not set up.
        if (!this.mIsSetup) {
            throw new Exception('Processor can not be build before calling setup.', this);
        }

        // Create processor when it is not created.
        if (!this.isProcessorCreated) {
            this.mProcessor = this.createProcessor();
        }

        return this.mProcessor!;
    }

    /**
     * Processor constructor of module.
     */
    public get processorConstructor(): CoreEntityProcessorConstructor<TProcessor> {
        return this.mProcessorConstructor;
    }

    /**
     * Constructor.
     * Takes over parent injections.
     * 
     * @param pProcessorConstructor - Processor constructor of user entity.
     * @param pParent - Parent of user entity.
     */
    public constructor(pParameter: CoreEntityConstructorParameter<TProcessor>) {
        // Validate processor constructor.
        if (!(pParameter.constructor.prototype instanceof Processor)) {
            throw new Exception(`Constructor "${pParameter.constructor.name}" does not extend`, this);
        }

        this.mProcessorConstructor = pParameter.constructor;

        // Set empty defaults.
        this.mProcessor = null;
        this.mIsLocked = false;
        this.mIsSetup = false;

        // Init lists and config.
        this.mTrackChanges = pParameter.trackConstructorChanges;
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mHooks = {
            create: new Stack<CoreEntityProcessorCreationHook<TProcessor>>(),
            setup: new Stack<CoreEntitySetupHook>()
        };

        // Passthrough parents entity injections.
        if (pParameter.parent) {
            for (const [lTarget, lValue] of pParameter.parent.mInjections.entries()) {
                this.setProcessorAttributes(lTarget, lValue);
            }
        }

        // Create new updater for every component entity.
        this.mUpdater = new CoreEntityUpdater({
            label: pParameter.constructor.name,
            debugLevel: pParameter.debugLevel,
            isolate: !!pParameter.isolate,
            trigger: pParameter.trigger,
            parent: pParameter.parent?.mUpdater,
            onUpdate: async () => {
                return this.onUpdate();
            }
        });
    }

    /**
     * Call function of processor in updater zone.
     * When the function is not found nothing will be called.
     * 
     * @param pProperyKey - Propertykey of processor leading to a function.
     * @param pForceCreate - Force create processor when it is not already created. 
     * @param pParameter - Parameter of function of {@link pProperyKey}.
     * 
     * 
     * @returns function call result or null when processor is not created and {@link pForceCreate} is not set.
     */
    public call<TTargetInterface extends object, TProperty extends keyof TTargetInterface>(pProperyKey: TProperty, pForceCreate: boolean, ...pParameter: PropertyFunctionParameter<TTargetInterface, TProperty>): PropertyFunctionResult<TTargetInterface, TProperty> | null {
        // Do not create processor when not force created.
        if (!this.isProcessorCreated && !pForceCreate) {
            return null;
        }

        // Try to get property function.
        const lPropertyFunction: ((...pArgs: Array<any>) => any) | undefined = Reflect.get(this.processor, pProperyKey) as ((...pArgs: Array<any>) => any) | undefined;
        if (typeof lPropertyFunction !== 'function') {
            return null;
        }

        // Call function in update trigger zone.
        return this.mUpdater.switchToUpdateZone(() => {
            return lPropertyFunction.call(this.processor, pParameter);
        });
    }

    /**
     * Deconstruct update zone.
     */
    public deconstruct(): void {
        this.mUpdater.deconstruct();
    }

    /**
     * Get injection parameter for the processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     */
    public getProcessorAttribute<T>(pInjectionTarget: InjectionConstructor): T | undefined {
        return this.mInjections.get(pInjectionTarget);
    }

    /**
     * Register object and pass on update events.
     * 
     * @param pObject - Object.
     */
    public registerObject<T extends object>(pObject: T): T {
        return this.mUpdater.registerObject(pObject);
    }

    /**
     * Set injection parameter for the module processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     * 
     * @throws {@link Exception}
     * When the processor was already initialized.
     */
    public setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        if (this.mIsLocked) {
            throw new Exception('Cant add injections to after construction.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
     * Setup needs to be called to access the processor.
     */
    public setup(): this {
        // Forbid double setup.
        if (this.mIsSetup) {
            throw new Exception('Setup allready called.', this);
        }

        this.mIsSetup = true;

        // Execute Setup hooks.
        let lSetupHook: CoreEntitySetupHook | undefined;
        while ((lSetupHook = this.mHooks.setup.pop())) {
            lSetupHook.apply(this);
        }

        return this;
    }

    /**
     * Manual updates core entity.
     * 
     * @returns true when a update happened and false when nothing was updated.
     */
    public async update(): Promise<boolean> {
        return this.mUpdater.update();
    }

    /**
     * Add hook called on processor creation.
     * Can replace the current processor by returning a object.
     * 
     * @param pHook - Hook function.
     */
    protected addCreationHook(pHook: CoreEntityProcessorCreationHook<TProcessor>): this {
        this.mHooks.create.push(pHook);

        return this;
    }

    /**
     * Add hook called on core entity setup.
     * 
     * @param pHook - Hook function.
     */
    protected addSetupHook(pHook: CoreEntitySetupHook): this {
        this.mHooks.setup.push(pHook);

        return this;
    }

    /**
     * Setup auto update for core entity.
     * 
     * @param pTrigger - Trigger that starts an update.
     */
    protected setAutoUpdate(pTrigger: UpdateTrigger): void {
        this.mUpdater.addUpdateTrigger(pTrigger);
    }

    /**
     * Create module object.
     */
    private createProcessor(): TProcessor {
        // Lock injection.
        this.mIsLocked = true;

        // Create processor.
        let lProcessor: TProcessor = this.mUpdater.switchToUpdateZone(() => {
            // Create tracked processor when 
            if (this.mTrackChanges) {
                return Processor.enableTrackingOnConstruction(() => {
                    return Injection.createObject<TProcessor>(this.mProcessorConstructor, this.mInjections);
                });
            }

            return Injection.createObject<TProcessor>(this.mProcessorConstructor, this.mInjections);
        });

        // Event when the processor should be tracked, save the original.
        lProcessor = CoreEntityProcessorProxy.getOriginal(lProcessor);

        // Call every creation hook.
        // Execute Setup hooks.
        let lCreationHook: CoreEntityProcessorCreationHook<TProcessor> | undefined;
        while ((lCreationHook = this.mHooks.create.pop())) {
            const lReplacement: TProcessor | void = lCreationHook.call(this, lProcessor);
            if (lReplacement) {
                lProcessor = lReplacement;
            }
        }

        return lProcessor;
    }

    /**
     * Called on update.
     * 
     * @returns true when a update happened and false when nothing was updated.
     */
    protected abstract onUpdate(): Promise<boolean>;
}

// Hooks
type CoreEntityProcessorCreationHook<TProcessor> = (pProcessor: TProcessor) => TProcessor | void;
type CoreEntitySetupHook = () => void;
type CoreEntityHooks<TProcessor> = {
    create: Stack<CoreEntityProcessorCreationHook<TProcessor>>;
    setup: Stack<CoreEntitySetupHook>;
};

// Call types.
type PropertyFunction<TProcessor extends object, TProperty extends keyof TProcessor> = TProcessor[TProperty] extends ((...pArgs: Array<any>) => any) ? TProcessor[TProperty] : never;
type PropertyFunctionResult<TProcessor extends object, TProperty extends keyof TProcessor> = ReturnType<PropertyFunction<TProcessor, TProperty>>;
type PropertyFunctionParameter<TProcessor extends object, TProperty extends keyof TProcessor> = Parameters<PropertyFunction<TProcessor, TProperty>>;

/*
 * Constructor parameter.
 */
export type CoreEntityConstructorParameter<TProcessor extends Processor> = {
    /**
     * Processor constructor.
     */
    constructor: CoreEntityProcessorConstructor<TProcessor>;

    /**
     * Debug level for this entity.
     */
    debugLevel: PwbDebugLogLevel;

    /**
     * Trigger that can be send to this and parent zones.
     * When any zone added a updateTrigger, they can auto update with them.
     */
    trigger: UpdateTrigger;

    /**
     * Parent entity..
     */
    parent?: CoreEntity | undefined;

    /**
     * Isolate trigger and dont send them to parent zones.
     */
    isolate?: boolean;

    /**
     * Track changes in processor.
     */
    trackConstructorChanges: boolean;
};
export type CoreEntityProcessorConstructor<TProcessor extends Processor = Processor> = new (...pParameter: Array<any>) => TProcessor;
