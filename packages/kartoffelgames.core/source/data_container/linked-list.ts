export class LinkedList<T> {
    private mRoot: LinkedListItem<T> | null;
    private mCurrent: LinkedListItem<T> | null;

    /**
     * Get current item.
     */
    public get current(): T | null {
        if (!this.mCurrent) {
            return null;
        }

        return this.mCurrent.value;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mRoot = null;
        this.mCurrent = null;
    }

    /**
     * Append all remaining items from another linked list after the current item.
     * All items after the current item will be lost.
     * 
     * @param pList 
     */
    public append(pList: LinkedList<T>): void {
        // If root is not set, set root and current to the first item of the other list.
        if (!this.mRoot) {
            this.mRoot = pList.mRoot;
            this.mCurrent = pList.mRoot;
            return;
        }

        // Append the other list to the current item.
        this.mCurrent!.next = pList.mCurrent;
    }

    /**
     * Add a new item after the current item.
     * 
     * @param pValue The value to add.
     */
    public push(pValue: T): void {
        const lNewItem: LinkedListItem<T> = {
            next: null,
            value: pValue,
        };

        // If root is not set, set root and current to new item.
        if (!this.mRoot) {
            this.mRoot = lNewItem;
            this.mCurrent = lNewItem;
            return;
        }

        // Push that little boy between the current and the next.
        lNewItem.next = this.mCurrent!.next;
        this.mCurrent!.next = lNewItem;

        // Move to the new item.
        this.mCurrent = lNewItem;
    }

    /**
     * Creates a new linked list starting from the current node.
     *
     * @returns {LinkedList<T>} A new linked list instance starting from the current node.
     */
    public newFromCurrent(): LinkedList<T> {
        const lNewList = new LinkedList<T>();
        lNewList.mRoot = this.mCurrent;
        lNewList.moveFirst();

        return lNewList;
    }

    /**
     * Move to the next item in the linked list.
     * 
     * @returns false when the end of the list is reached.
     */
    public next(): boolean {
        // If current is not set, return true.
        if (!this.mCurrent) {
            return false;
        }

        // If next is not set, return true.
        if (!this.mCurrent.next) {
            return false;
        }

        // Move to next item.
        this.mCurrent = this.mCurrent.next;

        return true;
    }

    /**
     * Move to the previous item in the linked list.
     */
    public moveFirst(): void {
        this.mCurrent = this.mRoot;
    }
}

type LinkedListItem<T> = {
    next: LinkedListItem<T> | null;
    value: T;
};