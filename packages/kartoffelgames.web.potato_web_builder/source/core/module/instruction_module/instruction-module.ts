import { PwbTemplateInstructionNode } from '../../component/template/nodes/pwb-template-instruction-node.ts';
import { UpdateTrigger } from '../../enum/update-trigger.enum.ts';
import { BaseModule, BaseModuleConstructorParameter, IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../base-module.ts';
import { ModuleExpression } from '../injection_reference/module-expression.ts';
import { ModuleTemplate } from '../injection_reference/module-template.ts';
import { InstructionResult } from './instruction-result.ts';

export class InstructionModule extends BaseModule<IPwbInstructionModuleProcessor> {
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
            parent: pParameter.parent,
            trigger: pParameter.trigger,
            values: pParameter.values,
        });

        // Set processor attribute values from injection template.
        this.setProcessorAttributes(InstructionModule, this);
        this.setProcessorAttributes(ModuleTemplate, pParameter.targetTemplate.clone());
        this.setProcessorAttributes(ModuleExpression, new ModuleExpression(pParameter.targetTemplate.instruction));

        // Set starting value of instruction => Empty.
        this.mLastResult = new InstructionResult();
    }

    /**
     * Update module.
     */
    public onUpdate(): boolean {
        // Try to update instruction when an onUpdate method is defined.
        const lNewValue: InstructionResult | null = this.call<IInstructionOnUpdate, 'onUpdate'>('onUpdate', true);

        // When no result is returned, no update needs to be done.
        if (!(lNewValue instanceof InstructionResult)) {
            return false;
        }

        // Save  instruction result.
        this.mLastResult = lNewValue;

        return true;
    }
}

export type MultiplicatorModuleConstructorParameter = BaseModuleConstructorParameter<IPwbInstructionModuleProcessor> & {
    targetTemplate: PwbTemplateInstructionNode,
};

/**
 * Interfaces.
 */
export interface IInstructionOnDeconstruct {
    onDeconstruct(): void;
}
export interface IInstructionOnUpdate {
    onUpdate(): InstructionResult | null;
}
export interface IPwbInstructionModuleProcessor extends IPwbModuleProcessor, Partial<IInstructionOnUpdate>, Partial<IInstructionOnUpdate> { }
export interface IPwbInstructionModuleProcessorConstructor extends IPwbModuleProcessorConstructor<IPwbInstructionModuleProcessor> { }


/**
 * Register configuration.
 */
export type InstructionModuleConfiguration = {
    instructionType: string;
    trigger: UpdateTrigger;
};