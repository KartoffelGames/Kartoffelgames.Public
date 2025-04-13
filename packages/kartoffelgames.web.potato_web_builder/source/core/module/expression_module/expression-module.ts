import type { PwbTemplateExpression } from '../../component/template/nodes/values/pwb-template-expression.ts';
import type { UpdateTrigger } from '../../enum/update-trigger.enum.ts';
import { BaseModule, type BaseModuleConstructorParameter, type IPwbModuleProcessor, type IPwbModuleProcessorConstructor } from '../base-module.ts';
import { ModuleExpression } from '../injection_reference/module-expression.ts';
import { ModuleTargetNode } from '../injection_reference/module-target-node.ts';
import { ModuleTemplate } from '../injection_reference/module-template.ts';

export class ExpressionModule extends BaseModule<IPwbExpressionModuleProcessor> {
    private mLastResult: string | null;
    private readonly mTargetTextNode: Text;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: ExpressionModuleConstructorParameter) {
        super({
            applicationContext: pParameter.applicationContext,
            constructor: pParameter.constructor,
            parent: pParameter.parent,
            trigger: pParameter.trigger,
            values: pParameter.values
        });

        this.mTargetTextNode = pParameter.targetNode;

        // Set starting value of expression.
        this.mLastResult = null;

        // Set module value from template value.
        this.setProcessorAttributes(ExpressionModule, this);
        this.setProcessorAttributes(ModuleTemplate, pParameter.targetTemplate.clone());
        this.setProcessorAttributes(ModuleTargetNode, pParameter.targetNode);
        this.setProcessorAttributes(ModuleExpression, new ModuleExpression(pParameter.targetTemplate.value));
    }

    /**
     * Update expressions.
     * 
     * @remarks
     * Allways invokes {@link IPwbExpressionModuleOnUpdate.onUpdate} and decides on result if any update happened.
     */
    public onUpdate(): boolean {
        // Try to update expression when an onUpdate method is defined.
        let lNewValue: string | null = this.call<IExpressionOnUpdate, 'onUpdate'>('onUpdate', true);

        // Reset undefined to empty string.
        if (lNewValue === null) {
            lNewValue = '';
        }

        // Update value if new value was processed.
        const lValueHasChanged: boolean = this.mLastResult === null || this.mLastResult !== lNewValue;
        if (lValueHasChanged) {
            // Update text data of node.
            const lNode: Text = this.mTargetTextNode;
            lNode.data = lNewValue;

            // Save last value.
            this.mLastResult = lNewValue;
        }

        return lValueHasChanged;
    }
}

export type ExpressionModuleConstructorParameter = BaseModuleConstructorParameter<IPwbExpressionModuleProcessor> & {
    targetTemplate: PwbTemplateExpression,
    targetNode: Text;
};

/**
 * Interfaces.
 */
export interface IExpressionOnDeconstruct {
    onDeconstruct(): void;
}
export interface IExpressionOnUpdate {
    onUpdate(): string | null;
}
export interface IPwbExpressionModuleProcessor extends IPwbModuleProcessor, Partial<IExpressionOnUpdate>, Partial<IExpressionOnDeconstruct> { }
export interface IPwbExpressionModuleProcessorConstructor extends IPwbModuleProcessorConstructor<IPwbExpressionModuleProcessor> { }

/**
 * Register configuration.
 */
export type ExpressionModuleConfiguration = {
    trigger: UpdateTrigger;
};
