/**
 * Injection modes.
 * Used to create new or reuse old instances of a object.
 */
export enum InjectMode {
    /**
     * Only one instance of a class is constructed.
     * Any other object created from this class has the same reference.
     */
    Singleton = 1,

    /**
     * Any new creation initializes a new instance.
     */
    Instanced = 2
}