import { GenericModule } from '../../generic_module/generic-module';
import { DivisionChannel } from '../../generic_module/pattern/division-channel';
import { Pattern } from '../../generic_module/pattern/pattern';
import { CursorHandler } from './setting_handler/cursor-handler';
import { JumpHandler } from './setting_handler/jump-handler';
import { LengthHandler } from './setting_handler/length-handler';
import { SettingsHandler } from './setting_handler/settings-handler';
import { SpeedHandler } from './setting_handler/speed-handler';
import { WaveHandler } from './setting_handler/wave-handler';

export class PlayerGlobalSettings {
    private readonly mCursorHandler: CursorHandler;
    private readonly mGenericModule: GenericModule;
    private readonly mJumpHandler: JumpHandler;
    private readonly mLengthHandler: LengthHandler;
    private readonly mSettingHandler: SettingsHandler;
    private readonly mSpeedHandler: SpeedHandler;
    private readonly mWaveHandler: WaveHandler;

    /**
     * Get current cursor.
     */
    public get cursor(): CursorHandler {
        return this.mCursorHandler;
    }

    /**
     * Get jump handler.
     */
    public get jump(): JumpHandler {
        return this.mJumpHandler;
    }

    /**
     * Get length handler.
     */
    public get length(): LengthHandler {
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
    public get settings(): SettingsHandler {
        return this.mSettingHandler;
    }

    /**
     * Get speed handler.
     */
    public get speed(): SpeedHandler {
        return this.mSpeedHandler;
    }

    /**
     * Get wave handler.
     */
    public get wave(): WaveHandler {
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
    speedHandler: SpeedHandler;
    lengthHandler: LengthHandler;
    cursorHandler: CursorHandler;
    jumpHandler: JumpHandler;
    settingsHandler: SettingsHandler;
    waveHandler: WaveHandler;
}