import { List } from '@kartoffelgames/core.data';
import { EffectBound } from '../enum/effect-bound';
import { Pitch } from '../enum/Pitch';
import { SetPitchEffect } from '../generic_module/effect/pitch/set-pitch-effect';
import { SetSampleEffect } from '../generic_module/effect/sample/set-sample-effect';
import { SetVolumeEffect } from '../generic_module/effect/volume/set-volume-effect';
import { VolumeSlideEffect } from '../generic_module/effect/volume/volume-slide-effect';
import { IGenericEffect } from '../generic_module/interface/i-generic-effect';
import { Sample } from '../generic_module/sample/sample';
import { BaseEffectProcessor } from './effect/base-effect-processor';
import { SetPitchEffectProcessor } from './effect/pitch/set-period-effect-processor';
import { SetSampleEffectProcessor } from './effect/sample/set-sample-effect-processor';
import { SetVolumeEffectProcessor } from './effect/volume/set-volume-effect-processor';
import { VolumeSlideEffectProcessor } from './effect/volume/volume-slide-effect-processor';
import { PlayerModule } from './player_module/player-module';

export class PlayerChannel {
    private readonly mChannelIndex: number;
    private mChannelSettings: ChannelSettings;
    private mEffectList: Array<BaseEffectProcessor<IGenericEffect>>;
    private readonly mPlayerModule: PlayerModule;

    /**
     * Constructor.
     */
    public constructor(pPlayerModule: PlayerModule, pChannelIndex: number) {
        this.mChannelIndex = pChannelIndex;
        this.mPlayerModule = pPlayerModule;

        this.mEffectList = new Array<BaseEffectProcessor<IGenericEffect>>();

        // Set empty continuing information.
        this.mChannelSettings = {
            pitch: Pitch.Empty,
            sampleData: {
                sample: null,
                position: 0
            },
            volume: 0,
            finetune: 0,
            invertLoop: false
        };
    }

    /**
     * Play next tick and get sample position value.
     */
    public nextSample(_pSongPositionChanged: boolean, pDivisionChanged: boolean, pTickChanged: boolean): number {
        if (pDivisionChanged) {
            this.onDivisionChange();
        }

        // Sort effects for priority.
        this.mEffectList.sort((pEffectA, pEffectB) => {
            // Sort priority number ASC.
            return pEffectA.priority - pEffectB.priority;
        });

        // Execute all effects in priority order.
        for (const lEffect of this.mEffectList) {
            this.mChannelSettings = lEffect.process(this.mChannelSettings, pTickChanged, this.mPlayerModule);
        }

        // Clear single bound effects.
        this.mEffectList = this.mEffectList.filter((pEffect) => {
            return pEffect.effectBound !== EffectBound.Single;
        });

        // Get current sample.
        const lSample: Sample | null = this.mChannelSettings.sampleData.sample;

        // Exit if no sample exists or sample finished playing.
        if (lSample === null || lSample.data.length === 0 || (this.mChannelSettings.sampleData.position + 1) > lSample.data.length) {
            return 0;
        }

        // Get next sample position value. Apply volume.
        const lNextSamplePosition = Math.floor(this.mChannelSettings.sampleData.position);
        let lSamplePositionValue: number = lSample.data[lNextSamplePosition];
        lSamplePositionValue *= this.mChannelSettings.volume;

        // Get current pitch of sample. Calculate finetune with "(12th root of two) * current pitch * finetune."
        const lPitch: number = this.mChannelSettings.pitch + ((Math.pow(2, 1/12) * this.mChannelSettings.pitch) * this.mChannelSettings.finetune)

        // Calculate next sample position.
        const lSampleSpeed = 7093789.2 / ((lPitch * 2) * this.mPlayerModule.speed.speed.sampleRate);
        this.mChannelSettings.sampleData.position += lSampleSpeed;

        // Check for loop information.
        if (lSample.repeatLength > 0) {
            // Check if sample cursor is after the repeat range.
            if ((this.mChannelSettings.sampleData.position + 1) > (lSample.repeatOffset + lSample.repeatLength)) {
                // Move back as long as not inside repeat length.
                this.mChannelSettings.sampleData.position = lSample.repeatOffset;
            }
        }

        return lSamplePositionValue;
    }

    /**
     * Convert generic effects into effect processors.
     * @param pGenericEffects - Division effects for this channel.
     */
    private createEffects(pGenericEffects: Array<IGenericEffect>): List<BaseEffectProcessor<IGenericEffect>> {
        const lEffectList: List<BaseEffectProcessor<IGenericEffect>> = new List<BaseEffectProcessor<IGenericEffect>>();

        // Convert each generic effect into processable effect.
        for (const lGenericEffect of pGenericEffects) {
            if (lGenericEffect instanceof SetSampleEffect) {
                lEffectList.push(new SetSampleEffectProcessor(lGenericEffect));
            } else if (lGenericEffect instanceof SetPitchEffect) {
                lEffectList.push(new SetPitchEffectProcessor(lGenericEffect));
            } else if (lGenericEffect instanceof VolumeSlideEffect) {
                lEffectList.push(new VolumeSlideEffectProcessor(lGenericEffect));
            } else if (lGenericEffect instanceof SetVolumeEffect) {
                lEffectList.push(new SetVolumeEffectProcessor(lGenericEffect));
            }
            // TODO: Others
        }

        return lEffectList;
    }

    /**
     * On division change.
     * Load all new division effects and clear old division bound effects. 
     */
    private onDivisionChange(): void {
        // Clear division bound effects.
        this.mEffectList = this.mEffectList.filter((pEffect) => {
            return pEffect.effectBound !== EffectBound.Division;
        });

        // Add effect into effect list. Convert generic effect into effect processors. 
        const lConvertedEffect: List<BaseEffectProcessor<IGenericEffect>> = this.createEffects(this.mPlayerModule.getDivision(this.mChannelIndex).effects);
        this.mEffectList.push(...lConvertedEffect);
    }
}

interface SampleData {
    sample: Sample | null,
    position: number;
}

export interface ChannelSettings {
    pitch: Pitch,
    /**
     * Volume range form 0 to 1.
     */
    volume: number,
    finetune: number,
    invertLoop: boolean,
    sampleData: SampleData;
}