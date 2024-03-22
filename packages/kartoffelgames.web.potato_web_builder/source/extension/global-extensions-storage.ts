import { Exception } from '@kartoffelgames/core.data';
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
    private readonly mExtensionsAccessMode!: WeakMap<IPwbExtensionProcessorClass, AccessMode>;
    private readonly mModuleExtensions!: Array<IPwbExtensionProcessorClass>;
    private mModuleExtensionsChangedOrder!: boolean;

    /**
     * Get all component extensions that inject new types.
     * Automatically reorders list when it has detected any changes.
     */
    public get componentExtensions(): Array<IPwbExtensionProcessorClass> {
        // Resort by access type when it is not already ordered.
        if (this.mComponentExtensionsChangedOrder) {
            this.orderExtensionList(this.mComponentExtensions);
        }

        return this.mComponentExtensions;
    }

    /**
     * Get all module extensions that inject new types.
     * Automatically reorders list when it has detected any changes.
     */
    public get moduleExtensions(): Array<IPwbExtensionProcessorClass> {
        // Resort by access type when it is not already ordered.
        if (this.mModuleExtensionsChangedOrder) {
            this.orderExtensionList(this.mModuleExtensions);
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

        // Extension access mode mapping.
        this.mExtensionsAccessMode = new WeakMap<IPwbExtensionProcessorClass, AccessMode>();

        // Setup extension storage lists.
        this.mComponentExtensions = new Array<IPwbExtensionProcessorClass>();
        this.mComponentExtensionsChangedOrder = false;
        this.mModuleExtensions = new Array<IPwbExtensionProcessorClass>();
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

        this.mExtensionsAccessMode.set(pExtension, pAccessMode);
    }

    /**
     * Order extension list by assigned access modes.
     * Changes reference.
     * 
     * @param pList - List reference.
     */
    private orderExtensionList(pList: Array<IPwbExtensionProcessorClass>): void {
        // Sort by write->readwrite->read->expression and update.
        pList.sort((pModuleA, pModuleB): number => {
            const lAccessModeA: AccessMode | undefined = this.mExtensionsAccessMode.get(pModuleA);
            const lAccessModeB: AccessMode | undefined = this.mExtensionsAccessMode.get(pModuleB);

            // Validate correct setup. This should really never happen.
            if (!lAccessModeA || !lAccessModeB) {
                throw new Exception('Extension is not properly setup. No access mode was set.', this);
            }

            return lAccessModeA - lAccessModeB;
        });
    }
}