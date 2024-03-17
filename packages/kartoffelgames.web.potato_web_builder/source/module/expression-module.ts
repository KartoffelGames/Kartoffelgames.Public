import { ComponentManager } from '../component/component-manager';
import { PwbTemplateExpression } from '../component/template/nodes/values/pwb-template-expression';
import { LayerValues } from '../component/values/layer-values';
import { BaseModule } from './base-module';
import { ExpressionModuleConfiguration } from './global-module-storage';

export class ExpressionModule extends BaseModule<Text, string> {
    private mLastResult: string | undefined;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: ExpressionModuleConstructorParameter) {
        super({
            module: pParameter.module,
            targetTemplate: pParameter.targetTemplate,
            values: pParameter.values,
            componentManager: pParameter.componentManager,
            targetNode: pParameter.targetNode,
        });

        // Set starting value of expression.
        this.mLastResult = undefined;

        // Get value from attribute or use target textnode.
        this.setProcessorAttributes(pParameter.targetTemplate.value);
    }

    /**
     * Update expressions.
     */
    public update(): boolean {
        // Reduce process list to single string.
        const lNewValue: string = this.processor.onUpdate();

        // Update value if new value was processed.
        const lValueHasChanged: boolean = this.mLastResult !== lNewValue;
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
    module: ExpressionModuleConfiguration,
    targetTemplate: PwbTemplateExpression,
    values: LayerValues,
    componentManager: ComponentManager,
    targetNode: Text;
};