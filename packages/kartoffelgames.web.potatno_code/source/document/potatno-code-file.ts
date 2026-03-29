import type { PotatnoFunction } from './potatno-function.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs, and tracks the currently active function.
 */
export class PotatnoCodeFile {
    private mActiveFunctionId: string;
    private readonly mFunctions: Map<string, PotatnoFunction>;

    /**
     * Get the currently active function for editing.
     */
    public get activeFunction(): PotatnoFunction | undefined {
        return this.mFunctions.get(this.mActiveFunctionId);
    }

    /**
     * Get the identifier of the currently active function.
     */
    public get activeFunctionId(): string {
        return this.mActiveFunctionId;
    }

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
        this.mActiveFunctionId = '';
    }

    /**
     * Add a new function to the file.
     * If no function is currently active, the added function becomes the active one.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoFunction): void {
        this.mFunctions.set(pFunction.id, pFunction);

        if (!this.mActiveFunctionId) {
            this.mActiveFunctionId = pFunction.id;
        }
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

        if (this.mActiveFunctionId === pFunctionId) {
            const lFirst: string | undefined = this.mFunctions.keys().next().value;
            this.mActiveFunctionId = lFirst ?? '';
        }

        return true;
    }

    /**
     * Set the active function by its identifier.
     *
     * @param pFunctionId - The identifier of the function to activate.
     *
     * @returns True if the function was found and activated, false otherwise.
     */
    public setActiveFunction(pFunctionId: string): boolean {
        if (this.mFunctions.has(pFunctionId)) {
            this.mActiveFunctionId = pFunctionId;
            return true;
        }
        return false;
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
}
