import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { IPwbExtensionModuleProcessorConstructor } from '../interface/extension.interface';
import { BaseExtension } from './base-extension';

export class ExtensionModule extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ModuleExtensionConstructorParameter) {
        super(pParameter);
    }
}

type ModuleExtensionConstructorParameter = {
    constructor: IPwbExtensionModuleProcessorConstructor,
    parent: InjectionHierarchyParent,
};