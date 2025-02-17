import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { InjectableSingleton } from '../../source/decorator/injectable-singleton.decorator.ts';
import { Injection } from '../../source/injection/injection.ts';


describe('InjectableSingleton', () => {
    it('Decorator: InjectableSingleton', () => {
        // Process.
        @InjectableSingleton
        class TestA { }

        // Process. Create object.
        const lCreatedObjectOne: TestA = Injection.createObject(TestA);
        const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

        // Evaluation.
        expect(lCreatedObjectOne).toBeInstanceOf(TestA);
        expect(lCreatedObjectOne).toBe(lCreatedObjectTwo);
    });
});