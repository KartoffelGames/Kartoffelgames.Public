import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { Dictionary } from '@kartoffelgames/core';
import { InjectMode } from '../source/enum/inject-mode.ts';
import { Injectable } from '../source/decorator/injectable.decorator.ts';
import { InjectableSingleton } from '../source/decorator/injectable-singleton.decorator.ts';
import { Injection } from '../source/injection/injection.ts';
import { InjectionConstructor } from '../source/type.ts';

/**
 * Decorator.
 * Layers constructor with extends.
 * @param pConstructor - Constructor.
 */
const gPlaceholderDecorator = (pConstructor: InjectionConstructor): any => {
    // Layer constructor.
    return class extends pConstructor { constructor(...pArgs: Array<any>) { super(...pArgs); } };
};

describe('Injection', () => {
    describe('Static Method: createObject', () => {
        it('-- Not registered', () => {
            // Setup.
            class TestA { }

            // Process.
            const lThrows = () => {
                Injection.createObject(TestA);
            };

            // Evaluation.
            expect(lThrows).toThrow(`Constructor "${TestA.name}" is not registered for injection and can not be build`);
        });

        it('-- Default without parameter', () => {
            // Setup.
            @Injectable
            class TestA { }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
        });

        it('-- Default with parameter', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @Injectable
            class TestParameterB { }
            @Injectable
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
            expect(lCreatedObject.mParameterA).toBeInstanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).toBeInstanceOf(TestParameterB);
        });

        it('-- Default with parameter, parameter is singleton.', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @InjectableSingleton
            class TestParameterB { }
            @Injectable
            class TestA { constructor(public mDefault: TestParameterA, public mSingleton: TestParameterB) { } }

            // Process.
            const lCreatedObjectOne: TestA = Injection.createObject(TestA);
            const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectOne.mDefault).toBeInstanceOf(TestParameterA);
            expect(lCreatedObjectOne.mSingleton).toBeInstanceOf(TestParameterB);
            expect(lCreatedObjectOne.mSingleton).toBe(lCreatedObjectTwo.mSingleton);
        });

        it('-- Default with parameter, parameter not registered.', () => {
            // Setup.
            class TestParameter { }
            @Injectable
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Process.
            const lThrows = () => {
                Injection.createObject(TestA);
            };

            // Evaluation.
            expect(lThrows).toThrow(`Parameter "${TestParameter.name}" of ${TestA.name} is not registered to be injectable.`);
        });

        it('-- Singleton without parameter', () => {
            // Setup.
            @InjectableSingleton
            class TestA { }

            // Process.
            const lCreatedObjectOne: TestA = Injection.createObject(TestA);
            const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectOne).toBeInstanceOf(TestA);
            expect(lCreatedObjectOne).toBe(lCreatedObjectTwo);
        });

        it('-- Singleton with parameter', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @Injectable
            class TestParameterB { }
            @InjectableSingleton
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
            expect(lCreatedObject.mParameterA).toBeInstanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).toBeInstanceOf(TestParameterB);
        });

        it('-- Singleton force create', () => {
            // Setup.
            @InjectableSingleton
            class TestA { }

            // Process.
            const lCreatedObjectOne: TestA = Injection.createObject(TestA);
            const lCreatedObjectTwo: TestA = Injection.createObject(TestA, true);

            // Evaluation.
            expect(lCreatedObjectTwo).toBeInstanceOf(TestA);
            expect(lCreatedObjectOne).not.toBe(lCreatedObjectTwo);
        });

        it('-- Default with layered history', () => {
            // Setup.
            @Injectable
            @gPlaceholderDecorator
            class TestA { }
            @gPlaceholderDecorator
            @Injectable
            class TestB { }

            // Process.
            const lCreatedObjectA: TestA = Injection.createObject(TestA);
            const lCreatedObjectB: TestB = Injection.createObject(TestB);

            // Evaluation.
            expect(lCreatedObjectA).toBeInstanceOf(TestA);
            expect(lCreatedObjectB).toBeInstanceOf(TestB);
        });

        it('-- Default with layered history with parameter', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @Injectable
            class TestParameterB { }
            @Injectable
            @gPlaceholderDecorator
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
            expect(lCreatedObject.mParameterA).toBeInstanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).toBeInstanceOf(TestParameterB);
        });

        it('-- Default with parameter with layered history', () => {
            // Setup.
            @Injectable
            @gPlaceholderDecorator
            class TestParameterA { }
            @Injectable
            class TestA { constructor(public mParameterA: TestParameterA) { } }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
            expect(lCreatedObject.mParameterA).toBeInstanceOf(TestParameterA);
        });

        it('-- Default with parameter with injection replacement', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @Injectable
            class ReplacementTestParameterA { }
            @Injectable
            class TestA { constructor(public mParameterA: TestParameterA) { } }

            // Setup. Set replacement.
            Injection.replaceInjectable(TestParameterA, ReplacementTestParameterA);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
            expect(lCreatedObject.mParameterA).toBeInstanceOf(ReplacementTestParameterA);
        });

        it('-- Default injection replacement with layered history', () => {
            // Setup.
            @Injectable
            @gPlaceholderDecorator
            class TestParameterA { }

            @Injectable
            @gPlaceholderDecorator
            class ReplacementTestParameterA { }

            // Setup.
            @Injectable
            class TestA { constructor(public mParameterA: TestParameterA) { } }

            // Setup. Set replacement.
            Injection.replaceInjectable(TestParameterA, ReplacementTestParameterA);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
            expect(lCreatedObject.mParameterA).toBeInstanceOf(ReplacementTestParameterA);
        });

        it('-- Default with second layer local injection', () => {
            // Setup.
            @Injectable
            class TestParameterLayerTwo { }
            class TestParameterLayerTwoLocalInjection { }
            @Injectable
            class TestParameterLayerOne { constructor(public mParameter: TestParameterLayerTwo) { } }
            @Injectable
            class TestA { constructor(public mParameter: TestParameterLayerOne) { } }

            // Setup. Create local injection.
            const lLocalInjectionParameter: TestParameterLayerTwoLocalInjection = new TestParameterLayerTwoLocalInjection();
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameterLayerTwo, lLocalInjectionParameter);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
            expect(lCreatedObject.mParameter).toBeInstanceOf(TestParameterLayerOne);
            expect(lCreatedObject.mParameter.mParameter).toBe(lLocalInjectionParameter);
        });

        it('-- Singleton ignore local injections', () => {
            // Setup.
            @Injectable
            class TestParameter { }
            class TestParameterReplacement { }


            @InjectableSingleton
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Setup. Create local injection.
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameter, new TestParameterReplacement());

            // Process.
            const lCreatedObjectWith: TestA = Injection.createObject(TestA, lLocalInjectionMap);
            const lCreatedObjectWithout: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectWith).toBe(lCreatedObjectWithout);
            expect(lCreatedObjectWith).toBeInstanceOf(TestA);
            expect(lCreatedObjectWithout).toBeInstanceOf(TestA);
            expect(lCreatedObjectWith.mParameter).toBeInstanceOf(TestParameter);
            expect(lCreatedObjectWithout.mParameter).toBeInstanceOf(TestParameter);
        });

        it('-- Singleton create with local injections on force create', () => {
            // Setup.
            @Injectable
            class TestParameter { }
            class TestParameterLocalInjection { }
            @InjectableSingleton
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Setup. Create local injection.
            const lLocalInjectionParameter: TestParameterLocalInjection = new TestParameterLocalInjection();
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameter, lLocalInjectionParameter);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA, true, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).toBeInstanceOf(TestA);
            expect(lCreatedObject.mParameter).toBe(lLocalInjectionParameter);
        });

        it('-- Default with with faulty parameter.', () => {
            // Setupt. Values
            const lErrorMessage: string = 'Special error message';

            // Setup.
            @Injectable
            class TestParameterA {
                constructor() {
                    throw new Error(lErrorMessage);
                }
            }

            @Injectable
            class TestA { constructor(public mParameterA: TestParameterA) { } }

            // Process.
            const lErrorFunction = () => {
                Injection.createObject(TestA);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(`Parameter "${TestParameterA.name}" of ${TestA.name} is not injectable.\n${lErrorMessage}`);
        });
    });

    it('Static Method: registerInjectable', () => {
        // Setup.
        class Type { }

        // Process.
        Injection.registerInjectable(Type, InjectMode.Instanced);
        const lCreatedObject = Injection.createObject<Type>(Type);

        // Evaluation.
        expect(lCreatedObject).toBeInstanceOf(Type);
    });

    describe('Static Method: replaceInjectable', () => {
        it('-- Default', () => {
            // Setup. Types.
            class OriginalType { }
            class ReplacementType { }

            // Setup. Type with injected parameter.
            @Injectable
            class TestClass {
                public a: any;
                constructor(pType: OriginalType) {
                    this.a = pType;
                }
            }

            // Setup. Register injectable.
            Injection.registerInjectable(OriginalType, InjectMode.Instanced);
            Injection.registerInjectable(ReplacementType, InjectMode.Instanced);

            // Process.
            Injection.replaceInjectable(OriginalType, ReplacementType);
            const lCreatedObject = Injection.createObject<TestClass>(TestClass);

            // Evaluation.
            expect(lCreatedObject.a).toBeInstanceOf(ReplacementType);
        });

        it('-- Original not registerd', () => {
            // Setup. Types.
            class OriginalType { }
            class ReplacementType { }

            // Setup. Register injectable.
            Injection.registerInjectable(ReplacementType, InjectMode.Instanced);

            // Process.
            const lThrowErrorFunction = () => {
                Injection.replaceInjectable(OriginalType, ReplacementType);
            };

            // Evaluation.
            expect(lThrowErrorFunction).toThrow('Original constructor is not registered.');
        });

        it('-- Replacement not registerd', () => {
            // Setup. Types
            class OriginalType { }
            class ReplacementType { }

            // Setup. Register injectable.
            Injection.registerInjectable(OriginalType, InjectMode.Instanced);

            // Process.
            const lThrowErrorFunction = () => {
                Injection.replaceInjectable(OriginalType, ReplacementType);
            };

            // Evaluation.
            expect(lThrowErrorFunction).toThrow('Replacement constructor is not registered.');
        });
    });
});