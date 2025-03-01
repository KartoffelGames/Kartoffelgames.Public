import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { ConstructorMetadata } from '../../source/metadata/constructor-metadata.ts';
import { Metadata } from '../../source/metadata/metadata.ts';

describe('Metadata', () => {
    describe('-- Static Method: add', () => {
        it('-- Constructor Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};

            // Process.
            @Metadata.add(lMetadataKey, lMetadataValue)
            class TestA { }

            // Process. Read metadata.
            const lResultMetadataValue: object | null = Metadata.get(TestA).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).toBe(lMetadataValue);
        });

        it('-- Property Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};
            const lPropertyName: unique symbol = Symbol('propertyname');

            // Process.         
            class TestA {
                @Metadata.add(lMetadataKey, lMetadataValue)
                public [lPropertyName]?: string;
            }

            // Process. Read metadata.
            const lResultMetadataValue: object | null = Metadata.get(TestA).getProperty(lPropertyName).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).toBe(lMetadataValue);
        });

        it('-- Property Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};

            // Process.         
            class TestA {
                @Metadata.add(lMetadataKey, lMetadataValue)
                public function(): string { return ''; }
            }

            // Process. Read metadata.
            const lResultMetadataValue: object | null = Metadata.get(TestA).getProperty('function').getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).toBe(lMetadataValue);
        });

        it('-- Accessor Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};
            const lPropertyName: unique symbol = Symbol('propertyname');

            // Process.         
            class TestA {
                @Metadata.add(lMetadataKey, lMetadataValue)
                public get [lPropertyName](): string { return ''; }
            }

            // Process. Read metadata.
            const lResultMetadataValue: object | null = Metadata.get(TestA).getProperty(lPropertyName).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).toBe(lMetadataValue);
        });

        it('-- Unsupported for static Properties.', ()=>{
            // Setup. Failing function.
            const lFailFunction = ()=>{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                class TestA {
                    @Metadata.add('', '')
                    public static get prop(): string { return ''; }
                }
            };

            // Evaluation.
            expect(lFailFunction).toThrow(`@Metadata.add not supported for statics.`);
        });
    });

    describe('-- Static Method: get', () => {
        it('-- Create New Metadata', () => {
            // Setup.
            @Metadata.init()
            class TestA { }

            // Process.
            const lConstructorMetadata = Metadata.get(TestA);

            // Evaluation.
            expect(lConstructorMetadata).toBeInstanceOf(ConstructorMetadata);
        });

        it('-- Get Existing Metadata ', () => {
            // Setup.
            @Metadata.init()
            class TestA { }

            // Process.
            const lOldConstructorMetadata = Metadata.get(TestA);
            const lNewConstructorMetadata = Metadata.get(TestA);

            // Evaluation.
            expect(lOldConstructorMetadata).toBe(lNewConstructorMetadata);
        });

        it('-- Native constructor metadata are not same ', () => {
            // Setup. Inheritance chain.
            @Metadata.init()
            class A { }
            @Metadata.init()
            class B extends A { }

            // Process.
            const lMetadataB: ConstructorMetadata = Metadata.get(B);
            const lMetadataA: ConstructorMetadata = Metadata.get(A);

            // Evaluation.
            expect(lMetadataA).not.toBe(lMetadataB);
        });

        it('-- Polyfilled constructor metadata are not same ', () => {
            // Setup. Inheritance chain.
            class A { }
            class B extends A { }

            // Process.
            const lMetadataA: ConstructorMetadata = Metadata.get(A);
            const lMetadataB: ConstructorMetadata = Metadata.get(B);

            // Evaluation.
            expect(lMetadataA).not.toBe(lMetadataB);
        });

        it('-- Polyfilled decorator metadata are not same ', () => {
            // Setup. Inheritance chain.
            class A { }
            class B extends A { }

            // Setup. Force polyfill metadata creation.
            Metadata.get(A);
            Metadata.get(B);

            // Process.
            const lMetadataA: DecoratorMetadata = A[Symbol.metadata]!;
            const lMetadataB: DecoratorMetadata = B[Symbol.metadata]!;

            // Evaluation.
            expect(lMetadataA).not.toBe(lMetadataB);
        });
    });
});