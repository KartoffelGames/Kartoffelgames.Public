import { PotatnoProjectType } from "../potatno-project-types-definition.ts";
import { IPotatnoNodeDefinition } from "./i-potatno-node-definition.ts";
import { PotatnoNodeDefinitionPorts } from "./i-potatno-node-definition.ts";

export class PotatnoDynamicNodeDefinition<TTypes extends PotatnoProjectType = PotatnoProjectType> implements IPotatnoNodeDefinition<TTypes, TInputs, TOutputs, TPreviewElement> {
    /**
     * Factory method to create a new node definition and register it at the project level.
     * 
     * @param pParameters - Constructor parameters for the node definition, including id, label, category, input and output port definitions, and code generator callback.
     * 
     * @returns The created PotatnoDynamicNodeDefinition instance. 
     */
    public static create<TTypes extends PotatnoProjectType, TInputKeys extends string, TInputs extends PotatnoNodeDefinitionPorts<TTypes, TInputKeys>, TOutputKeys extends string, TOutputs extends PotatnoNodeDefinitionPorts<TTypes, TOutputKeys>, TPreviewElement extends Element>(pParameters: PotatnoDynamicNodeDefinitionConstructorParameter<TTypes, TInputs, TOutputs, TPreviewElement>): PotatnoDynamicNodeDefinition<TTypes, TInputs, TOutputs, TPreviewElement> {
        return new PotatnoDynamicNodeDefinition(pParameters);
    }

}

type PotatnoDynamicNodeDefinitionConstructorParameter<TTypes extends PotatnoProjectType, TInputs extends PotatnoNodeDefinitionPorts<TTypes>, TOutputs extends PotatnoNodeDefinitionPorts<TTypes>, TPreviewElement extends Element> = {
    label?: string;
    id: string;
    category: string;
    inputs: TInputs;
    outputs: TOutputs;
    codeGenerator: PotatnoNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs>;
    preview?: PotatnoNodeDefinitionPreview<TTypes, TInputs, TOutputs, TPreviewElement>;
};

type PotatnoDynamicNodeDefinitionPorts<TTypes extends PotatnoProjectType, TInput extends PotatnoNodeDefinitionPorts<TTypes>, TOutput extends PotatnoNodeDefinitionPorts<TTypes>> = {}

type PotatnoDynamicNodeDefinitionPortGenerator<TTypes extends PotatnoProjectType, TInput extends PotatnoNodeDefinitionPorts<TTypes>, TOutput extends PotatnoNodeDefinitionPorts<TTypes>> = (pContext: PotatnoNodeDefinitionGeneratorData<TTypes, TInput, TOutput>) => Array<PotatnoPortDefinition<TTypes>>;