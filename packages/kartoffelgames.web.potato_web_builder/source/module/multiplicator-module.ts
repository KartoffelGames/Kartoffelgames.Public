import { Exception } from '@kartoffelgames/core.data';
import { ComponentManager } from '../component/component-manager';
import { ElementCreator } from '../component/element-creator';
import { PwbTemplateInstructionNode } from '../component/template/nodes/pwb-template-instruction-node';
import { LayerValues } from '../component/values/layer-values';
import { BaseModule } from './base-module';
import { InstructionModuleConfiguration } from './global-module-storage';
import { MultiplicatorResult } from './result/multiplicator-result';

export class MultiplicatorModule extends BaseModule<Comment, MultiplicatorResult> {
    private readonly mModuleObject: IPwbInstructionModuleObject;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: MultiplicatorModuleConstructorParameter) {
        super({
            ...pParameter,
            targetNode: ElementCreator.createComment('InstructionModule-Node')
        });

        // Attribute is always set for multiplicator modules.
        const lAttribute: PwbTemplateAttribute = this.attribute!;
        this.mModuleObject = this.createModuleObject(lAttribute.asText);
    }

    /**
     * Update module.
     */
    public update(): boolean {
        if (!this.mModuleObject.onUpdate) {
            throw new Exception('Multiplicator modules need to implement IPwbMultiplicatorModuleOnUpdate', this);
        }

        // TODO: Save updateResult.

        return this.mModuleObject.onUpdate();
    }
}

export type MultiplicatorModuleConstructorParameter = {
    module: InstructionModuleConfiguration,
    targetTemplate: PwbTemplateInstructionNode,
    values: LayerValues,
    componentManager: ComponentManager,
};