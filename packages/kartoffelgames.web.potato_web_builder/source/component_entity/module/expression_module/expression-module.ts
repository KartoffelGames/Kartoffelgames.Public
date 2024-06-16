import { BaseComponentEntity } from '../../base-component-entity';
import { PwbTemplateExpression } from '../../component/template/nodes/values/pwb-template-expression';
import { LayerValues } from '../../component/values/layer-values';
import { ModuleLayerValuesReference } from '../../injection-reference/module/module-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection-reference/module/module-target-node-reference';
import { ModuleTemplateReference } from '../../injection-reference/module/module-template-reference';
import { ModuleValueReference } from '../../injection-reference/module/module-value-reference';
import { BaseModule, IPwbModuleOnDeconstruct, IPwbModuleOnUpdate, IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../base-module';

export class ExpressionModule extends BaseModule<IPwbExpressionModuleProcessor> {
    private mLastResult: string | null;
    private readonly mTargetTextNode: Text;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: ExpressionModuleConstructorParameter) {
        super({
            constructor: pParameter.constructor,
            parent: pParameter.parent
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
    public onUpdate(): boolean {
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
            const lNode: Text = this.mTargetTextNode;
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
    parent: BaseComponentEntity,
    targetNode: Text;
};

// Interfaces.
export interface IPwbExpressionModuleOnUpdate extends IPwbModuleOnUpdate<string> { }
export interface IPwbExpressionModuleOnDeconstruct extends IPwbModuleOnDeconstruct { }
export interface IPwbExpressionModuleProcessor extends IPwbModuleProcessor, Partial<IPwbExpressionModuleOnUpdate>, Partial<IPwbExpressionModuleOnDeconstruct> { }
export interface IPwbExpressionModuleProcessorConstructor extends IPwbModuleProcessorConstructor<IPwbExpressionModuleProcessor> { }
