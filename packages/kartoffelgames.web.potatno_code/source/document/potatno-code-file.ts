import type { PotatnoFunction } from './potatno-function.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs.
 */
export class PotatnoCodeFile {
    private readonly mFunctions: Map<string, PotatnoFunction>;

    /**
     * Get the read-only map of all functions in this file.
     */
    public get functions(): ReadonlyMap<string, PotatnoFunction> {
        return this.mFunctions;
    }

    /**
     * Create an empty code file with no functions.
     */
    public constructor() {
        this.mFunctions = new Map<string, PotatnoFunction>();
    }

    /**
     * Add a new function to the file.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoFunction): void {
        this.mFunctions.set(pFunction.id, pFunction);
    }

    /**
     * Get a function by its identifier.
     *
     * @param pFunctionId - The identifier of the function to retrieve.
     *
     * @returns The function or undefined if not found.
     */
    public getFunction(pFunctionId: string): PotatnoFunction | undefined {
        return this.mFunctions.get(pFunctionId);
    }

    /**
     * Remove a function from the file by its identifier.
     * System functions cannot be removed.
     *
     * @param pFunctionId - The identifier of the function to remove.
     *
     * @returns True if the function was removed, false otherwise.
     */
    public removeFunction(pFunctionId: string): boolean {
        const lFunc: PotatnoFunction | undefined = this.mFunctions.get(pFunctionId);
        if (!lFunc || lFunc.system) {
            return false;
        }

        this.mFunctions.delete(pFunctionId);
        return true;
    }
}
