import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoDocumentValidationResult } from '../../../document/potatno-document-validation-result.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager } from '../potatno-ui-manager.ts';

/**
 * Ui manager integrity component.
 * Handles document integrity.
 */
export class PotatnoUiManagerIntegrity {
    private readonly mErrorItems: Set<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>>;
    private readonly mErrorList: Array<PotatnoCodeUiManagerIntegrityError>;
    private mIsDirty: boolean;
    private readonly mManager: PotatnoUiManager;

    /**
     * Nodes flagged by the last validation pass. Used by the graph for error highlighting.
     */
    public get errorItems(): ReadonlySet<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>> {
        // Retrigger validation on dirty state.
        if (this.mIsDirty) {
            this.revalidate();
        }

        return this.mErrorItems;
    }

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
        this.mErrorItems = new Set<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>>();

        // Simple dirty flag to revalidate.
        this.mIsDirty = true;

        // Register "all"-Listener and set dirtly. After a debounce validate automaticly.
        let lDebounce: number = 0;

        // Anything that has an effect.
        const lIntegrityChangeEvents: number = PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeUpdate | PotatnoCodeUiManagerChangeType.NodeDelete | PotatnoCodeUiManagerChangeType.Port;
        this.mManager.subscribe(lIntegrityChangeEvents, () => {
            this.mIsDirty = true;

            // Debounce: Clear and set a new timeout before pushing new history.
            globalThis.clearTimeout(lDebounce);
            lDebounce = globalThis.setTimeout(() => {
                // If its not dirty, no need to reevaluate.
                if (!this.mIsDirty) {
                    return;
                }

                this.revalidate();

                // Reset dirty flag.
                this.mIsDirty = false;
            }, 1000) as unknown as number;
        });
    }

    /**
     * Re-run document validation and refresh the cached error list and highlight sets.
     */
    public revalidate(): void {
        // Set document as clean.
        this.mIsDirty = false;

        // Clean error lists. Not fast but clean.
        this.mErrorList.splice(0, this.mErrorList.length);
        this.mErrorItems.clear();

        // Validate the document.
        const lValidationResult: PotatnoDocumentValidationResult<PotatnoProjectTypesDefinition> = this.mManager.graph.document.validate();

        // Validate and track all errors.
        for (const lError of lValidationResult.errors) {
            // Register as error item.
            this.mErrorItems.add(lError.item);

            // Add error messages to display to the user based on the item type.
            switch (true) {
                case lError.item instanceof PotatnoDocumentPort: {
                    this.mErrorList.push({ location: lError.item.node, message: lError.message });
                    break;
                }
                case lError.item instanceof PotatnoDocumentNode: {
                    this.mErrorList.push({ location: lError.item, message: lError.message });
                    break;
                }
                case lError.item instanceof PotatnoDocumentFunction: {
                    this.mErrorList.push({ location: lError.item, message: lError.message });
                    break;
                }
            }
        }

        // Trigger change events for affected items.
        for (const lAffectedItem of lValidationResult.affectedItems) {
            switch (true) {
                case lAffectedItem instanceof PotatnoDocumentPort: {
                    // Missing the delete, but that should be fine.
                    this.mManager.dispatch(PotatnoCodeUiManagerChangeType.PortAdd | PotatnoCodeUiManagerChangeType.PortUpdate, lAffectedItem);

                    // Also trigger a node update.
                    this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeUpdate, lAffectedItem.node);

                    break;
                }
                case lAffectedItem instanceof PotatnoDocumentNode: {
                    this.mManager.dispatch(PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeUpdate | PotatnoCodeUiManagerChangeType.NodeTransform, lAffectedItem);
                    break;
                }
                case lAffectedItem instanceof PotatnoDocumentFunction: {
                    this.mManager.dispatch(PotatnoCodeUiManagerChangeType.FunctionAdd | PotatnoCodeUiManagerChangeType.FunctionUpdate, lAffectedItem);
                    break;
                }
            }
        }

        // Trigger validation event on any revalidation.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.SpecialValidation, null);
    }
}

/**
 * A validation error shaped for the preview panel.
 */
export type PotatnoCodeUiManagerIntegrityError = {
    location: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | PotatnoDocumentFunction<PotatnoProjectTypesDefinition>;
    message: string;
};
