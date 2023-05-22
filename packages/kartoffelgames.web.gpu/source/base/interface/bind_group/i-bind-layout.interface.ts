import { IGpuObject } from '../i-gpu-object.interface';
import { IBindGroupLayout } from './i-bind-group-layout.interface';

export interface IBindLayout extends IGpuObject {
    /**
     * Available group indices.
     */
    groups: Array<number>;

    /**
     * Get bind group.
     * @param pGroupIndex - Group index.
     */
    getGroup(pGroupIndex: number): IBindGroupLayout;
}