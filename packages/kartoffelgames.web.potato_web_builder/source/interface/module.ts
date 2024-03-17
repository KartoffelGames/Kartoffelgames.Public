/* eslint-disable @typescript-eslint/no-empty-interface */

import { MultiplicatorResult } from '../module/result/multiplicator-result';

// Base.
export interface IPwbModuleObject<TResult> extends IPwbModuleOnUpdate<TResult>, IPwbModuleOnDeconstruct { }
export interface IPwbModuleClass<TResult> {
    new(): IPwbModuleObject<TResult>;
}

// Attribute.
export interface IPwbAttributeModuleObject extends IPwbModuleObject<boolean> { }
export interface IPwbAttributeModuleClass extends IPwbModuleClass<boolean> { }
export interface IPwbAttributeModuleOnUpdate extends IPwbModuleOnUpdate<boolean> { }

// Expression.
export interface IPwbExpressionModuleObject extends IPwbModuleObject<string> { }
export interface IPwbExpressionModuleClass extends IPwbModuleClass<string> { }
export interface IPwbExpressionModuleOnUpdate extends IPwbModuleOnUpdate<string> { }

// Instruction.
export interface IPwbInstructionModuleObject extends IPwbModuleObject<MultiplicatorResult> { }
export interface IPwbInstructionModuleClass extends IPwbModuleClass<MultiplicatorResult> { }
export interface IPwbInstructionModuleOnUpdate extends IPwbModuleOnUpdate<MultiplicatorResult | null> { }

export interface IPwbModuleOnUpdate<TResult> {
    /**
     * Called on update.
     */
    onUpdate(): TResult;
}

export interface IPwbModuleOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}