import { IDeconstructable } from '@kartoffelgames/core.data';
import { BaseUserEntity, IUserProcessor } from '../user_entity/base-user-entity';

export class ExtensionModule extends BaseUserEntity<IPwbExtensionModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pConstructor: IPwbExtensionModuleProcessorConstructor, pParent: BaseUserEntity | null,) {
        super(pConstructor, pParent);

        // Call execution hook.
        if ('onExecution' in this.processor) {
            this.processor.onExecution();
        }
    }
}

// Interfaces.
export interface IPwbExtensionModuleOnExecute {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onExecution(): void;
}

export interface IPwbExtensionModuleProcessor extends IUserProcessor, Partial<IPwbExtensionModuleOnExecute> { }
export interface IPwbExtensionModuleProcessorConstructor {
    new(): IPwbExtensionModuleProcessor;
}
