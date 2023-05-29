import { WebGpuTextureSampler } from '../../../abstraction_layer/webgpu/texture_resource/web-gpu-texture-sampler';
import { Base } from '../../base/export.';
import { CompareFunction } from '../../constant/compare-function.enum';
import { FilterMode } from '../../constant/filter-mode.enum';
import { WrappingMode } from '../../constant/wrapping-mode.enum';
import { GpuDevice } from '../gpu-device';


export class TextureSampler extends Base.TextureSampler<GpuDevice, WebGpuTextureSampler> {
    /**
     * Constructor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);
    }

    /**
     * Destroy native gpu object.
     * @param pNativeObject - Native texture sampler.
     */
    protected override destroyNative(pNativeObject: WebGpuTextureSampler): void {
        pNativeObject.destroy();
    }

    protected override generate(): WebGpuTextureSampler {
        // Convert compare function to native compare function.
        let lNativeCompareFunction: GPUCompareFunction | undefined = undefined;
        switch (this.compare) {
            case CompareFunction.Allways: {
                lNativeCompareFunction = 'always';
                break;
            }
            case CompareFunction.Greater: {
                lNativeCompareFunction = 'greater';
                break;
            }
            case CompareFunction.Equal: {
                lNativeCompareFunction = 'equal';
                break;
            }
            case CompareFunction.GreaterEqual: {
                lNativeCompareFunction = 'greater-equal';
                break;
            }
            case CompareFunction.LessEqual: {
                lNativeCompareFunction = 'less-equal';
                break;
            }
            case CompareFunction.Less: {
                lNativeCompareFunction = 'less';
                break;
            }
            case CompareFunction.Never: {
                lNativeCompareFunction = 'never';
                break;
            }
            case CompareFunction.NotEqual: {
                lNativeCompareFunction = 'not-equal';
                break;
            }
        }

        // Convert wrap mode to native address mode.
        let lAddressMode: GPUAddressMode = 'clamp-to-edge';
        switch (this.wrapMode) {
            case WrappingMode.ClampToEdge: {
                lAddressMode = 'clamp-to-edge';
                break;
            }
            case WrappingMode.MirrorRepeat: {
                lAddressMode = 'mirror-repeat';
                break;
            }
            case WrappingMode.Repeat: {
                lAddressMode = 'repeat';
                break;
            }
        }

        // Convert filter to native mipmap filter.
        let lMipMapFilter: GPUMipmapFilterMode = 'linear';
        switch (this.mipmapFilter) {
            case FilterMode.Linear: {
                lMipMapFilter = 'linear';
                break;
            }
            case FilterMode.Nearest: {
                lMipMapFilter = 'nearest';
                break;
            }
        }

        // Convert filter to native filter.
        const lToNativeFilterMode = (pFilerMode: FilterMode) => {
            switch (pFilerMode) {
                case FilterMode.Linear: {
                    return 'linear';
                }
                case FilterMode.Nearest: {
                    return 'nearest';
                }
            }
        };

        return new WebGpuTextureSampler(this.device.native, {
            compare: lNativeCompareFunction,
            fitMode: lAddressMode,
            magFilter: lToNativeFilterMode(this.magFilter),
            minFilter: lToNativeFilterMode(this.minFilter),
            mipmapFilter: lMipMapFilter,
            lodMinClamp: this.lodMinClamp,
            lodMaxClamp: this.lodMaxClamp,
            maxAnisotropy: this.maxAnisotropy
        });
    }
}