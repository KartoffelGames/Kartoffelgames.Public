import { GenericModule } from '../../generic_module/generic-module';
import { DivisionChannel } from '../../generic_module/pattern/division-channel';
import { Pattern } from '../../generic_module/pattern/pattern';
import { CursorSettings } from './settings/cursor-settings';
import { JumpSettings } from './settings/jump-settings';
import { LengthSettings } from './settings/length-settings';
import { SettingsSettings } from './settings/settings-settings';
import { SpeedSettings } from './settings/speed-settings';
import { WaveSettings } from './settings/wave-settings';

export class PlayerGlobalSettings {
    private readonly mCursorHandler: CursorSettings;
    private readonly mGenericModule: GenericModule;
    private readonly mJumpHandler: JumpSettings;
    private readonly mLengthHandler: LengthSettings;
    private readonly mSettingHandler: SettingsSettings;
    private readonly mSpeedHandler: SpeedSettings;
    private readonly mWaveHandler: WaveSettings;

    /**
     * Get current cursor.
     */
    public get cursor(): CursorSettings {
        return this.mCursorHandler;
    }

    /**
     * Get jump handler.
     */
    public get jump(): JumpSettings {
        return this.mJumpHandler;
    }

    /**
     * Get length handler.
     */
    public get length(): LengthSettings {
        return this.mLengthHandler;
    }

    /**
     * Get generic module.
     */
    public get module(): GenericModule {
        return this.mGenericModule;
    }

    /**
     * Get settings handler.
     */
    public get settings(): SettingsSettings {
        return this.mSettingHandler;
    }

    /**
     * Get speed handler.
     */
    public get speed(): SpeedSettings {
        return this.mSpeedHandler;
    }

    /**
     * Get wave handler.
     */
    public get wave(): WaveSettings {
        return this.mWaveHandler;
    }

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: PlayerModuleConstructorParameter) {
        this.mGenericModule = pParameter.genericModule;
        this.mLengthHandler = pParameter.lengthHandler;
        this.mCursorHandler = pParameter.cursorHandler;
        this.mJumpHandler = pParameter.jumpHandler;
        this.mSettingHandler = pParameter.settingsHandler;
        this.mSpeedHandler = pParameter.speedHandler;
        this.mWaveHandler = pParameter.waveHandler;
    }

    /**
     * Get current playing divisions channel
     * @param pChannelIndex - Channel index.
     */
    public getDivision(pChannelIndex: number): DivisionChannel {
        const lSongPosition: number = this.mGenericModule.pattern.songPositions[this.mCursorHandler.songPositionIndex];
        const lPattern: Pattern = this.mGenericModule.pattern.getPattern(lSongPosition);

        return lPattern.getDivision(this.mCursorHandler.divisionIndex).getChannel(pChannelIndex);
    }
}

interface PlayerModuleConstructorParameter {
    genericModule: GenericModule;
    speedHandler: SpeedSettings;
    lengthHandler: LengthSettings;
    cursorHandler: CursorSettings;
    jumpHandler: JumpSettings;
    settingsHandler: SettingsSettings;
    waveHandler: WaveSettings;
}