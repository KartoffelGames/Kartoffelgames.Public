import { PotatnoDocumentFunction } from "../../document/potatno-document-function.ts";
import { PotatnoFunctionDefinition } from "../potatno-function-definition.ts";
import { PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProjectType } from "../potatno-project-types-definition.ts";
import { PotatnoProject } from "../potatno-project.ts";
import { PotatnoNodeDefinition, PotatnoNodeDefinitionPortGeneratorFunction } from "./potatno-node-definition.ts";

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
export class PotatnoFunctionNodeDefinition<TProject extends PotatnoProject> extends PotatnoNodeDefinition<TProject> {
    /**
     * Create a new PotatnoFunctionNodeDefinition mirroring the given document function.
     *
     * @param pFunction - The document function this definition reflects.
     */
    public static newFunctionNode<TProject extends PotatnoProject>(pFunction: PotatnoDocumentFunction<TProject>): PotatnoFunctionNodeDefinition<TProject> {
        return new PotatnoFunctionNodeDefinition(pFunction);
    }

    private readonly mFunction: PotatnoDocumentFunction<TProject>;

    /**
     * Get the document function this definition mirrors.
     */
    public get function(): PotatnoDocumentFunction<TProject> {
        return this.mFunction;
    }

    /**
     * Constructor.
     *
     * @param pFunction - The document function this definition mirrors.
     */
    protected constructor(pFunction: PotatnoDocumentFunction<TProject>) {
        const lInputPortGenerator: PotatnoNodeDefinitionPortGeneratorFunction<TProject> = (pAddPort): void => {
            // Add an additional flow port for function call chaining.
            pAddPort({ label: 'Input', id: 'Input', portType: 'flow' });

            // Generate ports definitions based on the function inputs.
            for (const lPort of pFunction.inputs) {
                pAddPort({
                    label: lPort.label,
                    id: lPort.label,
                    portType: 'value',
                    dataType: lPort.dataType as PotatnoProjectType<TProject>
                });
            }
        };

        const lOutputPortGenerator: PotatnoNodeDefinitionPortGeneratorFunction<TProject> = (pAddPort): void => {
            // Add an additional flow port for function call chaining.
            pAddPort({ label: 'Output', id: 'Output', portType: 'flow' });

            // Generate ports definitions based on the function outputs.
            for (const lPort of pFunction.outputs) {
                pAddPort({
                    label: lPort.label,
                    id: lPort.label,
                    portType: 'value',
                    dataType: lPort.dataType as PotatnoProjectType<TProject>
                });
            }
        };

        // Get the function definition from the document function.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProject> | undefined = pFunction.project.getFunction(pFunction.definitionId);

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
                code: lFunctionDefinition?.codeGenerator.value ?? (() => ''),
                preview: null
            }
        });

        // Save reference to the source function for later use in code generation and editor features.
        this.mFunction = pFunction;
    }
}
