import type { PotatnoDocumentFunction, PotatnoDocumentFunctionPort } from '../../document/potatno-document-function.ts';
import type { PotatnoFunctionDefinition } from '../potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../potatno-project-types-definition.ts';
import { PotatnoNodeDefinition, type PotatnoNodeDefinitionPortGeneratorFunction } from './potatno-node-definition.ts';

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
export class PotatnoFunctionNodeDefinition<TProjectTypes extends PotatnoProjectTypesDefinition> extends PotatnoNodeDefinition<TProjectTypes> {
    private readonly mFunction: PotatnoDocumentFunction<TProjectTypes>;

    /**
     * Get the document function this definition mirrors.
     */
    public get function(): PotatnoDocumentFunction<TProjectTypes> {
        return this.mFunction;
    }

    /**
     * Live display label, read fresh from the source function so renaming the function updates
     * every surface that shows this definition (the node selector, placed call nodes). The base
     * class captured the label at construction time, which froze it at the function's initial name.
     */
    public override get label(): string {
        return this.mFunction.label;
    }

    /**
     * Constructor.
     *
     * @param pFunction - The document function this definition mirrors.
     */
    public constructor(pFunction: PotatnoDocumentFunction<TProjectTypes>) {
        const lPortGenerator = (pDirectionName: string, pFunctionPorts: ReadonlyArray<PotatnoDocumentFunctionPort<TProjectTypes>>, pOutputPorts: ReadonlyArray<unknown>): PotatnoNodeDefinitionPortGeneratorFunction<TProjectTypes> => {
            return (pAddPort): void => {
                // Add an additional flow port for function call chaining when the function has no outputs.
                if (pOutputPorts.length === 0) {
                    pAddPort({ label: pDirectionName, id: pDirectionName, portType: 'flow' });
                }

                // Generate ports definitions based on the function inputs.
                for (const lPort of pFunctionPorts) {
                    pAddPort({
                        label: lPort.label,
                        id: lPort.label,
                        portType: 'value',
                        dataType: lPort.dataType
                    });
                }
            };
        };

        // Get the function definition from the document function.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProjectTypes> | undefined = pFunction.project.getFunction(pFunction.definitionId);

        // Set id and label. Label defaults to id if not provided.
        super({
            id: `USERFUNCTION_${pFunction.id}`,
            label: pFunction.label,
            category: {
                name: 'user function',
                icon: 'ƒ'
            },
            generators: {
                ports: {
                    inputs: lPortGenerator('Input', pFunction.inputs, pFunction.outputs),
                    outputs: lPortGenerator('Output', pFunction.outputs, pFunction.outputs),
                },
                code: (pNodeContext) => {
                    if (!lFunctionDefinition) {
                        return '';
                    }

                    return lFunctionDefinition.codeGenerator.value({
                        function: pFunction,
                        inputs: pNodeContext.inputs,
                        outputs: pNodeContext.outputs,
                        code: pNodeContext.code
                    });
                }
            }
        });

        // Save reference to the source function for later use in code generation and editor features.
        this.mFunction = pFunction;
    }
}
