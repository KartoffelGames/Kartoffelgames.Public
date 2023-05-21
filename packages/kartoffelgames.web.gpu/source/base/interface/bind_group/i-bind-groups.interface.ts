import { IGpuObject } from '../i-gpu-object.interface';
import { IBindGroup } from './i-bind-group.interface';

export interface IBindGroups extends IGpuObject {
    /**
     * Available group indcies.
     */
    groups: Array<number>;

    /**
     * Get bind group.
     * @param pGroupIndex - Group index.
     */
    getGroup(pGroupIndex: number): IBindGroup;
}