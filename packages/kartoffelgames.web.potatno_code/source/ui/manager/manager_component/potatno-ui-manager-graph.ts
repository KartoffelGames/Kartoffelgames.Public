import { PotatnoDocumentFunction } from "../../../document/potatno-document-function.ts";
import { PotatnoDocumentNode, PotatnoDocumentNodeTransformation } from "../../../document/potatno-document-node.ts";
import { PotatnoDocumentPort } from "../../../document/potatno-document-port.ts";
import { PotatnoDocument } from "../../../document/potatno-document.ts";
import { PotatnoNodeDefinition } from "../../../project/node_definition/potatno-node-definition.ts";
import { PotatnoProjectTypesDefinition } from "../../../project/potatno-project-types-definition.ts";
import { PotatnoProject } from "../../../project/potatno-project.ts";
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from "../potatno-ui-manager.ts";

/**
 * Ui manager graph component.
 * Handles document changes.
 */
export class PotatnoUiManagerGraph {
    private readonly mManager: PotatnoUiManager;
    private mDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null;

    /**
     * Document.
     */
    public get document(): PotatnoDocument<PotatnoProjectTypesDefinition> | null {
        return this.mDocument;
    }

    /**
     * Constructor.
     * 
     * @param pManager - Parents ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;
        this.mDocument = null;
    }

    /**
     * Set a new document.
     * Updates the active function to the first function of the document when the current active function cant be found.
     * 
     * @param pDocument - New document.
     */
    public setDocument(pDocument: PotatnoDocument<PotatnoProjectTypesDefinition>) {
        // Set document and dispatch change event.
        this.mDocument = pDocument;

        // Before signaling the document, validate it to initialize any nodes and ports.
        this.mDocument.validate();

        // Then signal it.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.Document, this.mDocument);

        // Set a default function for the changed document.
        this.setDefaultActiveFunction();
    }

    /**
     * Remove a function from the document.
     *
     * @param pFunctionId - Id of the function to remove.
     */
    public removeFunction(pFunctionId: string): void {
        const lDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null = this.mDocument;
        if (!lDocument) {
            return;
        }

        let lRemovedFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = null;
        for (const lFunction of lDocument.functions) {
            if (lFunction.id === pFunctionId) {
                lRemovedFunction = lFunction;
                lDocument.removeFunction(lFunction);
                break;
            }
        }

        if (!lRemovedFunction) {
            return;
        }

        // Notify for the removed function and for the newly active one.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.FunctionDelete, lRemovedFunction);

        // Set a default function for the changed document.
        this.setDefaultActiveFunction();
    }

