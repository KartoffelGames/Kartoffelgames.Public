import { IDeconstructable } from '@kartoffelgames/core.data';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionModule, ExtensionModuleConfiguration } from '../extension/extension-module';
import { CoreEntity, CoreEntityConstructorParameter, CoreEntityProcessorConstructor } from './core-entity';
import { CoreEntityProcessorConstructorSetup, CoreEntityRegister } from './core-entity-register';

export abstract class CoreEntityExtendable<TProcessor extends object> extends CoreEntity<TProcessor> implements IDeconstructable {
    private static readonly mExtensionCache: WeakMap<CoreEntityProcessorConstructor, ExtensionCache> = new WeakMap<CoreEntityProcessorConstructor, ExtensionCache>();

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
        // Read extensions from cache or build new extension information.
        const lExtensionSetupLists: ExtensionCache = (() => {
            // Try to read cached information.
            const lExtensionCache: ExtensionCache | undefined = CoreEntityExtendable.mExtensionCache.get(this.processorConstructor);
            if (lExtensionCache) {
                return lExtensionCache;
            }

            // On cache fail create new extension cache.
            const lExtensionRegister: CoreEntityRegister = new CoreEntityRegister();

            // Filter extension list.
            const lExtensionSetupList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = lExtensionRegister.get<ExtensionModuleConfiguration>(ExtensionModule);

            // Filter extension list.
            const lTargetExtensionSetupList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = lExtensionSetupList.filter((pSetup: CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>) => {
                for (const lRestriction of pSetup.processorConfiguration.targetRestrictions) {
                    if (this instanceof lRestriction || this.processorConstructor.prototype instanceof lRestriction || this.processorConstructor === lRestriction) {
                        return true;
                    }
                }

                return false;
            });

            // Filter setup list access types and create extension cache object.
            const lNewExtensionList: ExtensionCache = {
                read: lTargetExtensionSetupList.filter((pSetup: CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>) => { return pSetup.processorConfiguration.access === AccessMode.Read; }),
                write: lTargetExtensionSetupList.filter((pSetup: CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>) => { return pSetup.processorConfiguration.access === AccessMode.Write; }),
                readWrite: lTargetExtensionSetupList.filter((pSetup: CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>) => { return pSetup.processorConfiguration.access === AccessMode.ReadWrite; })
            };

            // Cache new build extensionlist.
            CoreEntityExtendable.mExtensionCache.set(this.processorConstructor, lNewExtensionList);

            return lNewExtensionList;
        })();

        // Create extension execution order list. First write than readwrite than read.
        const lOrderedExtensionList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = [...lExtensionSetupLists.write, ...lExtensionSetupLists.readWrite, ...lExtensionSetupLists.read];

        // Create every module extension.
        for (const lSetup of lOrderedExtensionList) {
            const lModuleExtension: ExtensionModule = new ExtensionModule(lSetup.processorConstructor, <CoreEntity><any>this, lSetup.processorConfiguration.trigger);
            lModuleExtension.setup();

            this.mExtensionList.push(lModuleExtension);
        }
    }
}

type ExtensionCache = {
    read: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>>;
    write: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>>;
    readWrite: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>>;
};

export type CoreEntityExtendableConstructorParameter<TProcessor extends object> = CoreEntityConstructorParameter<TProcessor>;