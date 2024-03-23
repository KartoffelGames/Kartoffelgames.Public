import { IComponentHierarchyParent } from '../interface/component-hierarchy.interface';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';
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
    constructor: IPwbExtensionProcessorClass,
    parent: IComponentHierarchyParent,
};