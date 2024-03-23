import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../component/values/layer-values';
import { PwbInstructionModule } from '../../decorator/pwb-instruction-module.decorator';
import { IPwbInstructionModuleOnUpdate } from '../../interface/module.interface';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ComponentValuesReference } from '../../injection_reference/component/component-values-reference';
import { ModuleTemplateReference } from '../../injection_reference/module/module-template-reference';
import { InstructionResult } from '../../module/result/instruction-result';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { PwbTemplateXmlNode } from '../../component/template/nodes/pwb-template-xml-node';

/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] of [List] (;[CustomIndexName] = $index)?"
 */
@PwbInstructionModule({
    selector: /^\*pwbFor$/
})
export class ForOfManipulatorAttributeModule implements IPwbInstructionModuleOnUpdate {
    private readonly mAttributeReference: ModuleAttributeReference;
    private readonly mCompareHandler: CompareHandler<any>;
    private readonly mTemplateReference: ModuleTemplateReference;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTemplateReference - Target templat.
     * @param pValueReferece - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplateReference: ModuleTemplateReference, pValueReferece: ComponentValuesReference, pAttributeReference: ModuleAttributeReference) {
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueReferece.value;
        this.mAttributeReference = pAttributeReference;
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
        const lAttributeInformation: RegExpExecArray | null = lRegexAttributeInformation.exec(this.mAttributeReference.value.asText);
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
            const lListObject: { [key: string]: any; } = ComponentScopeExecutor.executeSilent(lExpression.value, this.mValueHandler);

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
            throw new Exception(`pwbFor-Paramater value has wrong format: ${this.mAttributeReference.value.values.toString()}`, this);
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
        const lClonedTemplate: PwbTemplateXmlNode = <PwbTemplateXmlNode>this.mTemplateReference.value.clone();
        const lComponentValues: LayerValues = new LayerValues(this.mValueHandler);
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

        // Add element.
        pModuleResult.addElement(lClonedTemplate, lComponentValues);
    };
}

type ForOfExpression = {
    variable: string,
    value: string,
    indexName?: string,
    indexExpression?: string;
};