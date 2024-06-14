import { Dictionary } from '@kartoffelgames/core.data';
import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { IPwbExtensionModuleProcessorClass } from '../interface/extension.interface';

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

    private readonly mExtensions!: Dictionary<ExtensionType, Dictionary<AccessMode, Array<IPwbExtensionModuleProcessorClass>>>;

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

        // Init some big ass dictionary containing both extension type and acces mode.
        this.mExtensions = new Dictionary<ExtensionType, Dictionary<AccessMode, Array<IPwbExtensionModuleProcessorClass>>>();
    }

    /**
     * Add global component extension.
     * @param pExtension - Extension constructor.
     * @param pExtensionType - Type of extension.
     */
    public addExtensionModule(pExtension: IPwbExtensionModuleProcessorClass, pExtensionType: ExtensionType, pAccessMode: AccessMode): void {
        // Add for component type.
        if ((pExtensionType & ExtensionType.Component) === ExtensionType.Component) {
            // Init component type dictionary.
            if (!this.mExtensions.has(ExtensionType.Component)) {
                this.mExtensions.set(ExtensionType.Component, new Dictionary<AccessMode, Array<IPwbExtensionModuleProcessorClass>>());
            }

            // Read access map by component type.
            const lAccessModeMap: Dictionary<AccessMode, Array<IPwbExtensionModuleProcessorClass>> = this.mExtensions.get(ExtensionType.Component)!;

            // Init access mode map.
            if (!lAccessModeMap.has(pAccessMode)) {
                lAccessModeMap.set(pAccessMode, new Array<IPwbExtensionModuleProcessorClass>());
            }

            // Read and add extension fro access mode.
            lAccessModeMap.get(pAccessMode)!.push(pExtension);
        }

        // Add for module type.
        // Add for Module type
        if ((pExtensionType & ExtensionType.Module) === ExtensionType.Module) {
            // Init Module type dictionary.
            if (!this.mExtensions.has(ExtensionType.Module)) {
                this.mExtensions.set(ExtensionType.Module, new Dictionary<AccessMode, Array<IPwbExtensionModuleProcessorClass>>());
            }

            // Read access map by Module type.
            const lAccessModeMap: Dictionary<AccessMode, Array<IPwbExtensionModuleProcessorClass>> = this.mExtensions.get(ExtensionType.Module)!;

            // Init access mode map.
            if (!lAccessModeMap.has(pAccessMode)) {
                lAccessModeMap.set(pAccessMode, new Array<IPwbExtensionModuleProcessorClass>());
            }

            // Read and add extension fro access mode.
            lAccessModeMap.get(pAccessMode)!.push(pExtension);
        }
    }

    /**
     * Read a list of all extension with the set {@link pExtensionType} and {@link pAccessMode}.
     * Returns an empty list when no extension are found.
     * 
     * @param pExtensionType - Extension type.
     * @param pAccessMode - Extension access mode.
     * 
     * @returns list of extension with set modifier. Return an empty list as default.
     */
    public getExtensionModuleConfiguration(pExtensionType: ExtensionType, pAccessMode: AccessMode): Array<IPwbExtensionModuleProcessorClass> {
        // Read possible extensions by extension type.
        const lExtensionTypeMap: Dictionary<AccessMode, Array<IPwbExtensionModuleProcessorClass>> | undefined = this.mExtensions.get(pExtensionType);
        if (!lExtensionTypeMap) {
            return new Array<IPwbExtensionModuleProcessorClass>();
        }

        // Read possible extensions by access mode.
        const lExtensionList: Array<IPwbExtensionModuleProcessorClass> | undefined = lExtensionTypeMap.get(pAccessMode);
        if (!lExtensionList) {
            return new Array<IPwbExtensionModuleProcessorClass>();
        }

        return lExtensionList;
    }
}