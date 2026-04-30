import { PotatnoDocumentFunction } from "../../document/potatno-document-function.ts";
import { PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProjectType } from "../potatno-project-types-definition.ts";
import { PotatnoNodeDefinition } from "./potatno-node-definition.ts";

/**
 * A live node definition derived from a PotatnoDocumentFunction.
 *
 * Implements PotatnoNodeDefinition so it can be used wherever a node definition
 * is expected — including as the definition of a PotatnoDocumentNode placed in
 * another function's graph. All properties are computed fresh from the source
 * function on every access, so the definition is always in sync with the
 * function's current signature.
 *
 * The stable id comes from PotatnoDocumentFunction.id, ensuring that nodes
 * referencing this definition keep their identity across sessions.
 */
export class PotatnoFunctionNodeDefinition<TTypes extends PotatnoProjectType> extends PotatnoNodeDefinition<TTypes> {
    /**
     * Constructor.
     *
     * @param pFunction - The document function this definition mirrors.
     */
    public constructor(pFunction: PotatnoDocumentFunction<TTypes>) {
        const lInputPortGenerator = (): Array<PotatnoPortDefinitionConfiguration<TTypes>> => {
            // Generate ports definitions based on the function inputs.
            const lPorts: Array<PotatnoPortDefinitionConfiguration<TTypes>> = pFunction.inputs.map((pPort) => {
                return {
                    name: pPort.name,
                    portType: 'value',
                    dataType: pPort.dataType as TTypes
                };
            });

            // Add an additional flow port for function call chaining.
            lPorts.unshift({
                name: 'Input',
                portType: 'flow'
            });

            return lPorts;
        };

        const lOutputPortGenerator = (): Array<PotatnoPortDefinitionConfiguration<TTypes>> => {
            // Generate ports definitions based on the function outputs.
            const lPorts: Array<PotatnoPortDefinitionConfiguration<TTypes>> = pFunction.outputs.map((pPort) => {
                return {
                    name: pPort.name,
                    portType: 'value',
                    dataType: pPort.dataType as TTypes
                };
            });

            // Add an additional flow port for function call chaining.
            lPorts.unshift({
                name: 'Output',
                portType: 'flow'
            });

            return lPorts;
        };

        // Set id and label. Label defaults to id if not provided.
        super({
            id: `USERFUNCTION_${pFunction.id}`,
            label: pFunction.label,
            category: 'user function',
            generators: {
                ports: {
                    inputs: lInputPortGenerator,
                    outputs: lOutputPortGenerator
                },
                code: pFunction.definition.codeGenerator.valueGenerator,
                preview: null
            }
        });
    }
}
