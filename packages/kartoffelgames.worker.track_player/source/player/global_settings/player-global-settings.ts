import { GenericModule } from '../../generic_module/generic-module';
import { CursorSettings } from './settings/cursor-settings';
import { JumpSettings } from './settings/jump-settings';
import { LengthSettings } from './settings/length-settings';
import { DelaySettings } from './settings/delay-settings';
import { SpeedSettings } from './settings/speed-settings';
import { WaveSettings } from './settings/wave-settings';

export class PlayerGlobalSettings {
    private readonly mCursorSetting: CursorSettings;
    private readonly mGenericSetting: GenericModule;
    private readonly mJumpSetting: JumpSettings;
    private readonly mLengthSetting: LengthSettings;
    private readonly mDelaySetting: DelaySettings;
    private readonly mSpeedSetting: SpeedSettings;
    private readonly mWaveSetting: WaveSettings;

    /**
     * Get current cursor.
     */
    public get cursor(): CursorSettings {
        return this.mCursorSetting;
    }

    /**
     * Get jump handler.
     */
    public get jump(): JumpSettings {
        return this.mJumpSetting;
    }

    /**
     * Get length handler.
     */
    public get length(): LengthSettings {
        return this.mLengthSetting;
    }

    /**
     * Get generic module.
     */
    public get module(): GenericModule {
        return this.mGenericSetting;
    }

    /**
     * Get settings handler.
     */
    public get delay(): DelaySettings {
        return this.mDelaySetting;
    }

    /**
     * Get speed handler.
     */
    public get speed(): SpeedSettings {
        return this.mSpeedSetting;
    }

    /**
     * Get wave handler.
     */
    public get wave(): WaveSettings {
        return this.mWaveSetting;
    }

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: PlayerModuleConstructorParameter) {
        this.mGenericSetting = pParameter.genericModule;
        this.mLengthSetting = pParameter.lengthHandler;
        this.mCursorSetting = pParameter.cursorHandler;
        this.mJumpSetting = pParameter.jumpHandler;
        this.mDelaySetting = pParameter.settingsHandler;
        this.mSpeedSetting = pParameter.speedHandler;
        this.mWaveSetting = pParameter.waveHandler;
    }
}

interface PlayerModuleConstructorParameter {
    genericModule: GenericModule;
    speedHandler: SpeedSettings;
    lengthHandler: LengthSettings;
    cursorHandler: CursorSettings;
    jumpHandler: JumpSettings;
    settingsHandler: DelaySettings;
    waveHandler: WaveSettings;
}