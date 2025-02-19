import { InstructionModule } from '../../../module/instruction_module/instruction-module.ts';
import { ComponentModules } from '../../component-modules.ts';
import { BaseBuilderData } from './base-builder-data.ts';

export class InstructionBuilderData extends BaseBuilderData {
    private mInstructionModule: InstructionModule | null;

    /**
     * Get instruction module of scope.
     */
    public get instructionModule(): InstructionModule | null {
        return this.mInstructionModule;
    } set instructionModule(pModule: InstructionModule | null) {
        this.mInstructionModule = pModule;
    }

    /**
     * Constructor.
     * 
     * @param pModules - Builder modules.
     * @param pAnchorName - Name of generated content anchor.
     */
    public constructor(pModules: ComponentModules, pAnchorName: string) {
        super(pModules, pAnchorName);

        this.mInstructionModule = null;
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