import { IDeconstructable } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionModule } from '../extension/extension-module';
import { ExtensionModuleConfiguration, GlobalExtensionStorage } from '../extension/global-extension-storage';
import { BaseUserEntity, IUserProcessor } from './base-user-entity';
import { BaseUpdateableUserEntity } from './base-updateable-user-entity';

export abstract class BaseExtendableUserEntity<TProcessor extends IUserProcessor = IUserProcessor> extends BaseUpdateableUserEntity<TProcessor> implements IDeconstructable {
    private readonly mExtensionList: Array<ExtensionModule>;

    /**
     * Constructor.
     * Takes over parent injections.
     * 
     * @param pProcessorConstructor - Processor constructor of user entity.
     * @param pParent - Parent of user entity.
     */
    public constructor(pProcessorConstructor: InjectionConstructor, pParent: BaseUserEntity<any> | null) {
        super(pProcessorConstructor, pParent);

        this.mExtensionList = new Array<ExtensionModule>();
    }

    /**
     * Deconstruct module.
     */
    public override deconstruct(): void {
        // Deconstruct extensions.
        for (const lExtensions of this.mExtensionList) {
            lExtensions.deconstruct();
        }

        super.deconstruct();
    }

    /**
     * Create module object.
     */
    protected override createProcessor(): TProcessor {
        // TODO: Caching is the key. Cache found extensions for constructor in weakmap. 

        const lExtensions: GlobalExtensionStorage = new GlobalExtensionStorage();

        // Filter extension list.
        const lExtensionList: Array<ExtensionModuleConfiguration> = lExtensions.extensionModuleConfigurations.filter((pExtensionConfiguration: ExtensionModuleConfiguration) => {
            for (const lRestriction of pExtensionConfiguration.targetRestrictions) {
                if (this instanceof lRestriction || this.processorConstructor.prototype instanceof lRestriction) {
                    return true;
                }
            }

            return false;
        });

        const lReadExtensionList: Array<ExtensionModuleConfiguration> = lExtensionList.filter((pExtensionConfiguration: ExtensionModuleConfiguration) => { return pExtensionConfiguration.access === AccessMode.Read; });
        const lWriteExtensionList: Array<ExtensionModuleConfiguration> = lExtensionList.filter((pExtensionConfiguration: ExtensionModuleConfiguration) => { return pExtensionConfiguration.access === AccessMode.Write; });
        const lReadWriteExtensionList: Array<ExtensionModuleConfiguration> = lExtensionList.filter((pExtensionConfiguration: ExtensionModuleConfiguration) => { return pExtensionConfiguration.access === AccessMode.ReadWrite; });

        // Create every write module extension.
        for (const lExtensionModuleConfiguration of lWriteExtensionList) {
            const lModuleExtension: ExtensionModule = new ExtensionModule(lExtensionModuleConfiguration.constructor, this);

            this.mExtensionList.push(lModuleExtension);
        }

        const lProcessor: TProcessor = super.createProcessor();


        // Get all read extensions. Keep order to execute readWrite extensions first.
        const lReadExtensions: Array<ExtensionModuleConfiguration> = [...lReadWriteExtensionList, ...lReadExtensionList];

        // Create every read module extension.
        for (const lExtensionModuleConfiguration of lReadExtensions) {
            const lModuleExtension: ExtensionModule = new ExtensionModule(lExtensionModuleConfiguration.constructor, this);

            this.mExtensionList.push(lModuleExtension);
        }

        return lProcessor;
    }
}