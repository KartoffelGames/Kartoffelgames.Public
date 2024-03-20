import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { BasePwbTemplateNode } from '../component/template/nodes/base-pwb-template-node';
import { PwbTemplateAttribute } from '../component/template/nodes/pwb-template-xml-node';
import { LayerValues } from '../component/values/layer-values';
import { ModuleAttributeReference } from '../injection_reference/module-attribute-reference';
import { ComponentLayerValuesReference } from '../injection_reference/general/component-layer-values-reference';
import { ModuleTargetNode } from '../injection_reference/module/module-target-node-reference';
import { ModuleTemplateReference } from '../injection_reference/module/module-template-reference';
import { BaseExtension } from './base-extension';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';

export class ModuleExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ModuleExtensionConstructorParameter) {
        super(pParameter);

        // Create local injection mapping.
        const lInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
        lInjections.set(ModuleTemplateReference, new ModuleTemplateReference(pParameter.template));
        if (pParameter.attribute !== null) {
            lInjections.set(ModuleAttributeReference, new ModuleAttributeReference(pParameter.attribute));
        }
        lInjections.set(ComponentLayerValuesReference, new ComponentLayerValuesReference(pParameter.layerValues));
        lInjections.set(ModuleTargetNode, new ModuleTargetNode(pParameter.element));

        // Create extension.
        this.createExtensionProcessor(lInjections);
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