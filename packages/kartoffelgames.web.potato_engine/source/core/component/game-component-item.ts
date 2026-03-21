import { Exception } from '@kartoffelgames/core';
import { FileSystem } from '@kartoffelgames/web-file-system';
import type { GameUpdateableUpdateListener, IGameUpdateable } from '../i-game-updateable.interface.ts';

/**
 * Represents an item that can be stored in a game component, such as a material slot or a mesh slot.
 * This class manages the relationship between a component and its items, allowing items to reference their parent components and trigger updates when changed.
 */
export abstract class GameComponentItem<TUpdateStateChanges extends string = any> implements IGameUpdateable<TUpdateStateChanges> {
    private mIsSystem: boolean;
    private mLabel: string;
    private readonly mLinkedParents: Set<IGameUpdateable<string>>;
    private readonly mUpdateListeners: Array<GameUpdateableUpdateListener<TUpdateStateChanges>>;

    /**
     * Indicates whether this item is a system item, which is an item that is used internally by the engine and should not be modified by user code.
     */
    public get isSystem(): boolean {
        return this.mIsSystem;
    }

    /**
     * Gets the label identifying this component item.
     *
     * @returns The item's label.
     */
    @FileSystem.fileProperty()
    public get label(): string {
        return this.mLabel;
    } set label(pValue: string) {
        // Gate access on system items.
        this.systemgate();

        this.mLabel = pValue;
    }

    /**
     * Creates a new game component item with the specified label.
     *
     * @param pLabel - The identifying label for this item.
     */
    public constructor(pLabel: string) {
        this.mLabel = pLabel;
        this.mLinkedParents = new Set<IGameUpdateable<string>>();
        this.mUpdateListeners = new Array<GameUpdateableUpdateListener<TUpdateStateChanges>>();
        this.mIsSystem = false;
    }

    /**
     * Add a listener function that will be called whenever this object is updated.
     * 
     * @param pListener - The listener function to add.
     */
    public addUpdateListener(pListener: GameUpdateableUpdateListener<TUpdateStateChanges>): void {
        this.mUpdateListeners.push(pListener);
    }

    /**
     * Adds a parent component to the linked parents set, indicating that the component now references this item.
     *
     * @param pParent - The parent component to link.
     */
    public linkParent(pParent: IGameUpdateable<string>): void {
        this.mLinkedParents.add(pParent);
    }

    /**
     * Removes a previously added update listener function.
     * 
     * @param pListener - The listener function to remove.
     */
    public removeUpdateListener(pListener: GameUpdateableUpdateListener<TUpdateStateChanges>): void {
        const lIndex = this.mUpdateListeners.indexOf(pListener);
        if (lIndex !== -1) {
            this.mUpdateListeners.splice(lIndex, 1);
        }
    }

    /**
     * Removes a parent component from the linked parents set, indicating that the component no longer references this item.
     *
     * @param pParent - The parent component to unlink.
     */
    public unlinkParent(pParent: IGameUpdateable<string>): void {
        this.mLinkedParents.delete(pParent);
    }

    /**
     * Transmits a component update event to all linked parent components.
     * This signals that this item has changed and that parent components may need to update accordingly.
     *
     * @internal
     */
    public update(pUpdateName: string, pStateChanges?: TUpdateStateChanges): void {
        // Send a component update event for every linked parent component to signal that this item has changed and that the parent components may need to update as well.
        for (const lParent of this.mLinkedParents) {
            lParent.update(pUpdateName, pStateChanges);
        }

        // Notify all update listeners. 
        // Small performance optimization to avoid iterating over the listeners array if there are no listeners.
        if (this.mUpdateListeners.length > 0) {
            for (const lListener of this.mUpdateListeners) {
                lListener(pUpdateName, pStateChanges);
            }
        }
    }

    /**
     * Marks this item as a system item, which is an item that is used internally by the engine and should not be modified by user code.
     */
    protected markAsSystem(): void {
        this.mIsSystem = true;
    }

    /**
     * Checks if this item is a system item and throws an exception if it is, to prevent modification of system items by user code.
     */
    protected systemgate(): void {
        if (this.mIsSystem) {
            throw new Exception('Cannot modify a system item.', this);
        }
    }
}

export interface GameComponentItemConstructor<T extends GameComponentItem> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly SYSTEM_INSTANCE: T;

    /**
     * Constructor signature for game component items.
     */
    new(...args: Array<any>): T;
}