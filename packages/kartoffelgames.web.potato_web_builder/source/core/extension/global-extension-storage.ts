import { Dictionary, List } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { IPwbExtensionModuleProcessorConstructor } from './extension-module';

/**
 * Global module storage.
 * Containing all imported modules.
 * 
 * Singleton instance.
 * 
 * @internal
 */
export class GlobalExtensionStorage {
    private static mInstance: GlobalExtensionStorage;

    private readonly mExtensionModuleClasses!: Dictionary<ExtensionModuleConfiguration, IPwbExtensionModuleProcessorConstructor>;
    private readonly mExtensionModuleConfigurations!: Dictionary<IPwbExtensionModuleProcessorConstructor, ExtensionModuleConfiguration>;

    /**
     * Get expression module definitions of all expression modules.
     */
    public get extensionModuleConfigurations(): Array<ExtensionModuleConfiguration> {
        return List.newListWith(...this.mExtensionModuleConfigurations.values());
    }


    /**
     * Constructor.
     * 
     * Reuses single instance.
     */
    public constructor() {
        if (GlobalExtensionStorage.mInstance) {
            return GlobalExtensionStorage.mInstance;
        }

        GlobalExtensionStorage.mInstance = this;

        // Class storages.
        this.mExtensionModuleClasses = new Dictionary<ExtensionModuleConfiguration, IPwbExtensionModuleProcessorConstructor>();
        this.mExtensionModuleConfigurations = new Dictionary<IPwbExtensionModuleProcessorConstructor, ExtensionModuleConfiguration>();
    }

    /**
     * Add global component extension.
     * @param pExtension - Extension constructor.
     * @param pExtensionType - Type of extension.
     */
    public addExtensionModule(pModuleDefinition: ExtensionModuleConfiguration): void {
        this.mExtensionModuleClasses.set(pModuleDefinition, pModuleDefinition.constructor);
        this.mExtensionModuleConfigurations.set(pModuleDefinition.constructor, pModuleDefinition);
    }

    /**
     * Get extension module definition for extension module class.
     * @param pModuleClass - Module class.
     */
    public getExtensionModuleConfiguration(pModuleClass: IPwbExtensionModuleProcessorConstructor): ExtensionModuleConfiguration | undefined {
        return this.mExtensionModuleConfigurations.get(pModuleClass);
    }
}

export type ExtensionModuleConfiguration = {
    access: AccessMode;
    constructor: IPwbExtensionModuleProcessorConstructor;
    trigger: UpdateTrigger;
    targetRestrictions: Array<InjectionConstructor>;
};