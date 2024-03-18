import { ComponentManager } from '../component/component-manager';
import { PwbTemplateAttribute } from '../component/template/nodes/values/pwb-template-attribute';
import { LayerValues } from '../component/values/layer-values';
import { ModuleAccessMode } from '../enum/module-access-mode';
import { ModuleKeyReference } from '../injection_reference/module/module-key-reference';
import { ModuleValueReference } from '../injection_reference/module/module-value-reference';
import { IPwbAttributeModuleProcessor } from '../interface/module';
import { BaseModule } from './base-module';
import { AttributeModuleConfiguration } from './global-module-storage';

export class AttributeModule extends BaseModule<Element, IPwbAttributeModuleProcessor> {
    private readonly mAccessMode: ModuleAccessMode;

    /**
     * If modules reads data into the view.
     */
    public get isReading(): boolean {
        return (this.mAccessMode & ModuleAccessMode.Read) === ModuleAccessMode.Read;
    }

    /**
     * If modules writes data out of the view.
     */
    public get isWriting(): boolean {
        return (this.mAccessMode & ModuleAccessMode.Write) === ModuleAccessMode.Write;
    }

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: StaticModuleConstructorParameter) {
        super(pParameter);

        // Save module access mode.
        this.mAccessMode = pParameter.module.access;

        // Set processor attribute values from injection template.
        this.setProcessorAttributes(ModuleValueReference, pParameter.targetTemplate.name);
        this.setProcessorAttributes(ModuleKeyReference, pParameter.targetTemplate.values.toString());
    }

    /**
     * Update module.
     */
    public update(): boolean {
        if ('onUpdate' in this.processor) {
            return this.processor.onUpdate();
        }

        return false;
    }
}

export type StaticModuleConstructorParameter = {
    module: AttributeModuleConfiguration,
    targetTemplate: PwbTemplateAttribute,
    values: LayerValues,
    componentManager: ComponentManager,
    targetNode: Element;
};