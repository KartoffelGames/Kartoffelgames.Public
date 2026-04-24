import { Exception } from "@kartoffelgames/core";
import type { PotatnoDocumentFunction } from './potatno-document-function.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs.
 */
export class PotatnoDocument {
    private readonly mFunctions: Map<string, PotatnoDocumentFunction>;

    /**
     * Get the read-only map of all functions in this file.
     */
    public get functions(): ReadonlyMap<string, PotatnoDocumentFunction> {
        return this.mFunctions;
    }

    /**
     * Create an empty code file with no functions.
     */
    public constructor() {
        this.mFunctions = new Map<string, PotatnoDocumentFunction>();
    }

    /**
     * Add a new function to the file.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoDocumentFunction): void {
        this.mFunctions.set(pFunction.id, pFunction);
    }

    /**
     * Get a function by its identifier.
     *
     * @param pFunctionId - The identifier of the function to retrieve.
     *
     * @returns The function or undefined if not found.
     */
    public getFunction(pFunctionId: string): PotatnoDocumentFunction | undefined {
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
    public removeFunction(pFunction: PotatnoDocumentFunction): boolean {
        const lFunc: PotatnoDocumentFunction | undefined = this.mFunctions.get(pFunction.id);
        if(!lFunc) {
            return false;
        }

        // Throw when function is a system function.
        if (lFunc.system) {
            throw new Exception(`Cannot remove system function with id ${pFunction.id}.`, this);
        }

        this.mFunctions.delete(pFunction.id);
        return true;
    }
}
