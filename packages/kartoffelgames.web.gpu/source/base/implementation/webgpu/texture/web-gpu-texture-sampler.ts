import { TextureSampler } from '../../../base/texture/texture-sampler';
import { CompareFunction } from '../../../constant/compare-function.enum';
import { FilterMode } from '../../../constant/filter-mode.enum';
import { WrappingMode } from '../../../constant/wrapping-mode.enum';
import { WebGpuSamplerMemoryLayout } from '../memory_layout/web-gpu-sampler-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';


export class WebGpuTextureSampler extends TextureSampler<WebGpuTypes, GPUSampler> {
    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pLayout - Sampler memory layout.
     */
    public constructor(pDevice: WebGpuDevice, pLayout: WebGpuSamplerMemoryLayout) {
        super(pDevice, pLayout);
    }

    /**
     * Destroy native gpu object.
     * @param _pNativeObject - Native texture sampler.
     */
    protected override destroyNative(_pNativeObject: GPUSampler): void {
        // Nothing to destroy. Very sad Godzilla noises
    }

    protected override generate(): GPUSampler {
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
        const lToNativeFilterMode = (pFilerMode: FilterMode): GPUFilterMode => {
            switch (pFilerMode) {
                case FilterMode.Linear: {
                    return 'linear';
                }
                case FilterMode.Nearest: {
                    return 'nearest';
                }
            }
        };

        const lSamplerOptions: GPUSamplerDescriptor = {
            label: 'Texture-Sampler',
            addressModeU: lAddressMode,
            addressModeV: lAddressMode,
            addressModeW: lAddressMode,
            magFilter: lToNativeFilterMode(this.magFilter),
            minFilter: lToNativeFilterMode(this.minFilter),
            mipmapFilter: lMipMapFilter,
            lodMaxClamp: this.lodMaxClamp,
            lodMinClamp: this.lodMinClamp,
            maxAnisotropy: this.maxAnisotropy
        };

        if (lNativeCompareFunction) {
            lSamplerOptions.compare = lNativeCompareFunction;
        }

        return this.device.gpuDeviceReference.createSampler(lSamplerOptions);
    }
}