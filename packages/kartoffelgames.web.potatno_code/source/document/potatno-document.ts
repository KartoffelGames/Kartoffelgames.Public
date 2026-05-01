import { Exception } from "@kartoffelgames/core";
import { PotatnoFunctionNodeDefinition } from "../project/node_definition/potatno-function-node-definition.ts";
import { PotatnoProjectType } from "../project/potatno-project-types-definition.ts";
import { PotatnoProject } from "../project/potatno-project.ts";
import type { PotatnoDocumentFunction } from './potatno-document-function.ts';
import type { PotatnoDocumentPortValidationError } from './potatno-document-port.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs.
 */
export class PotatnoDocument<TProjectType extends PotatnoProjectType> {
    private readonly mFunctions: Set<PotatnoDocumentFunction<TProjectType>>;
    private readonly mFunctionNodeDefinitions: Map<string, PotatnoFunctionNodeDefinition<TProjectType>>;
    private readonly mProject: PotatnoProject<TProjectType>;

    /**
     * Get the read-only set of all functions in this file.
     */
    public get functions(): ReadonlySet<PotatnoDocumentFunction<TProjectType>> {
        return this.mFunctions;
    }

    /**
     * Get the map of live node definitions generated from this document's functions.
     * Keyed by function id. Used by the code generator and editor to resolve
     * user-function call nodes at the document level.
     */
    public get functionNodeDefinitions(): ReadonlyMap<string, PotatnoFunctionNodeDefinition<TProjectType>> {
        return this.mFunctionNodeDefinitions;
    }

    /**
     * Get the project this document belongs to.
     */
    public get project(): PotatnoProject<TProjectType> {
        return this.mProject;
    }

    /**
     * Create an empty code file with no functions.
     */
    public constructor(pProject: PotatnoProject<TProjectType>) {
        this.mProject = pProject;
        this.mFunctions = new Set<PotatnoDocumentFunction<TProjectType>>();
        this.mFunctionNodeDefinitions = new Map<string, PotatnoFunctionNodeDefinition<TProjectType>>();
    }

    /**
     * Add a new function to the file.
     * A corresponding PotatnoFunctionNodeDefinition is created and registered
     * so the function can be placed as a node in other graphs.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoDocumentFunction<TProjectType>): void {
        this.mFunctions.add(pFunction);
        this.mFunctionNodeDefinitions.set(pFunction.id, new PotatnoFunctionNodeDefinition(pFunction));
    }

    /**
     * Remove a function from the file.
     * System functions cannot be removed.
     *
     * @param pFunction - The function to remove.
     *
     * @returns True if the function was removed, false otherwise.
     */
    public removeFunction(pFunction: PotatnoDocumentFunction<TProjectType>): boolean {
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
    public validate(): Array<PotatnoDocumentPortValidationError<TProjectType>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProjectType>> = [];

        for (const lFunction of this.mFunctions) {
            lErrors.push(...lFunction.validate());
        }

        return lErrors;
    }
}
