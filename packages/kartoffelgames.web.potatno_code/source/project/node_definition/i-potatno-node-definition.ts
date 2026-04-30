import { PotatnoCodeFunction } from "../../parser/potatno-code-function.ts";
import type { PotatnoPortDefinition } from '../potatno-port-definition.ts';
import { PotatnoProjectType } from "../potatno-project-types-definition.ts";

/**
 * Common interface for all node definitions that can be placed in a graph.
 * Implemented by both project-registered PotatnoNodeDefinition instances and
 * live PotatnoFunctionNodeDefinition instances derived from user functions.
 */
export interface IPotatnoNodeDefinition<TTypes extends PotatnoProjectType> {
    /**
     * Unique identifier for this node definition.
     */
    readonly id: string;

    /**
     * Category classification used to determine code-generation behaviour.
     */
    readonly category: string;

    /**
     * Display label for this node definition.
     */
    readonly label: string;

    /**
     * Input port definitions.
     */
    readonly inputs: ReadonlyArray<PotatnoPortDefinition<TTypes>>;

    /**
     * Output port definitions.
     */
    readonly outputs: ReadonlyArray<PotatnoPortDefinition<TTypes>>;

    /**
     * Code generator callback that produces the code expression for a node instance.
     */
    readonly codeGenerator: PotatnoNodeDefinitionCodeGenerator;

    /**
     * Optional preview configuration. Null when no preview is available for this node type.
     */
    readonly preview: PotatnoNodeDefinitionPreview | null;
}

/**
 * Code generator callback type for node definitions, receiving a typed context with inputs, outputs, properties, and body code blocks.
 */
export type PotatnoNodeDefinitionCodeGenerator = (pContext: PotatnoNodeDefinitionGeneratorData) => string;

/**
 * Preview generation.
 */
export type PotatnoNodeDefinitionPreview = {
    /**
     * Generator function that produces an HTMLElement to be used as a live preview for a node instance.
     * 
     * @returns an element that the node gets append as preview.
     */
    readonly generatePreview: () => Element;

    /**
     * Update function that updates the preview element based on the current input values and output values of the node instance.
     * This can be used to create live, data-driven previews that react to changes in the node's inputs and outputs.
     * 
     * @param pElement - The preview element to be updated.
     * @param pPreviewInputData - The example preview input data for the entry point, which can be used to run the intermediate code and update the preview element accordingly.
     * @param pIntermediateCodeOutput - The output of the intermediate code execution, which can be used to update the preview element accordingly.
     */
    readonly updatePreview: (pElement: Element, pContext: PotatnoNodeDefinitionGeneratorData, pFunction: PotatnoCodeFunction, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};

/**
 * Typed context passed to the node code generator callback.
 * All maps are plain JS objects for type safety and easy destructuring.
 */
export type PotatnoNodeDefinitionGeneratorData = {
    /**
     *  Input port valueIds keyed by port name. 
     */
    readonly inputs: Record<string, PotatnoCodeGeneratorPort>;

    /** 
     * Output port valueIds keyed by port name. 
     */
    readonly outputs: Record<string, PotatnoCodeGeneratorPort>;
};

/**
 * Definition of a port type used when registering node definitions.
 */

export type PotatnoNodeDefinitionPortDefinition<TTypes extends PotatnoProjectType> = PotatnoNodeDefinitionFlowPort | PotatnoNodeDefinitionValuePort<TTypes>;

export type PotatnoNodeDefinitionFlowPort = {
    /** 
     * Fixed type discriminator for flow ports.
     */
    portType: 'flow';
};

export type PotatnoNodeDefinitionValuePort<TTypes extends PotatnoProjectType> = {
    /**
     * Fixed type discriminator for value ports.
     */
    portType: 'value';

    /** 
     * Data type identifier for the port.
     */
    dataType: TTypes;
};

export type PotatnoNodeDefinitionPorts<TTypes extends PotatnoProjectType = PotatnoProjectType, TKey extends string = string> = Record<TKey, PotatnoNodeDefinitionPortDefinition<TTypes>>;

/**
 * Code generator node outputs.
 */
export type PotatnoCodeGeneratorPort = {
    valueId: string;
    code: {
        inner: string;
        next: string;
    }
}