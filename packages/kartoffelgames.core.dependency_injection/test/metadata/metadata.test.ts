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

        it('-- Native metadata are not same ', () => {
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

        it('-- Generated metadata are not same ', () => {
            // Setup. Inheritance chain.
            class A { }
            class B extends A { }

            // Process. Order matters.
            const lMetadataB: ConstructorMetadata = Metadata.get(B);
            const lMetadataA: ConstructorMetadata = Metadata.get(A);

            // Evaluation.
            expect(lMetadataA).not.toBe(lMetadataB);
        });
    });
});