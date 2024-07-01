import { Exception } from '@kartoffelgames/core';
import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../../core/component/template/nodes/pwb-template-instruction-node';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression';
import { ModuleTemplate } from '../../core/module/injection_reference/module-template';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { InstructionResult } from '../../core/module/instruction_module/instruction-result';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { ModuleValueProcedure } from '../../core/module/module-value-procedure';
import { ModuleValues } from '../../core/module/module-values';
import { ScopedValues } from '../../core/scoped-values';
import { Processor } from '../../core/core_entity/processor';

/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] of [List] (;[CustomIndexName] = $index)?"
 */
@PwbInstructionModule({
    instructionType: 'for',
    trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
})
export class ForInstructionModule extends Processor implements IInstructionOnUpdate {
    private readonly mExpression: ForOfExpression;
    private mLastEntries: Array<[string, any]>;
    private readonly mModuleValues: ModuleValues;
    private readonly mTemplate: PwbTemplateInstructionNode;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pModuleValues - Scoped values of module.
     * @param pModuleExpression - Expression of module.
     */
    public constructor(pTemplate: ModuleTemplate, pModuleValues: ModuleValues, pModuleExpression: ModuleExpression) {
        super();
        
        this.mTemplate = <PwbTemplateInstructionNode>pTemplate;
        this.mModuleValues = pModuleValues;
        this.mLastEntries = new Array<[string, any]>();

        const lInstruction = pModuleExpression.value;

        // [CustomName:1] of [List value:2] (;[CustomIndexName:4]=[Index calculating with "index" as key:5])?
        const lRegexAttributeInformation: RegExp = new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/);

        // If attribute value does match regex.
        const lAttributeInformation: RegExpExecArray | null = lRegexAttributeInformation.exec(lInstruction);
        if (!lAttributeInformation) {
            throw new Exception(`For-Parameter value has wrong format: ${lInstruction}`, this);
        }

        // Named variables, easier understanding.
        const lIterateVariableName: string = lAttributeInformation[1];
        const lIterateValueExpression: string = lAttributeInformation[2];
        const lIndexVariableExportName: string | undefined = lAttributeInformation[4] ?? null;
        const lIndexExpression: string | undefined = lAttributeInformation[5];

        // Create expressions.
        const lValueProcedure: ModuleValueProcedure<{ [key: string]: any; }> = this.mModuleValues.createExpressionProcedure(lIterateValueExpression);
        const lIndexProcedure: ModuleValueProcedure<any> | null = (lIndexVariableExportName) ? this.mModuleValues.createExpressionProcedure(lIndexExpression, ['$index', lIterateVariableName]) : null;

        // Split match into useable parts.
        this.mExpression = {
            iterateVariableName: lIterateVariableName,
            iterateValueProcedure: lValueProcedure,
            indexExportVariableName: lIndexVariableExportName,
            indexExportProcedure: lIndexProcedure,
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
        const lExpressionResult: { [key: string]: any; } = this.mExpression.iterateValueProcedure.execute();

        // Only proceed if value is added to html element.
        if (typeof lExpressionResult === 'object' && lExpressionResult !== null || Array.isArray(lExpressionResult)) {
            // Create entries from object, generator or array. In Silent zone.
            const lListObjectEntries: Array<[string, any]> = (() => {
                if (Symbol.iterator in lExpressionResult) {
                    return Object.entries([...<Iterable<any>>lExpressionResult]);
                } else {
                    return Object.entries(lExpressionResult);
                }
            })();

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
        const lTemplateItemValues: ScopedValues = new ScopedValues(this.mModuleValues.scopedValues);
        lTemplateItemValues.setTemporaryValue(pExpression.iterateVariableName, pObjectValue);

        // If custom index is used.
        if (pExpression.indexExportProcedure && pExpression.indexExportVariableName) {
            // Add index key as extenal value to execution.
            pExpression.indexExportProcedure.setTemporaryValue('$index', pObjectKey);
            pExpression.indexExportProcedure.setTemporaryValue(pExpression.iterateVariableName, pObjectValue);

            // Execute index expression. Expression is set when index name is set.
            const lIndexExpressionResult: any = pExpression.indexExportProcedure.execute();

            // Set custom index name as temporary value.
            lTemplateItemValues.setTemporaryValue(pExpression.indexExportVariableName, lIndexExpressionResult);
        }

        // Create template.
        const lTemplate: PwbTemplate = new PwbTemplate();
        lTemplate.appendChild(...this.mTemplate.childList);

        // Add element.
        pModuleResult.addElement(lTemplate, lTemplateItemValues);
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
    iterateVariableName: string,
    iterateValueProcedure: ModuleValueProcedure<{ [key: string]: any; }>,
    indexExportVariableName: string | null,
    indexExportProcedure: ModuleValueProcedure<any> | null;
};