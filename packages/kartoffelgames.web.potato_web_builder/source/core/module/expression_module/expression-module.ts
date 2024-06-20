import { PwbTemplateExpression } from '../../component/template/nodes/values/pwb-template-expression';
import { LayerValues } from '../../component/values/layer-values';
import { ModuleLayerValuesReference } from '../../injection-reference/module/module-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection-reference/module/module-target-node-reference';
import { ModuleTemplateReference } from '../../injection-reference/module/module-template-reference';
import { ModuleValueReference } from '../../injection-reference/module/module-value-reference';
import { BaseModule, BaseModuleConstructorParameter, IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../base-module';
import { UpdateTrigger } from '../../../enum/update-trigger.enum';

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
            interactionTrigger: pParameter.interactionTrigger
        });

        this.mTargetTextNode = pParameter.targetNode;

        // Set starting value of expression.
        this.mLastResult = null;

        // Set module value from template value.
        this.setProcessorAttributes(ModuleTemplateReference, pParameter.targetTemplate.clone());
        this.setProcessorAttributes(ModuleTargetNodeReference, pParameter.targetNode);
        this.setProcessorAttributes(ModuleLayerValuesReference, pParameter.values);
        this.setProcessorAttributes(ModuleValueReference, pParameter.targetTemplate.value);
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
    values: LayerValues;
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
