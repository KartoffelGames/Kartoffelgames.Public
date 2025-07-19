import { expect } from '@kartoffelgames/core-test';
import { StatefullSerializeable } from '../../source/statefull_serialize/decorator/statefull-serializeable.decorator.ts';
import { StatefullDeserializer } from '../../source/statefull_serialize/statefull-deserializer.ts';
import { StatefullSerializeableClasses } from '../../source/statefull_serialize/statefull-serializeable-classes.ts';
import { StatefullSerializer } from '../../source/statefull_serialize/statefull-serializer.ts';
import type { ObjectifiedReference, ObjectifiedValue } from '../../source/statefull_serialize/types/Objectified.type.ts';

Deno.test('StatefullDeserializer.deobjectify()', async (pContext) => {
    await pContext.step('Simple values', async (pContext) => {
        await pContext.step('Number', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: number = 241;

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBe(lValue);
        });

        await pContext.step('String', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: string = 'mystring';

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBe(lValue);
        });

        await pContext.step('Boolean', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: boolean = true;

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBe(lValue);
        });

        await pContext.step('Undefined', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: undefined = undefined;

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBe(lValue);
        });

        await pContext.step('Null', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: null = null;

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBe(lValue);
        });

        await pContext.step('Function', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: any = () => { /* Empty */ };

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBeUndefined();
        });
    });

    await pContext.step('Symbol', () => {
        // Setup.
        const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
        const lDescription: string = 'My Description';
        const lValue: symbol = Symbol(lDescription);

        // Setup. Objectify value.
        const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

        // Process.
        const lResult: symbol = lDeserializer.deobjectify(lObjectifiedValue);

        // Evaluation.
        expect(lResult.description).toBe(lValue.description);
    });

    await pContext.step('BigInt', () => {
        // Setup.
        const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
        const lValue: bigint = 241n;

        // Setup. Objectify value.
        const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

        // Process.
        const lResult: bigint = lDeserializer.deobjectify(lObjectifiedValue);

        // Evaluation.
        expect(lResult).toBe(lValue);
    });

    await pContext.step('Reference', async (pContext) => {
        await pContext.step('Valid reference', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: { a: object; } = { a: {} };
            lValue.a = lValue;

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: { a: object; } = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBe(lResult.a);
        });

        await pContext.step('Invalid reference', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lObjectifiedValue: ObjectifiedReference = {
                '&type': 'reference',
                '&objectId': 'NOT THERE',
            };

            // Process.
            const lErrorFunction = () => {
                lDeserializer.deobjectify(lObjectifiedValue);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(`Referenced object not found.`);
        });
    });

    await pContext.step('Predefined', async (pContext) => {
        await pContext.step('Object', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue = { a: '241', b: '420' };

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: { a: object; } = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBeDeepEqual(lValue);
        });

        await pContext.step('Array', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: Array<string> = ['241', '420'];

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: Array<string> = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBeDeepEqual(lValue);
        });

        await pContext.step('Date', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: Date = new Date('1995-12-17T03:24:00');

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: Date = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult.getTime()).toBe(lValue.getTime());
        });

        await pContext.step('Set', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lSetValueList: Array<string> = ['241', '420'];
            const lValue: Set<string> = new Set<string>(lSetValueList);

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: Set<string> = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect([...lResult]).toBeDeepEqual(lSetValueList);
        });

        await pContext.step('Map', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lKeyValueTuble: [string, string] = ['241', '420'];
            const lValue: Map<string, string> = new Map<string, string>([lKeyValueTuble]);

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: Map<string, string> = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect([...lResult.entries()]).toBeDeepEqual([...lValue.entries()]);
        });

        await pContext.step('TypedArray', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValueList: Array<number> = [87, 27];
            const lValue: Uint8Array = new Uint8Array(lValueList);

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: Uint8Array = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect([...lResult]).toBeDeepEqual([...lValue]);
            expect(lResult).toBeInstanceOf(Uint8Array);
        });
    });

    await pContext.step('Class', async (pContext) => {
        await pContext.step('Class with simple types', () => {
            // Setup. CLass id.
            const lClassId: string = '2b100e1e-0a73-4fca-abb3-ca8e240f6c0b';

            // Setup. Create class.
            @StatefullSerializeable(lClassId)
            class TestClass {
                private readonly mInner: number;
                public constructor(pValue: number) {
                    this.mInner = pValue;
                }
            }

            // Setup. Define test values.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lParameter = [241];
            const lTestObject: TestClass = new TestClass(lParameter[0]);

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lTestObject);

            // Process.
            const lResult: TestClass = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBeDeepEqual(lTestObject);
            expect(lResult).toBeInstanceOf(TestClass);
        });

        await pContext.step('Class with inner object', () => {
            // Setup. CLass id.
            const lClassId: string = 'b139df33-9ab6-461c-b66a-60757892ea04';
            const lClassIdChild: string = '66e206b6-799b-4aae-9732-6a92938e552e';

            // Setup. Create class.
            @StatefullSerializeable(lClassIdChild)
            class TestClassChild {
                private readonly mInner: number;
                public constructor(pValue: number) {
                    this.mInner = pValue;
                }
            }

            @StatefullSerializeable(lClassId)
            class TestClass {
                public readonly object: TestClassChild;
                public constructor(pValue: number) {
                    this.object = new TestClassChild(pValue);
                }
            }

            // Setup. Define test values.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lParameter = [241];
            const lTestObject: TestClass = new TestClass(lParameter[0]);

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lTestObject);

            // Process.
            const lResult: TestClass = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).toBeDeepEqual(lTestObject);
            expect(lResult).toBeInstanceOf(TestClass);
            expect(lResult.object).toBeInstanceOf(TestClassChild);
        });

        await pContext.step('Required values', () => {
            // Setup.
            const lRequiredName: string = 'requiredValue';
            const lRequiredValue: number = 241;
            const lClassId: string = 'ec3de59d-664e-4c3c-bc71-d862344bf502';

            // Setup. Create class.
            class TestClass {
            }

            // Setup. Register class.
            new StatefullSerializeableClasses().registerClass(TestClass, lClassId, () => {
                return {
                    requiredValues: [{ propertyName: lRequiredName, value: lRequiredValue }]
                };
            });

            // Setup. Define test values.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lTestObject: TestClass = new TestClass();

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lTestObject);

            // Process.
            const lResult: TestClass = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect((<any>lResult).requiredValue).toBe(lRequiredValue);
        });

        await pContext.step('Required function value', () => {
            // Setup.
            const lInnerPropertyName: string = 'innerPropertyName';
            const lRequiredName: string = 'requiredFunction';
            const lRequiredValue: number = 241;
            const lClassId: string = 'cf1fa96c-7343-4e91-baa6-335fed3e9039';

            // Setup. Create class.
            class TestClass {
                [key: string]: any;
                public requiredFunction(pValue: number): void {
                    this[lInnerPropertyName] = pValue;
                }
            }

            // Setup. Register class.
            new StatefullSerializeableClasses().registerClass(TestClass, lClassId, () => {
                return {
                    requiredValues: [{ propertyName: lRequiredName, value: lRequiredValue }]
                };
            });

            // Setup. Define test values.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lTestObject: TestClass = new TestClass();

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lTestObject);

            // Process.
            const lResult: TestClass = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult[lInnerPropertyName]).toBe(lRequiredValue);
        });

        await pContext.step('Required function value array', () => {
            // Setup.
            const lInnerPropertyNameOne: string = 'innerPropertyNameOne';
            const lInnerPropertyNameTwo: string = 'innerPropertyNameTwo';
            const lRequiredName: string = 'requiredFunction';
            const lRequiredValueList: Array<number> = [241, 420];
            const lClassId: string = '24ba4845-a107-4dfe-a156-5d685e027ff8';

            // Setup. Create class.
            class TestClass {
                [key: string]: any;
                public requiredFunction(pValueOne: number, pValueTwo: number): void {
                    this[lInnerPropertyNameOne] = pValueOne;
                    this[lInnerPropertyNameTwo] = pValueTwo;
                }
            }

            // Setup. Register class.
            new StatefullSerializeableClasses().registerClass(TestClass, lClassId, () => {
                return {
                    requiredValues: [{ propertyName: lRequiredName, value: lRequiredValueList }]
                };
            });

            // Setup. Define test values.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lTestObject: TestClass = new TestClass();

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lTestObject);

            // Process.
            const lResult: TestClass = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult[lInnerPropertyNameOne]).toBe(lRequiredValueList[0]);
            expect(lResult[lInnerPropertyNameTwo]).toBe(lRequiredValueList[1]);
        });
    });
});

Deno.test('StatefullDeserializer.deserialize()', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
        const lValue: number = 241;
        const lSerializedValue: string = new StatefullSerializer().serialize(lValue);

        // Process.
        const lResult: number = lDeserializer.deserialize(lSerializedValue);

        // Evaluation.
        expect(lResult).toBe(lValue);
    });
});


