import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ComponentProcessorConstructor, ComponentProcessor } from '../../interface/component.interface';
import { UpdateHandler } from './update-handler';

export class ComponentProcessorHandler {
    private readonly mProcessor: ComponentProcessor;
    private readonly mProcessorConstructor: ComponentProcessorConstructor;
    
    /**
     * User class instance.
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
     * Untracked user class instance.
     */
    public get untrackedProcessor(): ComponentProcessor {
        return ChangeDetection.getUntrackedObject(this.mProcessor);
    }

    /**
     * Constrcutor.
     * @param pComponentProcessorConstructor - Component processor constructor.
     */
    public constructor(pComponentProcessorConstructor: ComponentProcessorConstructor, pUpdateHandler: UpdateHandler, pInjectionList: Array<object | null>) {
        // Create injection mapping. Ignores none objects.
        const lLocalInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
        for (const lInjectionObject of pInjectionList) {
            if (typeof lInjectionObject === 'object' && lInjectionObject !== null) {
                lLocalInjections.add(<InjectionConstructor>lInjectionObject.constructor, lInjectionObject);
            }
        }

        // Create user object inside update zone.
        // Constructor needs to be called inside zone.
        let lUntrackedProcessor: ComponentProcessor | null = null;
        pUpdateHandler.executeInZone(() => {
            lUntrackedProcessor = Injection.createObject<ComponentProcessor>(pComponentProcessorConstructor, lLocalInjections);
        });
        this.mProcessor = pUpdateHandler.registerObject(<ComponentProcessor><any>lUntrackedProcessor);
        this.mProcessorConstructor = pComponentProcessorConstructor;
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    public callAfterPwbInitialize(): void {
        this.callUserCallback('afterPwbInitialize');
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    public callAfterPwbUpdate(): void {
        this.callUserCallback('afterPwbUpdate');
    }

    /**
     * Call onPwbInitialize of user class object.
     * @param pAttributeName - Name of updated attribute.
     */
    public callOnPwbAttributeChange(pAttributeName: string | symbol): void {
        this.callUserCallback('onPwbAttributeChange', pAttributeName);
    }

    /**
     * Call onPwbDeconstruct of user class object.
     */
    public callOnPwbDeconstruct(): void {
        this.callUserCallback('onPwbDeconstruct');
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    public callOnPwbInitialize(): void {
        this.callUserCallback('onPwbInitialize');
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    public callOnPwbUpdate(): void {
        this.callUserCallback('onPwbUpdate');
    }

    /**
     * Callback by name.
     * @param pCallbackKey - Callback name.
     */
    private callUserCallback(pCallbackKey: ComponentProcessorCallbacks, ...pArguments: Array<any>) {
        // Callback when it exits
        if (pCallbackKey in this.mProcessor) {
            (<(...pArguments: Array<any>) => void>this.mProcessor[pCallbackKey])(...pArguments);
        }
    }
}

type ComponentProcessorCallbacks = keyof ComponentProcessor;