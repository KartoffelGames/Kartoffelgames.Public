import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { LinkedList } from '../../source/data_container/linked-list.ts';

describe('LinkedList', () => {
    describe('Property: current', () => {
        it('-- should return null when list is empty', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();

            // Evaluation.
            expect(lList.current).toBeNull();
        });

        it('-- should return the current value', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();
            lList.push('Value1');

            // Evaluation.
            expect(lList.current).toBe('Value1');
        });
    });

    describe('Method: push', () => {
        it('-- should add a value to the list', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();

            // Process.
            lList.push('Value1');

            // Evaluation.
            expect(lList.current).toBe('Value1');
        });

        it('-- should add multiple values to the list', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();

            // Process.
            lList.push('Value1');
            lList.push('Value2');

            // Evaluation.
            expect(lList.current).toBe('Value2');

            // Process.
            lList.push('Value3');

            // Evaluation.
            expect(lList.current).toBe('Value3');
        });
    });

    describe('Method: next', () => {
        it('-- should move to the next item', () => {
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

        it('-- should return false when at the end of the list', () => {
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
            expect(lList.current).toBe('Value2');
        });

        it('-- should return false when current is null', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();

            // Process.
            const lHasNext: boolean = lList.next();

            // Evaluation.
            expect(lHasNext).toBeFalsy();
            expect(lList.current).toBeNull();
        });
    });

    describe('Method: moveFirst', () => {
        it('-- should move to the first item', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();
            lList.push('Value1');
            lList.push('Value2');

            // Evaluation.
            expect(lList.current).toBe('Value2');

            // Process.
            lList.moveFirst();

            // Evaluation.
            expect(lList.current).toBe('Value1');
        });
    });

    describe('Method: append', () => {
        it('-- should set root and current to the first item of the other list when root is not set', () => {
            // Setup.
            const lList1: LinkedList<string> = new LinkedList<string>();
            const lList2: LinkedList<string> = new LinkedList<string>();
            lList2.push('Value1');

            // Process.
            lList1.append(lList2);

            // Evaluation.
            expect(lList1.current).toBe('Value1');
        });

        it('-- should set current to the current item of the other list when current is not set', () => {
            // Setup.
            const lList1: LinkedList<string> = new LinkedList<string>();
            lList1.push('Value1');
            const lList2: LinkedList<string> = new LinkedList<string>();
            lList2.push('Value2');
            lList2.moveFirst();

            // Process.
            lList1.append(lList2);

            // Evaluation.
            expect(lList1.current).toBe('Value1');
            lList1.next();
            expect(lList1.current).toBe('Value2');
        });

        it('-- should append the other list to the current when host list is empty', () => {
            // Setup.
            const lList1: LinkedList<string> = new LinkedList<string>();
            const lList2: LinkedList<string> = new LinkedList<string>();
            lList2.push('Value1');
            lList2.push('Value2');
            lList2.moveFirst();

            // Process.
            lList1.append(lList2);

            // Evaluation.
            expect(lList1.current).toBe('Value1');
            lList1.next();
            expect(lList1.current).toBe('Value2');
        });
    });

    describe('Method: newFromCurrent', () => {
        it('-- should create a new list from the current item', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();
            lList.push('Value1');
            lList.push('Value2');
            lList.push('Value3');
            lList.moveFirst();

            // Process.
            const lNewList: LinkedList<string> = lList.newFromCurrent();

            // Evaluation.
            expect(lNewList.current).toBe('Value1');
            lNewList.next();
            expect(lNewList.current).toBe('Value2');
            lNewList.next();
            expect(lNewList.current).toBe('Value3');
        });

        it('-- should append current items not previous', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();
            lList.push('Value1');
            lList.push('Value2');
            lList.push('Value3');
            lList.moveFirst();
            lList.next();

            // Process.
            const lNewList: LinkedList<string> = lList.newFromCurrent();
            lNewList.moveFirst();

            // Evaluation.
            expect(lNewList.current).toBe('Value2');
            lNewList.next();
            expect(lNewList.current).toBe('Value3');
        });
    });
});