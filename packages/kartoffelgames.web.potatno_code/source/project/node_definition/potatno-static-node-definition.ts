import { PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProject } from "../potatno-project.ts";
import { PotatnoNodeDefinition, PotatnoNodeDefinitionCodeGenerator, PotatnoNodeDefinitionRegions } from "./potatno-node-definition.ts";

/**
 * Definition of a node type that can be instantiated in the graph. Registered at the project level and referenced by nodes via the definitionName property.
 * Generics allow for strong typing of input and output port definitions, which are passed to the code generator callback for type-safe code generation.
 * 
 * @template TTypes - String literal union type of valid data type identifiers for ports in this project.
 * @template TInputs - Object type mapping input port names to their definitions.
 * @template TOutputs - Object type mapping output port names to their definitions.
 * @template TPreviewElement - The type of the HTMLElement used for node previews for this node definition.
 */
export class PotatnoStaticNodeDefinition<TProject extends PotatnoProject> extends PotatnoNodeDefinition<TProject> {
    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    public constructor(pParameters: PotatnoStaticNodeDefinitionConstructorParameter<TProject>) {
        // Set id and label. Label defaults to id if not provided.
        super({
            id: pParameters.id,
            label: pParameters.label,
            category: pParameters.category,
            regions: pParameters.regions ?? null,
            generators: {
                ports: {
                    inputs: (pAddPort) => {
                        for (const lPort of pParameters.ports.inputs) {
                            pAddPort(lPort);
                        }
                    },
                    outputs: (pAddPort) => {
                        for (const lPort of pParameters.ports.outputs) {
                            pAddPort(lPort);
                        }
                    }
                },
                code: pParameters.generators.code,
            }
        });
    }
}

type PotatnoStaticNodeDefinitionConstructorParameter<TProject extends PotatnoProject> = {
    id: string;
    label: string;
    category: string;
    regions?: Partial<PotatnoNodeDefinitionRegions> | null;
    ports: {
        inputs: Array<PotatnoPortDefinitionConfiguration<TProject>>;
        outputs: Array<PotatnoPortDefinitionConfiguration<TProject>>;
    };
    generators: {
        code: PotatnoNodeDefinitionCodeGenerator;
    };
};
