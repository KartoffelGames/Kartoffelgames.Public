export enum PgslValueFixedState {
    /**
     * Allways variable.
     * This is used for variables that can be changed at runtime.
     */
    Variable = 0,

    /**
     * Fixed to the current scope.
     * This is used for variables that are fixed to the current scope and cannot be changed.
     * For example, a parameter of a function or a const variable in a function scope.
     */
    ScopeFixed = 1,

    /**
     * Fixed to the pipeline creation.
     * This is used for variables that are fixed at pipeline creation and can only be changed by creation of a new pipeline.
     */
    PipelineCreationFixed = 2,

    /**
     * Fixed to the shader creation.
     * This is used for variables that are fixed at shader creation and can only be changed by creation of a new shader module instance.
     */
    ShaderCreationFixed = 3,

    /**
     * Constant value.
     * This is used for variables that are constant and cannot be changed.
     * For example, a string literal or a number literal.
     */
    Constant = 4,
}