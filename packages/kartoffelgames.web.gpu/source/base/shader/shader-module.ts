import { BindGroupLayout } from '../binding/bind-group-layout';
import { PipelineLayout } from '../binding/pipeline-layout';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { ShaderLayout } from './shader-layout';

export class ShaderModule extends GpuNativeObject<GPUShaderModule> {
    private readonly mPipelineLayout: PipelineLayout;
    private readonly mShaderLayout: ShaderLayout;
    private readonly mSource: string;

    /**
     * Shader pipeline layout.
     */
    public get layout(): PipelineLayout {
        return this.mPipelineLayout;
    }

    // TODO: Entry points.

    // TODO: Parameter.

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice, pSource: string, pLayout: ShaderLayout) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Create shader information for source.
        this.mShaderLayout = pLayout;
        this.mSource = pSource;

        // Generate layout.
        this.mPipelineLayout = new PipelineLayout(this.device);
        for (const [lGroupIndex, lBindingList] of this.mShaderInformation.bindings) {
            // Create group layout and add each binding.
            let lGroupLayout: BindGroupLayout = new BindGroupLayout(this.device);
            for (const lBinding of lBindingList) {
                lGroupLayout.addBinding(lBinding, lBinding.name);
            }

            // Read from cache.
            if (BaseShader.mBindGroupLayoutCache.has(lGroupLayout.identifier)) {
                lGroupLayout = BaseShader.mBindGroupLayoutCache.get(lGroupLayout.identifier)!;
            }

            // Add group to pipeline.
            this.mPipelineLayout.addGroupLayout(lGroupIndex, lGroupLayout);
        }
    }

    /**
     * Destroy absolutly nothing.
     */
    protected override destroy(): void {
        // Nothing to destroy.
    }

    /**
     * Generate shader module.
     */
    protected override generate(): GPUShaderModule {
        // Create shader module use hints to speed up compilation on safari.
        return this.device.gpu.createShaderModule({
            code: this.mSource, 
            hints: {
                WHAT: { layout: this.mPipelineLayout.native }
            },
            //  sourceMap: undefined
        });
    }
}