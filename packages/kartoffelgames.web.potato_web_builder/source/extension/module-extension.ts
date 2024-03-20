import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ModuleLayerValuesReference } from '..';
import { ComponentManager } from '../component/component-manager';
import { BasePwbTemplateNode } from '../component/template/nodes/base-pwb-template-node';
import { PwbTemplateAttribute } from '../component/template/nodes/pwb-template-xml-node';
import { LayerValues } from '../component/values/layer-values';
import { ModuleConstructorReference } from '../injection_reference/module/module-constructor-reference';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';
import { BaseExtension } from './base-extension';

export class ModuleExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ModuleExtensionConstructorParameter) {
        super(pParameter);

        // Create local injection mapping.
        this.setProcessorAttributes(ModuleConstructorReference, this.mLayerValues);
        this.setProcessorAttributes(ModuleLayerValuesReference, this.mLayerValues);
    }
}

type ModuleExtensionConstructorParameter = {
    // Base 
    extensionClass: IPwbExtensionProcessorClass,
    componentManager: ComponentManager,
    targetClass: InjectionConstructor,
    targetObject: object | null,

    // Module
    template: BasePwbTemplateNode,
    attribute: PwbTemplateAttribute | null, // Null for native text expressions.
    layerValues: LayerValues,
    element: Node | null;  // Null for multiplicator modules
};