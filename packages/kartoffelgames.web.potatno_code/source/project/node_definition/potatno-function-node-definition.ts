import { PotatnoDocumentFunction } from "../../document/potatno-document-function.ts";
import { PotatnoPortDefinition } from "../potatno-port-definition.ts";
import { PotatnoProjectType } from "../potatno-project-types-definition.ts";
import { IPotatnoNodeDefinition, PotatnoNodeDefinitionCodeGenerator } from "./i-potatno-node-definition.ts";
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
export class PotatnoFunctionNodeDefinition<TTypes extends PotatnoProjectType = PotatnoProjectType> implements IPotatnoNodeDefinition<TTypes, any, any> {
    private readonly mFunction: PotatnoDocumentFunction;

    /**
     * Stable identifier derived from the source function's id.
     */
    public get id(): string {
        return `USERFUNCTION_${this.mFunction.id}`;
    }

    /**
     * Fixed category for all user-function call nodes.
     */
    public get category(): string {
        return 'user function';
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
        lPorts.unshift(new PotatnoPortDefinition<TTypes>('Input', 'flow'));

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
        lPorts.unshift(new PotatnoPortDefinition<TTypes>('Output', 'flow'));

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
