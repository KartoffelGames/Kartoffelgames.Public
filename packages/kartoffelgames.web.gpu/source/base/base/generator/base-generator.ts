import { GpuObject } from '../gpu/gpu-object';
import { BaseShaderInterpreter } from '../shader/interpreter/base-shader-interpreter';

export abstract class BaseGenerator {
    private readonly mObjectCache: WeakMap<GpuObject, any>;
    private readonly mShaderInterpreter: BaseShaderInterpreter;

    /**
     * Shader interpreter.
     */
    public get shaderInterpreter(): BaseShaderInterpreter {
        return this.mShaderInterpreter;
    }

    public constructor() {
        this.mObjectCache = new WeakMap<GpuObject, any>();
        this.mShaderInterpreter = this.createShaderInterpreter();
    }

    /**
     * Init gpu device.
     */
    public abstract init(): Promise<this>;

    /**
     * Create generator for interpreting shaders.
     */
    protected abstract createShaderInterpreter(): BaseShaderInterpreter;

    // TODO: Register generators ... addGenerator(typeof GpuBuffer, createBuffer) => void
    // TODO: Request generator ... generate(myBuffer) => GPUBuffer
}