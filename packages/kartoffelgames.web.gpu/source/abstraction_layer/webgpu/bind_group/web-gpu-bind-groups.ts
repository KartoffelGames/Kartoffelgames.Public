import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { WebGpuDevice } from '../web-gpu-device';
import { GpuNativeObject } from '../gpu-native-object';
import { WebGpuBindGroupLayout } from './web-gpu-bind-group-layout';

export class WebGpuBindGroups extends GpuNativeObject<GPUPipelineLayoutDescriptor>{
    private readonly mBindGroups: Dictionary<number, WebGpuBindGroupLayout>;

    /**
     * Bind group count.
     */
    public get groups(): Array<number> {
        return [...this.mBindGroups.keys()];
    }

    /**
     * Constructor.
     * @param pGpu  - Gpu.
     */
    public constructor(pGpu: WebGpuDevice) {
        super(pGpu, 'PIPELINE_LAYOUT_DESCRIPTOR');
        this.mBindGroups = new Dictionary<number, WebGpuBindGroupLayout>();
    }

    /**
     * Create bind group.
     * @param pIndex - Group index.
     * @param pLayout - [Optional] Bind group Layout.
     */
    public addGroup(pIndex: number, pLayout?: WebGpuBindGroupLayout): WebGpuBindGroupLayout {
        // Create and add bind group layout.
        let lBindLayout: WebGpuBindGroupLayout;
        if (pLayout) {
            lBindLayout = pLayout;
        } else {
            lBindLayout = new WebGpuBindGroupLayout(this.gpu);
        }
        this.mBindGroups.add(pIndex, lBindLayout);

        // Register native object.
        this.registerInternalNative(lBindLayout);

        return lBindLayout;
    }

    /**
     * Get created bind group layout.
     * @param pIndex - Group index.
     */
    public getGroup(pIndex: number): WebGpuBindGroupLayout {
        // Throw on unaccessable group.
        if (!this.mBindGroups.has(pIndex)) {
            throw new Exception(`Bind group layout (${pIndex}) does not exists.`, this);
        }

        // Bind group should allways exist.
        return this.mBindGroups.get(pIndex)!;
    }

    /**
     * Generate native object.
     */
    protected generate(): GPUPipelineLayoutDescriptor {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const [lIndex, lBindGroupLayout] of this.mBindGroups) {
            lPipelineLayout.bindGroupLayouts[lIndex] = lBindGroupLayout.native();
        }

        // Validate continunity.
        if (this.mBindGroups.size !== lPipelineLayout.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }
        
        return lPipelineLayout;
    }
}