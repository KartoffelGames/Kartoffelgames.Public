import { GenericModule } from '../generic_module/generic-module.ts';
import { PlayerChannel } from './player-channel.ts';
import { CursorChange, CursorSettings } from './global_settings/settings/cursor-settings.ts';
import { JumpSettings } from './global_settings/settings/jump-settings.ts';
import { LengthSettings } from './global_settings/settings/length-settings.ts';
import { DelaySettings } from './global_settings/settings/delay-settings.ts';
import { SpeedSettings } from './global_settings/settings/speed-settings.ts';
import { WaveSettings } from './global_settings/settings/wave-settings.ts';
import { PlayerGlobalSettings } from './global_settings/player-global-settings.ts';
import { ModuleFile } from "../module-file.ts";

export class Player {
    private readonly mModule: ModuleFile;
   
    /**
     * Constructor.
     * 
     * @param pModule - Module tha should be played.
     * @param pChannelCount - Input channel count.
     */
    public constructor(pModule: ModuleFile) {
        this.mModule = pModule;
    }

    /**
     * Process next audio block. 
     * Two buffers for left and right channel.
     * 
     * @param pSampleRate - Sample rate. 
     * @param pAudioBlockLength - Length of next audio block.
     * 
     * @return Left and right channel buffer or null if song is finished.
     */
    public next(_pSampleRate: number, _pAudioBlockLength: number): [Float32Array, Float32Array] | null {
        // TODO: Sample rate can be varianle...
        return null;
    }
}