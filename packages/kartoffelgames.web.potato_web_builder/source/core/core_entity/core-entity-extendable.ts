import { IDeconstructable } from '@kartoffelgames/core.data';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionModule, ExtensionModuleConfiguration } from '../extension/extension-module';
import { CoreEntity, CoreEntityConstructorParameter } from './core-entity';
import { CoreEntityProcessorConstructorSetup, CoreEntityRegister } from './core-entity-register';

export abstract class CoreEntityExtendable<TProcessor extends object> extends CoreEntity<TProcessor> implements IDeconstructable {
    private readonly mExtensionList: Array<ExtensionModule>;

    /**
     * Constructor.
     * Takes over parent injections.
     * 
     * @param pProcessorConstructor - Processor constructor of user entity.
     * @param pParent - Parent of user entity.
     */
    public constructor(pParameter: CoreEntityExtendableConstructorParameter<TProcessor>) {
        super(pParameter);

        this.mExtensionList = new Array<ExtensionModule>();

        // Apply extensions on setup.
        this.addSetupHook(() => {
            this.executeExtensions();
        });
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        // Deconstruct extensions.
        for (const lExtensions of this.mExtensionList) {
            lExtensions.deconstruct();
        }
    }

    /**
     * Create module object.
     */
    private executeExtensions(): void {
        // TODO: Caching is the key. Cache found extensions for constructor in weakmap. 

        const lExtensions: CoreEntityRegister = new CoreEntityRegister();

        // Filter extension list.
        const lExtensionSetupList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = lExtensions.get<ExtensionModuleConfiguration>(ExtensionModule);

        // Filter extension list.
        const lTargetExtensionSetupList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = lExtensionSetupList.filter((pSetup: CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>) => {
            for (const lRestriction of pSetup.processorConfiguration.targetRestrictions) {
                if (this instanceof lRestriction || this.processorConstructor.prototype instanceof lRestriction || this.processorConstructor === lRestriction) {
                    return true;
                }
            }

            return false;
        });

        // Filter setup list access types.
        const lReadExtensionSetupList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = lTargetExtensionSetupList.filter((pSetup: CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>) => { return pSetup.processorConfiguration.access === AccessMode.Read; });
        const lWriteExtensionSetupList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = lTargetExtensionSetupList.filter((pSetup: CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>) => { return pSetup.processorConfiguration.access === AccessMode.Write; });
        const lReadWriteExtensionSetupList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = lTargetExtensionSetupList.filter((pSetup: CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>) => { return pSetup.processorConfiguration.access === AccessMode.ReadWrite; });

        // Create every write module extension.
        for (const lSetup of lWriteExtensionSetupList) {
            const lModuleExtension: ExtensionModule = new ExtensionModule(lSetup.processorConstructor, <CoreEntity><any>this, lSetup.processorConfiguration.trigger);
            lModuleExtension.setup();

            this.mExtensionList.push(lModuleExtension);
        }

        // Get all read extensions. Keep order to execute readWrite extensions first.
        const lReadExtensions: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = [...lReadWriteExtensionSetupList, ...lReadExtensionSetupList];

        // Create every read module extension.
        for (const lSetup of lReadExtensions) {
            const lModuleExtension: ExtensionModule = new ExtensionModule(lSetup.processorConstructor, <CoreEntity><any>this, lSetup.processorConfiguration.trigger);
            lModuleExtension.setup();

            this.mExtensionList.push(lModuleExtension);
        }
    }
}

export type CoreEntityExtendableConstructorParameter<TProcessor extends object> = CoreEntityConstructorParameter<TProcessor>;