import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ComponentProcessorConstructor, ComponentProcessor } from '../../interface/component.interface';
import { UpdateHandler } from './update-handler';

export class ComponentProcessorHandler {
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mProcessor: ComponentProcessor | null;
    private readonly mProcessorConstructor: ComponentProcessorConstructor;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Component processor.
     */
    public get processor(): ComponentProcessor {
        if (!this.mProcessor) {
            this.mProcessor = this.createProcessor();
        }

        return this.mProcessor;
    }

    /**
     * Component processor constructor.
     */
    public get processorConstructor(): ComponentProcessorConstructor {
        return this.mProcessorConstructor;
    }

    /**
     * Untracked Component processor.
     */
    public get untrackedProcessor(): ComponentProcessor {
        return ChangeDetection.getUntrackedObject(this.processor);
    }

    /**
     * Constrcutor.
     * @param pComponentProcessorConstructor - Component processor constructor.
     */
    public constructor(pComponentProcessorConstructor: ComponentProcessorConstructor, pUpdateHandler: UpdateHandler, pInjections: Dictionary<InjectionConstructor, any>) {
        this.mProcessor = null;
        this.mUpdateHandler = pUpdateHandler;
        this.mProcessorConstructor = pComponentProcessorConstructor;
        this.mInjections = pInjections;
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callAfterPwbInitialize(): void {
        this.processor.afterPwbInitialize?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callAfterPwbUpdate(): void {
        this.processor.afterPwbUpdate?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     * @param pAttributeName - Name of updated attribute.
     */
    public callOnPwbAttributeChange(pAttributeName: string): void {
        this.processor.onPwbAttributeChange?.(pAttributeName);
    }

    /**
     * Call onPwbDeconstruct of component processor object.
     */
    public callOnPwbDeconstruct(): void {
        this.processor.onPwbDeconstruct?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callOnPwbInitialize(): void {
        this.processor.onPwbInitialize?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callOnPwbUpdate(): void {
        this.processor.onPwbUpdate?.();
    }

    /**
     * Create component processor.
     */
    private createProcessor(): ComponentProcessor {
        // Create user object inside update zone.
        // Constructor needs to be called inside zone.
        let lUntrackedProcessor: ComponentProcessor | null = null;
        this.mUpdateHandler.executeInZone(() => {
            lUntrackedProcessor = Injection.createObject<ComponentProcessor>(this.mProcessorConstructor, this.mInjections);
        });

        return this.mUpdateHandler.registerObject(<ComponentProcessor><any>lUntrackedProcessor);
    }
}