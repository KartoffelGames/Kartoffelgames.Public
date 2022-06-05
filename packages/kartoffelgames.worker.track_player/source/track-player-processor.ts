import { GenericModule } from './generic_module/generic-module';
import { ModParser } from './module_parser/mod-parser';
import { Player } from './player/player';

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
                    const lData: MessageData = pEvent.data?.data ?? null;

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
            const lModuleChannelList: Array<Float32Array> | null = this.mPlayer.next(lAudioBlockLength);
            if (lModuleChannelList === null) {
                // Exit and set disposeable if no output is generated.
                return false;
            }

            // Processor has one output for each module channel. Each output has only one channel.  
            for (let lChannelIndex: number = 0; lChannelIndex < lModuleChannelList.length; lChannelIndex++) {
                // Copy channel data into output.
                const lProcessChannel: Float32Array = pOutputs[lChannelIndex][0];
                const lModuleChannel: Float32Array = lModuleChannelList[lChannelIndex];
                for (let lSampleIndex: number = 0; lSampleIndex < lProcessChannel.length; lSampleIndex++) {
                    lProcessChannel[lSampleIndex] = lModuleChannel[lSampleIndex];
                }
            }
        }

        return true;
    }

    /**
     * Load binary file and parse to a generic module.
     * @param pFile - File as binary data.
     */
    // TODO: Outsource parsing and only "load" parsed module.
    private loadFile(pType: string, pFile: ArrayBuffer): void {
        const lFile: Uint8Array = new Uint8Array(pFile);

        // Parse with correct data.
        let lModule: GenericModule | null = null;
        switch (pType.toUpperCase()) {
            case 'MOD':
                lModule = new ModParser(lFile).parse();
        }

        // Create mixer when module is loaded.
        if (lModule !== null) {
            this.mPlayer = new Player(lModule, sampleRate);
        }
    }

    /**
     * Process message.
     * @param pMessageType - Message type.
     * @param pMessageData - Message data.
     */
    private readMessage(pMessageType: string, pMessageData: MessageData): void {
        switch (pMessageType) {
            case 'load': this.loadFile(pMessageData.type, pMessageData.buffer);
        }

        // TODO: Specify edit messages.
        // TODO: Specify media actions (pause, play, navigate, speed, ...)
        // TODO: Specify monitor messages. (Channel pulse, current playing data, ...)
        // TODO: Specify dynamic reaction messages (Remove channel, Add channel)
    }
}

type LoadMessageData = { buffer: ArrayBuffer, type: string; };
type MessageData = LoadMessageData;

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const sampleRate: number;

registerProcessor('Trackplayer', TrackPlayerProcessor);