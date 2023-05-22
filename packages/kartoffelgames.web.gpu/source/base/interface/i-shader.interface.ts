
import { IBindGroupLayout } from './bind_group/i-bind-group-layout.interface';
import { IGpuObject } from './i-gpu-object.interface';

export interface IShader extends IGpuObject {
    bindGroups: IBindGroupLayout;
}