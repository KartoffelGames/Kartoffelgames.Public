import { EffectPriority } from '../../../enum/effect-priority.enum';
import { DelayPatternEffect } from '../../effect_definition/pattern/delay-pattern-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class DelayPatternEffectProcessor extends BaseEffectProcessor<DelayPatternEffect>{
    private mOriginalDivisionLength: number = 0;

    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * On process.
     */
    public override onProcess(): void {
        const lCurrentDivisionLengthWithoutDelay: number = this.globalSettings.length.ticks / this.effectData.divisions;

        // Detect speed changes and recalculate delay with new speed.
        if (this.mOriginalDivisionLength !== lCurrentDivisionLengthWithoutDelay) {
            this.mOriginalDivisionLength = this.globalSettings.length.ticks;

            // Calculate new division length with current speed.
            const lCurrentDivisionLengthWithDelay: number = this.globalSettings.length.ticks * this.effectData.divisions;
            this.globalSettings.length.setTickRate(lCurrentDivisionLengthWithDelay);
        }
    }

    /**
     * On effect start.
     */
    public override onEffectStart(): void {
        // Reset division length with original speed.
        this.globalSettings.length.setTickRate(this.mOriginalDivisionLength);
    }
}