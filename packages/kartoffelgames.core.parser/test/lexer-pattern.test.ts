import { expect } from '@kartoffelgames/core-test';
import { LexerPattern, type LexerPatternConstructorParameter, type LexerPatternType } from '../source/lexer/lexer-pattern.ts';
import { Lexer } from '../source/lexer/lexer.ts';

const gDefaultPattern: LexerPatternConstructorParameter<string, LexerPatternType> = {
    type: 'single',
    metadata: [],
    dependencyFetch: null,
    pattern: { single: { regex: /const/, types: { token: 'modifier' }, validator: null } },
};

const gSplitPattern = (pDependencyFetch: LexerPatternConstructorParameter<string, LexerPatternType>['dependencyFetch']): LexerPatternConstructorParameter<string, LexerPatternType> => {
    return {
        type: 'split',
        metadata: [],
        pattern: {
            start: { regex: /start/, types: { token: 'modifier' }, validator: null },
            end: { regex: /end/, types: { token: 'identifier' }, validator: null },
            innerType: null
        },
        dependencyFetch: pDependencyFetch,
    };
};

// Character code of the first character of the default pattern "const".
const gDefaultPatternCharCode: number = 'c'.charCodeAt(0);

Deno.test('LexerPattern.lexer', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gDefaultPattern);

        // Evaluation
        expect(lPattern.lexer).toBe(lLexer);
    });
});

Deno.test('LexerPattern.pattern', async (pContext) => {
    await pContext.step('Split pattern', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternDefinition = {
            start: { regex: /start/, types: { token: 'modifier' }, validator: null },
            end: { regex: /end/, types: { token: 'identifier' }, validator: null },
            innerType: 'myType'
        };
        const lPatternParam: LexerPatternConstructorParameter<string, 'split'> = {
            type: 'split',
            metadata: [],
            pattern: lPatternDefinition,
            dependencyFetch: () => { },
        };
        const lPattern = new LexerPattern<string, 'split'>(lLexer, lPatternParam);

        // Evaluation
        expect(lPattern.pattern.start.regex.source).toEqual(`^(?<token>${lPatternDefinition.start.regex.source})`);
        expect(lPattern.pattern.start.types).toEqual(lPatternDefinition.start.types);
        expect(lPattern.pattern.start.validator).toEqual(lPatternDefinition.start.validator);
        expect(lPattern.pattern.end.regex.source).toEqual(`^(?<token>${lPatternDefinition.end.regex.source})`);
        expect(lPattern.pattern.end.types).toEqual(lPatternDefinition.end.types);
        expect(lPattern.pattern.end.validator).toEqual(lPatternDefinition.end.validator);
        expect(lPattern.pattern.innerType).toEqual(lPatternDefinition.innerType);
    });

    await pContext.step('Single pattern', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternDefinition = { single: { regex: /const/, types: { token: 'modifier' }, validator: null } };
        const lPatternParam: LexerPatternConstructorParameter<string, 'single'> = {
            type: 'single',
            metadata: [],
            pattern: lPatternDefinition,
            dependencyFetch: null,
        };
        const lPattern = new LexerPattern<string, 'single'>(lLexer, lPatternParam);

        // Evaluation
        expect(lPattern.pattern.start.regex.source).toEqual(`^(?<token>${lPatternDefinition.single.regex.source})`);
        expect(lPattern.pattern.start.types).toEqual(lPatternDefinition.single.types);
        expect(lPattern.pattern.start.validator).toEqual(lPatternDefinition.single.validator);
    });
});

Deno.test('LexerPattern.meta', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = { ...gDefaultPattern, metadata: ['meta1', 'meta2'] };
        const lPattern = new LexerPattern(lLexer, lPatternParam);

        // Evaluation
        expect(lPattern.meta).toEqual(['meta1', 'meta2']);
    });
});

Deno.test('LexerPattern.childPattern', async (pContext) => {
    await pContext.step('Without child pattern', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gDefaultPattern);

        // Process.
        lPattern.resolveDependencies();
        const lChildPattern = lPattern.childPattern.bucketOf(gDefaultPatternCharCode);

        // Evaluation
        expect(lChildPattern).toEqual([]);
    });

    await pContext.step('With child pattern added by dependency fetch', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternOne = new LexerPattern(lLexer, gDefaultPattern);
        const lPatternTwo = new LexerPattern(lLexer, gDefaultPattern);
        const lPattern = new LexerPattern(lLexer, gSplitPattern((pPattern: LexerPattern<string, LexerPatternType>) => {
            pPattern.useChildPattern(lPatternOne);
            pPattern.useChildPattern(lPatternTwo);
        }));

        // Process.
        lPattern.resolveDependencies();
        const lChildPattern = lPattern.childPattern.bucketOf(gDefaultPatternCharCode);

        // Evaluation
        expect(lChildPattern).toEqual([lPatternOne, lPatternTwo]);
    });

    await pContext.step('Child pattern not matching a character', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternOne = new LexerPattern(lLexer, gDefaultPattern);
        const lPattern = new LexerPattern(lLexer, gSplitPattern((pPattern: LexerPattern<string, LexerPatternType>) => {
            pPattern.useChildPattern(lPatternOne);
        }));

        // Process.
        lPattern.resolveDependencies();
        const lChildPattern = lPattern.childPattern.bucketOf('x'.charCodeAt(0));

        // Evaluation
        expect(lChildPattern).toEqual([]);
    });

    await pContext.step('Child pattern with different lexer', () => {
        // Setup. Pattern.
        const lPatternOne = new LexerPattern(new Lexer<string>(), gDefaultPattern);

        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gSplitPattern((pPattern: LexerPattern<string, LexerPatternType>) => {
            pPattern.useChildPattern(lPatternOne);
        }));

        // Process.
        const lFailingDependencyFetch = () => {
            lPattern.resolveDependencies();
        };

        // Evaluation
        expect(lFailingDependencyFetch).toThrow(`Can only add dependencies of the same lexer.`);
    });
});

