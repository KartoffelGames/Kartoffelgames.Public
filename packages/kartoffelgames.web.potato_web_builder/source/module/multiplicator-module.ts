import { Exception } from '@kartoffelgames/core.data';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { IPwbMultiplicatorModuleClass, IPwbMultiplicatorModuleObject, ModuleDefinition } from './interface/module';
import { BaseModule } from './base-module';
import { MultiplicatorResult } from './result/multiplicator-result';
import { PwbTemplateAttribute, PwbTemplateXmlNode } from '../component/template/nodes/pwb-template-xml-node';

export class MultiplicatorModule extends BaseModule<MultiplicatorResult | null, MultiplicatorResult> {
    private readonly mModuleObject: IPwbMultiplicatorModuleObject;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: MultiplicatorModuleConstructorParameter) {
        super({
            ...pParameter,
            targetNode: null
        });

        // Attribute is always set for multiplicator modules.
        const lAttribute: PwbTemplateAttribute = this.attribute!;
        this.mModuleObject = this.createModuleObject(lAttribute.value);
    }

    /**
     * Update module.
     */
    public update(): MultiplicatorResult | null {
        if (!this.mModuleObject.onUpdate) {
            throw new Exception('Multiplicator modules need to implement IPwbMultiplicatorModuleOnUpdate', this);
        }

        return this.mModuleObject.onUpdate();
    }
}

export type MultiplicatorModuleConstructorParameter = {
    moduleDefinition: ModuleDefinition,
    moduleClass: IPwbMultiplicatorModuleClass,
    targetTemplate: PwbTemplateXmlNode,
    targetAttribute: PwbTemplateAttribute,
    values: LayerValues,
    componentManager: ComponentManager,
};