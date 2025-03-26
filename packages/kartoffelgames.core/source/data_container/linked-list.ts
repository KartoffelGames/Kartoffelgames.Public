export class LinkedList<T> {
    private mCurrent: LinkedListChain<T>;
    private mHeadElement: LinkedListHeadElement<T>;
    private mRoot: LinkedListChain<T>;


    /**
     * Get current item.
     */
    public get current(): T | null {
        // If current is null revert to the last item.
        if (!this.mCurrent.item) {
            return null;
        }

        return this.mCurrent.item.value;
    }

    /**
     * Get if the list is done
     */
    public get done(): boolean {
        return !this.mCurrent.next;
    }

    /**
     * Get the root item.
     */
    public get root(): T | null {
        if (!this.mRoot.item) {
            return null;
        }

        return this.mRoot.item.value;
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Set root.
        this.mRoot = {
            next: null,
            item: null,
        };

        // List is empty, so it is also the root.
        this.mHeadElement = {
            head: this.mRoot
        };
        this.mCurrent = this.mRoot;
    }

    /**
     * Move to the last item in the linked list.
     */
    public moveEnd(): void {
        this.mCurrent = this.mHeadElement.head;
    }

    /**
     * Move to the previous item in the linked list.
     */
    public moveFirst(): void {
        this.mCurrent = this.mRoot;
    }

    /**
     * Move to the next item in the linked list.
     * 
     * @returns false when the end of the list is reached.
     */
    public next(): boolean {
        // If current is null revert to the last item.
        if (!this.mCurrent.next) {
            return false;
        }

        // Move to next item.
        this.mCurrent = this.mCurrent.next;

        // Return if there is an item.
        return !!this.mCurrent.item;
    }

    /**
     * Add a new item to the end.
     * 
     * @param pValue The value to add.
     */
    public push(pValue: T): void {
        const lNewChain: LinkedListChain<T> = {
            next: null,
            item: null,
        };

        // Set value to current head.
        this.mHeadElement.head.item = {
            value: pValue
        };

        // Chain the new item.
        this.mHeadElement.head.next = lNewChain;

        // Set the new head.
        this.mHeadElement.head = lNewChain;
    }

    /**
     * Creates a new linked list starting from the current node.
     * The list is still linked to the original list.
     * Appending to the original list will expand the new list and vice versa.
     *
     * @returns {LinkedList<T>} A new linked list instance starting from the current node.
     */
    public sliceReference(): LinkedList<T> {
        const lNewList: LinkedList<T> = new LinkedList<T>();
        lNewList.mRoot = lNewList.mCurrent = this.mCurrent;

        // Both lists are linked to the same head element.
        lNewList.mHeadElement = this.mHeadElement;

        return lNewList;
    }

    /**
     * Sync the list with another list by setting 
     * the current element to the current element of the other list.
     * 
     * @param pList The list to sync with.
     */
    public sync(pList: LinkedList<T>): void {
        this.mCurrent = pList.mCurrent;
    }
}

type LinkedListHeadElement<T> = {
    head: LinkedListChain<T>;
};

type LinkedListChain<T> = {
    next: LinkedListChain<T> | null;
    item: LinkedListItem<T> | null;
};

type LinkedListItem<T> = {
    value: T;
};