Deno.test('LexerPattern.useChildPattern()', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternOne = new LexerPattern(lLexer, gDefaultPattern);
        const lPatternTwo = new LexerPattern(lLexer, gDefaultPattern);
        const lMainPattern = new LexerPattern(lLexer, gSplitPattern(() => { }));

        // Process.
        lMainPattern.useChildPattern(lPatternOne);
        lMainPattern.useChildPattern(lPatternTwo);

        // Evaluation
        expect(lMainPattern.childPattern.bucketOf(gDefaultPatternCharCode)).toEqual([lPatternOne, lPatternTwo]);
    });

    await pContext.step('Throws exception on pattern of a different lexer', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lForeignPattern = new LexerPattern(new Lexer<string>(), gDefaultPattern);
        const lMainPattern = new LexerPattern(lLexer, gSplitPattern(() => { }));

        // Process.
        const lFailingUseChildPattern = () => {
            lMainPattern.useChildPattern(lForeignPattern);
        };

        // Evaluation
        expect(lFailingUseChildPattern).toThrow(`Can only add dependencies of the same lexer.`);
    });
});

Deno.test('LexerPattern.isSplit()', async (pContext) => {
    await pContext.step('Single pattern', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gDefaultPattern);

        // Evaluation
        expect(lPattern.isSplit()).toBe(false);
    });

    await pContext.step('Split pattern', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gSplitPattern(() => { }));

        // Evaluation
        expect(lPattern.isSplit()).toBe(true);
    });
});

Deno.test('LexerPattern.resolveDependencies()', async (pContext) => {
    await pContext.step('Calls dependency fetch', () => {
        // Setup. Flags.
        let lDependencyFetchCalled: boolean = false;

        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gSplitPattern(() => {
            lDependencyFetchCalled = true;
        }));

        // Process
        lPattern.resolveDependencies();

        // Evaluation
        expect(lDependencyFetchCalled).toBeTruthy();
    });

    await pContext.step('Calls dependency fetch only once', () => {
        // Setup. Flags.
        let lDependencyFetchCallCount: number = 0;

        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gSplitPattern(() => {
            lDependencyFetchCallCount++;
        }));

        // Process
        lPattern.resolveDependencies();
        lPattern.resolveDependencies();

        // Evaluation
        expect(lDependencyFetchCallCount).toBe(1);
    });

    await pContext.step('Auto resolve without a dependency fetch', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gDefaultPattern);

        // Process.
        const lResolveDependencies = () => {
            lPattern.resolveDependencies();
        };

        // Evaluation
        expect(lResolveDependencies).not.toThrow();
    });
});

Deno.test('LexerPattern.constructor()', async (pContext) => {
    await pContext.step('Throws exception split pattern without dependency fetch', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = gSplitPattern(null);

        // Evaluation
        expect(() => new LexerPattern(lLexer, lPatternParam)).toThrow('Split token with a start and end token, need inner token definitions');
    });

    await pContext.step('Throws exception single pattern with dependency fetch', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
            type: 'single',
            metadata: [],
            dependencyFetch: () => { },
            pattern: { single: { regex: /const/, types: { token: 'modifier' }, validator: null } }
        };

        // Evaluation
        expect(() => new LexerPattern(lLexer, lPatternParam)).toThrow('Pattern does not allow inner token pattern.');
    });

    await pContext.step('Throws exception split pattern type with wrong form', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
            type: 'split',
            metadata: [],
            dependencyFetch: () => { },
            pattern: { single: { regex: /const/, types: { token: 'modifier' }, validator: null } }
        };

        // Evaluation
        expect(() => new LexerPattern(lLexer, lPatternParam)).toThrow(`Can't use split pattern type with single pattern definition.`);
    });

    await pContext.step('Throws exception single pattern type with wrong form', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
            type: 'single',
            metadata: [],
            dependencyFetch: null,
            pattern: {
                start: { regex: /start/, types: { token: 'modifier' }, validator: null },
                end: { regex: /end/, types: { token: 'identifier' }, validator: null },
                innerType: null
            }
        };

        // Evaluation
        expect(() => new LexerPattern(lLexer, lPatternParam)).toThrow(`Can't use single pattern type with split pattern definition.`);
    });
});
