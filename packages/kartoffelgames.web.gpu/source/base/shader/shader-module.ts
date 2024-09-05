import { Dictionary } from '@kartoffelgames/core';
import { BindGroupLayout, BindLayout } from '../binding/bind-group-layout';
import { PipelineLayout } from '../binding/pipeline-layout';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { ShaderLayout } from './shader-layout';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';

export class ShaderModule extends GpuNativeObject<GPUShaderModule> {
    private readonly mParameter: Dictionary<string, PrimitiveBufferFormat>;
    private readonly mPipelineLayout: PipelineLayout;
    private readonly mSource: string;
    
    /**
     * Shader pipeline layout.
     */
    public get layout(): PipelineLayout {
        return this.mPipelineLayout;
    }

    /**
     * Shader pipeline parameters.
     */
    public get parameter(): Dictionary<string, PrimitiveBufferFormat> {
        return this.mParameter;
    }

    // TODO: Entry points.

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     * @param pSource - Shader source as wgsl code.
     * @param pLayout - Shader layout information.
     */
    public constructor(pDevice: GpuDevice, pSource: string, pLayout: ShaderLayout) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Create shader information for source.
        this.mSource = pSource;

        // Generate initial pipeline layout.
        const lInitialPipelineLayout: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        for (const lGroupName of Object.keys(pLayout.groups)) {
            const lGroup: ShaderLayout['groups'][string] = pLayout.groups[lGroupName];

            // Generate each binding.
            const lBindLayoutList: Array<BindLayout> = new Array<BindLayout>();
            for (const lBindName of Object.keys(lGroup.bindings)) {
                const lBind: ShaderLayout['groups'][string]['bindings'][string] = lGroup.bindings[lBindName];

                // Generate and add bind layout to bind layout list.
                lBindLayoutList.push({
                    name: lBindName,
                    index: lBind.index,
                    layout: lBind.layout,
                    visibility: lBind.visibility,
                    accessMode: lBind.accessMode,
                    usage: lBind.usage
                });
            }

            // Set bind group layout with group index.
            lInitialPipelineLayout.set(lGroup.index, new BindGroupLayout(this.device, lGroupName, lBindLayoutList));
        }

        // Generate layout.
        this.mPipelineLayout = new PipelineLayout(this.device, lInitialPipelineLayout);

        // Save parameters.
        this.mParameter = new Dictionary<string, PrimitiveBufferFormat>(Object.entries(pLayout.parameter));
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
            // TODO: sourceMap: undefined
        });
    }
}