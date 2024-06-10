import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { PwbTemplate } from '../../component/template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../../component/template/nodes/pwb-template-instruction-node';
import { LayerValues } from '../../component/values/layer-values';
import { PwbInstructionModule } from '../../decorator/pwb-instruction-module.decorator';
import { ModuleLayerValuesReference } from '../../injection/references/module/module-layer-values-reference';
import { ModuleTemplateReference } from '../../injection/references/module/module-template-reference';
import { ModuleValueReference } from '../../injection/references/module/module-value-reference';
import { IPwbInstructionModuleOnUpdate } from '../../interface/module.interface';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { InstructionResult } from '../../module/result/instruction-result';
import { ComponentUpdateHandlerReference } from '../../injection/references/component/component-update-handler-reference';
import { UpdateHandler } from '../../component/handler/update-handler';

/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] of [List] (;[CustomIndexName] = $index)?"
 */
@PwbInstructionModule({
    instructionType: 'for'
})
export class ForInstructionModule implements IPwbInstructionModuleOnUpdate {
    private readonly mExpression: ForOfExpression;
    private mLastEntries: Array<[string, any]>;
    private readonly mLayerValues: LayerValues;
    private readonly mTemplate: PwbTemplateInstructionNode;
    private readonly mUpdateHandler: UpdateHandler;


    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplate: ModuleTemplateReference, pLayerValues: ModuleLayerValuesReference, pAttributeValue: ModuleValueReference, pUpdateHandler: ComponentUpdateHandlerReference) {
        this.mTemplate = <PwbTemplateInstructionNode>pTemplate;
        this.mLayerValues = pLayerValues;
        this.mUpdateHandler = pUpdateHandler;
        this.mLastEntries = new Array<[string, any]>();

        const lInstruction = pAttributeValue.toString();

        // [CustomName:1] of [List value:2] (;[CustomIndexName:4]=[Index calculating with "index" as key:5])?
        const lRegexAttributeInformation: RegExp = new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/);

        // If attribute value does match regex.
        const lAttributeInformation: RegExpExecArray | null = lRegexAttributeInformation.exec(lInstruction);
        if (!lAttributeInformation) {
            throw new Exception(`For-Parameter value has wrong format: ${lInstruction}`, this);
        }

        // Split match into useable parts.
        this.mExpression = {
            variable: lAttributeInformation[1],
            value: lAttributeInformation[2],
            indexName: lAttributeInformation[4],
            indexExpression: lAttributeInformation[5]
        };
    }

    /**
     * Process module.
     * Execute attribute value and decide if template should be rendered.
     */
    public onUpdate(): InstructionResult | null {
        // Create module result that watches for changes in [PropertyName].
        const lModuleResult: InstructionResult = new InstructionResult();

        // Try to get list object from component values.
        const lExpressionResult: { [key: string]: any; } = ComponentScopeExecutor.executeSilent(this.mExpression.value, this.mLayerValues);

        // Only proceed if value is added to html element.
        if (typeof lExpressionResult === 'object' && lExpressionResult !== null || Array.isArray(lExpressionResult)) {
            // Create entries from object, generator or array. In Silent zone.
            const lListObjectEntries: Array<[string, any]> = this.mUpdateHandler.disableInteractionTrigger(() => {
                if (Symbol.iterator in lExpressionResult) {
                    return Object.entries([...<Iterable<any>>lExpressionResult]);
                } else {
                    return Object.entries(lExpressionResult);
                }
            });

            // Skip if values are the same.
            if (this.compareEntires(lListObjectEntries, this.mLastEntries)) {
                return null;
            }

            this.mLastEntries = lListObjectEntries;

            // Iterator iterator and
            for (const [lEntryKey, lEntryValue] of lListObjectEntries) {
                // Add new template for every entry.
                this.addTemplateForElement(lModuleResult, this.mExpression, lEntryValue, lEntryKey);
            }

            return lModuleResult;
        } else {
            // Just ignore. Can be changed later.
            return null;
        }
    }

    /**
     * Add template for element function.
     * @param pModuleResult - module result.
     * @param pExpression - for of expression.
     * @param pObjectValue - value.
     * @param pObjectKey - value key.
     */
    private readonly addTemplateForElement = (pModuleResult: InstructionResult, pExpression: ForOfExpression, pObjectValue: any, pObjectKey: number | string) => {
        const lComponentValues: LayerValues = new LayerValues(this.mLayerValues);
        lComponentValues.setTemporaryValue(pExpression.variable, pObjectValue);

        // If custom index is used.
        if (pExpression.indexName) {
            // Add index key as extenal value to execution.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$index', pObjectKey);

            // Execute index expression. Expression is set when index name is set.
            const lIndexExpressionResult: any = ComponentScopeExecutor.executeSilent(<string>pExpression.indexExpression, lComponentValues, lExternalValues);

            // Set custom index name as temporary value.
            lComponentValues.setTemporaryValue(pExpression.indexName, lIndexExpressionResult);
        }

        // Create template.
        const lTemplate: PwbTemplate = new PwbTemplate();
        lTemplate.appendChild(...this.mTemplate.childList);

        // Add element.
        pModuleResult.addElement(lTemplate, lComponentValues);
    };

    /**
     * Compare two entry arrays.
     * 
     * @param pEntriesA - Entires A. 
     * @param pEntriesB - Entires B.
     * 
     * @returns true when both are equal or false otherwise. 
     */
    private compareEntires(pEntriesA: Array<[string, any]>, pEntriesB: Array<[string, any]>): boolean {
        // Same length.
        if (pEntriesA.length !== pEntriesB.length) {
            return false;
        }

        // Evaluate every entry.
        for (let lIndex: number = 0; lIndex < pEntriesA.length; lIndex++) {
            const [lKeyA, lValueA] = pEntriesA[lIndex];
            const [lKeyB, lValueB] = pEntriesB[lIndex];

            // Not same key.
            if (lKeyA !== lKeyB) {
                return false;
            }

            // Not same value.
            if (lValueA !== lValueB) {
                return false;
            }
        }

        return true;
    }
}

type ForOfExpression = {
    variable: string,
    value: string,
    indexName?: string,
    indexExpression?: string;
};