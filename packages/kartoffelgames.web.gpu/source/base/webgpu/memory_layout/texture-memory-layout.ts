import { Exception } from '@kartoffelgames/core.data';
import { Base } from '../../base/export.';
import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';
import { ITextureMemoryLayout } from '../../interface/memory_layout/i-texture-memory-layout.interface';
import { WgslType } from '../shader/wgsl_enum/wgsl-type.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';

export class TextureMemoryLayout extends Base.TextureMemoryLayout implements ITextureMemoryLayout {
    public constructor(pParameter: TextureMemoryLayoutParameter) {
        // Map every texture type for view dimension.
        let lDimension: TextureDimension;
        switch (pParameter.type) {
            case WgslType.Texture1d:
            case WgslType.TextureStorage1d: {
                lDimension = TextureDimension.OneDimension;
                break;
            }
            case WgslType.TextureDepth2d:
            case WgslType.Texture2d:
            case WgslType.TextureStorage2d:
            case WgslType.TextureDepthMultisampled2d:
            case WgslType.TextureMultisampled2d: {
                lDimension = TextureDimension.TwoDimension;
                break;
            }
            case WgslType.TextureDepth2dArray:
            case WgslType.Texture2dArray:
            case WgslType.TextureStorage2dArray: {
                lDimension = TextureDimension.TwoDimensionArray;
                break;
            }
            case WgslType.Texture3d:
            case WgslType.TextureStorage3d: {
                lDimension = TextureDimension.ThreeDimension;
                break;
            }
            case WgslType.TextureCube:
            case WgslType.TextureDepthCube: {
                lDimension = TextureDimension.Cube;
                break;
            }
            case WgslType.TextureCubeArray: {
                lDimension = TextureDimension.CubeArray;
                break;
            }
            default: {
                throw new Exception(`Texture type "${pParameter.type}" not supported for any texture dimension.`, null);
            }
        }

        const lFormat: TextureFormat = pParameter.format ?? TextureFormat.RedGreenBlueAlpha;

        super({ ...pParameter, dimension: lDimension, format: lFormat });
    }
}

type TextureMemoryLayoutParameter = {
    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;

    // New 
    type: WgslType;
    format?: TextureFormat;
};