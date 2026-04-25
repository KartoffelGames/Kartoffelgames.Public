import { Exception } from "@kartoffelgames/core";
import { IPotatnoNodeDefinition, PotatnoNodeDefinitionCodeGenerator } from "../project/i-potatno-node-definition.ts";
import { PotatnoPortDefinition } from "../project/potatno-port-definition.ts";
import { PotatnoProjectType } from "../project/potatno-project.ts";
import type { PotatnoDocumentFunction } from './potatno-document-function.ts';

/**
 * Represents the mutable document state of a PotatnoCode file.
 * Contains all functions and their graphs.
 */
export class PotatnoDocument {
    private readonly mFunctions: Set<PotatnoDocumentFunction>;
    private readonly mFunctionNodeDefinitions: Map<string, PotatnoFunctionNodeDefinition>;

    /**
     * Get the read-only set of all functions in this file.
     */
    public get functions(): ReadonlySet<PotatnoDocumentFunction> {
        return this.mFunctions;
    }

    /**
     * Get the map of live node definitions generated from this document's functions.
     * Keyed by function id. Used by the code generator and editor to resolve
     * user-function call nodes at the document level.
     */
    public get functionNodeDefinitions(): ReadonlyMap<string, PotatnoFunctionNodeDefinition> {
        return this.mFunctionNodeDefinitions;
    }

    /**
     * Create an empty code file with no functions.
     */
    public constructor() {
        this.mFunctions = new Set<PotatnoDocumentFunction>();
        this.mFunctionNodeDefinitions = new Map<string, PotatnoFunctionNodeDefinition>();
    }

    /**
     * Add a new function to the file.
     * A corresponding PotatnoFunctionNodeDefinition is created and registered
     * so the function can be placed as a node in other graphs.
     *
     * @param pFunction - The function to add.
     */
    public addFunction(pFunction: PotatnoDocumentFunction): void {
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
    public removeFunction(pFunction: PotatnoDocumentFunction): boolean {
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
}

/**
 * A live node definition derived from a PotatnoDocumentFunction.
 *
 * Implements PotatnoNodeDefinition so it can be used wherever a node definition
 * is expected — including as the definition of a PotatnoDocumentNode placed in
 * another function's graph. All properties are computed fresh from the source
 * function on every access, so the definition is always in sync with the
 * function's current signature.
 *
 * The stable id comes from PotatnoDocumentFunction.id, ensuring that nodes
 * referencing this definition keep their identity across sessions.
 */
class PotatnoFunctionNodeDefinition<TTypes extends PotatnoProjectType = PotatnoProjectType> implements IPotatnoNodeDefinition<TTypes, any, any, any> {
    private readonly mFunction: PotatnoDocumentFunction;

    /**
     * Stable identifier derived from the source function's id.
     */
    public get id(): string {
        return this.mFunction.id;
    }

    /**
     * Fixed category for all user-function call nodes.
     */
    public get category(): string {
        return 'function'; // TODO: Dont know if that should be hardcoded or not?
    }

    /**
     * Display label mirrors the source function's label.
     */
    public get label(): string {
        return this.mFunction.label;
    }

    /**
     * Input port definitions generated from the source function's inputs.
     * Recomputed on every access so signature changes are always reflected.
     */
    public get inputs(): ReadonlyArray<PotatnoPortDefinition<TTypes>> {
        // Generate ports definitions based on the function inputs.
        const lPorts: Array<PotatnoPortDefinition<TTypes>> = this.mFunction.inputs.map((pPort) => {
            return new PotatnoPortDefinition<TTypes>(pPort.name, 'value', pPort.dataType as TTypes);
        });

        // Add an additional flow port for function call chaining.
        lPorts.push(new PotatnoPortDefinition<TTypes>('Input', 'flow'));

        return lPorts;
    }

    /**
     * Output port definitions generated from the source function's outputs.
     * Recomputed on every access so signature changes are always reflected.
     */
    public get outputs(): ReadonlyArray<PotatnoPortDefinition<TTypes>> {
        // Generate ports definitions based on the function outputs.
        const lPorts: Array<PotatnoPortDefinition<TTypes>> = this.mFunction.outputs.map((pPort) => {
            return new PotatnoPortDefinition<TTypes>(pPort.name, 'value', pPort.dataType as TTypes);
        });

        // Add an additional flow port for function call chaining.
        lPorts.push(new PotatnoPortDefinition<TTypes>('Output', 'flow'));

        return lPorts;
    }

    /**
     * Code generator for call-site code.
     * Delegates to the valueGenerator defined on the function's definition.
     */
    public get codeGenerator(): PotatnoNodeDefinitionCodeGenerator<TTypes, any, any> {
        return this.mFunction.definition.codeGenerator.valueGenerator;
    }

    /**
     * Function call nodes do not have node-level previews.
     */
    public get preview(): null {
        return null;
    }

    /**
     * Constructor.
     *
     * @param pFunction - The document function this definition mirrors.
     */
    public constructor(pFunction: PotatnoDocumentFunction) {
        this.mFunction = pFunction;
    }
}
