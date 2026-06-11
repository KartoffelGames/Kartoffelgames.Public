import { PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProjectTypesDefinition } from "../potatno-project-types-definition.ts";
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
export class PotatnoStaticNodeDefinition<TProjectTypes extends PotatnoProjectTypesDefinition> extends PotatnoNodeDefinition<TProjectTypes> {
    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    public constructor(pParameters: PotatnoStaticNodeDefinitionConstructorParameter<TProjectTypes>) {
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

type PotatnoStaticNodeDefinitionConstructorParameter<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    id: string;
    label: string;
    category: string;
    regions?: Partial<PotatnoNodeDefinitionRegions> | null;
    ports: {
        inputs: Array<PotatnoPortDefinitionConfiguration<TProjectTypes>>;
        outputs: Array<PotatnoPortDefinitionConfiguration<TProjectTypes>>;
    };
    generators: {
        code: PotatnoNodeDefinitionCodeGenerator;
    };
};
