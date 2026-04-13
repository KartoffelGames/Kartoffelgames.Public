import { Exception, type IDeconstructable } from '@kartoffelgames/core';
import { Injection, type InjectionConstructor } from '@kartoffelgames/core-dependency-injection';

/**
 * Base class for entities.
 * Entities are objects that have a processor. The processor is created on demand and can be used to store data and functions.
 * An entity can be component, module or an extension processor.
 */
export abstract class CoreEntity<TProcessor extends CoreEntityProcessor = CoreEntityProcessor> implements IDeconstructable {
    private readonly mHooks: CoreEntityHooks<TProcessor>;
    private readonly mInjections: Map<InjectionConstructor, any>;
    private mProcessor: TProcessor | null;
    private readonly mProcessorConstructor: CoreEntityProcessorConstructor<TProcessor>;

    /**
     * Processor of module.
     * Initialize processor when it hasn't already.
     */
    public get processor(): TProcessor {
        // Create processor when it is not created.
        if (!this.mProcessor) {
            throw new Exception('Processor is not created yet. Call setup to create processor.', this);
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
        this.mProcessorConstructor = pParameter.constructor;

        // Set empty defaults.
        this.mProcessor = null;

        // Init lists and config.
        this.mInjections = new Map<InjectionConstructor, any>();
        this.mHooks = {
            create: new Array<CoreEntityProcessorCreationHook<TProcessor>>()
        };

        // Passthrough parents entity injections.
        if (pParameter.parent) {
            for (const [lTarget, lValue] of pParameter.parent.mInjections.entries()) {
                this.setProcessorInjection(lTarget, lValue);
            }
        }
    }

    /**
     * Call function of processor in updater zone.
     * When the function is not found nothing will be called.
     * 
     * @param pProperyKey - Propertykey of processor leading to a function.
     * @param pParameter - Parameter of function of {@link pProperyKey}.
     * 
     * 
     * @returns function call result or null when processor is not created and {@link pForceCreate} is not set.
     */
    protected call<TTargetInterface extends object, TProperty extends keyof TTargetInterface>(pProperyKey: TProperty, ...pParameter: PropertyFunctionParameter<TTargetInterface, TProperty>): PropertyFunctionResult<TTargetInterface, TProperty> | null {
        // Try to get property function.
        const lPropertyFunction: ((...pArgs: Array<any>) => any) | undefined = Reflect.get(this.processor, pProperyKey) as ((...pArgs: Array<any>) => any) | undefined;
        if (typeof lPropertyFunction !== 'function') {
            return null;
        }

        // Call function in update trigger zone.
        return lPropertyFunction.apply(this.processor, pParameter);
    }

    /**
     * Deconstruct update zone.
     */
    public deconstruct(): void { }

    /**
     * Get injection parameter for the processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     */
    public getProcessorInjection<T>(pInjectionTarget: InjectionConstructor): T | undefined {
        return this.mInjections.get(pInjectionTarget);
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
    public setProcessorInjection(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        if (this.mProcessor) {
            throw new Exception('Cant add injections to after construction.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
     * Setup processor of entity. Call setup hooks and creation hooks.
     * 
     * @returns This for chaining. 
     */
    public setup(): this {
        this.mProcessor = this.createProcessor();

        return this;
    }

    /**
     * Add hook called on processor creation.
     * Can replace the current processor by returning a object.
     * 
     * @param pHook - Hook function.
     * 
     * @returns This for chaining. 
     */
    protected addConstructionHook(pHook: CoreEntityProcessorCreationHook<TProcessor>): this {
        this.mHooks.create.push(pHook);

        return this;
    }

    /**
     * Create module object.
     */
    protected createProcessor(): TProcessor {
        // Create processor.
        let lProcessor: TProcessor = Injection.createObject<TProcessor>(this.mProcessorConstructor, this.mInjections);

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
}

// Hooks
type CoreEntityProcessorCreationHook<TProcessor> = (pProcessor: TProcessor) => TProcessor | void;
type CoreEntityHooks<TProcessor> = {
    create: Array<CoreEntityProcessorCreationHook<TProcessor>>;
};

// Call types.
type PropertyFunction<TProcessor extends object, TProperty extends keyof TProcessor> = TProcessor[TProperty] extends ((...pArgs: Array<any>) => any) ? TProcessor[TProperty] : never;
type PropertyFunctionResult<TProcessor extends object, TProperty extends keyof TProcessor> = ReturnType<PropertyFunction<TProcessor, TProperty>>;
type PropertyFunctionParameter<TProcessor extends object, TProperty extends keyof TProcessor> = Parameters<PropertyFunction<TProcessor, TProperty>>;

/*
 * Constructor parameter.
 */
export type CoreEntityConstructorParameter<TProcessor extends CoreEntityProcessor> = {
    /**
     * Processor constructor.
     */
    constructor: CoreEntityProcessorConstructor<TProcessor>;

    /**
     * Parent of entity. Inherit injections from parent.
     */
    parent: CoreEntity | null;
};

export type CoreEntityProcessorConstructor<TProcessor extends CoreEntityProcessor = CoreEntityProcessor> = new (...pParameter: Array<any>) => TProcessor;
export type CoreEntityProcessor = object;