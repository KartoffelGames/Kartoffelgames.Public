import { InstructionExecuter } from '../execution/instruction-executor';
import { BaseGeneratorFactory } from '../native_generator/base-generator-factory';
import { TextureGroup } from '../pipeline/target/texture-group';
import { ShaderInterpreterConstructor, ShaderInterpreterFactory } from '../shader/interpreter/shader-interpreter-factory';
import { VertexFragmentShader } from '../shader/vertex-fragment-shader';

export class GpuDevice {
    /**
     * Request new gpu device.
     * @param pGenerator - Native object generator.
     */
    public static async request(pGenerator: BaseGeneratorFactory, pShaderInterpreter: ShaderInterpreterConstructor): Promise<GpuDevice> {
        // Construct gpu device.
        const lDevice: GpuDevice = new GpuDevice(pGenerator, pShaderInterpreter);

        // Init generator with created device.
        await pGenerator.init(lDevice);

        return lDevice;
    }

    private mFrameCounter: number;
    private readonly mGenerator: BaseGeneratorFactory;
    private readonly mShaderInterpreter: ShaderInterpreterFactory;

    /**
     * Get frame count.
     */
    public get frameCount(): number {
        return this.mFrameCounter;
    }

    /**
     * Native object generator.
     */
    public get generator(): BaseGeneratorFactory {
        return this.mGenerator;
    }

    /**
     * Shader interpreter.
     */
    public get shaderInterpreter(): ShaderInterpreterFactory {
        return this.mShaderInterpreter;
    }

    /**
     * Constructor.
     * @param pGenerator - Native GPU-Object Generator.
     */
    private constructor(pGenerator: BaseGeneratorFactory, pShaderInterpreter: ShaderInterpreterConstructor) {
        this.mFrameCounter = 0;
        this.mGenerator = pGenerator;
        this.mShaderInterpreter = new ShaderInterpreterFactory(this, pShaderInterpreter);
    }

    /**
     * Create instruction executor.
     */
    public instructionExecutor(): InstructionExecuter {
        return new InstructionExecuter(this);
    }

    /**
     * Create shader.
     * @param pSource - Shader source.
     * @param pVertexEntry - Vertex entry name.
     * @param pFragmentEntry - Optional fragment entry.
     */
    public renderShader(pSource: string, pVertexEntry: string, pFragmentEntry?: string): VertexFragmentShader {
        return new VertexFragmentShader(this, pSource, pVertexEntry, pFragmentEntry);
    }

    /**
     * Start new frame.
     */
    public startNewFrame(): void {
        this.mFrameCounter++;
    }

    /**
     * Create texture group that shares the same dimensions.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pMultisampleLevel - Multisample level of textures.
     */
    public textureGroup(pWidth: number, pHeight: number, pMultisampleLevel: number = 1): TextureGroup {
        return new TextureGroup(this, pWidth, pHeight, pMultisampleLevel);
    }
}