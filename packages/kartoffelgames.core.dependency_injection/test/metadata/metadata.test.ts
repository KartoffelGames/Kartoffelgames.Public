import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { ConstructorMetadata } from '../../source/metadata/constructor-metadata.ts';
import { Metadata } from '../../source/metadata/metadata.ts';
import { InjectionConstructor } from '../../source/type.ts';

describe('Metadata', () => {
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