import { ElementCreator } from '../component/element-creator';
import { PwbTemplateInstructionNode } from '../component/template/nodes/pwb-template-instruction-node';
import { LayerValues } from '../component/values/layer-values';
import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { ModuleKeyReference } from '../injection/references/module/module-key-reference';
import { ModuleValueReference } from '../injection/references/module/module-value-reference';
import { IPwbInstructionModuleProcessor, IPwbInstructionModuleProcessorConstructor } from '../interface/module.interface';
import { BaseModule } from './base-module';
import { InstructionResult, InstructionResultElement } from './result/instruction-result';

export class InstructionModule extends BaseModule<Comment, IPwbInstructionModuleProcessor> {
    private mLastResult: InstructionResult;

    /**
     * Current instruction result.
     */
    public get instructionResult(): InstructionResult {
        return this.mLastResult;
    }

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: MultiplicatorModuleConstructorParameter) {
        super({
            constructor: pParameter.constructor,
            targetTemplate: pParameter.targetTemplate,
            values: pParameter.values,
            parent: pParameter.parent,
            targetNode: ElementCreator.createComment('InstructionModule-Node')
        });

        // Set processor attribute values from injection template.
        this.setProcessorAttributes(ModuleKeyReference, pParameter.targetTemplate.instructionType);
        this.setProcessorAttributes(ModuleValueReference, pParameter.targetTemplate.instruction);
        
        // Set starting value of instruction => Empty.
        this.mLastResult = new InstructionResult();
    }

    /**
     * Update module.
     */
    public onUpdate(): boolean {
        // Try to update instruction when an onUpdate method is defined.
        let lNewValue: InstructionResult | null = null;
        if ('onUpdate' in this.processor) {
            lNewValue = this.processor.onUpdate();
        }

        // When no result is returned, no update needs to be done.
        if (!(lNewValue instanceof InstructionResult)) {
            return false;
        }

        // Check for changes in last and new result.
        const lValueHasChanged: boolean = (() => {
            // New and old 
            if (lNewValue.elementList.length !== this.mLastResult.elementList.length) {
                return true;
            }

            // Compare each element of instruction result.
            for (let lElementIndex: number = 0; lElementIndex < lNewValue.elementList.length; lElementIndex++) {
                const lNewElement: InstructionResultElement = lNewValue.elementList[lElementIndex];
                const lOldElement: InstructionResultElement = this.mLastResult.elementList[lElementIndex];

                // Compare new and old template.
                if (!lNewElement.template.equals(lOldElement.template)) {
                    return true;
                }

                // Compare new and old values.
                if (!lNewElement.componentValues.equals(lOldElement.componentValues)) {
                    return true;
                }
            }

            return false;
        })();

        // Save new value when it has changed.
        if (lValueHasChanged) {
            this.mLastResult = lNewValue;
        }

        return lValueHasChanged;
    }
}

export type MultiplicatorModuleConstructorParameter = {
    constructor: IPwbInstructionModuleProcessorConstructor,
    targetTemplate: PwbTemplateInstructionNode,
    values: LayerValues,
    parent: InjectionHierarchyParent,
};