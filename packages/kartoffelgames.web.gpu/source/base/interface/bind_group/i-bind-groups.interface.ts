import { IBindGroup } from './i-bind-group.interface';

export interface IBindGroups {
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