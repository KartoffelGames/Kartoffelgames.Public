import { InstructionModule } from '../../../module/instruction-module';
import { ComponentModules } from '../../component-modules';
import { BaseBuilderData } from './base-builder-data';

export class InstructionBuilderData extends BaseBuilderData {
    private mInstructionModule: InstructionModule | null;

    /**
     * Get instruction module of layer.
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