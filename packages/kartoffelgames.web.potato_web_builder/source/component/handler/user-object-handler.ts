import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ComponentProcessorConstructor, ComponentProcessor } from '../../interface/component.interface';
import { UpdateHandler } from './update-handler';

export class UserObjectHandler {
    private readonly mProcessorConstructor: ComponentProcessorConstructor;
    private readonly mUserObject: ComponentProcessor;

    /**
     * User class instance.
     */
    public get processor(): ComponentProcessor {
        return this.mUserObject;
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
    public get untrackedUserObject(): ComponentProcessor {
        return ChangeDetection.getUntrackedObject(this.mUserObject);
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
        let lUntrackedUserObject: ComponentProcessor | null = null;
        pUpdateHandler.executeInZone(() => {
            lUntrackedUserObject = Injection.createObject<ComponentProcessor>(pComponentProcessorConstructor, lLocalInjections);
        });
        this.mUserObject = pUpdateHandler.registerObject(<ComponentProcessor><any>lUntrackedUserObject);
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
    private callUserCallback(pCallbackKey: UserObjectCallbacks, ...pArguments: Array<any>) {
        // Callback when it exits
        if (pCallbackKey in this.mUserObject) {
            (<(...pArguments: Array<any>) => void>this.mUserObject[pCallbackKey])(...pArguments);
        }
    }
}

type UserObjectCallbacks = keyof ComponentProcessor;