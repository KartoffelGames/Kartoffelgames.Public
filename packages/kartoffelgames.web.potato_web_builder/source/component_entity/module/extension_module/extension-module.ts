import { BaseComponentEntity } from '../../base-component-entity';
import { BaseModule, IPwbModuleOnDeconstruct, IPwbModuleOnUpdate } from '../base-module';

export class ExtensionModule extends BaseModule<IPwbExtensionModuleProcessor> {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ModuleExtensionConstructorParameter) {
        super(pParameter);
    }

    /**
     * Update module.
     */
    public onUpdate(): boolean {
        if ('onUpdate' in this.processor) {
            return this.processor.onUpdate();
        }

        return false;
    }
}

type ModuleExtensionConstructorParameter = {
    constructor: IPwbExtensionModuleProcessorConstructor,
    parent: BaseComponentEntity,
};

// Interfaces.
export interface IPwbExtensionModuleOnUpdate extends IPwbModuleOnUpdate<boolean> { }
export interface IPwbExtensionModuleOnDeconstruct extends IPwbModuleOnDeconstruct { }
export interface IPwbExtensionModuleProcessor extends Partial<IPwbExtensionModuleOnDeconstruct>, Partial<IPwbExtensionModuleOnUpdate>{ }
export interface IPwbExtensionModuleProcessorConstructor {
    new(): IPwbExtensionModuleProcessor;
}
