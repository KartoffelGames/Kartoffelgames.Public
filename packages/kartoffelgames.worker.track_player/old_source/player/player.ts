import { GenericModule } from '../generic_module/generic-module.ts';
import { PlayerChannel } from './player-channel.ts';
import { CursorChange, CursorSettings } from './global_settings/settings/cursor-settings.ts';
import { JumpSettings } from './global_settings/settings/jump-settings.ts';
import { LengthSettings } from './global_settings/settings/length-settings.ts';
import { DelaySettings } from './global_settings/settings/delay-settings.ts';
import { SpeedSettings } from './global_settings/settings/speed-settings.ts';
import { WaveSettings } from './global_settings/settings/wave-settings.ts';
import { PlayerGlobalSettings } from './global_settings/player-global-settings.ts';

export class Player {
    private readonly mChannelList: Array<PlayerChannel>;
    private readonly mPlayerModule: PlayerGlobalSettings;

    /**
     * Constructor.
     * @param pModule - Module tha should be played.
     * @param pChannelCount - Input channel count.
     * @param pSampleRate - Sample rate.
     */
    public constructor(pModule: GenericModule, pSampleRate: number) {
        this.mChannelList = new Array<PlayerChannel>();

        // Create handler.
        const lSpeedHandler: SpeedSettings = new SpeedSettings(pSampleRate);
        const lLengthHandler: LengthSettings = new LengthSettings(pModule, lSpeedHandler);
        const lCursorHandler: CursorSettings = new CursorSettings(lLengthHandler);
        const lJumpHandler: JumpSettings = new JumpSettings(lCursorHandler);
        const lSettingsHandler: DelaySettings = new DelaySettings();
        const lWaveHandler: WaveSettings = new WaveSettings();

        // Create player module. Initialize with handler.
        this.mPlayerModule = new PlayerGlobalSettings({
            genericModule: pModule,
            speedHandler: lSpeedHandler,
            lengthHandler: lLengthHandler,
            cursorHandler: lCursorHandler,
            jumpHandler: lJumpHandler,
            settingsHandler: lSettingsHandler,
            waveHandler: lWaveHandler
        });
    }

    /**
     * Process next audio block. 
     * Two buffers for left and right channel.
     * @param pAudioBlockLength - Length of next audio block.
     */
    public nextBlock(pAudioBlockLength: number): [Float32Array, Float32Array] | null {
        // Exit when song is finished.
        if (this.mPlayerModule.cursor.songPositionCursor >= this.mPlayerModule.length.songPositions) {
            return null;
        }

        // Update channels.
        if (this.mChannelList.length > this.mPlayerModule.length.channels) {
            // Remove channels.
            this.mChannelList.splice(this.mPlayerModule.length.channels);
        } else if (this.mChannelList.length < this.mPlayerModule.length.channels) {
            // Create new channel for each missing.
            for (let lChannelIndex: number = this.mChannelList.length; lChannelIndex < this.mPlayerModule.length.channels; lChannelIndex++) {
                this.mChannelList.push(new PlayerChannel(this.mPlayerModule, lChannelIndex));
            }
        }

        // Create output buffer for left and right channel.
        const lOutputBufferList: [Float32Array, Float32Array] = [
            new Float32Array(pAudioBlockLength),
            new Float32Array(pAudioBlockLength)
        ];
        const [lLeftOutputBuffer, lRightOutputBuffer] = lOutputBufferList;

        // For each audio sample.
        for (let lAudioSampleIndex: number = 0; lAudioSampleIndex < pAudioBlockLength; lAudioSampleIndex++) {
            // Tick next. Exit if no other pattern can be played.
            const lCursorChange: CursorChange | null = this.tickAudioSample();
            if (!lCursorChange) {
                return lOutputBufferList;
            }

            // For each channel.
            for (let lChannelIndex = 0; lChannelIndex < this.mPlayerModule.length.channels; lChannelIndex++) {
                // Generate left and right channel.
                const [lLeftChannelValue, lRightChannelValue] = this.mChannelList[lChannelIndex].nextAudioSample(lCursorChange.division, lCursorChange.tick);

                // Apply tracker channel value to left and right output channel.
                // Reduce channel output value by 40% to reduce audio clipping.
                lLeftOutputBuffer[lAudioSampleIndex] += lLeftChannelValue * 0.6; // Left channel.
                lRightOutputBuffer[lAudioSampleIndex] += lRightChannelValue * 0.6; // Right channel.
            }
        }

        return lOutputBufferList;
    }

    /**
     * Executes after each audio sample.
     * Triggers channels next division.
     */
    private tickAudioSample(): CursorChange | null {
        // Move cursor one sample
        const lChangeOn: CursorChange = this.mPlayerModule.cursor.next();

        // Reset loop position and pattern settings on pattern change.
        if (lChangeOn.songPosition) {
            this.mPlayerModule.jump.resetLoop();
        }

        // Check for jump action. Jump only on division change.
        if (lChangeOn.division) {
            // Execute jump. Set everything on change state if jump happened.
            if (this.mPlayerModule.jump.executeJump()) {
                lChangeOn.tick = true;
                lChangeOn.division = true;
                lChangeOn.songPosition = true;
            }
        }

        // Check song end.
        if (this.mPlayerModule.cursor.songPositionCursor >= this.mPlayerModule.length.songPositions) {
            return null;
        }

        return lChangeOn;
    }
}