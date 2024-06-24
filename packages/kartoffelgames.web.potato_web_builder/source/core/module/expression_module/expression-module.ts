import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { PwbTemplateExpression } from '../../component/template/nodes/values/pwb-template-expression';
import { ModuleTargetNode } from '../injection_reference/module-target-node';
import { ModuleTemplate } from '../injection_reference/module-template';
import { BaseModule, BaseModuleConstructorParameter, IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../base-module';
import { ModuleExpression } from '../injection_reference/module-expression';

export class ExpressionModule extends BaseModule<IPwbExpressionModuleProcessor> {
    private mLastResult: string | null;
    private readonly mTargetTextNode: Text;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: ExpressionModuleConstructorParameter) {
        super({
            processorConstructor: pParameter.processorConstructor,
            parent: pParameter.parent,
            interactionTrigger: pParameter.interactionTrigger,
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
    public update(): boolean {
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
