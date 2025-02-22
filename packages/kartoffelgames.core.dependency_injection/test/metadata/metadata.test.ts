import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { ConstructorMetadata } from '../../source/metadata/constructor-metadata.ts';
import { Metadata } from '../../source/metadata/metadata.ts';
import { InjectionConstructor } from '../../source/type.ts';

/**
 * Decorator.
 * Layers constructor with extends.
 * @param pConstructor - Constructor.
 */
const gPlaceholderDecorator = (pConstructor: InjectionConstructor): any => {
    // Layer constructor.
    return class extends pConstructor { constructor(...pArgs: Array<any>) { super(...pArgs); } };
};

describe('Metadata', () => {
    describe('-- Static Method: get', () => {
        it('-- Create New Metadata', () => {
            // Setup.
            class TestA { }

            // Process.
            const lConstructorMetadata = Metadata.get(TestA);

            // Evaluation.
            expect(lConstructorMetadata).toBeInstanceOf(ConstructorMetadata);
        });

        it('-- Get Existing Metadata ', () => {
            // Setup.
            class TestA { }

            // Process.
            const lOldConstructorMetadata = Metadata.get(TestA);
            const lNewConstructorMetadata = Metadata.get(TestA);

            // Evaluation.
            expect(lOldConstructorMetadata).toBe(lNewConstructorMetadata);
        });

        it('-- Get With Decoration History', () => {
            // Setup.
            @gPlaceholderDecorator
            class Test { }

            // Setup. Get base class.
            const lTestParent = DecorationRootHistory.getOriginalOf(Test);

            // Process.
            const lChildConstructorMetadata = Metadata.get(Test);
            const lParentConstructorMetadata = Metadata.get(lTestParent);

            // Evaluation.
            expect(lChildConstructorMetadata).toBe(lParentConstructorMetadata);
        });
    });
});