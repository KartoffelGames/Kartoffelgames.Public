import { ICloneable } from '../interface/i-cloneable';

/**
 * Simple and fast stack implementation based on references.
 * 
 * @public
 */
export class Stack<T> implements ICloneable<Stack<T>> {
    private mTopItem: StackItem<T> | null;

    /**
     * Current top item of stack.
     * Returns undefined when no item is stacked.
     */
    public get top(): T | undefined {
        // Undefined when no item is stacked.
        if (!this.mTopItem) {
            return undefined;
        }

        return this.mTopItem.value;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTopItem = null;
    }

    /**
     * Clones the references of all stack items into a new one.
     * Does only shallow copy.
     * 
     * @returns The cloned stack.
     */
    public clone(): Stack<T> {
        const lClonedStack: Stack<T> = new Stack<T>();

        // Only thing that needs to be cloned is the current reference.
        lClonedStack.mTopItem = this.mTopItem;

        return lClonedStack;
    }

    /**
     * Clear stack and get all stacked items in stack order.
     * 
     * @returns All stacked values in top to down order.
     * 
     * @example Flush Stack
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     * 
     * // Flush all items. Clears stack.
     * const stackValues = stack.flush(); // => [3, 2, 1];
     * console.log(stack.top); // => undefined
     * ``` 
     */
    public flush(): Array<T> {
        const lValueList: Array<T> = new Array<T>();

        // Pop items as long as there are stack items.
        // Don't check poped value as next indicator as it can contain undefined.
        while (this.mTopItem) {
            lValueList.push(this.pop()!);
        }

        return lValueList;
    }

    /**
     * Removes the current top item of stack.
     * When no item is stacked nothing happends and undefined is returned.
     * 
     * @returns Current top item. When no item was stacked, undefined is returned instead.
     * 
     * @example Pop current top item.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     * 
     * // Check current stacked top item before and after poping.
     * console.log(stack.top); // => 3
     * const stackValues = stack.pop(); // => 3;
     * console.log(stack.top); // => 2
     * ``` 
     */
    public pop(): T | undefined {
        // Undefined when no item is stacked.
        if (!this.mTopItem) {
            return undefined;
        }

        // Buffer current top value.
        const lCurrentTopValue: T = this.mTopItem.value;

        // Replace current top item with previous stacked.
        this.mTopItem = this.mTopItem.previous;

        return lCurrentTopValue;
    }

    /**
     * Push new value as top item of stack. Replaces the current top item.
     * @param pValue - Next value placed on top.
     * 
     * @example Push next top item.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);

     * 
     * // Check current stacked top item before and after pushing.
     * console.log(stack.top); // => 1
     * stack.push(2);
     * console.log(stack.top); // => 2
     * ``` 
     */
    public push(pValue: T): void {
        // Create new stack item with the current top item as reference. 
        const lNextItem: StackItem<T> = {
            previous: this.mTopItem,
            value: pValue
        };

        // Replace current top item with next.
        this.mTopItem = lNextItem;
    }

    /**
     * Converts this stack into an array.
     * The first item in the array is the last item pushed into the stack.
     * 
     * @returns The current stack as array.
     * 
     * @example Stack into array.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     * 
     * // Stack to array.
     * console.log(stack.toArray()); // => [3, 2, 1]
     * ``` 
     */
    public toArray(): Array<T> {
        const lArray: Array<T> = new Array<T>();

        // Convert stack into Array.
        let lStackItem: StackItem<T> | null = this.mTopItem;
        while (lStackItem) {
            // Add current stack item value.
            lArray.push(lStackItem.value);

            // Move cursor.
            lStackItem = lStackItem.previous;
        }

        // Array is in wrong order.
        return lArray;
    }
}

type StackItem<T> = {
    previous: StackItem<T> | null;
    value: T;
};