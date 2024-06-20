import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { InteractionZoneStack } from '@kartoffelgames/web.change-detection/library/source/change_detection/interaction-zone';
import { UpdateHandler } from '../component/handler/update-handler';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

export class CoreEntity<TProcessor extends object = object> {
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mLocked: boolean;
    private readonly mProcessor: TProcessor | null;
    private readonly mProcessorConstructor: CoreEntityProcessorConstructor<TProcessor>;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Processor of module.
     * Initialize processor when it hasn't already.
     */
    public get processor(): TProcessor {
        if (!this.processorCreated) {
            this.createProcessor();
        }

        return this.mProcessor!;
    }

    /**
     * Processor constructor of module.
     */
    public get processorConstructor(): CoreEntityProcessorConstructor {
        return this.mProcessorConstructor;
    }

    /**
     * If processor is created or not.
     */
    public get processorCreated(): boolean {
        return !!this.mProcessor;
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
        this.mProcessor = null;
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mLocked = false;

        // Passthrough parents entity injections.
        if (pParameter.parent !== null) {
            for (const [lTarget, lValue] of pParameter.parent.mInjections.entries()) {
                this.setProcessorAttributes(lTarget, lValue);
            }
        }

        // Try to read interaction stack from parent.
        const lCurrentInteractionStack: InteractionZoneStack | undefined = (pParameter.parent !== null) ? pParameter.parent.updateHandler.interactionStack : undefined;

        // Create new updater for every component entity.
        this.mUpdateHandler = new UpdateHandler(pParameter.isolateInteraction, pParameter.interactionTrigger, lCurrentInteractionStack);
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
        if (!this.processorCreated && !pForceCreate) {
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
        if (this.mLocked) {
            throw new Exception('Cant add injections to after construction.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
     * Create module object.
     */
    protected createProcessor(): TProcessor {
        // Lock injection.
        this.mLocked = true;

        // Create processor.
        const lProcessor: TProcessor = this.updateHandler.enableInteractionTrigger(() => {
            return Injection.createObject<TProcessor>(this.mProcessorConstructor, this.mInjections);
        });

        // Call creation hook and possible replace processor.
        return this.onCreation(lProcessor);
    }

    /**
     * On processor creation.
     * Processor can be replaced here.
     * 
     * @param pProcessor -  Created processor
     */
    protected onCreation(pProcessor: TProcessor): TProcessor {
        return pProcessor;
    }
}


type PropertyFunction<TProcessor extends object, TProperty extends keyof TProcessor> = TProcessor[TProperty] extends ((...pArgs: Array<any>) => any) ? TProcessor[TProperty] : never;

type PropertyFunctionResult<TProcessor extends object, TProperty extends keyof TProcessor> = ReturnType<PropertyFunction<TProcessor, TProperty>>;

type PropertyFunctionParameter<TProcessor extends object, TProperty extends keyof TProcessor> = Parameters<PropertyFunction<TProcessor, TProperty>>;

export type CoreEntityConstructorParameter<TProcessor extends object> = {
    processorConstructor: CoreEntityProcessorConstructor<TProcessor>;
    parent: CoreEntity | null;
    isolateInteraction: boolean;
    interactionTrigger: UpdateTrigger;
};

export type CoreEntityProcessorConstructor<TProcessor extends object = object> = new (...pParameter: Array<any>) => TProcessor;