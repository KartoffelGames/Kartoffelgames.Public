import { SamplerType } from '../../constant/sampler-type.enum';
import { IMemoryLayout } from './i-memory-layout.interface';

export interface ISamplerMemoryLayout extends IMemoryLayout {
    /**
     * Sampler type.
     */
    readonly samplerType: SamplerType;
}