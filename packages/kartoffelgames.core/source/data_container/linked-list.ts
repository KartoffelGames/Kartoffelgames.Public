export class LinkedList<T> {
    private mHead: LinkedListItem<T> | null;
    private mTail: LinkedListItem<T> | null;
    private mCurrent: LinkedListItem<T> | null;

    /**
     * Get the first item.
     */
    public get head(): T | null {
        if (!this.mHead) {
            return null;
        }

        return this.mHead.value;
    }

    /**
     * Get the last item.
     */
    public get tail(): T | null {
        if (!this.mTail) {
            return null;
        }

        return this.mTail.value;
    }

    /**
     * Get current item.
     */
    public get current(): T | null {
        // If current is null revert to the last item.
        if (!this.mCurrent) {
            // TODO: na also not great. How to move only one back and one forward???
            this.moveLast();
            
        }

        // When it still null, no value is set.
        if (!this.mCurrent) {
            return null;
        }

        return this.mCurrent.value;
    }

    /**
     * Get if the list is done
     */
    public get done(): boolean {
        return !this.mCurrent;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mHead = null;
        this.mCurrent = null;
        this.mTail = null;
    }

    /**
     * Append all remaining items from another linked list after the current item.
     * All items after the current item will be lost.
     * 
     * @param pList 
     */
    public append(pList: LinkedList<T>): void {
        if (!pList.mCurrent) {
            return;
        }

        // If root is not set, set root and current to the first item of the other list.
        if (!this.mHead || !this.mTail) {
            this.mHead = pList.mHead;
            this.mCurrent = pList.mHead;
            this.mTail = pList.mTail;
            return;
        }

        // When current is not set, move to the last item and append the other list.
        if (!this.mCurrent) {
            this.moveLast();
            this.append(pList);
            this.next();
            return;
        }

        // Append the other list to the current item.
        this.mCurrent.next = pList.mCurrent;
        this.mTail = pList.mTail;
    }

    /**
     * Add a new item to the end.
     * 
     * @param pValue The value to add.
     */
    public push(pValue: T): void {
        const lNewItem: LinkedListItem<T> = {
            next: null,
            value: pValue,
        };

        // If head is not set, set head, tail and current to new item.
        if (!this.mHead || !this.mTail) {
            this.mHead = lNewItem;
            this.mCurrent = lNewItem;
            this.mTail = lNewItem;
            return;
        }

        // Push that little boy after tail
        this.mTail.next = lNewItem;
        this.mTail = lNewItem;

        if (!this.mCurrent) {
            this.mCurrent = lNewItem;
        }
    }

    /**
     * Creates a new linked list starting from the current node.
     * The list is still linked to the original list.
     * Appending to the original list will expand the chaining.
     *
     * @returns {LinkedList<T>} A new linked list instance starting from the current node.
     */
    public newFromCurrent(): LinkedList<T> {
        // TODO. Thats shitty. Make it better. Make it without referencing. Name it slice and make it a feature hehehe.
        // TODO: referenceSlice? How to update expand tail only tail
        const lNewList = new LinkedList<T>();

        // Only set head and tail if current is set.
        if (this.mCurrent) {
            lNewList.mHead = this.mCurrent;
            lNewList.mTail = this.mTail;
            lNewList.moveFirst();
        }

        return lNewList;
    }

    /**
     * Move to the next item in the linked list.
     * 
     * @returns false when the end of the list is reached.
     */
    public next(): boolean {
        // If current is null revert to the last item.
        if (!this.mCurrent) {
            // TODO: Thats also shitty. How to move only one back and one forward???
            this.moveLast(); 
        }

        // When it still null, no value is set.
        if (!this.mCurrent) {
            return false;
        }

        // Move to next item.
        this.mCurrent = this.mCurrent.next;

        return !!this.mCurrent;
    }

    /**
     * Move to the previous item in the linked list.
     */
    public moveFirst(): void {
        this.mCurrent = this.mHead;
    }

    /**
     * Move to the last item in the linked list.
     */
    public moveLast(): void {
        this.mCurrent = this.mTail;
    }
}

type LinkedListItem<T> = {
    next: LinkedListItem<T> | null;
    value: T;
};