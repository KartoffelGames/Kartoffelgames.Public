// TODO: Move enum out of buildin folder and let the declaration be seperate.

/**
 * Texel format enum.
 */
export const PgslTexelFormat = {
    Rgba8unorm: 'rgba8unorm',
    Rgba8snorm: 'rgba8snorm',
    Rgba8uint: 'rgba8uint',
    Rgba8sint: 'rgba8sint',
    Rgba16uint: 'rgba16uint',
    Rgba16sint: 'rgba16sint',
    Rgba16float: 'rgba16float',
    R32uint: 'r32uint',
    R32sint: 'r32sint',
    R32float: 'r32float',
    Rg32uint: 'rg32uint',
    Rg32sint: 'rg32sint',
    Rg32float: 'rg32float',
    Rgba32uint: 'rgba32uint',
    Rgba32sint: 'rgba32sint',
    Rgba32float: 'rgba32float',
    Bgra8unorm: 'bgra8unorm'
} as const;

export type PgslTexelFormat = (typeof PgslTexelFormat)[keyof typeof PgslTexelFormat];