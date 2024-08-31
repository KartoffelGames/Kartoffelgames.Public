import { PgslTypeName } from './pgsl-type-name.enum';

export enum PgslBuildInTypeName {
    VertexIndex = PgslTypeName.VertexIndex,
    InstanceIndex = PgslTypeName.InstanceIndex,
    Position = PgslTypeName.Position,
    FrontFacing = PgslTypeName.FrontFacing,
    FragDepth = PgslTypeName.FragDepth,
    SampleIndex = PgslTypeName.SampleIndex,
    SampleMask = PgslTypeName.SampleMask,
    LocalInvocationId = PgslTypeName.LocalInvocationId,
    LocalInvocationIndex = PgslTypeName.LocalInvocationIndex,
    GlobalInvocationId = PgslTypeName.GlobalInvocationId,
    WorkgroupId = PgslTypeName.WorkgroupId,
    NumWorkgroups = PgslTypeName.NumWorkgroups,
    ClipDistances = PgslTypeName.ClipDistances,
}