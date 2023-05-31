export enum WebGpuTextureUsage {
    CopySource = GPUTextureUsage.COPY_SRC,
    CopyDestination = GPUTextureUsage.COPY_DST,
    TextureBinding = GPUTextureUsage.TEXTURE_BINDING,
    StorageBinding = GPUTextureUsage.STORAGE_BINDING,
    RenderAttachment = GPUTextureUsage.RENDER_ATTACHMENT
}