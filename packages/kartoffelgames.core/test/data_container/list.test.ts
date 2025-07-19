import { expect } from '@kartoffelgames/core-test';
import { List } from '../../source/data_container/list.ts';

Deno.test('List.newListWith()', async (pContext) => {
    await pContext.step('should create a new list with provided values', () => {
        // Setup
        const lArray: Array<string> = ['Value1', 'Value2', 'Value3'];

        // Process.
        const lList: List<string> = List.newListWith(...lArray);

        // Evaluation.
        expect(lList).toBeDeepEqual(lArray);
    });
});

Deno.test('List.equals()', async (pContext) => {
    await pContext.step('should compare different lists', () => {
        // Setup.
        const lList1: List<string> = List.newListWith('Value1', 'Value2');
        const lList2: List<string> = List.newListWith('Value1', 'Value2');
        const lList3: List<string> = List.newListWith('Value2', 'Value1');

        // Process.
        const lList1IsList2: boolean = lList1.equals(lList2);
        const lList1IsList3: boolean = lList1.equals(lList3);

        // Evaluation.
        expect(lList1IsList2).toBeTruthy();
        expect(lList1IsList3).toBeFalsy();
    });

    await pContext.step('should compare the same list', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2');

        // Process.
        const lListIsSame: boolean = lList.equals(lList);

        // Evaluation.
        expect(lListIsSame).toBeTruthy();
    });

    await pContext.step('should compare with null', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2');

        // Process.
        const lListIsSame: boolean = lList.equals(<any>null);

        // Evaluation.
        expect(lListIsSame).toBeFalsy();
    });

    await pContext.step('should compare with undefined', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2');

        // Process.
        const lListIsSame: boolean = lList.equals(<any>undefined);

        // Evaluation.
        expect(lListIsSame).toBeFalsy();
    });

    await pContext.step('should compare lists with different lengths', () => {
        // Setup.
        const lList1: List<string> = List.newListWith('Value1', 'Value2');
        const lList2: List<string> = List.newListWith('Value1', 'Value2', 'Value3');

        // Process.
        const lList1IsList2: boolean = lList1.equals(lList2);

        // Evaluation.
        expect(lList1IsList2).toBeFalsy();
    });
});

Deno.test('List.clear()', async (pContext) => {
    await pContext.step('should clear the list', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value');

        // Process.
        lList.clear();

        // Evaluation.
        expect(lList).toHaveLength(0);
    });
});

Deno.test('List.clone()', async (pContext) => {
    await pContext.step('should clone the list', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2');

        // Process.
        const lListClone: List<string> = lList.clone();

        // Evaluation.
        expect(lListClone).toBeDeepEqual(lList);
        expect(lListClone).not.toBe(lList);
    });
});

Deno.test('List.distinct()', async (pContext) => {
    await pContext.step('should return a distinct list', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2', 'Value1');

        // Process.
        const lDistinctList: List<string> = lList.distinct();

        // Evaluation.
        expect(lDistinctList).toBeDeepEqual(['Value1', 'Value2']);
    });
});

Deno.test('List.remove()', async (pContext) => {
    await pContext.step('should remove an existing item', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2', 'Value1');

        // Process.
        const lRemovedValue: string | undefined = lList.remove('Value1');

        // Evaluation.
        expect(lRemovedValue).toBe('Value1');
        expect(lList).toBeDeepEqual(['Value2', 'Value1']);
    });

    await pContext.step('should not remove a non-existing item', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1');

        // Process.
        const lRemovedValue: string | undefined = lList.remove('Value2');

        // Evaluation.
        expect(lRemovedValue).toBeUndefined();
        expect(lList).toBeDeepEqual(['Value1']);
    });
});

Deno.test('List.replace()', async (pContext) => {
    await pContext.step('should replace an existing item', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2', 'Value1');

        // Process.
        const lRemovedValue: string | undefined = lList.replace('Value1', 'Value3');

        // Evaluation.
        expect(lRemovedValue).toBe('Value1');
        expect(lList).toBeDeepEqual(['Value3', 'Value2', 'Value1']);
    });

    await pContext.step('should not replace a non-existing item', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1');

        // Process.
        const lRemovedValue: string | undefined = lList.replace('Value2', 'Value3');

        // Evaluation.
        expect(lRemovedValue).toBeUndefined();
        expect(lList).toBeDeepEqual(['Value1']);
    });
});

Deno.test('List.toString()', async (pContext) => {
    await pContext.step('should convert the list to a string', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2');

        // Process.
        const lString: string = lList.toString();

        // Evaluation.
        expect(lString).toBe('[Value1, Value2]');
    });
});