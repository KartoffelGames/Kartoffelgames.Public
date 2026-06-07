import { PotatnoDocumentFunction } from "../../../document/potatno-document-function.ts";
import { PotatnoDocument } from "../../../document/potatno-document.ts";
import { PotatnoUiProject } from "../../potatno-ui-project.ts";
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from "../potatno-ui-manager.ts";

/**
 * Ui manager graph component.
 * Handles document changes.
 */
export class PotatnoUiManagerGraph {
    private readonly mManager: PotatnoUiManager;
    private mDocument: PotatnoDocument<PotatnoUiProject> | null;

    /**
     * Document.
     */
    public get document(): PotatnoDocument<PotatnoUiProject> | null {
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
    public setDocument(pDocument: PotatnoDocument<PotatnoUiProject>) {
        // Check the current active function and reset to the first if it is not there anymore.
        const lActiveFunctionId: string = (() => {
            const lNewDocumentFunctions: Array<PotatnoDocumentFunction<PotatnoUiProject>> = [...pDocument.functions];

            // Try to find the current active function id inside the snapshot function.
            const lIsFunctionIdFound = lNewDocumentFunctions.some((pFunction) => pFunction.id === this.mManager.activeFunctionId);
            if (lIsFunctionIdFound) {
                return this.mManager.activeFunctionId;
            }

            // Just take the first function id when it can be found.
            return lNewDocumentFunctions[0].id;
        })();

        // Set document and dispatch change event.
        this.mDocument = pDocument;
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.Document, this.mDocument);

        // Update active function if that has changed.
        if (this.mManager.activeFunctionId !== lActiveFunctionId) {
            this.mManager.setActiveFunction(lActiveFunctionId);
        }
    }
}