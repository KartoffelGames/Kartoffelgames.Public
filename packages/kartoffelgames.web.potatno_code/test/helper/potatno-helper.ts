import type { PotatnoDocumentFunction } from '../../source/document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../source/document/potatno-document-node.ts';
import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoDeserializer } from '../../source/serialization/potatno-deserializer.ts';
import { PotatnoSerializer } from '../../source/serialization/potatno-serializer.ts';
import { TestProject } from './test-project.ts';

/**
 * Shared test helper for the PotatnoCode test suite.
 *
 * Bundles the document-building, node-wiring and serialization boilerplate that
 * every {@link TestProject}-based test file would otherwise redefine at the top
 * of the file. All members are static; the class is never instantiated and only
 * exists to group the helpers into a single tree-shakeable unit.
 */
export class PotatnoHelper {
    /**
     * Place a project node definition on a function by its definition id.
     *
     * @param pFunction - Document function the new node is added to.
     * @param pDefinitionId - Id of the project node definition to instantiate.
     *
     * @returns The newly created document node.
     *
     * @throws When the project has no node definition with the given id.
     */
    public static addProjectNode(pFunction: PotatnoDocumentFunction<typeof TestProject>, pDefinitionId: string): PotatnoDocumentNode<typeof TestProject> {
        const lDefinition = TestProject.nodeDefinitions.find((pDefinition) => pDefinition.id === pDefinitionId);
        if (!lDefinition) {
            throw new Error(`No project node definition with id "${pDefinitionId}"`);
        }
        return pFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 6, height: 4 });
    }

    /**
     * Connect a flow output of one node to the single flow input of another.
     *
     * @param pSourceNode - Node whose flow output is the source of the connection.
     * @param pTargetNode - Node whose single flow input receives the connection.
     * @param pSourceFlowId - Definition id of the named flow output to use. When omitted, the source node's single flow output is used.
     */
    public static connectFlow(pSourceNode: PotatnoDocumentNode<typeof TestProject>, pTargetNode: PotatnoDocumentNode<typeof TestProject>, pSourceFlowId?: string): void {
        // Use the named flow output when an id is given, otherwise the node's single flow output.
        const lSourcePort = pSourceFlowId === undefined ? pSourceNode.outputs.flow[0] : pSourceNode.outputs.map.get(pSourceFlowId)!;

        lSourcePort.connect(pTargetNode.inputs.flow[0]);
    }

    /**
     * Connect a value output port to a value input port, both resolved by definition id.
     *
     * @param pSourceNode - Node that provides the value output.
     * @param pSourcePortId - Definition id of the source node's value output port.
     * @param pTargetNode - Node that receives the value input.
     * @param pTargetPortId - Definition id of the target node's value input port.
     */
    public static connectValue(pSourceNode: PotatnoDocumentNode<typeof TestProject>, pSourcePortId: string, pTargetNode: PotatnoDocumentNode<typeof TestProject>, pTargetPortId: string): void {
        pSourceNode.outputs.map.get(pSourcePortId)!.connect(pTargetNode.inputs.map.get(pTargetPortId)!);
    }

    /**
     * Create a user function instance from the project's first user function definition (the helper).
     *
     * @param pDocument - Document the user function instance is created in.
     * @param pId - Stable id for the new function instance.
     * @param pLabel - Display label for the new function instance.
     *
     * @returns The newly created, non-system document function.
     */
    public static newHelperFunction(pDocument: PotatnoDocument<typeof TestProject>, pId: string, pLabel: string): PotatnoDocumentFunction<typeof TestProject> {
        const lHelperDefinition = [...TestProject.userFunctions.values()][0];
        return pDocument.newFunction({
            definitionId: lHelperDefinition.id,
            id: pId,
            label: pLabel,
            isSystem: false
        });
    }

    /**
     * Run a document through a serialize / deserialize round-trip and return the reconstructed copy.
     *
     * @param pDocument - Document to serialize and deserialize.
     *
     * @returns A freshly reconstructed document equivalent to the input.
     */
    public static roundTrip(pDocument: PotatnoDocument<typeof TestProject>): PotatnoDocument<typeof TestProject> {
        const lSerializer = new PotatnoSerializer<typeof TestProject>();
        const lDeserializer = new PotatnoDeserializer<typeof TestProject>(TestProject);
        return lDeserializer.deserialize(lSerializer.serialize(pDocument));
    }

    /**
     * Set the direct value of a node's value input port, resolved by definition id.
     *
     * @param pNode - Node that owns the value input port.
     * @param pPortId - Definition id of the value input port.
     * @param pValue - Direct value to assign, as the port type's string representation.
     */
    public static setInputValue(pNode: PotatnoDocumentNode<typeof TestProject>, pPortId: string, pValue: Array<string>): void {
        pNode.inputs.map.get(pPortId)!.setDirectValue(pValue);
    }

    /**
     * Build a calculator document with the entry function instance and its default entry / exit nodes wired in.
     *
     * @returns The document together with the entry function and its default entry and exit nodes.
     */
    public static setupCalculatorDocument(): PotatnoHelperCalculatorDocument {
        const lEntryDefinition = TestProject.entryPoint;
        const lDocument: PotatnoDocument<typeof TestProject> = new PotatnoDocument(TestProject);
        const lFunction: PotatnoDocumentFunction<typeof TestProject> = lDocument.newFunction({
            definitionId: lEntryDefinition.id,
            id: 'calc-instance-1',
            label: lEntryDefinition.label,
            isSystem: true
        });
        const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
        const lDefaultEntry = lFunction.addNodeByDefinition(lNodes.entry[0], { x: 0, y: 0, width: 6, height: 4 });
        const lDefaultExit = lFunction.addNodeByDefinition(lNodes.exit[0], { x: 12, y: 0, width: 6, height: 4 });

        return { document: lDocument, function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit };
    }
}

/**
 * Result of {@link PotatnoHelper.setupCalculatorDocument}: the calculator document
 * alongside its entry function and the default entry / exit nodes.
 */
export type PotatnoHelperCalculatorDocument = {
    document: PotatnoDocument<typeof TestProject>;
    function: PotatnoDocumentFunction<typeof TestProject>;
    defaultEntry: PotatnoDocumentNode<typeof TestProject>;
    defaultExit: PotatnoDocumentNode<typeof TestProject>;
};
