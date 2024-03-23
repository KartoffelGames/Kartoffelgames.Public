import { IComponentHierarchyParent } from '../interface/component-hierarchy.interface';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';
import { BaseExtension } from './base-extension';

export class ComponentExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ComponentExtensionConstructorParameter) {
        super(pParameter);
    }
}

type ComponentExtensionConstructorParameter = {
    constructor: IPwbExtensionProcessorClass,
    parent: IComponentHierarchyParent,
};