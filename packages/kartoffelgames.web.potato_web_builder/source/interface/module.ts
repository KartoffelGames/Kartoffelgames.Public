/* eslint-disable @typescript-eslint/no-empty-interface */

import { InstructionResult } from '../module/result/instruction-result';

// Base.
export interface IPwbModuleProcessor { }
export interface IPwbModuleProcessorConstructor<T extends IPwbModuleProcessor> {
    new(...args: Array<any>): T;
}

export interface IPwbModuleOnUpdate<TUpdateResult> {
    /**
     * Called on update.
     */
    onUpdate(): TUpdateResult;
}

export interface IPwbModuleOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}

// Attribute.
export interface IPwbAttributeModuleOnUpdate extends IPwbModuleOnUpdate<boolean> { }
export interface IPwbAttributeModuleOnDeconstruct extends IPwbModuleOnDeconstruct { }
export interface IPwbAttributeModuleProcessor extends IPwbModuleProcessor, Partial<IPwbAttributeModuleOnUpdate>, Partial<IPwbAttributeModuleOnDeconstruct> { }
export interface IPwbAttributeModuleProcessorConstructor extends IPwbModuleProcessorConstructor<IPwbAttributeModuleProcessor> { }

// Expression.
export interface IPwbExpressionModuleOnUpdate extends IPwbModuleOnUpdate<string> { }
export interface IPwbExpressionModuleOnDeconstruct extends IPwbModuleOnDeconstruct { }
export interface IPwbExpressionModuleProcessor extends IPwbModuleProcessor, Partial<IPwbExpressionModuleOnUpdate>, Partial<IPwbExpressionModuleOnDeconstruct> { }
export interface IPwbExpressionModuleProcessorConstructor extends IPwbModuleProcessorConstructor<IPwbExpressionModuleProcessor> { }

// Instruction.
export interface IPwbInstructionModuleOnUpdate extends IPwbModuleOnUpdate<InstructionResult> { }
export interface IPwbInstructionModuleOnDeconstruct extends IPwbModuleOnDeconstruct { }
export interface IPwbInstructionModuleProcessor extends IPwbModuleProcessor, Partial<IPwbInstructionModuleOnUpdate>, Partial<IPwbInstructionModuleOnDeconstruct> { }
export interface IPwbInstructionModuleProcessorConstructor extends IPwbModuleProcessorConstructor<IPwbInstructionModuleProcessor> { }


