export enum PgslValueAddressSpace {
    /**
     * Variables in function scope.
     */
    Function = 'Function',

    /**
     * Module scope read write variables.
     */
    Module = 'Private',

    /**
     * Workgroup variables. Only address space that is able to handle creation fixed length arrays.
     */
    Workgroup = 'Workgroup',

    /**
     * Uniform variables.
     */
    Uniform = 'Uniform',

    /**
     * Storage variables.
     */
    Storage = 'Storage',

    /**
     * Texture address space.
     */
    Texture = 'Texture'
}