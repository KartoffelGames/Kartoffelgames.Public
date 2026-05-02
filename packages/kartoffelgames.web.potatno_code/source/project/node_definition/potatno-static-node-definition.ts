import { PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProjectType } from "../potatno-project-types-definition.ts";
import { PotatnoProject } from "../potatno-project.ts";
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
export class PotatnoStaticNodeDefinition<TProject extends PotatnoProject<any>> extends PotatnoNodeDefinition<TProject> {
    /**
     * Create a new PotatnoStaticNodeDefinition.
     *
     * @param pParameters - Static node definition configuration including id, label, category, ports, and generators.
     */
    public static new<TProject extends PotatnoProject<any>>(pParameters: PotatnoStaticNodeDefinitionConstructorParameter<TProject>): PotatnoStaticNodeDefinition<TProject> {
        return new PotatnoStaticNodeDefinition(pParameters);
    }

    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    protected constructor(pParameters: PotatnoStaticNodeDefinitionConstructorParameter<TProject>) {
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

type PotatnoStaticNodeDefinitionConstructorParameter<TProject extends PotatnoProject<any>> = {
    id: string;
    label: string;
    category: string;
    ports: {
        inputs: Array<PotatnoPortDefinitionConfiguration<TProject>>;
        outputs: Array<PotatnoPortDefinitionConfiguration<TProject>>;
    };
    generators: {
        code: PotatnoNodeDefinitionCodeGenerator;
        preview?: PotatnoNodeDefinitionPreviewGenerator | null;
    };
};
