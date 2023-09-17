import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuVideoTextureGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'videoTexture'> {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generate(): GPUExternalTexture {
        return this.factory.gpu.importExternalTexture({
            label: 'External-Texture',
            source: this.gpuObject.video,
            colorSpace: 'srgb'
        });
    }
}