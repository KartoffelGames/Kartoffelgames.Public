import { IGpuObject } from '../gpu/i-gpu-object.interface';
import { IBindGroup } from './i-bind-group.interface';

export interface IBindGroupLayout extends IGpuObject {
    /**
     * Get bindings. Bindings does not have continuity.
     */
    bindings: Array<Binding | null>

    /**
     * Create bind group from bind group layout.
     */
    createBinding(): IBindGroup;
}

type Binding = {

}