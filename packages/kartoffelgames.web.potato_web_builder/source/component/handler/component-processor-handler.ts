import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ComponentProcessorConstructor, ComponentProcessor } from '../../interface/component.interface';
import { UpdateHandler } from './update-handler';

export class ComponentProcessorHandler {
    private readonly mProcessor: ComponentProcessor;
    private readonly mProcessorConstructor: ComponentProcessorConstructor;

    /**
     * Component processor.
     */
    public get processor(): ComponentProcessor {
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
        return ChangeDetection.getUntrackedObject(this.mProcessor);
    }

    /**
     * Constrcutor.
     * @param pComponentProcessorConstructor - Component processor constructor.
     */
    public constructor(pComponentProcessorConstructor: ComponentProcessorConstructor, pUpdateHandler: UpdateHandler, pInjections: Dictionary<InjectionConstructor, any>) {
        // Create user object inside update zone.
        // Constructor needs to be called inside zone.
        let lUntrackedProcessor: ComponentProcessor | null = null;
        pUpdateHandler.executeInZone(() => {
            lUntrackedProcessor = Injection.createObject<ComponentProcessor>(pComponentProcessorConstructor, pInjections);
        });
        this.mProcessor = pUpdateHandler.registerObject(<ComponentProcessor><any>lUntrackedProcessor);
        this.mProcessorConstructor = pComponentProcessorConstructor;
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callAfterPwbInitialize(): void {
        this.mProcessor.afterPwbInitialize?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callAfterPwbUpdate(): void {
        this.mProcessor.afterPwbUpdate?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     * @param pAttributeName - Name of updated attribute.
     */
    public callOnPwbAttributeChange(pAttributeName: string): void {
        this.mProcessor.onPwbAttributeChange?.(pAttributeName);
    }

    /**
     * Call onPwbDeconstruct of component processor object.
     */
    public callOnPwbDeconstruct(): void {
        this.mProcessor.onPwbDeconstruct?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callOnPwbInitialize(): void {
        this.mProcessor.onPwbInitialize?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callOnPwbUpdate(): void {
        this.mProcessor.onPwbUpdate?.();
    }
}