import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { PwbTemplate } from '../../component/template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../../component/template/nodes/pwb-template-instruction-node';
import { LayerValues } from '../../component/values/layer-values';
import { PwbInstructionModule } from '../../decorator/pwb-instruction-module.decorator';
import { ComponentLayerValuesReference } from '../../injection_reference/component/component-layer-values-reference';
import { ModuleTemplateReference } from '../../injection_reference/module/module-template-reference';
import { ModuleValueReference } from '../../injection_reference/module/module-value-reference';
import { IPwbInstructionModuleOnUpdate } from '../../interface/module.interface';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { InstructionResult } from '../../module/result/instruction-result';

/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] of [List] (;[CustomIndexName] = $index)?"
 */
@PwbInstructionModule({
    instructionType: 'for'
})
export class ForInstructionModule implements IPwbInstructionModuleOnUpdate {
    private readonly mCompareHandler: CompareHandler<any>;
    private readonly mInstruction: string;
    private readonly mLayerValues: LayerValues;
    private readonly mTemplate: PwbTemplateInstructionNode;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplate: ModuleTemplateReference, pLayerValues: ComponentLayerValuesReference, pAttributeValue: ModuleValueReference) {
        this.mTemplate = <PwbTemplateInstructionNode>pTemplate;
        this.mLayerValues = pLayerValues;
        this.mInstruction = pAttributeValue.toString();
        this.mCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
    }

    /**
     * Process module.
     * Execute attribute value and decide if template should be rendered.
     */
    public onUpdate(): InstructionResult | null {
        // [CustomName:1] of [List value:2] (;[CustomIndexName:4]=[Index calculating with "index" as key:5])?
        const lRegexAttributeInformation: RegExp = new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/);

        // If attribute value does match regex.
        const lAttributeInformation: RegExpExecArray | null = lRegexAttributeInformation.exec(this.mInstruction);
        if (lAttributeInformation) {

            // Split match into useable parts.
            const lExpression: ForOfExpression = {
                variable: lAttributeInformation[1],
                value: lAttributeInformation[2],
                indexName: lAttributeInformation[4],
                indexExpression: lAttributeInformation[5]
            };

            // Create module result that watches for changes in [PropertyName].
            const lModuleResult: InstructionResult = new InstructionResult();

            // Try to get list object from component values.
            const lListObject: { [key: string]: any; } = ComponentScopeExecutor.executeSilent(lExpression.value, this.mLayerValues);

            // Skip if values are the same.
            if (this.mCompareHandler.compareAndUpdate(lListObject)) {
                return null;
            }

            // Only proceed if value is added to html element.
            if (typeof lListObject === 'object' && lListObject !== null || Array.isArray(lListObject)) {
                // Iterator iterator and
                if (Symbol.iterator in lListObject) {
                    const lIterator: Generator<any, any> = <Generator<any, any>>lListObject;
                    let lIndex: number = 0;
                    for (const lValue of lIterator) {
                        // Add new template item and count index.
                        this.addTempateForElement(lModuleResult, lExpression, lValue, lIndex++);
                    }
                } else {
                    for (const lListObjectKey in lListObject) {
                        this.addTempateForElement(lModuleResult, lExpression, lListObject[lListObjectKey], lListObjectKey);
                    }
                }

                return lModuleResult;
            } else {
                // Just ignore. Can be changed later.
                return null;
            }
        } else {
            throw new Exception(`For-Parameter value has wrong format: ${this.mInstruction}`, this);
        }
    }

    /**
     * Add template for element function.
     * @param pModuleResult - module result.
     * @param pExpression - for of expression.
     * @param pObjectValue - value.
     * @param pObjectKey - value key.
     */
    private readonly addTempateForElement = (pModuleResult: InstructionResult, pExpression: ForOfExpression, pObjectValue: any, pObjectKey: number | string) => {
        const lComponentValues: LayerValues = new LayerValues(this.mLayerValues);
        lComponentValues.setLayerValue(pExpression.variable, pObjectValue);

        // If custom index is used.
        if (pExpression.indexName) {
            // Add index key as extenal value to execution.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$index', pObjectKey);

            // Execute index expression. Expression is set when index name is set.
            const lIndexExpressionResult: any = ComponentScopeExecutor.executeSilent(<string>pExpression.indexExpression, lComponentValues, lExternalValues);

            // Set custom index name as temporary value.
            lComponentValues.setLayerValue(pExpression.indexName, lIndexExpressionResult);
        }

        // Create template.
        const lTemplate: PwbTemplate = new PwbTemplate();
        lTemplate.appendChild(...this.mTemplate.childList);

        // Add element.
        pModuleResult.addElements(lTemplate, lComponentValues);
    };
}

type ForOfExpression = {
    variable: string,
    value: string,
    indexName?: string,
    indexExpression?: string;
};