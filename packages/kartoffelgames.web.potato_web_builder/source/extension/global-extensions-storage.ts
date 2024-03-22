import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';

/**
 * Global extension storage.
 * Containing all imported extensions.
 * 
 * Singleton instance.
 * 
 * @internal
 */
export class GlobalExtensionsStorage {
    private static mInstance: GlobalExtensionsStorage;

    private readonly mComponentExtensions!: Array<IPwbExtensionProcessorClass>;
    private mComponentExtensionsChangedOrder!: boolean;
    private readonly mModuleExtensions!: Array<IPwbExtensionProcessorClass>;
    private mModuleExtensionsChangedOrder!: boolean;

    /**
     * Get all component extensions that inject neew types.
     */
    public get componentExtensions(): Array<IPwbExtensionProcessorClass> {
        if (this.mComponentExtensionsChangedOrder) {
            // TODO: Resort by access type.
        }

        return this.mComponentExtensions;
    }

    /**
     * Get all module extensions that inject neew types.
     */
    public get moduleExtensions(): Array<IPwbExtensionProcessorClass> {
        if (this.mModuleExtensionsChangedOrder) {
            // TODO: Resort by access type.
        }

        return this.mModuleExtensions;
    }

    /**
     * Constructor.
     * 
     * Reuses single instance.
     */
    public constructor() {
        if (GlobalExtensionsStorage.mInstance) {
            return GlobalExtensionsStorage.mInstance;
        }

        GlobalExtensionsStorage.mInstance = this;

        this.mComponentExtensions = new Array<IPwbExtensionProcessorClass>();
        this.mModuleExtensions = new Array<IPwbExtensionProcessorClass>();

        this.mComponentExtensionsChangedOrder = false;
        this.mModuleExtensionsChangedOrder = false;
    }

    /**
     * Add global component extension.
     * @param pExtension - Extension constructor.
     * @param pExtensionType - Type of extension.
     */
    public add(pExtension: IPwbExtensionProcessorClass, pExtensionType: ExtensionType, pAccessMode: AccessMode): void {
        // Module extensions.
        if ((pExtensionType & ExtensionType.Module) === ExtensionType.Module) {
            this.mModuleExtensions.push(pExtension);
            this.mModuleExtensionsChangedOrder = true;
        }

        // Component extensions.
        if ((pExtensionType & ExtensionType.Component) === ExtensionType.Component) {
            this.mComponentExtensions.push(pExtension);
            this.mComponentExtensionsChangedOrder = true;
        }
    }
}