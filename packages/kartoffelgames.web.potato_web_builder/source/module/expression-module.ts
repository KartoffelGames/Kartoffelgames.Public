import { PwbTemplateExpression } from '../component/template/nodes/values/pwb-template-expression';
import { LayerValues } from '../component/values/layer-values';
import { ModuleValueReference } from '../injection_reference/module/module-value-reference';
import { IComponentHierarchyParent } from '../interface/component-hierarchy.interface';
import { IPwbExpressionModuleProcessor, IPwbExpressionModuleProcessorConstructor } from '../interface/module.interface';
import { BaseModule } from './base-module';

export class ExpressionModule extends BaseModule<Text, IPwbExpressionModuleProcessor> {
    private mLastResult: string | null;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: ExpressionModuleConstructorParameter) {
        super({
            constructor: pParameter.constructor,
            targetTemplate: pParameter.targetTemplate,
            values: pParameter.values,
            parent: pParameter.parent,
            targetNode: pParameter.targetNode
        });

        // Set starting value of expression.
        this.mLastResult = null;

        // Set module value from template value.
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
        let lNewValue: string | undefined = undefined;
        if ('onUpdate' in this.processor) {
            lNewValue = this.processor.onUpdate();
        }

        // Reset undefined to empty string.
        if (typeof lNewValue === 'undefined') {
            lNewValue = '';
        }

        // Update value if new value was processed.
        const lValueHasChanged: boolean = this.mLastResult === null || this.mLastResult !== lNewValue;
        if (lValueHasChanged) {
            // Update text data of node.
            const lNode: Text = this.node;
            lNode.data = lNewValue;

            // Save last value.
            this.mLastResult = lNewValue;
        }

        return lValueHasChanged;
    }
}

export type ExpressionModuleConstructorParameter = {
    constructor: IPwbExpressionModuleProcessorConstructor,
    targetTemplate: PwbTemplateExpression,
    values: LayerValues,
    parent: IComponentHierarchyParent,
    targetNode: Text;
};