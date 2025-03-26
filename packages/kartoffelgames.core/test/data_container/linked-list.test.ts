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

    describe('Property: root', () => {
        it('-- should return null when list is empty', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();

            // Evaluation.
            expect(lList.root).toBeNull();
        });

        it('-- should return the last value', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();
            lList.push('Value1');
            lList.push('Value2');

            // Evaluation.
            expect(lList.root).toBe('Value1');
        });
    });

    describe('Property: done', () => {
        it('-- should return false when there are more items', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();
            lList.push('Value1');

            // Evaluation.
            expect(lList.done).toBeFalsy();
        });

        it('-- should return true when there are no more items', () => {
            // Setup.
            const lList: LinkedList<string> = new LinkedList<string>();
            lList.push('Value1');

            // Process.
            lList.moveEnd();

            // Evaluation.
            expect(lList.done).toBeTruthy();
        });
    })

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
            lList.push('Value3');

            // Evaluation.
            expect(lList.current).toBe('Value1');
            lList.next();
            expect(lList.current).toBe('Value2');
            lList.next();
            expect(lList.current).toBe('Value3');
        });

        it('-- Should append an new item after list was done', () => {
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
            expect(lList.current).toBeNull();
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
            lList.moveEnd();

            // Evaluation.
            expect(lList.current).toBeNull();

            // Process.
            lList.moveFirst();

            // Evaluation.
            expect(lList.current).toBe('Value1');
        });
    });

    describe('Method: sliceReference', () => {
        it('-- should create a new list from the current item', () => {
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

        it('-- should append current items not previous', () => {
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

        it('-- should append new items to the original list', () => {
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

    describe('Method: sync', () => {
        it('-- should create a new list from the current item', () => {
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
});