import type { PotatnoNode } from '../../graph/potatno-node.ts';
import type { PotatnoHistoryAction } from '../potatno-history-action.ts';

/**
 * Action: Change a property value on a node.
 */
export class PropertyChangeAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mNewValue: string;
    private readonly mNode: PotatnoNode;
    private mOldValue: string;
    private readonly mPropertyName: string;

    public constructor(pNode: PotatnoNode, pPropertyName: string, pNewValue: string) {
        this.description = `Change property: ${pPropertyName}`;
        this.mNode = pNode;
        this.mPropertyName = pPropertyName;
        this.mNewValue = pNewValue;
        this.mOldValue = pNode.properties.get(pPropertyName) ?? '';
    }

    public apply(): void {
        this.mOldValue = this.mNode.properties.get(this.mPropertyName) ?? '';
        this.mNode.properties.set(this.mPropertyName, this.mNewValue);
    }

    public revert(): void {
        if (this.mOldValue === '') {
            this.mNode.properties.delete(this.mPropertyName);
        } else {
            this.mNode.properties.set(this.mPropertyName, this.mOldValue);
        }
    }
}
