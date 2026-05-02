import { PotatnoProject } from "../potatno-project.ts";
import { PotatnoNodeDefinition, PotatnoNodeDefinitionCodeGenerator, PotatnoNodeDefinitionPortGenerator, PotatnoNodeDefinitionPreviewGenerator } from "./potatno-node-definition.ts";

/**
 * Potatno node definition that changes dynamically based on the provided context.
 */
export class PotatnoDynamicNodeDefinition<TProject extends PotatnoProject<any>> extends PotatnoNodeDefinition<TProject> {
    /**
     * Create a new PotatnoNodeDefinition.
     *
     * @param pParameters - Node definition configuration including id, label, category, and generators.
     */
    public static new<TProject extends PotatnoProject<any>>(pParameters: PotatnoDynamicNodeDefinitionConstructorParameter<TProject>): PotatnoDynamicNodeDefinition<TProject> {
        return new PotatnoDynamicNodeDefinition(pParameters);
    }

    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    protected constructor(pParameters: PotatnoDynamicNodeDefinitionConstructorParameter<TProject>) {
        super({
            id: pParameters.id,
            label: pParameters.label,
            category: pParameters.category,
            generators: {
                ports: {
                    inputs: pParameters.generators.ports.inputs,
                    outputs: pParameters.generators.ports.outputs
                },
                code: pParameters.generators.code,
                preview: pParameters.generators.preview ?? null
            }
        });
    }
}

type PotatnoDynamicNodeDefinitionConstructorParameter<TProject extends PotatnoProject<any>> = {
    id: string;
    label: string;
    category: string;
    generators: {
        ports: PotatnoNodeDefinitionPortGenerator<TProject>;
        code: PotatnoNodeDefinitionCodeGenerator;
        preview?: PotatnoNodeDefinitionPreviewGenerator | null;
    };
};
