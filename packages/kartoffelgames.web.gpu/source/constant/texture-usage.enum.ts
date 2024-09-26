export enum TextureUsage {
    None = 0,
    TextureBinding = GPUTextureUsage.TEXTURE_BINDING,
    StorageBinding = GPUTextureUsage.STORAGE_BINDING,
    RenderAttachment = GPUTextureUsage.RENDER_ATTACHMENT
}