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
     * Build a calculator document with the entry function instance.
     *
     * The function's system entry / exit nodes are not placed by hand; a single
     * {@link PotatnoDocument.validate} call syncs all of them (the `Default` and `X10`
     * entry / exit pairs) into the graph. The secondary `X10` entry → exit pair is then
     * wired flow-only so the document validates while leaving the `Default` pair free for
     * the caller to wire as the test requires.
     *
     * @returns The document together with the entry function and all four synced system nodes.
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

        // Validate once so the function's system entry / exit nodes are synced into the graph.
        lDocument.validate();

        // Resolve the synced system nodes by their definition ids.
        const lNodeDefinitions = lEntryDefinition.getNodeDefinitions(lFunction);
        const lFindNode = (pDefinitionId: string): PotatnoDocumentNode<typeof TestProject> => {
            const lNode = [...lFunction.nodes].find((pNode) => pNode.definitionId === pDefinitionId);
            if (!lNode) {
                throw new Error(`System node "${pDefinitionId}" was not synced into the calculator document.`);
            }
            return lNode;
        };

        const lDefaultEntry = lFindNode(lNodeDefinitions.entry[0].id);
        const lX10Entry = lFindNode(lNodeDefinitions.entry[1].id);
        const lDefaultExit = lFindNode(lNodeDefinitions.exit[0].id);
        const lX10Exit = lFindNode(lNodeDefinitions.exit[1].id);

        // Wire the secondary X10 entry → exit pair flow-only so the X10 exit terminates and the document validates.
        lX10Entry.outputs.flow[0].connect(lX10Exit.inputs.flow[0]);

        return { document: lDocument, function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit, x10Entry: lX10Entry, x10Exit: lX10Exit };
    }
}

/**
 * Result of {@link PotatnoHelper.setupCalculatorDocument}: the calculator document
 * alongside its entry function and the synced `Default` / `X10` entry and exit nodes.
 */
export type PotatnoHelperCalculatorDocument = {
    document: PotatnoDocument<typeof TestProject>;
    function: PotatnoDocumentFunction<typeof TestProject>;
    defaultEntry: PotatnoDocumentNode<typeof TestProject>;
    defaultExit: PotatnoDocumentNode<typeof TestProject>;
    x10Entry: PotatnoDocumentNode<typeof TestProject>;
    x10Exit: PotatnoDocumentNode<typeof TestProject>;
};
