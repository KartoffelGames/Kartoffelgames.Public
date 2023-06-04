import { IBindGroupLayout } from '../bind_group/i-bind-group-layout.interface';
import { IGpuObject } from '../gpu/i-gpu-object.interface';


export interface IShader extends IGpuObject {
    readonly bindGroups: IBindGroupLayout;
}