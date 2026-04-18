import type { PwbTemplateAttribute } from '../../component/template/nodes/values/pwb-template-attribute.ts';
import type { AccessMode } from '../../enum/access-mode.enum.ts';
import { BaseModule, type BaseModuleConstructorParameter, type IPwbModuleProcessor, type IPwbModuleProcessorConstructor } from '../base-module.ts';
import { ModuleAttribute } from '../injection_reference/module-attribute.ts';
import { ModuleTargetNode } from '../injection_reference/module-target-node.ts';
import { ModuleTemplate } from '../injection_reference/module-template.ts';

/**
 * Module for attribute instructions.
 * This module can react to changes in attributes but cant update or add any DOM elements.
 */
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
    public constructor(pParameter: AttributeModuleConstructorParameter) {
        super({
            constructor: pParameter.constructor,
            parent: pParameter.parent,
            values: pParameter.values,
        });

        // Save module access mode.
        this.mAccessMode = pParameter.accessMode;

        // Set processor attribute values from injection template.
        this.setProcessorInjection(AttributeModule, this);
        this.setProcessorInjection(ModuleTemplate, pParameter.targetTemplate.clone());
        this.setProcessorInjection(ModuleTargetNode, pParameter.targetNode);
        this.setProcessorInjection(ModuleAttribute, new ModuleAttribute(pParameter.targetTemplate.name, pParameter.targetTemplate.values.toString()));
    }

    /**
     * Update module.
     */
    protected override onUpdate(): boolean {
        return this.call<IAttributeOnUpdate, 'onUpdate'>('onUpdate') ?? false;
    }
}

export type AttributeModuleConstructorParameter = BaseModuleConstructorParameter<IPwbAttributeModuleProcessor> & {
    accessMode: AccessMode,
    targetTemplate: PwbTemplateAttribute,
    targetNode: Element;
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
};