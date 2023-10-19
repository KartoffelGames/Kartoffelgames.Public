import { expect } from 'chai';
import { Stack } from '../../../source/data_container/stack';

describe('Stack', () => {
    describe('Property: top', () => {
        it('-- Single value stack', () => {
            // Setup.
            const lValue: string = 'test value';
            const lStack: Stack<string> = new Stack<string>();
            lStack.push(lValue);

            // Process.
            const lTopValue: string | undefined = lStack.top;

            // Evaluation.
            expect(lTopValue).to.equals(lValue);
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
            expect(lTopValue).to.equals(lValue);
        });

        it('-- Empty stack', () => {
            // Setup.
            const lStack: Stack<string> = new Stack<string>();

            // Process.
            const lTopValue: string | undefined = lStack.top;

            // Evaluation.
            expect(lTopValue).to.be.undefined;
        });
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
            expect(lFlushedValues).to.has.lengthOf(0);
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
        expect(lStack.top).to.equals(lValue);
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
            expect(lPoppedValue).to.equal(lValue);
            expect(lStack.top).to.be.undefined;
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
            expect(lPoppedValue).to.equal(lValueTwo);
            expect(lStack.top).to.equal(lValueOne);
        });

        it('-- Without values', () => {
            // Setup.
            const lStack: Stack<number> = new Stack<number>();

            // Process.
            const lPoppedValue: number | undefined = lStack.pop();

            // Evaluation.
            expect(lPoppedValue).to.be.undefined;
            expect(lStack.top).to.be.undefined;
        });
    });
});