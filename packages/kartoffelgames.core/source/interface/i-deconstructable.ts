/**
 * Destructable type. Provides deconstruct methods.
 * 
 * @experimental @alpha
 */
export interface IDeconstructable {
    /**
     * Called on object deconstruction.
     */
    deconstruct(): void;
}