import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { LexerPattern, type LexerPatternConstructorParameter, type LexerPatternType } from '../source/lexer/lexer-pattern.ts';
import { Lexer } from '../source/lexer/lexer.ts';

const gDefaultPattern: LexerPatternConstructorParameter<string, LexerPatternType> = {
    type: 'single',
    metadata: [],
    dependencyFetch: null,
    pattern: { single: { regex: /(?<token>const)/, types: { token: 'modifier' }, validator: null } },
};

describe('LexerPattern', () => {
    describe('Property: dependenciesResolved', () => {
        it('-- Resolve with dependency fetch', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                type: 'split',
                metadata: [],
                pattern: {
                    start: { regex: /(?<token>start)/, types: { token: 'modifier' }, validator: null },
                    end: { regex: /(?<token>end)/, types: { token: 'identifier' }, validator: null },
                    innerType: null
                },
                dependencyFetch: () => { },
            };
            const lPattern = new LexerPattern(lLexer, lPatternParam);

            // Process.
            const lPreviousState: boolean = lPattern.dependenciesResolved;
            lPattern.resolveDependencies();
            const lCurrentState: boolean = lPattern.dependenciesResolved;

            // Evaluation
            expect(lPreviousState).toBe(false);
            expect(lCurrentState).toBe(true);
        });

        it('-- Auto resolve without a dependency fetch', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                type: 'single',
                metadata: [],
                dependencyFetch: null,
                pattern: { single: { regex: /(?<token>const)/, types: { token: 'modifier' }, validator: null } },
            };
            const lPattern = new LexerPattern(lLexer, lPatternParam);

            // Process.
            const lPreviousState: boolean = lPattern.dependenciesResolved;
            lPattern.resolveDependencies();
            const lCurrentState: boolean = lPattern.dependenciesResolved;

            // Evaluation
            expect(lPreviousState).toBe(true);
            expect(lCurrentState).toBe(true);
        });
    });

    it('Property: lexer', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, gDefaultPattern);

        // Evaluation
        expect(lPattern.lexer).toBe(lLexer);
    });

    describe('Property: pattern', () => {
        it('-- Split pattern', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternDefinition = {
                start: { regex: /(?<token>start)/, types: { token: 'modifier' }, validator: null },
                end: { regex: /(?<token>end)/, types: { token: 'identifier' }, validator: null },
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
            expect(lPattern.pattern.start.regex).toEqual(lPatternDefinition.start.regex);
            expect(lPattern.pattern.start.types).toEqual(lPatternDefinition.start.types);
            expect(lPattern.pattern.start.validator).toEqual(lPatternDefinition.start.validator);
            expect(lPattern.pattern.end.regex).toEqual(lPatternDefinition.end.regex);
            expect(lPattern.pattern.end.types).toEqual(lPatternDefinition.end.types);
            expect(lPattern.pattern.end.validator).toEqual(lPatternDefinition.end.validator);
            expect(lPattern.pattern.innerType).toEqual(lPatternDefinition.innerType);
        });

        it('-- Single pattern', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternDefinition = { single: { regex: /(?<token>const)/, types: { token: 'modifier' }, validator: null } };
            const lPatternParam: LexerPatternConstructorParameter<string, 'single'> = {
                type: 'single',
                metadata: [],
                pattern: lPatternDefinition,
                dependencyFetch: null,
            };
            const lPattern = new LexerPattern<string, 'single'>(lLexer, lPatternParam);

            // Evaluation
            expect(lPattern.pattern.regex).toEqual(lPatternDefinition.single.regex);
            expect(lPattern.pattern.types).toEqual(lPatternDefinition.single.types);
            expect(lPattern.pattern.validator).toEqual(lPatternDefinition.single.validator);
        });
    });

    it('Property: meta', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = { ...gDefaultPattern, metadata: ['meta1', 'meta2'] };
        const lPattern = new LexerPattern(lLexer, lPatternParam);

        // Evaluation
        expect(lPattern.meta).toEqual(['meta1', 'meta2']);
    });

    describe('Property: dependencies', () => {
        it('-- without dependencies', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                ...gDefaultPattern,
                dependencyFetch: null,
            };
            const lPattern = new LexerPattern(lLexer, lPatternParam);

            // Process.
            lPattern.resolveDependencies();
            const lDependecies = lPattern.dependencies;

            // Evaluation
            expect(lDependecies).toEqual([]);
        });

        it('-- with dependencies', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternOne = new LexerPattern(lLexer, gDefaultPattern);
            const lPatternTwo = new LexerPattern(lLexer, gDefaultPattern);
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                type: 'split',
                metadata: [],
                pattern: {
                    start: { regex: /(?<token>start)/, types: { token: 'modifier' }, validator: null },
                    end: { regex: /(?<token>end)/, types: { token: 'identifier' }, validator: null },
                    innerType: null
                },
                dependencyFetch: (pPattern: LexerPattern<string, LexerPatternType>) => {
                    pPattern.useChildPattern(lPatternOne);
                    pPattern.useChildPattern(lPatternTwo);
                },
            };
            const lPattern = new LexerPattern(lLexer, lPatternParam);

            // Process.
            lPattern.resolveDependencies();
            const lDependecies = lPattern.dependencies;

            // Evaluation
            expect(lDependecies).toEqual([lPatternOne, lPatternTwo]);
        });

        it('-- dependency with different lexer', () => {
            // Setup. Pattern.
            const lPatternOne = new LexerPattern(new Lexer<string>(), gDefaultPattern);

            // Setup
            const lLexer = new Lexer<string>();
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                type: 'split',
                metadata: [],
                pattern: {
                    start: { regex: /(?<token>start)/, types: { token: 'modifier' }, validator: null },
                    end: { regex: /(?<token>end)/, types: { token: 'identifier' }, validator: null },
                    innerType: null
                },
                dependencyFetch: (pPattern: LexerPattern<string, LexerPatternType>) => {
                    pPattern.useChildPattern(lPatternOne);
                },
            };
            const lPattern = new LexerPattern(lLexer, lPatternParam);

            // Process.
            const lFailingDependencyFetch = () => {
                lPattern.resolveDependencies();
            };

            // Evaluation
            expect(lFailingDependencyFetch).toThrow(`Can only add dependencies of the same lexer.`);
        });
    });

    it('Method: useChildPattern', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternOne = new LexerPattern(lLexer, gDefaultPattern);
        const lPatternTwo = new LexerPattern(lLexer, gDefaultPattern);
        const lMainPattern = new LexerPattern(lLexer, {
            type: 'split',
            metadata: [],
            pattern: {
                start: { regex: /(?<token>start)/, types: { token: 'modifier' }, validator: null },
                end: { regex: /(?<token>end)/, types: { token: 'identifier' }, validator: null },
                innerType: null
            },
            dependencyFetch: () => {}
        });

        // Process.
        lMainPattern.useChildPattern(lPatternOne);
        lMainPattern.useChildPattern(lPatternTwo);

        // Evaluation
        expect(lMainPattern.dependencies).toEqual([lPatternOne, lPatternTwo]);
    });

    it('Method: is', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
            type: 'single',
            metadata: [],
            dependencyFetch: null,
            pattern: { single: { regex: /(?<token>const)/, types: { token: 'modifier' }, validator: null } }
        };
        const lPattern = new LexerPattern(lLexer, lPatternParam);

        // Evaluation
        expect(lPattern.is('single')).toBe(true);
        expect(lPattern.is('split')).toBe(false);
    });

    it('Method: resolveDependencies', () => {
        // Setup. Flags.
        let lDependencyFetchCalled: boolean = false;

        // Setup
        const lLexer = new Lexer<string>();
        const lPattern = new LexerPattern(lLexer, {
            type: 'split',
            metadata: [],
            pattern: {
                start: { regex: /(?<token>start)/, types: { token: 'modifier' }, validator: null },
                end: { regex: /(?<token>end)/, types: { token: 'identifier' }, validator: null },
                innerType: null
            },
            dependencyFetch: () => {
                lDependencyFetchCalled = true;
            },
        });

        // Process
        lPattern.resolveDependencies();

        // Evaluation
        expect(lDependencyFetchCalled).toBeTruthy();
        expect(lPattern.dependenciesResolved).toBe(true);
    });

    describe('Method: constructor', () => {
        it('-- throws exception split pattern without dependency fetch', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                type: 'split',
                metadata: [],
                dependencyFetch: null,
                pattern: {
                    start: { regex: /(?<token>start)/, types: { token: 'modifier' }, validator: null },
                    end: { regex: /(?<token>end)/, types: { token: 'identifier' }, validator: null },
                    innerType: null
                }
            };

            // Evaluation
            expect(() => new LexerPattern(lLexer, lPatternParam)).toThrow('Split token with a start and end token, need inner token definitions');
        });

        it('-- throws exception single pattern with dependency fetch', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                type: 'single',
                metadata: [],
                dependencyFetch: () => { },
                pattern: { single: { regex: /(?<token>const)/, types: { token: 'modifier' }, validator: null } }
            };

            // Evaluation
            expect(() => new LexerPattern(lLexer, lPatternParam)).toThrow('Pattern does not allow inner token pattern.');
        });

        it('-- throws exception split pattern type with wrong form', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                type: 'split',
                metadata: [],
                dependencyFetch: () => { },
                pattern: { single: { regex: /(?<token>const)/, types: { token: 'modifier' }, validator: null } }
            };

            // Evaluation
            expect(() => new LexerPattern(lLexer, lPatternParam)).toThrow(`Can't use split pattern type with single pattern definition.`);
        });

        it('-- throws exception single pattern type with wrong form', () => {
            // Setup
            const lLexer = new Lexer<string>();
            const lPatternParam: LexerPatternConstructorParameter<string, LexerPatternType> = {
                type: 'single',
                metadata: [],
                dependencyFetch: null,
                pattern: {
                    start: { regex: /(?<token>start)/, types: { token: 'modifier' }, validator: null },
                    end: { regex: /(?<token>end)/, types: { token: 'identifier' }, validator: null },
                    innerType: null
                }
            };

            // Evaluation
            expect(() => new LexerPattern(lLexer, lPatternParam)).toThrow(`Can't use single pattern type with split pattern definition.`);
        });
    });
});