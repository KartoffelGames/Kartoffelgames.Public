import { IBufferLayout } from '../buffer/i-buffer-layout.interface';
import { IGpuObject } from '../i-gpu-object.interface';
import { IBindGroup } from './i-bind-group.interface';

export interface IBindGroupLayout extends IGpuObject {
    /**
     * Add binding to group.
     * @param pBufferLayout - Buffer layout of bind.
     */
    addBind(pBufferLayout: IBufferLayout): void;

    /**
     * Create bind group from bind group layout.
     */
    createBinding(): IBindGroup;
}