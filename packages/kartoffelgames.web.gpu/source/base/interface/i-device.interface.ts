import { IGpuObject } from './i-gpu-object.interface';

export interface IDevice extends IGpuObject {
    // Currently nothing.
    readonly name: string;
}