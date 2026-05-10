import { Exception } from "@kartoffelgames/core";
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { PotatnoDocument } from "../document/potatno-document.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import { NodeCategory } from './node/node-category.enum.ts';
import { PotatnoCodeNode, type PotatnoCodeNodeContext } from './node/potatno-code-node.ts';
import { PotatnoCodeTemplateNode } from './node/potatno-code-template-node.ts';
import { PotatnoCodeFunction } from './potatno-code-function.ts';
import { PotatnoFunctionDefinition } from "../project/potatno-function-definition.ts";

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
    public generateDocumentCode(pDocument: PotatnoDocument<TProject>): PotatnoCodeGeneratorResult<TProject> {
        // Find the primary function (entry point) to generate code for.
        const lEntryPointFunction: PotatnoDocumentFunction<TProject> | undefined = [...pDocument.functions].find((pFunction) => {
            return pFunction.isSystem;
        });

        if (!lEntryPointFunction) {
            throw new Exception('No entry point function found for code generation.', this);
        }

        // Generate code for the entry point function and all functions reachable from it.
        return this.generateFunctionCode(lEntryPointFunction);
    }

    /**
     * Generate code for a function.
     * Generates code for the given function and all functions reachable from it, ensuring the entry point function is always last in the output.
     * 
     * @param pFunction - The function to generate code for.
     * 
     * @returns the generated function code along with any dependent function code generations.
     */
    public generateFunctionCode(pFunction: PotatnoDocumentFunction<TProject>): PotatnoCodeGeneratorResult<TProject> {
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

        // Generate code for each ending node while buffering dependent function code generations.
        const lDependentFunctionCodes: Array<PotatnoCodeGeneratorResultDependency<TProject>> = new Array<PotatnoCodeGeneratorResultDependency<TProject>>();
        const lFunctionCodeResult: string = lExitNodes.map((pExitNode) => {
            return this.generateNodeCodeWithDependencies(pExitNode, lDependentFunctionCodes);
        }).join('\n');

        // Return the generated code for the entry point function along with all dependent function code generations.
        return {
            code: lFunctionCodeResult,
            dependencies: lDependentFunctionCodes
        };
    }

    /**
     * Generate code for a single node, along with any dependent function code generations.
     * 
     * @param pNode - The node to generate code for.
     * 
     * @returns The result of the code generation for the node.
     */
    public generateNodeCode(pNode: PotatnoDocumentNode<TProject>): PotatnoCodeGeneratorResult<TProject> {
        return this.generateNodeCodeWithDependencies(pNode, new Array<PotatnoCodeGeneratorResultDependency<TProject>>());
    }

    private generateNodeCodeWithDependencies(pNode: PotatnoDocumentNode<TProject>, pFunctionDependencies: Array<PotatnoCodeGeneratorResultDependency<TProject>>): PotatnoCodeGeneratorResult<TProject> {
        // Create a map for resolving function ids to their instance.
        const lFunctionMap: Map<string, PotatnoDocumentFunction<TProject>> = new Map<string, PotatnoDocumentFunction<TProject>>();
        for (const lFunction of pNode.document.functions) {
            lFunctionMap.set(lFunction.id, lFunction);
        }
        
        // TODO: Implement logic :)
    }

















}

/**
 * Result of generating code for a single item, including any dependent function code generations.
 */
type PotatnoCodeGeneratorResult<TProject extends PotatnoProject> = {
    /**
     * Generated code.
     */
    code: string;

    /**
     * List of function code generations that the node depends on.
     */
    dependencies: Array<PotatnoCodeGeneratorResultDependency<TProject>>;
};

/**
 * Represents a single function code generation that is a dependency of a code generation, including the generated code and the function it corresponds to.
 */
type PotatnoCodeGeneratorResultDependency<TProject extends PotatnoProject> = {
    /**
     * The generated code for the dependent function.
     */
    code: string;

    /**
     * The function that was generated to produce the code.
     */
    function: PotatnoDocumentFunction<TProject>;
};
