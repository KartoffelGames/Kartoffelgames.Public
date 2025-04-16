abstract class AudioWorkletProcessorMock {
    public sampleRate: number = 48000;
}

const gRegisterProcessor = (_pName: string, _pProcessorCtor: any) => {
    // Nothing for now.
};

(<any>globalThis).AudioWorkletProcessor = AudioWorkletProcessorMock;
(<any>globalThis).registerProcessor = gRegisterProcessor;