import { Dictionary, Exception, IDeconstructable } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';

export abstract class BaseUserEntity<TProcessor extends IUserProcessor = IUserProcessor> implements IDeconstructable {
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mLocked: boolean;
    private readonly mProcessor: TProcessor | null;
    private readonly mProcessorConstructor: InjectionConstructor;

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
    public get processorConstructor(): InjectionConstructor {
        return this.mProcessorConstructor;
    }

    /**
     * If processor is created or not.
     */
    public get processorCreated(): boolean {
        return !!this.mProcessor;
    }

    /**
     * Constructor.
     * Takes over parent injections.
     * 
     * @param pProcessorConstructor - Processor constructor of user entity.
     * @param pParent - Parent of user entity.
     */
    public constructor(pProcessorConstructor: InjectionConstructor, pParent: BaseUserEntity<any> | null) {
        this.mProcessorConstructor = pProcessorConstructor;
        this.mProcessor = null;
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mLocked = false;

        // Passthrough parents entity injections.
        if (pParent) {
            for (const [lTarget, lValue] of pParent.mInjections.entries()) {
                this.setProcessorAttributes(lTarget, lValue);
            }
        }
    }

    /**
     * Deconstruct user processor.
     */
    public deconstruct(): void {
        if ('onDeconstruct' in this.processor) {
            this.processor.onDeconstruct();
        }
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
        const lProcessor: TProcessor = Injection.createObject<TProcessor>(this.mProcessorConstructor, this.mInjections);

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

export interface IUserProcessorOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}

export interface IUserProcessor extends Partial<IUserProcessorOnDeconstruct> { }