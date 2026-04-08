import type { IDeconstructable } from '@kartoffelgames/core';
import { AccessMode } from '../enum/access-mode.enum.ts';
import { ExtensionModule, type ExtensionModuleConfiguration } from '../extension/extension-module.ts';
import { CoreEntityRegister, type CoreEntityProcessorConstructorSetup } from './core-entity-register.ts';
import { CoreEntity, CoreEntityProcessor, type CoreEntityConstructorParameter, type CoreEntityProcessorConstructor } from './core-entity.ts';

/**
 * Core entity that initializes extensions.
 */
export abstract class CoreEntityExtendable<TProcessor extends CoreEntityProcessor> extends CoreEntity<TProcessor> implements IDeconstructable {
    private static readonly mExtensionCache: WeakMap<CoreEntityProcessorConstructor, ExtensionCache> = new WeakMap<CoreEntityProcessorConstructor, ExtensionCache>();

    private readonly mExtensionList: Array<ExtensionModule>;

    /**
     * Constructor.
     * 
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: CoreEntityExtendableConstructorParameter<TProcessor>) {
        super(pParameter);

        this.mExtensionList = new Array<ExtensionModule>();

        // Apply extensions.
        this.executeExtensions();
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
    private executeExtensions(): void {
        // Read extensions from cache or build new extension information.
        const lExtensionSetupLists: ExtensionCache = (() => {
            // Check and initialize cache for processor constructor when it doesn't exist.
            if (!CoreEntityExtendable.mExtensionCache.has(this.processorConstructor)) {
                // Filter extension list.
                const lExtensionSetupList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = CoreEntityRegister.get<ExtensionModuleConfiguration>(ExtensionModule);

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
            }

            // Read cached information.
            return CoreEntityExtendable.mExtensionCache.get(this.processorConstructor)!;
        })();

        // Create extension execution order list. First write than readwrite than read.
        const lOrderedExtensionList: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>> = [...lExtensionSetupLists.write, ...lExtensionSetupLists.readWrite, ...lExtensionSetupLists.read];

        // Create every module extension.
        for (const lSetup of lOrderedExtensionList) {
            this.mExtensionList.push(new ExtensionModule(lSetup.processorConstructor, <CoreEntity><any>this));
        }
    }
}

type ExtensionCache = {
    read: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>>;
    write: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>>;
    readWrite: Array<CoreEntityProcessorConstructorSetup<ExtensionModuleConfiguration>>;
};

export type CoreEntityExtendableConstructorParameter<TProcessor extends CoreEntityProcessor> = CoreEntityConstructorParameter<TProcessor>;