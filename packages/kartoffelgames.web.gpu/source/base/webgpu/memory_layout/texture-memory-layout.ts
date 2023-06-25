import { Base } from '../../base/export.';
import { ITextureMemoryLayout, TextureMemoryLayoutParameter } from '../../interface/memory_layout/i-texture-memory-layout.interface';

export class TextureMemoryLayout extends Base.TextureMemoryLayout implements ITextureMemoryLayout {
    /**
     * Constructor.
     * @param pParameter - Texture memory layout.
     */
    public constructor(pParameter: TextureMemoryLayoutParameter) {
        super(pParameter);
    }
}