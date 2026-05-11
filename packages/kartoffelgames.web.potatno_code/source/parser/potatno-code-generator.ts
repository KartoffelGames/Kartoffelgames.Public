import { Exception } from "@kartoffelgames/core";
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { PotatnoDocument } from "../document/potatno-document.ts";
import { PotatnoFunctionNodeDefinition } from '../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoCodeGeneratorPort, PotatnoNodeDefinitionGeneratorContext } from '../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoFunctionDefinition } from "../project/potatno-function-definition.ts";
import { PotatnoCodeGeneratorFunctionResult } from './potatno-code-generator-function-result.ts';
import { PotatnoCodeGeneratorGraphResult } from "./potatno-code-generator-graph-result.ts";

/**
 * Walks the graph in topological order and generates code without metadata markers.
 *
 * Value identifiers (valueIds) are assigned freshly each generation pass using a
 * Map<PotatnoDocumentPort, string> — they are not stored on the port objects.
 */
export class PotatnoCodeGenerator<TProject extends PotatnoProject> {
    private readonly mProject: TProject;

    /**
     * Constructor.
     *
     * @param pProject - The project providing node definitions and code generation settings.
     */
    public constructor(pProject: TProject) {
        this.mProject = pProject;
    }

    /**
     * Generate code for a document.
     * Generates code for all functions reachable from the documents entry point.
     * 
     * @param pDocument - The document to generate code for.
     * 
     * @returns The generated code as a string.
     */
    public generateDocumentCode(pDocument: PotatnoDocument<TProject>): string {
        // Find the primary function (entry point) to generate code for.
        const lEntryPointFunction: PotatnoDocumentFunction<TProject> | undefined = [...pDocument.functions].find((pFunction) => {
            return pFunction.isSystem;
        });

        if (!lEntryPointFunction) {
            throw new Exception('No entry point function found for code generation.', this);
        }

        // Generate code for a function and all its dependencies, ensuring the entry point function is always last in the output.
        const lFunctionCodeResult: PotatnoCodeGeneratorFunctionResult<TProject> = this.generateFunctionCode(lEntryPointFunction);

        // TODO: Concat code of all dependent function int the correct order and return the full code as a string.
    }

    /**
     * Generate code for a function.
     * Generates code for the given function and all functions reachable from it, ensuring the entry point function is always last in the output.
     * 
     * @param pFunction - The function to generate code for.
     * 
     * @returns the generated function code along with any dependent function code generations.
     */
    public generateFunctionCode(pFunction: PotatnoDocumentFunction<TProject>): PotatnoCodeGeneratorFunctionResult<TProject> {
        // Get the function definition.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProject> | undefined = this.mProject.getFunction(pFunction.definitionId);
        if (!lFunctionDefinition) {
            throw new Exception(`Function definition not found for function "${pFunction.label}".`, this);
        }

        // Get all definition ids of entry nodes defined by the function definition.
        const lExitNodeDefinitionIds = new Set(lFunctionDefinition.getNodeDefinitions(pFunction).exit.map((pNodeDefinition) => {
            return pNodeDefinition.id;
        }) ?? new Array<string>());

        // Find all ending nodes of the graph.
        const lExitNodes: Array<PotatnoDocumentNode<TProject>> = [...pFunction.nodes].filter((pNode) => {
            return lExitNodeDefinitionIds.has(pNode.definitionId);
        });

        // TODO: Call code generation for each exit node and save the results of the generation as well as the dependency generations so the dependency must not be generated multiple times if used by multiple nodes.
    }

    /**
     * Generate code for a single node, along with any dependent function code generations.
     * 
     * @param pExitNode - The node to generate code for.
     * 
     * @returns The result of the code generation for the node.
     */
    public generateNodeGraphCode(pExitNode: PotatnoDocumentNode<TProject>): PotatnoCodeGeneratorGraphResult<TProject> {
        return this.generateNodeCodeWithDependencies(pExitNode, new Array<PotatnoCodeGeneratorFunctionResult<TProject>>());
    }

    private generateNodeCodeWithDependencies(pNode: PotatnoDocumentNode<TProject>, pDependencies: Array<PotatnoCodeGeneratorFunctionResult<TProject>>): PotatnoCodeGeneratorGraphResult<TProject> {
        // Create a map for resolving function ids to their instance.
        const lFunctionMap: Map<string, PotatnoDocumentFunction<TProject>> = new Map<string, PotatnoDocumentFunction<TProject>>();
        for (const lFunction of pNode.document.functions) {
            lFunctionMap.set(lFunction.id, lFunction);
        }
        
        // TODO: Implement logic :)
    }
}