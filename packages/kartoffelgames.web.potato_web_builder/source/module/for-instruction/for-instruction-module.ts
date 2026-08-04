import { Exception } from '@kartoffelgames/core';
import { Injection } from '@kartoffelgames/core-dependency-injection';
import type { PwbTemplateInstructionNode } from '../../core/component/template/nodes/pwb-template-instruction-node.ts';
import { PwbTemplate } from '../../core/component/template/nodes/pwb-template.ts';
import { DataLevel } from '../../core/data/data-level.ts';
import type { LevelProcedure } from '../../core/data/level-procedure.ts';
import { ModuleDataLevel } from '../../core/data/module-data-level.ts';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression.ts';
import { ModuleTemplate } from '../../core/module/injection_reference/module-template.ts';
import type { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module.ts';
import { InstructionResult } from '../../core/module/instruction_module/instruction-result.ts';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator.ts';

/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] of [List] (;[CustomIndexName] = $index)? ($key = [KeyInstruction])?"
 */
@PwbInstructionModule({
    instructionType: 'for'
})
export class ForInstructionModule implements IInstructionOnUpdate {
    /**
     * [CustomName:1] of [List value:2] (;[CustomIndexName:4]=[Index calculating with "index" as key:5])?
     */
    private static readonly REGEX_HEAD: RegExp = new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(?:;(.*))?$/);

    /**
     * [CustomName:1]=[Index calculating with "index" as key:2]
     */
    private static readonly REGEX_MODIFIER_INSTRUCTION: RegExp = new RegExp(/^\s*(\$?[a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.+?)\s*$/);

    private readonly mExpression: ForInstructionModuleExpression;
    private mLastEntries: Array<[string, any]>;
    private readonly mModuleValues: ModuleDataLevel;
    private readonly mTemplate: PwbTemplateInstructionNode;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pModuleData - Data level of module.
     * @param pModuleExpression - Expression of module.
     */
    public constructor(pTemplate = Injection.use(ModuleTemplate), pModuleData = Injection.use(ModuleDataLevel), pModuleExpression = Injection.use(ModuleExpression)) {
        this.mTemplate = <PwbTemplateInstructionNode>pTemplate;
        this.mModuleValues = pModuleData;
        this.mLastEntries = new Array<[string, any]>();

        const lForInstruction = pModuleExpression.value;

        // If attribute value does match regex.
        const lHeadInformation: RegExpExecArray | null = ForInstructionModule.REGEX_HEAD.exec(lForInstruction);
        if (!lHeadInformation) {
            throw new Exception(`For-Parameter value has wrong format: ${lForInstruction}`, this);
        }

        // Named variables, easier understanding.
        const lIterateVariableName: string = lHeadInformation[1];
        const lIterateValueExpression: string = lHeadInformation[2];

        // Split the optional instructions into its semicolon separated modifiers.
        const lInstructionPartList: Array<string> = (() => {
            if (!lHeadInformation[3]) {
                return new Array<string>();
            }

            return lHeadInformation[3].split(';');
        })();

        // Parse optional modifiers. A modifier is either the reserved "$key" identity expression or an index variable declaration.
        const lExpressionModifier: Array<ForInstructionModuleModifierInstruction> = new Array<ForInstructionModuleModifierInstruction>();
        for (const lModifierInstruction of lInstructionPartList) {
            // Execute modifier instruction regex
            const lModifierInstructionMatch: RegExpExecArray | null = ForInstructionModule.REGEX_MODIFIER_INSTRUCTION.exec(lModifierInstruction);
            if (!lModifierInstructionMatch) {
                throw new Exception(`For-Parameter optional instruction has wrong format: ${lModifierInstruction}`, this);
            }

            // Save expression modifier.
            lExpressionModifier.push({
                variableName: lModifierInstructionMatch[1],
                procedure: this.mModuleValues.createExpressionProcedure(lModifierInstructionMatch[2]!, ['$index', lIterateVariableName])
            });
        }

        // Split match into useable parts.
        this.mExpression = {
            iterateVariableName: lIterateVariableName,
            iterateValueProcedure: this.mModuleValues.createExpressionProcedure(lIterateValueExpression),
            modifier: lExpressionModifier
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
            if (this.compareEntries(lListObjectEntries, this.mLastEntries)) {
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
    private readonly addTemplateForElement = (pModuleResult: InstructionResult, pExpression: ForInstructionModuleExpression, pObjectValue: any, pObjectKey: number | string) => {
        const lTemplateItemData: DataLevel = new DataLevel(this.mModuleValues.data);
        lTemplateItemData.setTemporaryValue(pExpression.iterateVariableName, pObjectValue);

        // Determine the identity key of the element found in the modifiers. Default to the items object reference. 
        let lKey: unknown = pObjectValue;

        // Execute all modifiers.
        for(const lModifier of pExpression.modifier){
            // Add index key as extenal value to execution.
            lModifier.procedure.setTemporaryValue('$index', pObjectKey);
            lModifier.procedure.setTemporaryValue(pExpression.iterateVariableName, pObjectValue);

            // Execute modifier expression. Get the expression result.
            const lModifierResult: any = lModifier.procedure.execute();

            // Special handling for "$key" values as they are not stored in temporary values.
            if(lModifier.variableName === '$key'){
                lKey = lModifierResult;
                continue;
            }

            // Set custom variable name as temporary value.
            lTemplateItemData.setTemporaryValue(lModifier.variableName, lModifierResult);
        }

        // Create template.
        const lTemplate: PwbTemplate = new PwbTemplate();
        lTemplate.appendChild(...this.mTemplate.childList);

        // Add element.
        pModuleResult.addElement(lTemplate, lTemplateItemData, lKey);
    };

    /**
     * Compare two entry arrays.
     * 
     * @param pEntriesA - Entries A. 
     * @param pEntriesB - Entries B.
     * 
     * @returns true when both are equal or false otherwise. 
     */
    private compareEntries(pEntriesA: Array<[string, any]>, pEntriesB: Array<[string, any]>): boolean {
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

type ForInstructionModuleExpression = {
    iterateVariableName: string,
    iterateValueProcedure: LevelProcedure<{ [key: string]: any; }>,
    modifier: Array<ForInstructionModuleModifierInstruction>;
};

type ForInstructionModuleModifierInstruction = {
    variableName: string;
    procedure: LevelProcedure<any>;
};