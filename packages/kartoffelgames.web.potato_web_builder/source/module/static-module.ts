import { ComponentManager } from '../component/component-manager';
import { PwbTemplateAttribute, PwbTemplateXmlNode } from '../component/template/nodes/pwb-template-xml-node';
import { LayerValues } from '../component/values/layer-values';
import { BaseModule } from './base-module';
import { IPwbAttributeModuleProcessorConstructor, IPwbAttributeModuleObject, ModuleDefinition } from '../interface/module';

export class StaticModule extends BaseModule<boolean, boolean> {
    private readonly mModuleObject: IPwbAttributeModuleObject;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: StaticModuleConstructorParameter) {
        super(pParameter);

        // Create module object with attribute value. Attribute is always set for static modules.
        const lAttribute: PwbTemplateAttribute = this.attribute!;
        this.mModuleObject = this.createModuleObject(lAttribute.asText);
    }

    /**
     * Update module.
     */
    public update(): boolean {
        return this.mModuleObject.onUpdate?.() ?? false;
    }
}

export type StaticModuleConstructorParameter = {
    moduleDefinition: ModuleDefinition,
    moduleClass: IPwbAttributeModuleProcessorConstructor,
    targetTemplate: PwbTemplateXmlNode,
    targetAttribute: PwbTemplateAttribute,
    values: LayerValues,
    componentManager: ComponentManager,
    targetNode: Element;
};