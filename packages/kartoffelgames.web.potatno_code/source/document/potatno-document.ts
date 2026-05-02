import { Exception } from "@kartoffelgames/core";
import { PotatnoFunctionNodeDefinition } from "../project/node_definition/potatno-function-node-definition.ts";
import { PotatnoProject } from "../project/potatno-project.ts";
import type { PotatnoDocumentFunction } from './potatno-document-function.ts';
import type { PotatnoDocumentPortValidationError } from './potatno-document-port.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs.
 */
export class PotatnoDocument<TProject extends PotatnoProject<any>> {
    private readonly mFunctions: Set<PotatnoDocumentFunction<TProject>>;
    private readonly mFunctionNodeDefinitions: Map<string, PotatnoFunctionNodeDefinition<TProject>>;
    private readonly mProject: TProject;

    /**
     * Get the read-only set of all functions in this file.
     */
    public get functions(): ReadonlySet<PotatnoDocumentFunction<TProject>> {
        return this.mFunctions;
    }

    /**
     * Get the map of live node definitions generated from this document's functions.
     * Keyed by function id. Used by the code generator and editor to resolve
     * user-function call nodes at the document level.
     */
    public get functionNodeDefinitions(): ReadonlyMap<string, PotatnoFunctionNodeDefinition<TProject>> {
        return this.mFunctionNodeDefinitions;
    }

    /**
     * Get the project this document belongs to.
     */
    public get project(): TProject {
        return this.mProject;
    }

    /**
     * Create an empty code file with no functions.
     */
    public constructor(pProject: TProject) {
        this.mProject = pProject;
        this.mFunctions = new Set<PotatnoDocumentFunction<TProject>>();
        this.mFunctionNodeDefinitions = new Map<string, PotatnoFunctionNodeDefinition<TProject>>();
    }

    /**
     * Add a new function to the file.
     * A corresponding PotatnoFunctionNodeDefinition is created and registered
     * so the function can be placed as a node in other graphs.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoDocumentFunction<TProject>): void {
        this.mFunctions.add(pFunction);
        this.mFunctionNodeDefinitions.set(pFunction.id, PotatnoFunctionNodeDefinition.new(pFunction));
    }

    /**
     * Remove a function from the file.
     * System functions cannot be removed.
     *
     * @param pFunction - The function to remove.
     *
     * @returns True if the function was removed, false otherwise.
     */
    public removeFunction(pFunction: PotatnoDocumentFunction<TProject>): boolean {
        if (!this.mFunctions.has(pFunction)) {
            return false;
        }

        if (pFunction.isSystem) {
            throw new Exception(`Cannot remove a system function.`, this);
        }

        this.mFunctions.delete(pFunction);
        this.mFunctionNodeDefinitions.delete(pFunction.id);
        return true;
    }

    /**
     * Validate all functions in this document and return any errors found.
     */
    public validate(): Array<PotatnoDocumentPortValidationError<TProject>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProject>> = [];

        for (const lFunction of this.mFunctions) {
            lErrors.push(...lFunction.validate());
        }

        return lErrors;
    }
}
