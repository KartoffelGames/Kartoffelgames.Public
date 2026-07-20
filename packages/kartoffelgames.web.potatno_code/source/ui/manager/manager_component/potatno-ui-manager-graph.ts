import { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode, PotatnoDocumentNodeTransformation } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoDocument } from '../../../document/potatno-document.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager } from '../potatno-ui-manager.ts';

/**
 * Ui manager graph component.
 * Handles document changes.
 */
export class PotatnoUiManagerGraph {
    private mDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null;
    private readonly mManager: PotatnoUiManager;

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
     * Add a new user function from a definition id and activate it.
     *
     * @param pDefinitionId - The user function definition id to instantiate.
     */
    public addFunction(pDefinitionId: string): void {
        const lDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null = this.mDocument;
        if (!lDocument) {
            return;
        }

        // Find the actual function definition based on the provided definition id.
        if (!lDocument.project.userFunctions.has(pDefinitionId)) {
            return;
        }

        // Create new function.
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> = new PotatnoDocumentFunction(lDocument.project, lDocument, {
            definitionId: pDefinitionId,
            id: crypto.randomUUID(),
            isSystem: false,
            label: `Function_${lDocument.functions.length}`
        });

        // And add the function.
        lDocument.addFunction(lFunction);
        lDocument.validate();

        // Dispatch function add event.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.FunctionAdd, lFunction);

        // Set the function as new active.
        this.mManager.setActiveFunction(lFunction);
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
        } catch {
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
     * Remove a node from the active function.
     *
     * @param pNode - The node to remove.
     */
    public removeNode(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        pNode.function.removeNode(pNode);

        // Notify per removed node.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeDelete, pNode);
    }

    /**
     * Set a new document.
     * Updates the active function to the first function of the document when the current active function cant be found.
     * 
     * @param pDocument - New document.
     */
    public setDocument(pDocument: PotatnoDocument<PotatnoProjectTypesDefinition>): void {
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
     * Set a port's direct value.
     *
     * @param pPort - The value port to set.
     * @param pValues - The new direct value strings.
     */
    public setPortDirectValue(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pValues: Array<string>): void {
        pPort.setDirectValue(pValues);

        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeUpdate, pPort.node);
    }

    /**
     * Calls updater function with the specified node.
     * Does emit an transformation event on completion and nothing else.
     * 
     * @param pNode - Node to update.
     * @param pUpdater - Update method of the node.
     */
    public transformNode(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null,  pUpdater: (pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>) => void): void {
        // Skip node update when no node is set.
        if (!pNode) {
            return;
        }

        // Read the transformation before the update.
        const lBeforeTransformation = structuredClone(pNode.transformation);

        // Simple pass forward.
        pUpdater(pNode);

        // Dispatch transformation change event only when actually something has changed.
        if(lBeforeTransformation.width === pNode.transformation.width && lBeforeTransformation.height === pNode.transformation.height && lBeforeTransformation.x === pNode.transformation.x && lBeforeTransformation.y === pNode.transformation.y) {
            return;
        }

        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeTransform, pNode);
    }

    /**
     * Calls updater function with the specified function.
     * Does emit an update event on completion.
     * 
     * @param pFunction - Function to update.
     * @param pUpdater - Update method of the function.
     */
    public updateFunction(pFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null, pUpdater: (pFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition>) => void): void {
        // Skip function update when no function is set.
        if (!pFunction) {
            return;
        }

        // Simple pass forward.
        pUpdater(pFunction);
        
        // Dispatch changes.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.FunctionUpdate, pFunction);
    }

    /**
     * Calls updater function with the specified node.
     * Does emit an update event on completion.
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
        if (!this.mDocument || this.mDocument.functions.length === 0) {
            return;
        }

        // Check the current active function and reset to the first if it is not there anymore.
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> = (() => {
            const lNewDocumentFunctions: Array<PotatnoDocumentFunction<PotatnoProjectTypesDefinition>> = [...this.mDocument.functions];

            // Use the first function if currently no active is set.
            if(!this.mManager.activeFunction){
                return lNewDocumentFunctions[0];
            }

            // Try to find the current active function id inside the snapshot function.
            const lFunctionWithSameId = lNewDocumentFunctions.find((pFunction) => {
                return pFunction.id === this.mManager.activeFunction!.id;
            });

            // When the current function still exists in the new document, use it.
            if (lFunctionWithSameId) {
                return lFunctionWithSameId;
            }

            // Just take the first function id when it can be found.
            return lNewDocumentFunctions[0];
        })();

        // Update active function if that has changed.
        if (this.mManager.activeFunction !== lActiveFunction) {
            this.mManager.setActiveFunction(lActiveFunction);
        }
    }
}
