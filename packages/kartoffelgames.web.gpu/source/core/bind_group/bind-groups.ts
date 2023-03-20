import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { BindGroupLayout } from './bind-group-layout';

export class BindGroups extends GpuNativeObject<GPUPipelineLayoutDescriptor>{
    private readonly mBindGroups: Dictionary<number, BindGroupLayout>;

    /**
     * Bind group count.
     */
    public get count(): number {
        return this.mBindGroups.size;
    }

    /**
     * Constructor.
     * @param pGpu  - Gpu.
     */
    public constructor(pGpu: Gpu) {
        super(pGpu, 'PIPELINE_LAYOUT_DESCRIPTOR');
        this.mBindGroups = new Dictionary<number, BindGroupLayout>();
    }

    /**
     * Create bind group.
     * @param pIndex - Group index.
     * @param pLayout - [Optional] Bind group Layout.
     */
    public addGroup(pIndex: number, pLayout?: BindGroupLayout): BindGroupLayout {
        // Create and add bind group layout.
        let lBindLayout: BindGroupLayout;
        if (pLayout) {
            lBindLayout = pLayout;
        } else {
            lBindLayout = new BindGroupLayout(this.gpu);
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
    public getGroup(pIndex: number): BindGroupLayout {
        // Throw on unaccessable group.
        if (!this.mBindGroups.has(pIndex)) {
            throw new Exception(`Bind group layout (${pIndex}) does not exists.`, this);
        }

        // Bind group should allways exist.
        return this.mBindGroups.get(pIndex)!;
    }

    /**
     * Ddesctroy native object.
     * @param _pNativeObject - Native object.
     */
    protected async destroyNative(_pNativeObject: GPUPipelineLayoutDescriptor): Promise<void> {
        /* Nothing to destroy. */
    }

    /**
     * Generate native object.
     */
    protected async generate(): Promise<GPUPipelineLayoutDescriptor> {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const [lIndex, lBindGroupLayout] of this.mBindGroups) {
            lPipelineLayout.bindGroupLayouts[lIndex] = await lBindGroupLayout.native();
        }

        // Validate continunity.
        for (const lEntry of lPipelineLayout.bindGroupLayouts) {
            if (!lEntry) {
                throw new Exception(`Bind group gap detected. Group not set.`, this);
            }
        }

        return lPipelineLayout;
    }
}