    /**
     * Announce a transient, in-place node geometry change (a live drag or resize) so the connection
     * layer can redraw its wires. Carries no history/preview/validation side effects — those are
     * committed separately on pointer-up via {@link commitNodeChange}.
     */
    public transformNode(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>, pTransformation: Partial<PotatnoDocumentNodeTransformation>): void {
        // Build full transformation and override provided data.
        const lTransformation: PotatnoDocumentNodeTransformation = {
            x: pNode.transformation.x,
            y: pNode.transformation.y,
            width: pNode.transformation.width,
            height: pNode.transformation.height,

            // Override with provided data.
            ...pTransformation
        };

        // Move and resize.
        pNode.moveTo(lTransformation.x, lTransformation.y);
        pNode.resizeTo(lTransformation.width, lTransformation.height);

        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeTransform, pNode);
    }

    /**
     * Add a new user function from a definition id and activate it.
     *
     * @param pDefinitionId - The user function definition id to instantiate.
     */
    public addFunction(pDefinitionId: string): void {
        const lDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null = this.mDocument;
        const lProject: PotatnoProject<PotatnoProjectTypesDefinition> | null = this.mManager.project;
        if (!lDocument || !lProject) {
            return;
        }

        // Find the actual function definition based on the provided definition id.
        if (!lProject.userFunctions.has(pDefinitionId)) {
            return;
        }

        // Create new function.
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> = new PotatnoDocumentFunction(lProject, lDocument, {
            definitionId: pDefinitionId,
            id: crypto.randomUUID(),
            isSystem: false,
            label: `Function ${lDocument.functions.size}`
        });

        // And add the function.
        lDocument.addFunction(lFunction);
        lDocument.validate();

        // Dispatch function add event.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.FunctionAdd, lFunction);

        // Set the function as new active.
        this.mManager.setActiveFunction(lFunction.id);
    }

    /**
     * Place a new node in the active function from a definition.
     *
     * @param pFunction - 
     * @param pDefinition - The node definition to instantiate.
     * @param pTransformation - Initial grid placement of the node.
     *
     * @returns The created node.
     */
    public addNode(pFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition>, pDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>, pTransformation: PotatnoDocumentNodeTransformation): PotatnoDocumentNode<PotatnoProjectTypesDefinition> {
        // Add node to function.
        const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = pFunction.addNodeByDefinition(pDefinition, pTransformation);
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeAdd, lNode);

        return lNode;
    }

    /**
     * Remove a node from the active function.
     *
     * @param pNode - The node to remove.
     */
    public removeNode(lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        lNode.function.removeNode(lNode);

        // Notify per removed node.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeDelete, lNode);
    }

    /**
     * Connect two ports and rebuild dependent state.
     *
     * @param pSource - One side of the connection.
     * @param pTarget - The other side of the connection.
     *
     * @returns `true` when the ports were connected, `false` when the connection was rejected.
     */
    public connectPorts(pSource: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pTarget: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): boolean {
        try {
            pSource.connect(pTarget);
        } catch (pError) {
            console.error('[PotatnoCodeUiManager] Connection failed:', pError);
            return false;
        }

        // Dispatch for from-node as well as to-node.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.ConnectionAdd, pSource);
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.ConnectionAdd, pTarget);

        return true;
    }

    /**
     * Disconnect two ports and rebuild dependent state.
     *
     * @param pSource - One side of the connection.
     * @param pTarget - The other side of the connection.
     */
    public disconnectPorts(pSource: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pTarget: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): void {
        pSource.disconnect(pTarget);

        // Dispatch for from-node as well as to-node.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.ConnectionDelete, pSource);
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.ConnectionDelete, pTarget);
    }

    /**
     * Set a port's direct value.
     *
     * @param pPort - The value port to set.
     * @param pValues - The new direct value strings.
     */
    public setPortDirectValue(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pValues: Array<string>): void {
        pPort.setDirectValue(pValues);

        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeUpdate, pPort);
    }

    /**
     * Update unspecified fields of a node.
     * 
     * @param pNode - Node to update.
     * @param pUpdater - Update method of the node.
     */
    public updateNode(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null, pUpdater: (pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>) => void): void {
        // Skip node update when no node is set.
        if (!pNode) {
            return;
        }

        // Simple pass forward.
        pUpdater(pNode);

        // Dispatch changes.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeUpdate, pNode);
    }

    /**
     * Set a default active function when the current active function is not accessable anymore.
     */
    private setDefaultActiveFunction() {
        // Cant set active functions when neighter there is a document or a function to begin with.
        if (!this.mDocument || this.mDocument.functions.size === 0) {
            return;
        }

        // Check the current active function and reset to the first if it is not there anymore.
        const lActiveFunctionId: string = (() => {
            const lNewDocumentFunctions: Array<PotatnoDocumentFunction<PotatnoProjectTypesDefinition>> = [...this.mDocument.functions];

            // Try to find the current active function id inside the snapshot function.
            const lIsFunctionIdFound = lNewDocumentFunctions.some((pFunction) => pFunction.id === this.mManager.activeFunctionId);
            if (lIsFunctionIdFound) {
                return this.mManager.activeFunctionId;
            }

            // Just take the first function id when it can be found.
            return lNewDocumentFunctions[0].id;
        })();

        // Update active function if that has changed.
        if (this.mManager.activeFunctionId !== lActiveFunctionId) {
            this.mManager.setActiveFunction(lActiveFunctionId);
        }
    }
}
