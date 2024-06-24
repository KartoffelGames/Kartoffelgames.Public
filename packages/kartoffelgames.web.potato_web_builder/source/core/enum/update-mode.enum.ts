export enum UpdateMode {
    /**
     * Default behaviour. Update automaticly and propagate changes to parent.
     */
    Default = 0,

    /**
     * Do not propagate changes to parent components.
     */
    Isolated = 1,
    
    /**
     * Update component manually. Child components can still update independent.
     */
    Manual = 2
}