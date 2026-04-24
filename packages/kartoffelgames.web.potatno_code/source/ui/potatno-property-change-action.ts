import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoHistoryAction } from './potatno-history-action.ts';

/**
 * History action that changes a property value on a node.
 * Records the old value for undo support.
 */
export class PropertyChangeAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mNewValue: string;
    private readonly mNode: PotatnoDocumentNode;
    private mOldValue: string;
    private readonly mPropertyName: string;

    /**
     * Constructor.
     *
     * @param pNode - The node whose property will be changed.
     * @param pPropertyName - The name of the property to change.
     * @param pNewValue - The new value for the property.
     */
    public constructor(pNode: PotatnoDocumentNode, pPropertyName: string, pNewValue: string) {
        this.description = `Change property: ${pPropertyName}`;
        this.mNode = pNode;
        this.mPropertyName = pPropertyName;
        this.mNewValue = pNewValue;
        this.mOldValue = pNode.properties.get(pPropertyName) ?? '';
    }

    /**
     * Apply the action by setting the property to the new value.
     * The current value is saved before the change for accurate revert.
     */
    public apply(): void {
        this.mOldValue = this.mNode.properties.get(this.mPropertyName) ?? '';
        this.mNode.properties.set(this.mPropertyName, this.mNewValue);
    }

    /**
     * Revert the action by restoring the property to its previous value.
     * If the old value was empty, the property is deleted from the node.
     */
    public revert(): void {
        if (this.mOldValue === '') {
            this.mNode.properties.delete(this.mPropertyName);
        } else {
            this.mNode.properties.set(this.mPropertyName, this.mOldValue);
        }
    }
}
