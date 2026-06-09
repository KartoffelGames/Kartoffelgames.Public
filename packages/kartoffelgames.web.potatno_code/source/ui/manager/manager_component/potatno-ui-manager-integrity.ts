import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiProject, type PotatnoUiManager } from '../potatno-ui-manager.ts';

/**
 * Ui manager integrity component.
 * Handles document integrity.
 */
export class PotatnoUiManagerIntegrity {
    private readonly mErrorList: Array<PotatnoCodeUiManagerIntegrityError>;
    private readonly mErrorItems: Set<IPotatnoDocumentItem<PotatnoUiProject>>;
    private mIsDirty: boolean;
    private readonly mManager: PotatnoUiManager;

    /**
     * Validation errors for the preview panel.
     */
    public get errors(): ReadonlyArray<PotatnoCodeUiManagerIntegrityError> {
        // Retrigger validation on dirty state.
        if (this.mIsDirty) {
            this.revalidate();
        }

        return this.mErrorList;
    }

    /**
     * Nodes flagged by the last validation pass. Used by the graph for error highlighting.
     */
    public get errorItems(): ReadonlySet<IPotatnoDocumentItem<PotatnoUiProject>> {
        // Retrigger validation on dirty state.
        if (this.mIsDirty) {
            this.revalidate();
        }

        return this.mErrorItems;
    }

    /**
     * Current document integrity is valid.
     */
    public get isValid(): boolean {
        // Retrigger validation on dirty state.
        if (this.mIsDirty) {
            this.revalidate();
        }

        return this.mErrorItems.size === 0;
    }

    /**
     * Constructor.
     * 
     * @param pManager - Parents ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;
        this.mErrorList = new Array<PotatnoCodeUiManagerIntegrityError>();
        this.mErrorItems = new Set<IPotatnoDocumentItem<PotatnoUiProject>>();

        // Simple dirty flag to revalidate.
        this.mIsDirty = true;

        // Register "all"-Listener and set dirtly. After a debounce validate automaticly.
        let lDebounce: number = 0;
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Any, null, ()=>{
            this.mIsDirty = true;

            // Debounce: Clear and set a new timeout before pushing new history.
            globalThis.clearTimeout(lDebounce);
            lDebounce = globalThis.setTimeout(() => {
                this.revalidate();
            }, 1000) as unknown as number;
        });
    }

    /**
     * Re-run document validation and refresh the cached error list and highlight sets.
     */
    public revalidate(): void {
        // If its not dirty, no need to reevaluate.
        if(!this.mIsDirty){
            return;
        }

        // Reset dirty flag.
        this.mIsDirty = false;

        // Do nothing if document is not set.
        if (!this.mManager.graph.document) {
            return;
        }

        // Clean error lists. Not fast but clean.
        this.mErrorList.splice(0, this.mErrorList.length);
        this.mErrorItems.clear();

        // Validate and track all errors.
        for (const lError of this.mManager.graph.document.validate()) {
            // Register as error item.
            this.mErrorItems.add(lError.item);

            // Add error messages to display to the user based on the item type.
            switch(true){
                case lError.item instanceof PotatnoDocumentPort: {
                    this.mErrorList.push({ location: `Node "${lError.item.node.label}"`, message: lError.message });
                    break;
                }
                case lError.item instanceof PotatnoDocumentNode: {
                    this.mErrorList.push({ location: `Node "${lError.item.label}"`, message: lError.message });
                    break;
                }
            }
        }
    }
}

/**
 * A validation error shaped for the preview panel.
 */
export type PotatnoCodeUiManagerIntegrityError = {
    location: string;
    message: string;
};
