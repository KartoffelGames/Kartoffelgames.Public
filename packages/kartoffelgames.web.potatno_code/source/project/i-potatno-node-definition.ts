import { PotatnoCodeFunction } from "../parser/potatno-code-function.ts";
import { PotatnoNodeDefinitionGeneratorData, PotatnoNodeDefinitionPorts } from "./potatno-node-definition.ts";
import type { PotatnoPortDefinition } from './potatno-port-definition.ts';
import { PotatnoProjectType } from "./potatno-project.ts";

/**
 * Common interface for all node definitions that can be placed in a graph.
 * Implemented by both project-registered PotatnoNodeDefinition instances and
 * live PotatnoFunctionNodeDefinition instances derived from user functions.
 */
export interface IPotatnoNodeDefinition<TTypes extends PotatnoProjectType, TInputs extends PotatnoNodeDefinitionPorts<TTypes>, TOutputs extends PotatnoNodeDefinitionPorts<TTypes>, TPreviewElement extends Element> {
    /**
     * Unique identifier for this node definition.
     */
    readonly id: string;

    /**
     * Category classification used to determine code-generation behaviour.
     */
    readonly category: string;

    /**
     * Human-readable display label.
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
    readonly codeGenerator: PotatnoNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs>;

    /**
     * Optional preview configuration. Null when no preview is available for this node type.
     */
    readonly preview: PotatnoNodeDefinitionPreview<TTypes, TInputs, TOutputs, TPreviewElement> | null;
}

/**
 * Code generator callback type for node definitions, receiving a typed context with inputs, outputs, properties, and body code blocks.
 */
export type PotatnoNodeDefinitionCodeGenerator<TTypes extends PotatnoProjectType, TInput extends PotatnoNodeDefinitionPorts<TTypes>, TOutput extends PotatnoNodeDefinitionPorts<TTypes>> = (pContext: PotatnoNodeDefinitionGeneratorData<TTypes, TInput, TOutput>) => string;

/**
 * Preview generation.
 */
export type PotatnoNodeDefinitionPreview<TTypes extends PotatnoProjectType, TInput extends PotatnoNodeDefinitionPorts<TTypes>, TOutput extends PotatnoNodeDefinitionPorts<TTypes>, TElement extends Element> = {
    /**
     * Generator function that produces an HTMLElement to be used as a live preview for a node instance.
     * 
     * @returns an element that the node gets append as preview.
     */
    readonly generatePreview: () => TElement;

    /**
     * Update function that updates the preview element based on the current input values and output values of the node instance.
     * This can be used to create live, data-driven previews that react to changes in the node's inputs and outputs.
     * 
     * @param pElement - The preview element to be updated.
     * @param pPreviewInputData - The example preview input data for the entry point, which can be used to run the intermediate code and update the preview element accordingly.
     * @param pIntermediateCodeOutput - The output of the intermediate code execution, which can be used to update the preview element accordingly.
     */
    readonly updatePreview: (pElement: TElement, pContext: PotatnoNodeDefinitionGeneratorData<TTypes, TInput, TOutput>, pFunction: PotatnoCodeFunction, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};