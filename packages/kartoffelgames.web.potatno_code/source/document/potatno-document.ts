import { Exception } from "@kartoffelgames/core";
import type { PotatnoDocumentFunction } from './potatno-document-function.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs.
 */
export class PotatnoDocument {
    private readonly mFunctions: Set<PotatnoDocumentFunction>;

    /**
     * Get the read-only set of all functions in this file.
     */
    public get functions(): ReadonlySet<PotatnoDocumentFunction> {
        return this.mFunctions;
    }

    /**
     * Create an empty code file with no functions.
     */
    public constructor() {
        this.mFunctions = new Set<PotatnoDocumentFunction>();
    }

    /**
     * Add a new function to the file.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoDocumentFunction): void {
        this.mFunctions.add(pFunction);
    }

    /**
     * Remove a function from the file.
     * System functions cannot be removed.
     *
     * @param pFunction - The function to remove.
     *
     * @returns True if the function was removed, false otherwise.
     */
    public removeFunction(pFunction: PotatnoDocumentFunction): boolean {
        if (!this.mFunctions.has(pFunction)) {
            return false;
        }

        // Throw when function is a system function.
        if (pFunction.system) {
            throw new Exception(`Cannot remove a system function.`, this);
        }

        this.mFunctions.delete(pFunction);
        return true;
    }
}
