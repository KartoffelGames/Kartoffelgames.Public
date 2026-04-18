import type { PwbTemplateInstructionNode } from '../../component/template/nodes/pwb-template-instruction-node.ts';
import { BaseModule, type BaseModuleConstructorParameter, type IPwbModuleProcessor, type IPwbModuleProcessorConstructor } from '../base-module.ts';
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
            values: pParameter.values,
        });

        // Set processor attribute values from injection template.
        this.setProcessorInjection(InstructionModule, this);
        this.setProcessorInjection(ModuleTemplate, pParameter.targetTemplate.clone());
        this.setProcessorInjection(ModuleExpression, new ModuleExpression(pParameter.targetTemplate.instruction));

        // Set starting value of instruction => Empty.
        this.mLastResult = new InstructionResult();
    }

    /**
     * Update module.
     */
    public onUpdate(): boolean {
        // Try to update instruction when an onUpdate method is defined.
        const lNewValue: InstructionResult | null = this.call<IInstructionOnUpdate, 'onUpdate'>('onUpdate');

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
};