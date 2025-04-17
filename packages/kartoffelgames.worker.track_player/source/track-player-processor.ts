import { StatefullDeserializer } from '@kartoffelgames/core-serializer';
import { GenericModule } from './generic_module/generic-module.ts';
import { Player } from './player/player.ts';

export class TrackPlayerProcessor extends AudioWorkletProcessor {
    private mPlayer: Player | null;

    /**
     * Constructor.
     * Set message port.
     */
    public constructor() {
        super();

        // Set module as unloaded.
        this.mPlayer = null;

        // Set port listener for receiving messages.
        this.port.addEventListener('message', (pEvent: MessageEvent) => {
            if (typeof pEvent.data === 'object' && pEvent.data !== null) {
                // Read message type.
                const lType: string = pEvent.data?.type ?? null;

                // If message has valid type, load message data.
                if (lType !== null) {
                    const lData: any = pEvent.data?.data ?? null;

                    // Process message when message data is valid.
                    if (lData !== null) {
                        this.readMessage(lType, lData);
                    }
                }
            }
        });
        this.port.start();
    }

    /**
     * Mix module to audio output.
     * @param pInputs - Input.
     * @param pOutputs - Output.
     * @param pParameters - Processor parameter.
     */
    public override process(_pInputs: Array<Array<Float32Array>>, pOutputs: Array<Array<Float32Array>>, _pParameters: Record<string, Float32Array>): boolean {
        if (this.mPlayer !== null) {
            // Get block length and mix this block.
            const lAudioBlockLength = pOutputs[0][0].length;
            const lModuleChannelList: [Float32Array, Float32Array] | null = this.mPlayer.nextBlock(lAudioBlockLength);
            if (lModuleChannelList === null) {
                // Exit and set disposeable if no output is generated.
                return false;
            }

            /*
             * Processor can has multiple outputs with multiple channels.
             * Multiple outputs contains the same data.
             * Channels are divided between left an right in order [L R L R...]
             */

            // For each outout.
            for (const lOutput of pOutputs) {
                // Dublicate data for each output.
                for (let lChannelIndex: number = 0; lChannelIndex < lOutput.length; lChannelIndex++) {
                    // Get output channel
                    const lOutputChannel: Float32Array = lOutput[lChannelIndex];
                    // Even channels are right channel data (1) and uneven are left data (0).
                    const lChannelData: Float32Array = lModuleChannelList[1 - (lChannelIndex % 2)];

                    // Copy channel data to output.
                    for (let lSampleIndex: number = 0; lSampleIndex < lChannelData.length; lSampleIndex++) {
                        lOutputChannel[lSampleIndex] = lChannelData[lSampleIndex];
                    }
                }
            }
        }

        return true;
    }

    /**
     * Process message.
     * @param pMessageType - Message type.
     * @param pMessageData - Message data.
     */
    private readMessage(pMessageType: string, pMessageData: any): void {
        switch (pMessageType) {
            case 'load': {
                const lModule: GenericModule = new StatefullDeserializer().deserialize(pMessageData);
                this.mPlayer = new Player(lModule, sampleRate);
                console.log(lModule);
                break;
            }
        }

        // TODO: Specify edit messages.
        // TODO: Specify media actions (pause, play, navigate, speed, ...)
        // TODO: Specify monitor messages. (Channel pulse, current playing data, ...)
        // TODO: Specify dynamic reaction messages (Remove channel, Add channel)
        // TODO: Specify export message. As GenericModule
    }
}

// Global used variable in processor scope.
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const sampleRate: number;

registerProcessor('Trackplayer', TrackPlayerProcessor);