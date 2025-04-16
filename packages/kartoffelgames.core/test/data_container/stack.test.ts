import { expect } from '@kartoffelgames/core-test';
import { Stack } from '../../source/data_container/stack.ts';

Deno.test('Stack.size', async (pContext) => {
    await pContext.step('Single value stack', () => {
        // Setup.
        const lStack: Stack<string> = new Stack<string>();
        lStack.push('1');

        // Process.
        const lSize: number = lStack.size;

        // Evaluation.
        expect(lSize).toBe(1);
    });

    await pContext.step('Multi value stack', () => {
        // Setup.
        const lStack: Stack<string> = new Stack<string>();
        lStack.push('1');
        lStack.push('2');

        // Process.
        const lSize: number = lStack.size;

        // Evaluation.
        expect(lSize).toBe(2);
    });

    await pContext.step('Cloned stack', () => {
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

    await pContext.step('Popped stack item', () => {
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

Deno.test('Stack.top', async (pContext) => {
    await pContext.step('Single value stack', () => {
        // Setup.
        const lValue: string = 'test value';
        const lStack: Stack<string> = new Stack<string>();
        lStack.push(lValue);

        // Process.
        const lTopValue: string | undefined = lStack.top;

        // Evaluation.
        expect(lTopValue).toBe(lValue);
    });

    await pContext.step('Multi value stack', () => {
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

    await pContext.step('Empty stack', () => {
        // Setup.
        const lStack: Stack<string> = new Stack<string>();

        // Process.
        const lTopValue: string | undefined = lStack.top;

        // Evaluation.
        expect(lTopValue).toBeUndefined();
    });
});

Deno.test('Stack.entries()', async (pContext) => {
    await pContext.step('should return all entries in reverse order', () => {
        // Setup.
        const lValues: Array<number> = [12, 14, 16];
        const lStack: Stack<number> = new Stack<number>();
        for (const lItem of lValues) {
            lStack.push(lItem);
        }

        // Process.
        const lAsArray: Array<number> = [...lStack.entries()];

        // Evaluation.
        expect(lValues.reverse()).toBeDeepEqual(lAsArray);
    });
});

Deno.test('Stack.flush()', async (pContext) => {
    await pContext.step('With values', () => {
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
        expect(lFlushedValues).toBeDeepEqual(lValueList.reverse());
    });

    await pContext.step('No values', () => {
        // Setup.
        const lStack: Stack<number> = new Stack<number>();

        // Process.
        const lFlushedValues = lStack.flush();

        // Evaluation.
        expect(lFlushedValues).toHaveLength(0);
    });

    await pContext.step('Undefined values', () => {
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
        expect(lFlushedValues).toBeDeepEqual(lValueList.reverse());
    });
});

Deno.test('Stack.push()', async (pContext) => {
    await pContext.step('should push a value onto the stack', () => {
        // Setup.
        const lValue: number = 12;
        const lStack: Stack<number> = new Stack<number>();

        // Process.
        lStack.push(lValue);

        // Evaluation.
        expect(lStack.top).toBe(lValue);
    });
});

Deno.test('Stack.toArray()', async (pContext) => {
    await pContext.step('should convert the stack to an array', () => {
        // Setup.
        const lValues: Array<number> = [12, 14, 16];
        const lStack: Stack<number> = new Stack<number>();
        for (const lItem of lValues) {
            lStack.push(lItem);
        }

        // Process.
        const lAsArray: Array<number> = lStack.toArray();

        // Evaluation.
        expect(lValues.reverse()).toBeDeepEqual(lAsArray);
    });
});

Deno.test('Stack.clone()', async (pContext) => {
    await pContext.step('should clone the stack', () => {
        // Setup.
        const lValues: Array<number> = [12, 14, 16];
        const lStack: Stack<number> = new Stack<number>();
        for (const lItem of lValues) {
            lStack.push(lItem);
        }

        // Process.
        const lClone: Stack<number> = lStack.clone();

        // Evaluation.
        expect(lStack.toArray()).toBeDeepEqual(lClone.toArray());
    });
});

Deno.test('Stack.pop()', async (pContext) => {
    await pContext.step('Single value', () => {
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

    await pContext.step('Multi value', () => {
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

    await pContext.step('Without values', () => {
        // Setup.
        const lStack: Stack<number> = new Stack<number>();

        // Process.
        const lPoppedValue: number | undefined = lStack.pop();

        // Evaluation.
        expect(lPoppedValue).toBeUndefined();
        expect(lStack.top).toBeUndefined();
    });
});