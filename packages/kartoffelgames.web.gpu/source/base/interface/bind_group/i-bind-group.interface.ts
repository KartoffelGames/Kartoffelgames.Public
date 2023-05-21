import { IBufferLayout } from '../buffer/i-buffer-layout.interface';
import { IGpuObject } from '../i-gpu-object.interface';

export interface IBindGroup extends IGpuObject {
    /**
     * Add binding to group.
     * @param pBufferLayout - Buffer layout of bind.
     */
    addBind(pBufferLayout: IBufferLayout): void;
}