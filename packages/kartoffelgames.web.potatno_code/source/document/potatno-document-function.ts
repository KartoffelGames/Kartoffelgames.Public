import type { PotatnoNodeDefinition } from "../project/node_definition/potatno-node-definition.ts";
import { PotatnoFunctionDefinition } from "../project/potatno-function-definition.ts";
import { PotatnoPortDefinition } from "../project/potatno-port-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.ts';
import { PotatnoDocumentNode, PotatnoDocumentNodeConstructorParameter, PotatnoDocumentNodePortConfiguration, PotatnoDocumentNodeTransformation } from "./potatno-document-node.ts";
import { PotatnoDocument, PotatnoDocumentPortValidationError } from "./potatno-document.ts";

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoDocumentFunction<TProject extends PotatnoProject<any>> implements IPotatnoDocumentItem<TProject> {
    private mLabel: string;
    private readonly mDefinitionId: string;
    private readonly mDocument: PotatnoDocument<TProject>;
    private readonly mId: string;
    private readonly mImports: Array<string>;
    private readonly mInputs: Array<PotatnoDocumentFunctionPort>;
    private readonly mIsSystem: boolean;
    private readonly mNodes: Set<PotatnoDocumentNode<TProject>>;
    private readonly mOutputs: Array<PotatnoDocumentFunctionPort>;
    private readonly mProject: TProject;

    /**
     * Unique identifier for this function instance. Stable across sessions so it can be referenced as a node in other graphs.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * The stable id of the function definition this function was created from.
     */
    public get definitionId(): string {
        return this.mDefinitionId;
    }

    /**
     * The document this function belongs to.
     */
    public get document(): PotatnoDocument<TProject> {
        return this.mDocument;
    }

    /**
     * Read-only set of all nodes in the graph.
     */
    public get nodes(): ReadonlySet<PotatnoDocumentNode<TProject>> {
        return this.mNodes;
    }

    /**
     * Get all available node definitions for this document, including both project-level and function node definitions.
     */
    public get nodeDefinitions(): ReadonlyArray<PotatnoNodeDefinition<TProject>> {
        // Read the function definition from project.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProject> | undefined = this.mProject.getFunction(this.definitionId);

        // When no definition is set, the result is empty.
        const lFunctionNodes: ReadonlyArray<PotatnoNodeDefinition<TProject>> = (() => {
            if (!lFunctionDefinition) {
                return new Array<PotatnoNodeDefinition<TProject>>();
            }

            // Create node definitions for all nodes provided by the function definition.
            return lFunctionDefinition.nodeDefinitions;
        })();

        return [
            ...lFunctionNodes,
            ...this.mDocument.nodeDefinitions
        ];
    }

    /**
     * Get the list of imports for this function.
     */
    public get imports(): ReadonlyArray<string> {
        return this.mImports;
    }

    /**
     * Get the input port definitions for this function.
     */
    public get inputs(): ReadonlyArray<PotatnoDocumentFunctionPort> {
        return this.mInputs;
    }

    /**
     * Get the label of this function.
     */
    public get label(): string {
        return this.mLabel;
    } set label(pLabel: string) {
        this.mLabel = pLabel;
    }

    /**
     * Get the output port definitions for this function.
     */
    public get outputs(): ReadonlyArray<PotatnoDocumentFunctionPort> {
        return this.mOutputs;
    }

    /**
     * Get whether the function is a system-defined function.
     */
    public get isSystem(): boolean {
        return this.mIsSystem;
    }

    /**
     * Get the project this function belongs to.
     */
    public get project(): TProject {
        return this.mProject;
    }

    /**
     * Create a new function instance.
     *
     * @param pProject - The project this function belongs to.
     * @param pDefinitionId - The stable id of the function definition this function was created from.
     * @param pId - The unique identifier of the function.
     * @param pLabel - Label of the function.
     * @param pIsSystem - Whether the function is a system-defined function.
     */
    public constructor(pProject: TProject, pDocument: PotatnoDocument<TProject>, pParameter: PotatnoDocumentFunctionConstructorParameter) {
        this.mProject = pProject;
        this.mDocument = pDocument;
        this.mLabel = pParameter.label;
        this.mIsSystem = pParameter.isSystem;
        this.mDefinitionId = pParameter.definitionId;
        this.mId = pParameter.id;
        this.mNodes = new Set<PotatnoDocumentNode<TProject>>();
        this.mInputs = new Array<PotatnoDocumentFunctionPort>();
        this.mOutputs = new Array<PotatnoDocumentFunctionPort>();
        this.mImports = new Array<string>();
    }

    /**
     * Add an import to the function if it does not already exist.
     *
     * @param pImport - The import string to add.
     */
    public addImport(pImport: string): void {
        if (!this.mImports.includes(pImport)) {
            this.mImports.push(pImport);
        }
    }

    /**
     * Add an input port definition to the function.
     *
     * @param pPort - The port definition.
     */
    public addInput(pPort: PotatnoDocumentFunctionPort): void {
        // Skip if port label already exists.
        if (this.mInputs.some((existingPort) => existingPort.label === pPort.label)) {
            return;
        }

        this.mInputs.push(pPort);
    }

    /**
     * Add an output port definition to the function.
     *
     * @param pPort - The port definition.
     */
    public addOutput(pPort: PotatnoDocumentFunctionPort): void {
        // Skip if port label already exists.
        if (this.mOutputs.some((existingPort) => existingPort.label === pPort.label)) {
            return;
        }

        this.mOutputs.push(pPort);
    }

    /**
     * Add a pre-constructed node directly.
     *
     * @param pNode - The node to add.
     */
    public addNode(pNode: PotatnoDocumentNode<TProject>): void {
        this.mNodes.add(pNode);
    }

    /**
     * Create a new node from a definition instance. Used by the editor when the user places a node.
     * The definition's ports and metadata are used to populate the node.
     *
     * @param pDefinition - The node definition to create the node from.
     * @param pTransformation - Initial grid position of the node.
     * @param pSystem - Whether this is a system node.
     */
    public newNode(pDefinition: PotatnoNodeDefinition<TProject>, pTransformation: PotatnoDocumentNodeTransformation, pSystem: boolean = false): PotatnoDocumentNode<TProject> {
        // Node definition to configuration converter.
        const lNodeConverter = (pPort: PotatnoPortDefinition<TProject>): PotatnoDocumentNodePortConfiguration<TProject> => {
            return {
                definitionId: pPort.id,
                label: pPort.label,
                portType: pPort.portType,
                dataType: pPort.dataType
            };
        };

        const lNode = new PotatnoDocumentNode<TProject>(this.mProject, this.mDocument, {
            category: pDefinition.category,
            definitionId: pDefinition.id,
            ports: {
                input: pDefinition.inputs.map(lNodeConverter),
                output: pDefinition.outputs.map(lNodeConverter)
            },
            isSystem: pSystem,
            label: pDefinition.label,
            transformation: pTransformation,
        });

        this.mNodes.add(lNode);

        return lNode;
    }

    /**
     * Remove a node and disconnect all its ports from the graph.
     */
    public removeNode(pNode: PotatnoDocumentNode<TProject>): void {
        // Disconnect all ports of the node.
        for (const lPort of [...pNode.inputs.values(), ...pNode.outputs.values()]) {
            for (const lConnectedPort of Array.from(lPort.connectedPorts)) {
                lPort.disconnect(lConnectedPort);
            }
        }

        this.mNodes.delete(pNode);
    }

    /**
     * Remove an import from the function.
     *
     * @param pImport - The import string to remove.
     */
    public removeImport(pImport: string): void {
        const index = this.mImports.indexOf(pImport);
        if (index !== -1) {
            this.mImports.splice(index, 1);
        }
    }

    /**
     * Remove an input port definition from the function.
     *
     * @param pPort - The port definition to remove.
     */
    public removeInput(pPort: PotatnoDocumentFunctionPort): void {
        const index = this.mInputs.findIndex((existingPort) => existingPort.label === pPort.label);
        if (index !== -1) {
            this.mInputs.splice(index, 1);
        }
    }

    /**
     * Remove an output port definition from the function.
     *
     * @param pPort - The port definition to remove.
     */
    public removeOutput(pPort: PotatnoDocumentFunctionPort): void {
        const index = this.mOutputs.findIndex((existingPort) => existingPort.label === pPort.label);
        if (index !== -1) {
            this.mOutputs.splice(index, 1);
        }
    }

    /**
     * Validate all nodes in this function and return any errors found.
     */
    public validate(): Array<PotatnoDocumentPortValidationError<TProject>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProject>> = [];

        for (const lNode of this.mNodes) {
            lErrors.push(...lNode.validate());
        }

        return lErrors;
    }
}

export type PotatnoDocumentFunctionConstructorParameter = {
    definitionId: string;
    id: string;
    label: string;
    isSystem: boolean;
};

export type PotatnoDocumentFunctionPort = {
    label: string;
    dataType: string;
};