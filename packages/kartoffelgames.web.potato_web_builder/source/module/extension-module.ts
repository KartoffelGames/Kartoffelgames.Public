import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { IPwbExtensionModuleProcessor, IPwbExtensionModuleProcessorConstructor } from '../interface/module.interface';
import { BaseModule } from './base-module';

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
    parent: InjectionHierarchyParent,
};