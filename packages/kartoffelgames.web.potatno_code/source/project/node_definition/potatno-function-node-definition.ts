import { PotatnoDocumentFunction } from "../../document/potatno-document-function.ts";
import { PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProjectType } from "../potatno-project-types-definition.ts";
import { PotatnoProject } from "../potatno-project.ts";
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
export class PotatnoFunctionNodeDefinition<TProject extends PotatnoProject<any>> extends PotatnoNodeDefinition<TProject> {
    /**
     * Create a new PotatnoFunctionNodeDefinition mirroring the given document function.
     *
     * @param pFunction - The document function this definition reflects.
     */
    public static new<TProject extends PotatnoProject<any>>(pFunction: PotatnoDocumentFunction<TProject>): PotatnoFunctionNodeDefinition<TProject> {
        return new PotatnoFunctionNodeDefinition(pFunction);
    }

    /**
     * Constructor.
     *
     * @param pFunction - The document function this definition mirrors.
     */
    protected constructor(pFunction: PotatnoDocumentFunction<TProject>) {
        const lInputPortGenerator = (): Array<PotatnoPortDefinitionConfiguration<TProject>> => {
            // Generate ports definitions based on the function inputs.
            const lPorts: Array<PotatnoPortDefinitionConfiguration<TProject>> = pFunction.inputs.map((pPort) => {
                return {
                    name: pPort.name,
                    portType: 'value',
                    dataType: pPort.dataType as PotatnoProjectType<TProject>
                };
            });

            // Add an additional flow port for function call chaining.
            lPorts.unshift({
                name: 'Input',
                portType: 'flow'
            });

            return lPorts;
        };

        const lOutputPortGenerator = (): Array<PotatnoPortDefinitionConfiguration<TProject>> => {
            // Generate ports definitions based on the function outputs.
            const lPorts: Array<PotatnoPortDefinitionConfiguration<TProject>> = pFunction.outputs.map((pPort) => {
                return {
                    name: pPort.name,
                    portType: 'value',
                    dataType: pPort.dataType as PotatnoProjectType<TProject>
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
                code: pFunction.definition.codeGenerator.value,
                preview: null
            }
        });
    }
}
