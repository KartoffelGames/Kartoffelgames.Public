import { PotatnoProjectType } from "../potatno-project-types-definition.ts";
import { IPotatnoNodeDefinition, PotatnoNodeDefinitionCodeGenerator, PotatnoNodeDefinitionPorts, PotatnoNodeDefinitionPreview } from "./i-potatno-node-definition.ts";

export class PotatnoDynamicNodeDefinition<TTypes extends PotatnoProjectType> implements IPotatnoNodeDefinition<TTypes> {
    /**
     * Factory method to create a new node definition and register it at the project level.
     * 
     * @param pParameters - Constructor parameters for the node definition, including id, label, category, input and output port definitions, and code generator callback.
     * 
     * @returns The created PotatnoDynamicNodeDefinition instance. 
     */
    public static create<TTypes extends PotatnoProjectType>(pParameters: PotatnoDynamicNodeDefinitionConstructorParameter<TTypes>): PotatnoDynamicNodeDefinition<TTypes> {
        return new PotatnoDynamicNodeDefinition(pParameters);
    }

}

type PotatnoDynamicNodeDefinitionConstructorParameter<TTypes extends PotatnoProjectType> = {
    label?: string;
    id: string;
    category: string;
    inputs: PotatnoNodeDefinitionPorts<TTypes>;
    outputs: PotatnoNodeDefinitionPorts<TTypes>;
    codeGenerator: PotatnoNodeDefinitionCodeGenerator;
    preview?: PotatnoNodeDefinitionPreview | null;
};