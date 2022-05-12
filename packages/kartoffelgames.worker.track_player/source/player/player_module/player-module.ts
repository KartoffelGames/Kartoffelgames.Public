import { GenericModule } from '../../generic_module/generic-module';
import { DivisionChannel } from '../../generic_module/pattern/division-channel';
import { Pattern } from '../../generic_module/pattern/pattern';
import { CursorHandler } from './handler/cursor-handler';
import { JumpHandler } from './handler/jump-handler';
import { LengthHandler } from './handler/length-handler';
import { SpeedHandler } from './handler/speed-handler';

export class PlayerModule {
    private readonly mCursor: CursorHandler;
    private readonly mGenericModule: GenericModule;
    private readonly mJump: JumpHandler;
    private readonly mModuleLengthInformation: LengthHandler;
    private readonly mSpeedHandler: SpeedHandler;

    /**
     * Get current cursor.
     */
    public get cursor(): CursorHandler {
        return this.mCursor;
    }

    /**
     * Get jump handler.
     */
    public get jump(): JumpHandler {
        return this.mJump;
    }

    /**
     * Get length handler.
     */
    public get length(): LengthHandler {
        return this.mModuleLengthInformation;
    }

    /**
     * Get generic module.
     */
    public get module(): GenericModule {
        return this.mGenericModule;
    }

    /**
     * Get speed handler.
     */
    public get speed(): SpeedHandler {
        return this.mSpeedHandler;
    }

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: PlayerModuleConstructorParameter) {
        this.mGenericModule = pParameter.genericModule;
        this.mModuleLengthInformation = pParameter.lengthHandler;
        this.mCursor = pParameter.cursorHandler;
        this.mJump = pParameter.jumpHandler;
        this.mSpeedHandler = pParameter.speedHandler;
    }

    /**
     * Get current playing divisions channel
     * @param pChannelIndex - Channel index.
     */
    public getDivision(pChannelIndex: number): DivisionChannel {
        const lSongPosition: number = this.mGenericModule.pattern.songPositions[this.mCursor.songPositionIndex];
        const lPattern: Pattern = this.mGenericModule.pattern.getPattern(lSongPosition);

        return lPattern.getDivision(this.mCursor.divisionIndex).getChannel(pChannelIndex);
    }
}

interface PlayerModuleConstructorParameter {
    genericModule: GenericModule;
    speedHandler: SpeedHandler;
    lengthHandler: LengthHandler;
    cursorHandler: CursorHandler;
    jumpHandler: JumpHandler;
}