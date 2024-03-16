import { MultiplicatorModule } from '../../../module/multiplicator-module';
import { ComponentModules } from '../../component-modules';
import { BaseBuilderData } from './base-builder-data';

export class InstructionBuilderData extends BaseBuilderData {
    private mInstructionModule: MultiplicatorModule | null;

    /**
     * Get instruction module of layer.
     */
    public get instructionModule(): MultiplicatorModule | null {
        return this.mInstructionModule;
    } set instructionModule(pModule: MultiplicatorModule | null) {
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