import { PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProjectType } from "../potatno-project-types-definition.ts";
import { PotatnoNodeDefinition, PotatnoNodeDefinitionCodeGenerator, PotatnoNodeDefinitionPreviewGenerator } from "./potatno-node-definition.ts";

/**
 * Definition of a node type that can be instantiated in the graph. Registered at the project level and referenced by nodes via the definitionName property.
 * Generics allow for strong typing of input and output port definitions, which are passed to the code generator callback for type-safe code generation.
 * 
 * @template TTypes - String literal union type of valid data type identifiers for ports in this project.
 * @template TInputs - Object type mapping input port names to their definitions.
 * @template TOutputs - Object type mapping output port names to their definitions.
 * @template TPreviewElement - The type of the HTMLElement used for node previews for this node definition.
 */
export class PotatnoStaticNodeDefinition<TTypes extends PotatnoProjectType> extends PotatnoNodeDefinition<TTypes> {
    /**
     * Constructor.
     * 
     * @param pParameters - Constructor parameters. 
     */
    public constructor(pParameters: PotatnoStaticNodeDefinitionConstructorParameter<TTypes>) {
        // Set id and label. Label defaults to id if not provided.
        super({
            id: pParameters.id,
            label: pParameters.label ?? pParameters.id,
            category: pParameters.category,
            generators: {
                ports: {
                    inputs: () => pParameters.ports.inputs ?? [],
                    outputs: () => pParameters.ports.outputs ?? []
                },
                code: pParameters.generators.code,
                preview: pParameters.generators.preview ?? null
            }
        });
    }
}

type PotatnoStaticNodeDefinitionConstructorParameter<TTypes extends PotatnoProjectType> = {
    id: string;
    label: string;
    category: string;
    ports: {
        inputs: Array<PotatnoPortDefinitionConfiguration<TTypes>>;
        outputs: Array<PotatnoPortDefinitionConfiguration<TTypes>>;
    };
    generators: {
        code: PotatnoNodeDefinitionCodeGenerator;
        preview?: PotatnoNodeDefinitionPreviewGenerator | null;
    };
};
