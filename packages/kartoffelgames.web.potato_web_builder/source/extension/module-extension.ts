import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { IPwbExtensionModuleProcessorClass } from '../interface/extension.interface';
import { BaseExtension } from './base-extension';

export class ModuleExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ModuleExtensionConstructorParameter) {
        super(pParameter);
    }
}

type ModuleExtensionConstructorParameter = {
    constructor: IPwbExtensionModuleProcessorClass,
    parent: InjectionHierarchyParent,
};