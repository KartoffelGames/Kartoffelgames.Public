import { Exception } from '@kartoffelgames/core';
import { PotatnoFunctionNodeDefinition } from '../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoNodeDefinition } from '../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.interface.ts';
import { PotatnoDocumentFunction, type PotatnoDocumentFunctionConstructorParameter } from './potatno-document-function.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs.
 */
export class PotatnoDocument<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mFunctions: Set<PotatnoDocumentFunction<TProjectTypes>>;
    private readonly mFunctionNodeDefinitions: Map<string, PotatnoFunctionNodeDefinition<TProjectTypes>>;
    private readonly mProject: PotatnoProject<TProjectTypes>;

    /**
     * Get the read-only set of all functions in this file.
     */
    public get functions(): ReadonlySet<PotatnoDocumentFunction<TProjectTypes>> {
        return this.mFunctions;
    }

    /**
     * Get all available node definitions for this document, including both project-level and function node definitions.
     */
    public get nodeDefinitions(): ReadonlyArray<PotatnoNodeDefinition<TProjectTypes>> {
        return [
            ...this.mFunctionNodeDefinitions.values(),
            ...this.mProject.nodeDefinitions.values()
        ];
    }

    /**
     * Get the project this document belongs to.
     */
    public get project(): PotatnoProject<TProjectTypes> {
        return this.mProject;
    }

    /**
     * Create an empty code file with no functions.
     */
    public constructor(pProject: PotatnoProject<TProjectTypes>) {
        this.mProject = pProject;
        this.mFunctions = new Set<PotatnoDocumentFunction<TProjectTypes>>();
        this.mFunctionNodeDefinitions = new Map<string, PotatnoFunctionNodeDefinition<TProjectTypes>>();
    }

    /**
     * Add an existing function to the file.
     * A corresponding PotatnoFunctionNodeDefinition is created and registered
     * so the function can be placed as a node in other graphs.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoDocumentFunction<TProjectTypes>): void {
        this.mFunctions.add(pFunction);

        // Create and register a corresponding node definition for this function.
        const lNodeDefinition: PotatnoFunctionNodeDefinition<TProjectTypes> = new PotatnoFunctionNodeDefinition(pFunction);
        this.mFunctionNodeDefinitions.set(lNodeDefinition.id, lNodeDefinition);
    }

    /**
     * Add a new function to the file.
     * A corresponding PotatnoFunctionNodeDefinition is created and registered
     * so the function can be placed as a node in other graphs.
     *
     * @param pConstructionParameter - The parameters to construct the function.
     */
    public newFunction(pConstructionParameter: PotatnoDocumentFunctionConstructorParameter): PotatnoDocumentFunction<TProjectTypes> {
        // Create the function instance.
        const lFunction: PotatnoDocumentFunction<TProjectTypes> = new PotatnoDocumentFunction(this.mProject, this, pConstructionParameter);

        this.mFunctions.add(lFunction);

        // Create and register a corresponding node definition for this function.
        const lNodeDefinition: PotatnoFunctionNodeDefinition<TProjectTypes> = new PotatnoFunctionNodeDefinition(lFunction);
        this.mFunctionNodeDefinitions.set(lNodeDefinition.id, lNodeDefinition);

        return lFunction;
    }

    /**
     * Remove a function from the file.
     * System functions cannot be removed.
     *
     * @param pFunction - The function to remove.
     *
     * @returns True if the function was removed, false otherwise.
     */
    public removeFunction(pFunction: PotatnoDocumentFunction<TProjectTypes>): boolean {
        if (!this.mFunctions.has(pFunction)) {
            return false;
        }

        if (pFunction.isSystem) {
            throw new Exception(`Cannot remove a system function.`, this);
        }

        this.mFunctions.delete(pFunction);

        // Find the corresponding node definition.
        const lFunctionNodeDefinition: PotatnoFunctionNodeDefinition<TProjectTypes> | undefined = this.mFunctionNodeDefinitions.values().find((nodeDef) => {
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
     * Also rejects cross-function recursion (A → B → A) so the code
     * generator can assume an acyclic function-call graph.
     */
    public validate(): Array<PotatnoDocumentPortValidationError<TProjectTypes>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProjectTypes>> = [];

        const lEntryPointDefinitionId: string = this.mProject.entryPoint.id;

        // Check for the entry point function and initialize of not added yet.
        if (!this.mFunctions.values().some((pFunction) => pFunction.definitionId === lEntryPointDefinitionId)) {
            this.newFunction({
                definitionId: lEntryPointDefinitionId,
                id: crypto.randomUUID(),
                isSystem: true,
                label: this.mProject.entryPoint.label
            });
        }

        // TODO: Validation is in wrong order. Validate in correct dependency order.

        // Per-function validation: flow/value cycles, region constraints, port resync.
        for (const lFunction of this.mFunctions) {
            lErrors.push(...lFunction.validate());
        }

        // Cross-function recursion detection over the function-call graph.
        lErrors.push(...this.detectCrossFunctionRecursion());

        return lErrors;
    }

    /**
     * Build the function-call dependency graph from PotatnoFunctionNodeDefinition
     * usages and report any cycles found.
     */
    private detectCrossFunctionRecursion(): Array<PotatnoDocumentPortValidationError<TProjectTypes>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProjectTypes>> = [];

        // Create a mapping of which functions call which other functions based on the function nodes used in their graphs.
        // The function call only searches for the requested function and caches the result, so each function's called functions are only computed once.
        const lFunctionsUsedFunctions: Map<PotatnoDocumentFunction<TProjectTypes>, Set<PotatnoDocumentFunction<TProjectTypes>>> = new Map<PotatnoDocumentFunction<TProjectTypes>, Set<PotatnoDocumentFunction<TProjectTypes>>>();
        const lGetUsedFunctions = (pFunction: PotatnoDocumentFunction<TProjectTypes>): Set<PotatnoDocumentFunction<TProjectTypes>> => {
            // Create new mapping entry for this function if it doesn't exist yet.
            if (!lFunctionsUsedFunctions.has(pFunction)) {
                // Create new set of called functions for this function and populate it by searching through all nodes in the function.
                const lUsedFunctions: Set<PotatnoDocumentFunction<TProjectTypes>> = new Set<PotatnoDocumentFunction<TProjectTypes>>();
                for (const lNode of pFunction.nodes) {
                    // If this node is a function node, add the corresponding function to the called set.
                    if (this.mFunctionNodeDefinitions.has(lNode.definitionId)) {
                        lUsedFunctions.add(this.mFunctionNodeDefinitions.get(lNode.definitionId)!.function);
                    }
                }

                // Cache the result for future lookups.
                lFunctionsUsedFunctions.set(pFunction, lUsedFunctions);
            }

            return lFunctionsUsedFunctions.get(pFunction)!;
        };

        // Search buffer lists.
        const lProcessedFunctions: Set<PotatnoDocumentFunction<TProjectTypes>> = new Set<PotatnoDocumentFunction<TProjectTypes>>();
        const lFunctionCallStack: Set<PotatnoDocumentFunction<TProjectTypes>> = new Set<PotatnoDocumentFunction<TProjectTypes>>();

        // Recursive deep search function to explore the call graph.
        const lVisit = (pFunction: PotatnoDocumentFunction<TProjectTypes>): void => {
            // Skip already fully explored functions.
            // That way each function is only processed once, even if there are multiple paths to it.
            if (lProcessedFunctions.has(pFunction)) {
                return;
            }

            // Already on the current search path => cycle.
            if (lFunctionCallStack.has(pFunction)) {
                lErrors.push(new PotatnoDocumentPortValidationError(`Function "${pFunction.label}" participates in a cross-function recursion cycle.`, pFunction));
                return;
            }

            // Build the function stack for the current path and explore deeper.
            lFunctionCallStack.add(pFunction);
            for (const lCalled of lGetUsedFunctions(pFunction)) {
                lVisit(lCalled);
            }
            lFunctionCallStack.delete(pFunction);

            // Mark this function as fully processed.
            lProcessedFunctions.add(pFunction);
        };

        // Check each function for itself.
        for (const lFunction of this.mFunctions) {
            lVisit(lFunction);
        }

        return lErrors;
    }
}

/**
 * A validation error for a document port.
 */
export class PotatnoDocumentPortValidationError<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mMessage: string;
    private readonly mItem: IPotatnoDocumentItem<TProjectTypes>;

    /**
     * Get the error message describing the validation error.
     */
    public get message(): string {
        return this.mMessage;
    }

    /**
     * Get the item that caused the validation error.
     */
    public get item(): IPotatnoDocumentItem<TProjectTypes> {
        return this.mItem;
    }

    /**
     * Create a new validation error for a document item.
     * 
     * @param pMessage - The error message describing the validation error.
     * @param pItem - The item that caused the validation error.
     */
    public constructor(pMessage: string, pItem: IPotatnoDocumentItem<TProjectTypes>) {
        this.mMessage = pMessage;
        this.mItem = pItem;
    }
}
