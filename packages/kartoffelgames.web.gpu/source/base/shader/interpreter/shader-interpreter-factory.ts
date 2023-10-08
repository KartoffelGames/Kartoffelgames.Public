import { GpuDevice } from '../../gpu/gpu-device';
import { BaseShaderInterpreter } from './base-shader-interpreter';


export class ShaderInterpreterFactory {
    private readonly mDevice: GpuDevice;
    private readonly mInterpreterConstructor: ShaderInterpreterConstructor;

    /**
     * Constructor.
     * @param pDevice - Gpu device.
     * @param pInterpreter - Shader Interpreter 
     */
    public constructor(pDevice: GpuDevice, pInterpreter: ShaderInterpreterConstructor) {
        this.mDevice = pDevice;
        this.mInterpreterConstructor = pInterpreter;
    }

    /**
     * Interpret source code.
     * Executes precompile commands.
     * @param pSource - Source.
     */
    public interpret(pSource: string): BaseShaderInterpreter {
        // TODO: Process precompile commands.

        return new this.mInterpreterConstructor(this.mDevice, pSource);
    }
}

export type ShaderInterpreterConstructor = new (pDevice: GpuDevice, pSource: string) => BaseShaderInterpreter;