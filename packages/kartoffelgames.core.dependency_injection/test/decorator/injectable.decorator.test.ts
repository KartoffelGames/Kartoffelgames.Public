import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { Injectable } from '../../source/decorator/injectable.decorator.ts';
import { Injection } from '../../source/injection/injection.ts';


describe('Injectable', () => {
    it('Decorator: Injectable', () => {
        // Process.
        @Injectable
        class TestA { }

        // Process. Create object.
        const lCreatedObjectOne: TestA = Injection.createObject(TestA);
        const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

        // Evaluation.
        expect(lCreatedObjectOne).toBeInstanceOf(TestA);
        expect(lCreatedObjectOne).not.toBe(lCreatedObjectTwo);
    });
});