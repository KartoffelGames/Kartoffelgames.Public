import { CompareFunction } from '../../../../constant/compare-function.enum';
import { FilterMode } from '../../../../constant/filter-mode.enum';
import { WrappingMode } from '../../../../constant/wrapping-mode.enum';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuTextureSamplerGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'textureSampler'>  {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native bind data group layout object.
     */
    protected override generate(): GPUSampler {
        // Convert compare function to native compare function.
        let lNativeCompareFunction: GPUCompareFunction | undefined = undefined;
        switch (this.gpuObject.compare) {
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
        switch (this.gpuObject.wrapMode) {
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
        switch (this.gpuObject.mipmapFilter) {
            case FilterMode.Linear: {
                lMipMapFilter = 'linear';
                break;
            }
            case FilterMode.Nearest: {
                lMipMapFilter = 'nearest';
                break;
            }
        }

        const lSamplerOptions: GPUSamplerDescriptor = {
            label: 'Texture-Sampler',
            addressModeU: lAddressMode,
            addressModeV: lAddressMode,
            addressModeW: lAddressMode,
            magFilter: this.toNativeFilterMode(this.gpuObject.magFilter),
            minFilter: this.toNativeFilterMode(this.gpuObject.minFilter),
            mipmapFilter: lMipMapFilter,
            lodMaxClamp: this.gpuObject.lodMaxClamp,
            lodMinClamp: this.gpuObject.lodMinClamp,
            maxAnisotropy: this.gpuObject.maxAnisotropy
        };

        if (lNativeCompareFunction) {
            lSamplerOptions.compare = lNativeCompareFunction;
        }

        return this.factory.gpu.createSampler(lSamplerOptions);
    }

    /**
     * Convert filter to native filter.
     * @param pFilerMode - Filter mode.
     */
    private toNativeFilterMode(pFilerMode: FilterMode): GPUFilterMode {
        switch (pFilerMode) {
            case FilterMode.Linear: {
                return 'linear';
            }
            case FilterMode.Nearest: {
                return 'nearest';
            }
        }
    }
}
