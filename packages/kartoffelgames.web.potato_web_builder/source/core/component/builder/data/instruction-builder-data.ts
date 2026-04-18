import type { InstructionModule } from '../../../module/instruction_module/instruction-module.ts';
import { BaseBuilderData } from './base-builder-data.ts';

/**
 * Instruction builder data. Contains instruction module of scope and content of instruction builder.
 * 
 * @internal
 */
export class InstructionBuilderData extends BaseBuilderData {
    private readonly mInstructionModule: InstructionModule;

    /**
     * Get instruction module of scope.
     */
    public get instructionModule(): InstructionModule {
        return this.mInstructionModule;
    }
    
    /**
     * Constructor.
     * 
     * @param pInstructionModule - Instruction module of scope.
     * @param pAnchorName - Name of generated content anchor.
     */
    public constructor(pInstructionModule: InstructionModule, pAnchorName: string) {
        super(pAnchorName);

        this.mInstructionModule = pInstructionModule;
    }

    /**
     * On deconstruction.
     * Deconstruct linked instruction module.
     */
    protected onDeconstruct(): void {
        // Deconstruct linked modules.
        this.mInstructionModule!.deconstruct();
    }
}