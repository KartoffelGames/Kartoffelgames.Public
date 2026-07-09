import { Exception } from '@kartoffelgames/core';
import { PotatnoFunctionNodeDefinition } from '../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoNodeDefinition } from '../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoDocumentFunction, type PotatnoDocumentFunctionConstructorParameter } from './potatno-document-function.ts';
import { PotatnoDocumentPortValidationError, PotatnoDocumentValidationResult } from './potatno-document-validation-result.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs.
 */
export class PotatnoDocument<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mFunctionNodeDefinitions: Map<string, PotatnoFunctionNodeDefinition<TProjectTypes>>;
    private readonly mFunctions: Array<PotatnoDocumentFunction<TProjectTypes>>;
    private readonly mProject: PotatnoProject<TProjectTypes>;

    /**
     * Get the read-only set of all functions in this file.
     */
    public get functions(): ReadonlyArray<PotatnoDocumentFunction<TProjectTypes>> {
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
        this.mFunctions = new Array<PotatnoDocumentFunction<TProjectTypes>>();
        this.mFunctionNodeDefinitions = new Map<string, PotatnoFunctionNodeDefinition<TProjectTypes>>();
    }

    /**
     * Add an existing function to the file.
     * A corresponding PotatnoFunctionNodeDefinition is created and registered
     * so the function can be placed as a node in other graphs.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoDocumentFunction<TProjectTypes>): PotatnoDocumentFunction<TProjectTypes> {
        // Try to find the function by reference.
        const lFunctionIndex: number = this.mFunctions.indexOf(pFunction);
        if (lFunctionIndex !== -1) {
            // Remove function so it can be added again at the end.
            this.mFunctions.splice(lFunctionIndex, 1);
        }

        // Add function again.
        this.mFunctions.push(pFunction);

        // Create and register a corresponding node definition for this function.
        const lNodeDefinition: PotatnoFunctionNodeDefinition<TProjectTypes> = new PotatnoFunctionNodeDefinition(pFunction);
        this.mFunctionNodeDefinitions.set(lNodeDefinition.id, lNodeDefinition);

        return pFunction;
    }

    /**
     * Add a new function to the file.
     * A corresponding PotatnoFunctionNodeDefinition is created and registered
     * so the function can be placed as a node in other graphs.
     *
     * @param pConstructionParameter - The parameters to construct the function.
     */
    public newFunction(pConstructionParameter: PotatnoDocumentFunctionConstructorParameter): PotatnoDocumentFunction<TProjectTypes> {
        // Create the function instance and add new function.
        return this.addFunction(new PotatnoDocumentFunction(this.mProject, this, pConstructionParameter));
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
        // Restrict system function deletion.
        if (pFunction.isSystem) {
            throw new Exception(`Cannot remove a system function.`, this);
        }

        // Try to find the function by reference.
        const lFunctionIndex: number = this.mFunctions.indexOf(pFunction);

        // Not found. do nothing just return failure.
        if (lFunctionIndex === -1) {
            return false;
        }

        // Remove it inline.
        this.mFunctions.splice(lFunctionIndex, 1);

        // Find the corresponding node definition and delete them.
        for (const pNodeDefinition of this.mFunctionNodeDefinitions.values()) {
            // Check function by reference.
            if (pNodeDefinition.function !== pFunction) {
                continue;
            }

            // When the function has a node definition, remove it.
            this.mFunctionNodeDefinitions.delete(pNodeDefinition.id);
        }

        return true;
    }

    /**
     * Validate all functions in this document and return any errors found.
     * Also rejects cross-function recursion (A → B → A) so the code generator can assume an acyclic function-call graph.
     */
    public validate(): PotatnoDocumentValidationResult<TProjectTypes> {
        // Create new validation item.
        const lValidationItem: PotatnoDocumentValidationResult<TProjectTypes> = new PotatnoDocumentValidationResult<TProjectTypes>();

        const lEntryPointDefinitionId: string = this.mProject.entryPoint.id;

        // Check for the entry point function and initialize of not added yet.
        if (!this.mFunctions.values().some((pFunction) => pFunction.definitionId === lEntryPointDefinitionId)) {
            const lNewFunction: PotatnoDocumentFunction<TProjectTypes> = this.newFunction({
                definitionId: lEntryPointDefinitionId,
                id: crypto.randomUUID(),
                isSystem: true,
                label: this.mProject.entryPoint.label
            });

            // Add the new function as affected item.
            lValidationItem.addAffectedItem(lNewFunction);
        }

        // TODO: Validation is in wrong order. Validate in correct dependency order.

        // Per-function validation: flow/value cycles, region constraints, port resync.
        for (const lFunction of this.mFunctions) {
            lValidationItem.merge(lFunction.validate());
        }

        // Cross-function recursion detection over the function-call graph.
        lValidationItem.pushError(...this.detectCrossFunctionRecursion());

        return lValidationItem;
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
