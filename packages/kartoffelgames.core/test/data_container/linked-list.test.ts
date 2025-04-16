import { expect } from '@kartoffelgames/core-test';
import { LinkedList } from '../../source/data_container/linked-list.ts';

Deno.test('LinkedList.current', async (pContext) => {
    await pContext.step('should return null when list is empty', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();

        // Evaluation.
        expect(lList.current).toBeNull();
    });

    await pContext.step('should return the current value', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');

        // Evaluation.
        expect(lList.current).toBe('Value1');
    });
});

Deno.test('LinkedList.root', async (pContext) => {
    await pContext.step('should return null when list is empty', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();

        // Evaluation.
        expect(lList.root).toBeNull();
    });

    await pContext.step('should return the last value', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.push('Value2');

        // Evaluation.
        expect(lList.root).toBe('Value1');
    });
});

Deno.test('LinkedList.done', async (pContext) => {
    await pContext.step('should return false when there are more items', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');

        // Evaluation.
        expect(lList.done).toBeFalsy();
    });

    await pContext.step('should return true when there are no more items', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');

        // Process.
        lList.moveEnd();

        // Evaluation.
        expect(lList.done).toBeTruthy();
    });
});

Deno.test('LinkedList.push()', async (pContext) => {
    await pContext.step('should add a value to the list', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();

        // Process.
        lList.push('Value1');

        // Evaluation.
        expect(lList.current).toBe('Value1');
    });

    await pContext.step('should add multiple values to the list', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();

        // Process.
        lList.push('Value1');
        lList.push('Value2');
        lList.push('Value3');

        // Evaluation.
        expect(lList.current).toBe('Value1');
        lList.next();
        expect(lList.current).toBe('Value2');
        lList.next();
        expect(lList.current).toBe('Value3');
    });

    await pContext.step('should append a new item after list was done', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.moveFirst();
        lList.next();

        // Evaluation.
        expect(lList.done).toBeTruthy();

        // Process.
        lList.push('Value2');

        // Evaluation.
        expect(lList.current).toBe('Value2');
    });
});

Deno.test('LinkedList.next()', async (pContext) => {
    await pContext.step('should move to the next item', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.push('Value2');
        lList.moveFirst();

        // Evaluation.
        expect(lList.current).toBe('Value1');

        // Process.
        const lHasNext: boolean = lList.next();

        // Evaluation.
        expect(lHasNext).toBeTruthy();
        expect(lList.current).toBe('Value2');
    });

    await pContext.step('should return false when at the end of the list', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.push('Value2');
        lList.moveFirst();
        lList.next();

        // Process.
        const lHasNext: boolean = lList.next();

        // Evaluation.
        expect(lHasNext).toBeFalsy();
        expect(lList.current).toBeNull();
    });

    await pContext.step('should return false when current is null', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();

        // Process.
        const lHasNext: boolean = lList.next();

        // Evaluation.
        expect(lHasNext).toBeFalsy();
        expect(lList.current).toBeNull();
    });
});

Deno.test('LinkedList.moveFirst()', async (pContext) => {
    await pContext.step('should move to the first item', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.push('Value2');
        lList.moveEnd();

        // Evaluation.
        expect(lList.current).toBeNull();

        // Process.
        lList.moveFirst();

        // Evaluation.
        expect(lList.current).toBe('Value1');
    });
});

Deno.test('LinkedList.sliceReference()', async (pContext) => {
    await pContext.step('should create a new list from the current item', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.push('Value2');
        lList.push('Value3');
        lList.moveFirst();

        // Process.
        const lNewList: LinkedList<string> = lList.sliceReference();

        // Evaluation.
        expect(lNewList.current).toBe('Value1');
        lNewList.next();
        expect(lNewList.current).toBe('Value2');
        lNewList.next();
        expect(lNewList.current).toBe('Value3');
        lNewList.next();
        expect(lNewList.current).toBeNull();
    });

    await pContext.step('should append current items not previous', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.push('Value2');
        lList.push('Value3');
        lList.moveFirst();
        lList.next();

        // Process.
        const lNewList: LinkedList<string> = lList.sliceReference();
        lNewList.moveFirst();

        // Evaluation.
        expect(lNewList.current).toBe('Value2');
        lNewList.next();
        expect(lNewList.current).toBe('Value3');
        lNewList.next();
        expect(lNewList.current).toBeNull();
    });

    await pContext.step('should append new items to the original list', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.push('Value2');
        lList.push('Value3');
        lList.moveFirst();
        lList.next();

        // Process.
        const lNewList: LinkedList<string> = lList.sliceReference();
        lNewList.push('Value4');

        // Evaluation.
        lList.moveFirst();
        expect(lList.current).toBe('Value1');
        lList.next();
        expect(lList.current).toBe('Value2');
        lList.next();
        expect(lList.current).toBe('Value3');
        lList.next();
        expect(lList.current).toBe('Value4');
    });
});

Deno.test('LinkedList.sync()', async (pContext) => {
    await pContext.step('should create a new list from the current item', () => {
        // Setup.
        const lList: LinkedList<string> = new LinkedList<string>();
        lList.push('Value1');
        lList.push('Value2');
        lList.push('Value3');
        lList.moveFirst();

        // Setup. Create slice.
        const lNewList: LinkedList<string> = lList.sliceReference();

        // Setup. Move child list.
        lNewList.next();
        lNewList.next();

        // Process.
        lList.sync(lNewList);

        // Evaluation.
        expect(lList.current).toBe(lNewList.current);
    });
});