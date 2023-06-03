import { IGpuObject } from '../gpu/i-gpu-object.interface';
import { IBindGroupLayout } from './i-bind-group-layout.interface';

export interface IBindLayout extends IGpuObject {
    /**
     * Available group count.
     */
    readonly groupCount: number;

    /**
     * Add bind group layout.
     * @param pGroupIndex - Group index.
     * @param pBindGroupLayout - Bind group layout.
     */
    addGroup(pGroupIndex: number, pBindGroupLayout: IBindGroupLayout): void;

    /**
     * Get bind group.
     * @param pGroupIndex - Group index.
     */
    getGroup(pGroupIndex: number): IBindGroupLayout;
}