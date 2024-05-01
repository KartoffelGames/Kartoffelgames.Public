import { Dictionary } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { InjectMode } from '../../source/enum/inject-mode';
import { Injectable } from '../../source/decorator/injectable.decorator';
import { InjectableSingleton } from '../../source/decorator/injectable-singleton.decorator';
import { Injection } from '../../source/injection/injection';
import { InjectionConstructor } from '../../source/type';

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
            expect(lThrows).to.throw(`Constructor "${TestA.name}" is not registered for injection and can not be build`);
        });

        it('-- Default without parameter', () => {
            // Setup.
            @Injectable
            class TestA { }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
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
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
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
            expect(lCreatedObjectOne.mDefault).to.be.instanceOf(TestParameterA);
            expect(lCreatedObjectOne.mSingleton).to.be.instanceOf(TestParameterB);
            expect(lCreatedObjectOne.mSingleton).to.equal(lCreatedObjectTwo.mSingleton);
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
            expect(lThrows).to.throw(`Parameter "${TestParameter.name}" of ${TestA.name} is not registered to be injectable.`);
        });

        it('-- Singleton without parameter', () => {
            // Setup.
            @InjectableSingleton
            class TestA { }

            // Process.
            const lCreatedObjectOne: TestA = Injection.createObject(TestA);
            const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectOne).to.be.instanceOf(TestA);
            expect(lCreatedObjectOne).to.equal(lCreatedObjectTwo);
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
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
        });

        it('-- Singleton force create', () => {
            // Setup.
            @InjectableSingleton
            class TestA { }

            // Process.
            const lCreatedObjectOne: TestA = Injection.createObject(TestA);
            const lCreatedObjectTwo: TestA = Injection.createObject(TestA, true);

            // Evaluation.
            expect(lCreatedObjectTwo).to.be.instanceOf(TestA);
            expect(lCreatedObjectOne).to.not.equal(lCreatedObjectTwo);
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
            expect(lCreatedObjectA).to.be.instanceOf(TestA);
            expect(lCreatedObjectB).to.be.instanceOf(TestB);
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
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
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
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
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
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(ReplacementTestParameterA);
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
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(ReplacementTestParameterA);
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
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.be.instanceOf(TestParameterLayerOne);
            expect(lCreatedObject.mParameter.mParameter).to.equal(lLocalInjectionParameter);
        });

        it('-- Singleton create new with local injection', () => {
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
            const lCreatedObject: TestA = Injection.createObject(TestA, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.equal(lLocalInjectionParameter);
            expect(lCreatedObject.mParameter).to.be.instanceOf(TestParameterLocalInjection);
        });

        it('-- Singleton create with and without local injections', () => {
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
            const lObjectLocalInjections: TestA = Injection.createObject(TestA, lLocalInjectionMap);
            const lObjectOne: TestA = Injection.createObject(TestA);
            const lObjectTwo: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lObjectLocalInjections).to.be.instanceOf(TestA);
            expect(lObjectOne).to.be.instanceOf(TestA);

            expect(lObjectOne).to.equal(lObjectTwo);

            expect(lObjectLocalInjections.mParameter).to.equal(lLocalInjectionParameter);
            expect(lObjectLocalInjections.mParameter).to.be.instanceOf(TestParameterLocalInjection);

            expect(lObjectOne.mParameter).to.not.equal(lLocalInjectionParameter);
            expect(lObjectOne.mParameter).to.be.instanceOf(TestParameter);
        });

        it('-- Singleton with local injection with force', () => {
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
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.equal(lLocalInjectionParameter);
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
            expect(lErrorFunction).to.throw(`Parameter "${TestParameterA.name}" of ${TestA.name} is not injectable.\n${lErrorMessage}`);
        });
    });

    it('Static Method: registerInjectable', () => {
        // Setup.
        class Type { }

        // Process.
        Injection.registerInjectable(Type, InjectMode.Instanced);
        const lCreatedObject = Injection.createObject<Type>(Type);

        // Evaluation.
        expect(lCreatedObject).to.be.an.instanceOf(Type);
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
            expect(lCreatedObject.a).to.be.an.instanceOf(ReplacementType);
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
            expect(lThrowErrorFunction).to.throw('Original constructor is not registered.');
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
            expect(lThrowErrorFunction).to.throw('Replacement constructor is not registered.');
        });
    });
});