import { MultiplicatorModule } from '../../../module/multiplicator-module';
import { BaseBuilderContent } from './base-builder-content';

export class InstructionBuilderContent extends BaseBuilderContent {
    private mMultiplicatorModule: MultiplicatorModule | null;

    /**
     * Get multiplicator module of layer.
     */
    public get multiplicatorModule(): MultiplicatorModule | null {
        return this.mMultiplicatorModule;
    }

    /**
     * Set multiplicator module of layer.
     */
    public set multiplicatorModule(pModule: MultiplicatorModule | null) {
        this.mMultiplicatorModule = pModule;
    }


    /**
     * On deconstruction.
     * Deconstruct linked modules.
     */
    protected onDeconstruct(): void {
        // Deconstruct linked modules.
        this.mMultiplicatorModule.deconstruct();
    }
}