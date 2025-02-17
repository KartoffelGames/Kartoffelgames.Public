import { describe, it } from '@std/testing/bdd';
import { expect } from '@kartoffelgames/core-test';
import { List } from '../../source/data_container/list.ts';

describe('List', () => {
    it('Static Method: newListWith', () => {
        // Setup
        const lArray: Array<string> = ['Value1', 'Value2', 'Value3'];

        // Process.
        const lList: List<string> = List.newListWith(...lArray);

        // Evaluation.
        expect(lList).toBeDeepEqual(lArray);
    });

    describe('Method: equals', () => {
        it('-- Compare different lists', () => {
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

        it('-- Compare same List', () => {
            // Setup.
            const lList: List<string> = List.newListWith('Value1', 'Value2');

            // Process.
            const lListIsSame: boolean = lList.equals(lList);

            // Evaluation.
            expect(lListIsSame).toBeTruthy();
        });

        it('-- Compare with null', () => {
            // Setup.
            const lList: List<string> = List.newListWith('Value1', 'Value2');

            // Process.
            const lListIsSame: boolean = lList.equals(<any>null);

            // Evaluation.
            expect(lListIsSame).toBeFalsy();
        });

        it('-- Compare with undefined', () => {
            // Setup.
            const lList: List<string> = List.newListWith('Value1', 'Value2');

            // Process.
            const lListIsSame: boolean = lList.equals(<any>undefined);

            // Evaluation.
            expect(lListIsSame).toBeFalsy();
        });

        it('-- Compare List with different length', () => {
            // Setup.
            const lList1: List<string> = List.newListWith('Value1', 'Value2');
            const lList2: List<string> = List.newListWith('Value1', 'Value2', 'Value3');

            // Process.
            const lList1IsList2: boolean = lList1.equals(lList2);

            // Evaluation.
            expect(lList1IsList2).toBeFalsy();
        });
    });

    it('Method: clear', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value');

        // Process.
        lList.clear();

        // Evaluation.
        expect(lList).toHaveLength(0);
    });

    it('Method: clone', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2');

        // Process.
        const lListClone: List<string> = lList.clone();

        // Evaluation.
        expect(lListClone).toBeDeepEqual(lList);
        expect(lListClone).not.toBe(lList);
    });

    it('Method: distinct', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2', 'Value1');

        // Process.
        const lDistinctList: List<string> = lList.distinct();

        // Evaluation.
        expect(lDistinctList).toBeDeepEqual(['Value1', 'Value2']);
    });

    describe('Method: remove', () => {
        it('-- Remove existing item', () => {
            // Setup.
            const lList: List<string> = List.newListWith('Value1', 'Value2', 'Value1');

            // Process.
            const lRemovedValue: string | undefined = lList.remove('Value1');

            // Evaluation.
            expect(lRemovedValue).toBe('Value1');
            expect(lList).toBeDeepEqual(['Value2', 'Value1']);
        });

        it('-- Remove none existing item', () => {
            // Setup.
            const lList: List<string> = List.newListWith('Value1');

            // Process.
            const lRemovedValue: string | undefined = lList.remove('Value2');

            // Evaluation.
            expect(lRemovedValue).toBeUndefined();
            expect(lList).toBeDeepEqual(['Value1']);
        });
    });

    describe('Method: replace', () => {
        it('-- Replace existant item', () => {
            // Setup.
            const lList: List<string> = List.newListWith('Value1', 'Value2', 'Value1');

            // Process.
            const lRemovedValue: string | undefined = lList.replace('Value1', 'Value3');

            // Evaluation.
            expect(lRemovedValue).toBe('Value1');
            expect(lList).toBeDeepEqual(['Value3', 'Value2', 'Value1']);
        });

        it('-- Replace none existant item', () => {
            // Setup.
            const lList: List<string> = List.newListWith('Value1');

            // Process.
            const lRemovedValue: string | undefined = lList.replace('Value2', 'Value3');

            // Evaluation.
            expect(lRemovedValue).toBeUndefined();
            expect(lList).toBeDeepEqual(['Value1']);
        });
    });

    it('Method: toString', () => {
        // Setup.
        const lList: List<string> = List.newListWith('Value1', 'Value2');

        // Process.
        const lString: string = lList.toString();

        // Evaluation.
        expect(lString).toBe('[Value1, Value2]');
    });
});