export interface IInstructionSet {
    /**
     * Execute instruction set.
     * @param pCommandEncoder - Command encoder.
     */
    execute(pCommandEncoder: GPUCommandEncoder): void
}