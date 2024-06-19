import { AccessMode } from '../../../enum/access-mode.enum';
import { PwbTemplateAttribute } from '../../component/template/nodes/values/pwb-template-attribute';
import { LayerValues } from '../../component/values/layer-values';
import { ModuleKeyReference } from '../../injection-reference/module/module-key-reference';
import { ModuleLayerValuesReference } from '../../injection-reference/module/module-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection-reference/module/module-target-node-reference';
import { ModuleTemplateReference } from '../../injection-reference/module/module-template-reference';
import { ModuleValueReference } from '../../injection-reference/module/module-value-reference';
import { BaseUserEntity } from '../../user_entity/base-user-entity';
import { BaseModule, IPwbModuleOnDeconstruct, IPwbModuleOnUpdate, IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../base-module';

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
        super(pParameter.constructor, pParameter.parent);

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
    public onUpdate(): boolean {
        if ('onUpdate' in this.processor) {
            return this.processor.onUpdate();
        }

        return false;
    }
}

export type StaticModuleConstructorParameter = {
    accessMode: AccessMode,
    constructor: IPwbAttributeModuleProcessorConstructor,
    targetTemplate: PwbTemplateAttribute,
    values: LayerValues,
    parent: BaseUserEntity,
    targetNode: Element;
};

// Interfaces.
export interface IPwbAttributeModuleOnUpdate extends IPwbModuleOnUpdate<boolean> { }
export interface IPwbAttributeModuleOnDeconstruct extends IPwbModuleOnDeconstruct { }
export interface IPwbAttributeModuleProcessor extends IPwbModuleProcessor, Partial<IPwbAttributeModuleOnUpdate>, Partial<IPwbAttributeModuleOnDeconstruct> { }
export interface IPwbAttributeModuleProcessorConstructor extends IPwbModuleProcessorConstructor<IPwbAttributeModuleProcessor> { }