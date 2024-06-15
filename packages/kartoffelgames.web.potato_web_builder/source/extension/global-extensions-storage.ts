import { Dictionary } from '@kartoffelgames/core.data';
import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { ExtensionModuleConfiguration } from '../module/global-module-storage';

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

    private readonly mExtensionsModules!: Dictionary<ExtensionType, Dictionary<AccessMode, Array<ExtensionModuleConfiguration>>>;

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
        this.mExtensionsModules = new Dictionary<ExtensionType, Dictionary<AccessMode, Array<ExtensionModuleConfiguration>>>();
    }

    /**
     * Add global component extension.
     * @param pExtension - Extension constructor.
     * @param pExtensionType - Type of extension.
     */
    public addExtensionModule(pModuleDefinition: ExtensionModuleConfiguration): void {
        // Add for component type.
        if ((pModuleDefinition.type & ExtensionType.Component) === ExtensionType.Component) {
            // Init component type dictionary.
            if (!this.mExtensionsModules.has(ExtensionType.Component)) {
                this.mExtensionsModules.set(ExtensionType.Component, new Dictionary<AccessMode, Array<ExtensionModuleConfiguration>>());
            }

            // Read access map by component type.
            const lAccessModeMap: Dictionary<AccessMode, Array<ExtensionModuleConfiguration>> = this.mExtensionsModules.get(ExtensionType.Component)!;

            // Init access mode map.
            if (!lAccessModeMap.has(pModuleDefinition.access)) {
                lAccessModeMap.set(pModuleDefinition.access, new Array<ExtensionModuleConfiguration>());
            }

            // Read and add extension fro access mode.
            lAccessModeMap.get(pModuleDefinition.access)!.push(pModuleDefinition);
        }

        // Add for module type.
        if ((pModuleDefinition.type & ExtensionType.Module) === ExtensionType.Module) {
            // Init Module type dictionary.
            if (!this.mExtensionsModules.has(ExtensionType.Module)) {
                this.mExtensionsModules.set(ExtensionType.Module, new Dictionary<AccessMode, Array<ExtensionModuleConfiguration>>());
            }

            // Read access map by Module type.
            const lAccessModeMap: Dictionary<AccessMode, Array<ExtensionModuleConfiguration>> = this.mExtensionsModules.get(ExtensionType.Module)!;

            // Init access mode map.
            if (!lAccessModeMap.has(pModuleDefinition.access)) {
                lAccessModeMap.set(pModuleDefinition.access, new Array<ExtensionModuleConfiguration>());
            }

            // Read and add extension fro access mode.
            lAccessModeMap.get(pModuleDefinition.access)!.push(pModuleDefinition);
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
    public getExtensionModuleConfiguration(pExtensionType: ExtensionType, pAccessMode: AccessMode): Array<ExtensionModuleConfiguration> {
        // Read possible extensions by extension type.
        const lExtensionTypeMap: Dictionary<AccessMode, Array<ExtensionModuleConfiguration>> | undefined = this.mExtensionsModules.get(pExtensionType);
        if (!lExtensionTypeMap) {
            return new Array<ExtensionModuleConfiguration>();
        }

        // Read possible extensions by access mode.
        const lExtensionList: Array<ExtensionModuleConfiguration> | undefined = lExtensionTypeMap.get(pAccessMode);
        if (!lExtensionList) {
            return new Array<ExtensionModuleConfiguration>();
        }

        return lExtensionList;
    }
}