import { AccessMode } from '../../../enum/access-mode.enum';
import { UpdateTrigger } from '../../../enum/update-trigger.enum';
import { PwbTemplateAttribute } from '../../component/template/nodes/values/pwb-template-attribute';
import { LayerValues } from '../../component/values/layer-values';
import { ModuleKeyReference } from '../../injection-reference/module/module-key-reference';
import { ModuleLayerValuesReference } from '../../injection-reference/module/module-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection-reference/module/module-target-node-reference';
import { ModuleTemplateReference } from '../../injection-reference/module/module-template-reference';
import { ModuleValueReference } from '../../injection-reference/module/module-value-reference';
import { BaseModule, BaseModuleConstructorParameter, IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../base-module';

export class AttributeModule extends BaseModule<IPwbAttributeModuleProcessor> {
    private readonly mAccessMode: AccessMode;

    /**
     * Module access mode in view.
     */
    public get accessMode(): AccessMode {
        return this.mAccessMode;
    }

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: StaticModuleConstructorParameter) {
        super({
            processorConstructor: pParameter.processorConstructor,
            parent: pParameter.parent,
            interactionTrigger: pParameter.interactionTrigger
        });

        // Save module access mode.
        this.mAccessMode = pParameter.accessMode;

        // Set processor attribute values from injection template.
        this.setProcessorAttributes(ModuleTemplateReference, pParameter.targetTemplate.clone());
        this.setProcessorAttributes(ModuleTargetNodeReference, pParameter.targetNode);
        this.setProcessorAttributes(ModuleLayerValuesReference, pParameter.values);
        this.setProcessorAttributes(ModuleKeyReference, pParameter.targetTemplate.name);
        this.setProcessorAttributes(ModuleValueReference, pParameter.targetTemplate.values.toString());
    }

    /**
     * Update module.
     */
    public update(): boolean {
        return this.call<IAttributeOnUpdate, 'onUpdate'>('onUpdate', true) ?? false;
    }
}

export type StaticModuleConstructorParameter = BaseModuleConstructorParameter<IPwbAttributeModuleProcessor> & {
    accessMode: AccessMode,
    targetTemplate: PwbTemplateAttribute,
    targetNode: Element;
    values: LayerValues;
};

/**
 * Interfaces.
 */
export interface IAttributeOnDeconstruct {
    onDeconstruct(): void;
}
export interface IAttributeOnUpdate {
    onUpdate(): boolean;
}
export interface IPwbAttributeModuleProcessor extends IPwbModuleProcessor, Partial<IAttributeOnUpdate>, Partial<IAttributeOnDeconstruct> { }
export interface IPwbAttributeModuleProcessorConstructor extends IPwbModuleProcessorConstructor<IPwbAttributeModuleProcessor> { }

/**
 * Register configuration.
 */
export type AttributeModuleConfiguration = {
    access: AccessMode;
    selector: RegExp;
    trigger: UpdateTrigger;
};