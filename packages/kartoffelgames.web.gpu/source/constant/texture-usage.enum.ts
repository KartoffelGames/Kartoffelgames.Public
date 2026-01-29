export enum TextureUsage {
    None = 0,
    CopySource = GPUTextureUsage.COPY_SRC,
    CopyDestination = GPUTextureUsage.COPY_DST,
    TextureBinding = GPUTextureUsage.TEXTURE_BINDING,
    Storage = GPUTextureUsage.STORAGE_BINDING,
    RenderAttachment = GPUTextureUsage.RENDER_ATTACHMENT,
}