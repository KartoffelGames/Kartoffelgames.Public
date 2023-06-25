import { Base } from '../../base/export.';
import { ISamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../../interface/memory_layout/i-sampler-memory-layout.interface';

export class SamplerMemoryLayout extends Base.SamplerMemoryLayout implements ISamplerMemoryLayout {
    /**
     * Constructor.
     * @param pParameter - Sampler memory layout.
     */
    public constructor(pParameter: SamplerMemoryLayoutParameter) {
        super(pParameter);
    }
}