import { IBindGroups } from './bind_group/i-bind-groups.interface';
import { IGpuObject } from './i-gpu-object.interface';

export interface IShader extends IGpuObject {
    bindGroups: IBindGroups;
}