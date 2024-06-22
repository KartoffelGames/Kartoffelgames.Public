import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { InteractionZoneStack } from '@kartoffelgames/web.change-detection/library/source/change_detection/interaction-zone';
import { UpdateHandler } from '../component/handler/update-handler';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

export class CoreEntity<TProcessor extends object = object> {
    private readonly mCoreEntitySetupHookList: Array<CoreEntitySetupHook>;
    private readonly mCreateOnSetup: boolean;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mIsLocked: boolean;
    private mIsSetup: boolean;
    private mProcessor: TProcessor | null;
    private readonly mProcessorConstructor: CoreEntityProcessorConstructor<TProcessor>;
    private readonly mProcessorCreationHookList: Array<CoreEntityProcessorCreationHook<TProcessor>>;
    private readonly mUpdateHandler: UpdateHandler;

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
     * Update handler of component entity.
     */
    protected get updateHandler(): UpdateHandler {
        return this.mUpdateHandler;
    }

    /**
     * Constructor.
     * Takes over parent injections.
     * 
     * @param pProcessorConstructor - Processor constructor of user entity.
     * @param pParent - Parent of user entity.
     */
    public constructor(pParameter: CoreEntityConstructorParameter<TProcessor>) {
        this.mProcessorConstructor = pParameter.processorConstructor;
        this.mCreateOnSetup = !!pParameter.createOnSetup;

        // Set empty defaults.
        this.mProcessor = null;
        this.mIsLocked = false;
        this.mIsSetup = false;

        // Init lists.
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mProcessorCreationHookList = new Array<CoreEntityProcessorCreationHook<TProcessor>>();
        this.mCoreEntitySetupHookList = new Array<CoreEntitySetupHook>();

        // Passthrough parents entity injections.
        if (pParameter.parent) {
            for (const [lTarget, lValue] of pParameter.parent.mInjections.entries()) {
                this.setProcessorAttributes(lTarget, lValue);
            }
        }

        // Try to read interaction stack from parent.
        const lCurrentInteractionStack: InteractionZoneStack | undefined = pParameter.parent?.updateHandler.interactionStack;

        // Create new updater for every component entity.
        this.mUpdateHandler = new UpdateHandler(!!pParameter.isolateInteraction, pParameter.interactionTrigger, lCurrentInteractionStack);
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
        return this.updateHandler.enableInteractionTrigger(() => {
            return lPropertyFunction.call(this.processor, pParameter);
        });
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
        for (const lSetupHook of this.mCoreEntitySetupHookList) {
            lSetupHook.apply(this);
        }

        // Force create processor after setup hooks when setting is set.
        if (this.mCreateOnSetup) {
            this.processor;
        }

        return this;
    }

    /**
     * Add hook called on processor creation.
     * Can replace the current processor by returning a object.
     * 
     * @param pHook - Hook function.
     */
    protected addCreationHook(pHook: CoreEntityProcessorCreationHook<TProcessor>): this {
        this.mProcessorCreationHookList.push(pHook);

        return this;
    }

    /**
     * Add hook called on core entity setup.
     * 
     * @param pHook - Hook function.
     */
    protected addSetupHook(pHook: CoreEntitySetupHook): this {
        this.mCoreEntitySetupHookList.push(pHook);

        return this;
    }

    /**
     * Create module object.
     */
    private createProcessor(): TProcessor {
        // Lock injection.
        this.mIsLocked = true;

        // Create processor.
        let lProcessor: TProcessor = this.updateHandler.enableInteractionTrigger(() => {
            return Injection.createObject<TProcessor>(this.mProcessorConstructor, this.mInjections);
        });

        // Call every creation hook.
        for (const lCreationHook of this.mProcessorCreationHookList) {
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
type CoreEntitySetupHook = () => void;

// Call types.
type PropertyFunction<TProcessor extends object, TProperty extends keyof TProcessor> = TProcessor[TProperty] extends ((...pArgs: Array<any>) => any) ? TProcessor[TProperty] : never;
type PropertyFunctionResult<TProcessor extends object, TProperty extends keyof TProcessor> = ReturnType<PropertyFunction<TProcessor, TProperty>>;
type PropertyFunctionParameter<TProcessor extends object, TProperty extends keyof TProcessor> = Parameters<PropertyFunction<TProcessor, TProperty>>;

/*
 * Constructor parameter.
 */
export type CoreEntityConstructorParameter<TProcessor> = {
    processorConstructor: CoreEntityProcessorConstructor<TProcessor>;
    interactionTrigger: UpdateTrigger;
    parent?: CoreEntity | undefined;
    isolateInteraction?: boolean;
    createOnSetup?: boolean;
};
export type CoreEntityProcessorConstructor<TProcessor = object> = new (...pParameter: Array<any>) => TProcessor;