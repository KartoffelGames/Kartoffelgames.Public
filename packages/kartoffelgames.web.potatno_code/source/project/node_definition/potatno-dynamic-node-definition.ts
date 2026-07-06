import type { PotatnoProjectTypesDefinition } from '../potatno-project-types-definition.ts';
import { PotatnoNodeDefinition, type PotatnoNodeDefinitionCodeGenerator, type PotatnoNodeDefinitionPortGenerator, type PotatnoNodeDefinitionRegions } from './potatno-node-definition.ts';

/**
 * Potatno node definition that changes dynamically based on the provided context.
 */
export class PotatnoDynamicNodeDefinition<TProjectTypes extends PotatnoProjectTypesDefinition> extends PotatnoNodeDefinition<TProjectTypes> {
    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    public constructor(pParameters: PotatnoDynamicNodeDefinitionConstructorParameter<TProjectTypes>) {
        super({
            id: pParameters.id,
            label: pParameters.label,
            category: pParameters.category,
            regions: pParameters.regions ?? null,
            generators: {
                ports: {
                    inputs: pParameters.generators.ports.inputs,
                    outputs: pParameters.generators.ports.outputs
                },
                code: pParameters.generators.code
            }
        });
    }
}

type PotatnoDynamicNodeDefinitionConstructorParameter<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    id: string;
    label: string;
    category: {
        name: string;
        icon?: string;
    };
    regions?: Partial<PotatnoNodeDefinitionRegions> | null;
    generators: {
        ports: PotatnoNodeDefinitionPortGenerator<TProjectTypes>;
        code: PotatnoNodeDefinitionCodeGenerator;
    };
};
