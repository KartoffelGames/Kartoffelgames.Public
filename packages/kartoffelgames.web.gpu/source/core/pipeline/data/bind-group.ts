import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { BaseBuffer } from '../../buffer/base-buffer';
import { Gpu } from '../../gpu';
import { BindType } from './bind-group-layout';

export class BindGroup {
    private readonly mBindList: Array<Bind>;
    private readonly mGpu: Gpu;
    private readonly mLayout: GPUBindGroupLayout;

    /**
     * Constructor.
     * @param pLayout - Layout
     * @param pBindList - Bind list.
     */
    public constructor(pGpu: Gpu, pLayout: GPUBindGroupLayout, pBindList: Array<BindDefinition>) {
        this.mGpu = pGpu;
        this.mLayout = pLayout;
        this.mBindList = new Array<Bind>();

        // Extend bind definition by data.
        for (const lDefinition of pBindList) {
            this.mBindList.push({
                name: lDefinition.name,
                type: lDefinition.type,
                data: null
            });
        }
    }

    public generateBindGroup(): GPUBindGroup {
        const lEntryList: Array<GPUBindGroupEntry> = new Array<GPUBindGroupEntry>();

        for (let lIndex: number = 0; lIndex < this.mBindList.length; lIndex++) {
            const lBind = this.mBindList[lIndex];

            if (!lBind.data) {
                throw new Exception(`Bind data "${lBind.data}" not set.`, this);
            }

            if (lBind instanceof BaseBuffer) {
                lEntryList.push({
                    binding: lIndex,
                    resource: {
                        buffer: (<BaseBuffer<TypedArray>>lBind.data).buffer
                    }
                });
            } else {
                lEntryList.push({
                    binding: lIndex,
                    resource: <GPUTextureView>lBind.data
                });
            }
        }

        return this.mGpu.device.createBindGroup({
            layout: this.mLayout,
            entries: lEntryList
        });
    }

    public setData(pBindName: string, pData: GPUTextureView | BaseBuffer<TypedArray>): void {
        const lBind = this.mBindList.find((pBind) => { return pBind.name === pBindName; });
        if (!lBind) {
            throw new Exception(`Bind "${pBindName}" not found.`, this);
        }

        // TODO: Validate datatype for bind type.

        lBind.data = pData;
    }
}

type Bind = {
    name: string,
    type: BindType,
    data: GPUTextureView | BaseBuffer<TypedArray> | null;
};

export type BindDefinition = {
    name: string,
    type: BindType,
};