import { ModuleFile } from "../module/module-file.ts";

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