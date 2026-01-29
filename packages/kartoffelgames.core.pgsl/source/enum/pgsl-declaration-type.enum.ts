/**
 * Declaration name. Used by module and function variables.
 * Because it is used by both, it cant be specified more strictly or inside a syntax tree demself.
 */
export enum PgslDeclarationType {
    Let = 'let', // Only for function variables.
    Const = 'const', // Shared name for function and module variables but serves different purposes.
    Storage = 'storage', // Only for module variables.
    Uniform = 'uniform', // Only for module variables.
    Workgroup = 'workgroup', // Only for module variables.
    Private = 'private', // Only for module variables.
    Param = 'param', // Only for module variables.
}