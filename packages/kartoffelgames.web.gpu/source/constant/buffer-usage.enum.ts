export enum BufferUsage {
    None = 0,
    Index = GPUBufferUsage.INDEX,
    Vertex = GPUBufferUsage.VERTEX,
    Uniform = GPUBufferUsage.UNIFORM,
    Storage = GPUBufferUsage.STORAGE,
    Indirect = GPUBufferUsage.INDIRECT,
    CopySource = GPUBufferUsage.COPY_SRC,
    CopyDestination = GPUBufferUsage.COPY_DST,

    // No public available
    // MapWrite = GPUBufferUsage.MAP_WRITE,
    // MapRead = GPUBufferUsage.MAP_READ,
    // QueryResolve = GPUBufferUsage.QUERY_RESOLVE
}