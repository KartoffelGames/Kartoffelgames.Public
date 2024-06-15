import { PwbTemplateAttribute } from '../component/template/nodes/values/pwb-template-attribute';
import { LayerValues } from '../component/values/layer-values';
import { AccessMode } from '../enum/access-mode.enum';
import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { ModuleKeyReference } from '../injection/references/module/module-key-reference';
import { ModuleValueReference } from '../injection/references/module/module-value-reference';
import { IPwbAttributeModuleProcessor, IPwbAttributeModuleProcessorConstructor } from '../interface/module.interface';
import { BaseModule } from './base-module';

export class AttributeModule extends BaseModule<Element, IPwbAttributeModuleProcessor> {
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
            constructor: pParameter.constructor,
            targetTemplate: pParameter.targetTemplate,
            values: pParameter.values,
            parent: pParameter.parent,
            targetNode: pParameter.targetNode
        });

        // Save module access mode.
        this.mAccessMode = pParameter.accessMode;

        // Set processor attribute values from injection template.
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
    parent: InjectionHierarchyParent,
    targetNode: Element;
};