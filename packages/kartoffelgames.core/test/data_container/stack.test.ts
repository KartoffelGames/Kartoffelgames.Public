import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { Stack } from '../../source/data_container/stack.ts';

describe('Stack', () => {
    describe('Property: size', () => {
        it('-- Single value stack', () => {
            // Setup.
            const lStack: Stack<string> = new Stack<string>();
            lStack.push('1');

            // Process.
            const lSize: number = lStack.size;

            // Evaluation.
            expect(lSize).toBe(1);
        });

        it('-- Multi value stack', () => {
            // Setup.
            const lStack: Stack<string> = new Stack<string>();
            lStack.push('1');
            lStack.push('2');

            // Process.
            const lSize: number = lStack.size;

            // Evaluation.
            expect(lSize).toBe(2);
        });

        it('-- Cloned stack', () => {
            // Setup.
            const lStack: Stack<string> = new Stack<string>();
            lStack.push('1');
            lStack.push('2');

            // Setup. Clone stack.
            const lStackCopy: Stack<string> = lStack.clone();

            // Process.
            const lSize: number = lStackCopy.size;

            // Evaluation.
            expect(lSize).toBe(2);
        });

        it('-- Poped stack item', () => {
            // Setup.
            const lStack: Stack<string> = new Stack<string>();
            lStack.push('1');
            lStack.push('2');
            lStack.pop();

            // Process.
            const lSize: number = lStack.size;

            // Evaluation.
            expect(lSize).toBe(1);
        });
    });

    describe('Property: top', () => {
        it('-- Single value stack', () => {
            // Setup.
            const lValue: string = 'test value';
            const lStack: Stack<string> = new Stack<string>();
            lStack.push(lValue);

            // Process.
            const lTopValue: string | undefined = lStack.top;

            // Evaluation.
            expect(lTopValue).toBe(lValue);
        });

        it('-- Multi value stack', () => {
            // Setup.
            const lValue: string = 'test value';
            const lStack: Stack<string> = new Stack<string>();
            lStack.push('first top value');
            lStack.push(lValue);

            // Process.
            const lTopValue: string | undefined = lStack.top;

            // Evaluation.
            expect(lTopValue).toBe(lValue);
        });

        it('-- Empty stack', () => {
            // Setup.
            const lStack: Stack<string> = new Stack<string>();

            // Process.
            const lTopValue: string | undefined = lStack.top;

            // Evaluation.
            expect(lTopValue).toBeUndefined();
        });
    });

    it('Method: enties', () => {
        // Setup.
        const lValues: Array<number> = [12, 14, 16];
        const lStack: Stack<number> = new Stack<number>();
        for (const lItem of lValues) {
            lStack.push(lItem);
        }

        // Process.
        const lAsArray: Array<number> = [...lStack.entries()];

        // Evaluation.
        expect(lValues.reverse()).to.deep.equals(lAsArray);
    });

    describe('Property: flush', () => {
        it('-- With values', () => {
            // Setup.
            const lValueList: Array<number> = [1, 2, 4, 8];
            const lStack: Stack<number> = new Stack<number>();
            lStack.push(lValueList[0]);
            lStack.push(lValueList[1]);
            lStack.push(lValueList[2]);
            lStack.push(lValueList[3]);

            // Process.
            const lFlushedValues = lStack.flush();

            // Evaluation.
            expect(lFlushedValues).to.deep.equals(lValueList.reverse());
        });

        it('-- No values', () => {
            // Setup.
            const lStack: Stack<number> = new Stack<number>();

            // Process.
            const lFlushedValues = lStack.flush();

            // Evaluation.
            expect(lFlushedValues).toHaveLength(0);
        });

        it('-- Undefined values', () => {
            // Setup.
            const lValueList: Array<number> = [1, 2, <any>undefined, 8];
            const lStack: Stack<number> = new Stack<number>();
            lStack.push(lValueList[0]);
            lStack.push(lValueList[1]);
            lStack.push(lValueList[2]);
            lStack.push(lValueList[3]);

            // Process.
            const lFlushedValues = lStack.flush();

            // Evaluation.
            expect(lFlushedValues).to.deep.equals(lValueList.reverse());
        });
    });

    it('Method: push', () => {
        // Setup.
        const lValue: number = 12;
        const lStack: Stack<number> = new Stack<number>();

        // Process.
        lStack.push(lValue);

        // Evaluation.
        expect(lStack.top).toBe(lValue);
    });

    it('Method: toArray', () => {
        // Setup.
        const lValues: Array<number> = [12, 14, 16];
        const lStack: Stack<number> = new Stack<number>();
        for (const lItem of lValues) {
            lStack.push(lItem);
        }

        // Process.
        const lAsArray: Array<number> = lStack.toArray();

        // Evaluation.
        expect(lValues.reverse()).to.deep.equals(lAsArray);
    });

    it('Method: clone', () => {
        // Setup.
        const lValues: Array<number> = [12, 14, 16];
        const lStack: Stack<number> = new Stack<number>();
        for (const lItem of lValues) {
            lStack.push(lItem);
        }

        // Process.
        const lClone: Stack<number> = lStack.clone();

        // Evaluation.
        expect(lStack.toArray()).to.deep.equals(lClone.toArray());
    });

    describe('Method: pop', () => {
        it('-- Single value', () => {
            // Setup.
            const lValue: number = 34;
            const lStack: Stack<number> = new Stack<number>();
            lStack.push(lValue);

            // Process.
            const lPoppedValue: number | undefined = lStack.pop();

            // Evaluation.
            expect(lPoppedValue).toBe(lValue);
            expect(lStack.top).toBeUndefined();
        });

        it('-- Multi value', () => {
            // Setup.
            const lValueOne: number = 34;
            const lValueTwo: number = 67;
            const lStack: Stack<number> = new Stack<number>();
            lStack.push(lValueOne);
            lStack.push(lValueTwo);

            // Process.
            const lPoppedValue: number | undefined = lStack.pop();

            // Evaluation.
            expect(lPoppedValue).toBe(lValueTwo);
            expect(lStack.top).toBe(lValueOne);
        });

        it('-- Without values', () => {
            // Setup.
            const lStack: Stack<number> = new Stack<number>();

            // Process.
            const lPoppedValue: number | undefined = lStack.pop();

            // Evaluation.
            expect(lPoppedValue).toBeUndefined();
            expect(lStack.top).toBeUndefined();
        });
    });
});