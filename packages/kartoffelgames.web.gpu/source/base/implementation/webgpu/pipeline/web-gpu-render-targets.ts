import { RenderTargets } from '../../../base/pipeline/render-targets';
import { AccessMode } from '../../../constant/access-mode.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { WebGpuTextureMemoryLayout } from '../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuTypes } from '../web-gpu-device';

export class WebGpuRenderTargets extends RenderTargets<WebGpuTypes> {
    /**
     * Create layout for a canvas texture.
     */
    protected override createCanvasMemoryLayout(): WebGpuTextureMemoryLayout {
        return new WebGpuTextureMemoryLayout(this.device, {
            dimension: TextureDimension.ThreeDimension,
            format: TextureFormat.RedGreenBlueAlpha,
            bindType: TextureBindType.RenderTarget,
            multisampled: this.multiSampleLevel > 1,
            access: AccessMode.Write,
            memoryIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Create layout for a color texture.
     */
    protected override createColorMemoryLayout(): WebGpuTextureMemoryLayout {
        return new WebGpuTextureMemoryLayout(this.device, {
            dimension: TextureDimension.ThreeDimension,
            format: TextureFormat.RedGreenBlueAlpha,
            bindType: TextureBindType.RenderTarget,
            multisampled: this.multiSampleLevel > 1,
            access: AccessMode.Write,
            memoryIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Create layout for a depth texture.
     */
    protected override createDepthMemoryLayout(): WebGpuTextureMemoryLayout {
        return new WebGpuTextureMemoryLayout(this.device, {
            dimension: TextureDimension.ThreeDimension,
            format: TextureFormat.Depth,
            bindType: TextureBindType.RenderTarget,
            multisampled: this.multiSampleLevel > 1,
            access: AccessMode.Write,
            memoryIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }
}