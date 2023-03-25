export enum WgslEnum {
    Unknown = '*',

    // Enum.
    AccessModeRead = 'read',
    AccessModeWrite = 'write',
    AccessModeReadWrite = 'read_write',

    AddressSpaceFunction = 'function',
    AddressSpacePrivate = 'private',
    AddressSpaceWorkgroup = 'workgroup',
    AddressSpaceUniform = 'uniform',
    AddressSpaceStorage = 'storage',

    InterpolationTypePerspective = 'perspective',
    InterpolationTypeLinear = 'linear',
    InterpolationTypeFlat = 'flat',

    InterpolationSamplingCenter = 'center',
    InterpolationSamplingCentroid = 'centroid',
    InterpolationSamplingSample = 'sample',

    BuiltInValueVertexIndex = 'vertex_index',
    BuiltInValueInstanceIndex = 'instance_index',
    BuiltInValuePosition = 'position',
    BuiltInValueFrontFacing = 'front_facing',
    BuiltInValueFragmentDepth = 'frag_depth',
    BuiltInValueLocalInvocationId = 'local_invocation_id',
    BuiltInValueLocalInvocationIndex = 'local_invocation_index',
    BuiltInValueGlobalInvovationId = 'global_invocation_id',
    BuiltInValueWorkgroupId = 'workgroup_id',
    BuiltInValueNumverWorkgroups = 'num_workgroups',
    BuiltInValueSampleIndex = 'sample_index',
    BuiltInValueSampleMask = 'sample_mask',

    TexelFormatRgba8unorm = 'rgba8unorm',
    TexelFormatRgba8snorm = 'rgba8snorm',
    TexelFormatRgba8uint = 'rgba8uint',
    TexelFormatRgba8sint = 'rgba8sint',
    TexelFormatRgba16uint = 'rgba16uint',
    TexelFormatRgba16sint = 'rgba16sint',
    TexelFormatRgba16float = 'rgba16float',
    TexelFormatR32uint = 'r32uint',
    TexelFormatR32sint = 'r32sint',
    TexelFormatR32float = 'r32float',
    TexelFormatRg32uint = 'rg32uint',
    TexelFormatRg32sint = 'rg32sint',
    TexelFormatRg32float = 'rg32float',
    TexelFormatRgba32uint = 'rgba32uint',
    TexelFormatRgba32sint = 'rgba32sint',
    TexelFormatRgba32float = 'rgba32float',
    TexelFormatBgra8unorm = 'bgra8unorm',
}