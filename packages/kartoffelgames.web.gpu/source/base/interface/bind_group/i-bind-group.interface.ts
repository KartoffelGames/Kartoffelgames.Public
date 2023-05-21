import { IBufferLayout } from '../buffer/i-buffer-layout.interface';

export interface IBindGroup {
    /**
     * Add binding to group.
     * @param pBufferLayout - Buffer layout of bind.
     */
    addBind(pBufferLayout: IBufferLayout): void;
}