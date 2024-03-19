import { ExtensionType } from '../enum/extension-type.enum';
import { IPwbExtensionClass } from '../interface/extension.interface';

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

    private readonly mComponentExtensions!: Array<IPwbExtensionClass>;
    private readonly mModuleExtensions!: Array<IPwbExtensionClass>;

    /**
     * Get all component extensions that inject neew types.
     */
    public get componentExtensions(): Array<IPwbExtensionClass> {
        return this.mComponentExtensions;
    }

    /**
     * Get all module extensions that inject neew types.
     */
    public get moduleExtensions(): Array<IPwbExtensionClass> {
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

        this.mComponentExtensions = new Array<IPwbExtensionClass>();
        this.mModuleExtensions = new Array<IPwbExtensionClass>();
    }

    /**
     * Add global component extension.
     * @param pExtension - Extension constructor.
     * @param pExtensionType - Type of extension.
     */
    public add(pExtension: IPwbExtensionClass, pExtensionType: ExtensionType): void {
        // Module extensions.
        if ((pExtensionType & ExtensionType.Module) === ExtensionType.Module) {
            this.mModuleExtensions.push(pExtension);
        }

        // Component extensions.
        if ((pExtensionType & ExtensionType.Component) === ExtensionType.Component) {
            this.mComponentExtensions.push(pExtension);
        }
    }
}