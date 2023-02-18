export enum TextureUsage {
    CopySource = GPUTextureUsage.COPY_SRC,
    CopyDestination = GPUTextureUsage.COPY_DST,
    TextureBinding = GPUTextureUsage.STORAGE_BINDING,
    StorageBinding = GPUTextureUsage.STORAGE_BINDING,
    RenderAttachment = GPUTextureUsage.RENDER_ATTACHMENT
}