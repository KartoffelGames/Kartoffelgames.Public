import { Exception } from "@kartoffelgames/core";
import { PotatnoFunctionNodeDefinition } from "../project/node_definition/potatno-function-node-definition.ts";
import { PotatnoNodeDefinition } from "../project/node_definition/potatno-node-definition.ts";
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
     * Get all available node definitions for this document, including both project-level and function node definitions.
     */
    public get nodeDefinitions(): ReadonlyMap<string, PotatnoNodeDefinition<TProject>> {
        return new Map<string, PotatnoNodeDefinition<TProject>>([
            ...this.mFunctionNodeDefinitions.entries(),
            ...this.mProject.nodeDefinitions.entries()
        ]);
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

        // Create and register a corresponding node definition for this function.
        const lNodeDefinition: PotatnoFunctionNodeDefinition<TProject> = PotatnoFunctionNodeDefinition.new(pFunction);
        this.mFunctionNodeDefinitions.set(lNodeDefinition.id, lNodeDefinition);
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

        // Find the corresponding node definition.
        const lFunctionNodeDefinition: PotatnoFunctionNodeDefinition<TProject> | undefined = this.mFunctionNodeDefinitions.values().find((nodeDef) => {
            return nodeDef.function === pFunction;
        });

        // When the function has a node definition, remove it.
        if (lFunctionNodeDefinition) {
            this.mFunctionNodeDefinitions.delete(lFunctionNodeDefinition.id);
        }

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
