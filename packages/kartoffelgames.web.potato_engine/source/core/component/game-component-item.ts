import { GameComponent } from "./game-component.ts";

/**
 * Represents an item that can be stored in a game component, such as a material slot or a mesh slot.
 * This class manages the relationship between a component and its items, allowing items to reference their parent components and trigger updates when changed.
 */
export class GameComponentItem {
    /**
     * Set of parent game components that reference this item.
     */
    private mLinkedParents: Set<GameComponent | GameComponentItem>;

    /**
     * The identifying label for this component item.
     */
    private mLabel: string;

    /**
     * Gets the label identifying this component item.
     *
     * @returns The item's label.
     */
    public get label(): string {
        return this.mLabel;
    } set label(pValue: string) {
        this.mLabel = pValue;
    }

    /**
     * Creates a new game component item with the specified label.
     *
     * @param pLabel - The identifying label for this item.
     */
    public constructor(pLabel: string) {
        this.mLabel = pLabel;
        this.mLinkedParents = new Set<GameComponent | GameComponentItem>();
    }

    /**
     * Adds a parent component to the linked parents set, indicating that the component now references this item.
     *
     * @param pParent - The parent component to link.
     */
    public linkParent(pParent: GameComponent): void {
        this.mLinkedParents.add(pParent);
    }

    /**
     * Removes a parent component from the linked parents set, indicating that the component no longer references this item.
     *
     * @param pParent - The parent component to unlink.
     */
    public unlinkParent(pParent: GameComponent): void {
        this.mLinkedParents.delete(pParent);
    }

    /**
     * Transmits a component update event to all linked parent components.
     * This signals that this item has changed and that parent components may need to update accordingly.
     *
     * @internal
     */
    public update(): void {
        // Send a component update event for every linked parent component to signal that this item has changed and that the parent components may need to update as well.
        for (const lParent of this.mLinkedParents) {
            lParent.update();
        }
    }
}