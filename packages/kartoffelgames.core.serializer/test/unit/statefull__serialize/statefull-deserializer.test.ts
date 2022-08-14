import { expect } from 'chai';
import { StatefullSerializeable } from '../../../source/statefull_serialize/decorator/statefull-serializeable.decorator';
import { StatefullDeserializer } from '../../../source/statefull_serialize/statefull-deserializer';
import { StatefullSerializeableClasses } from '../../../source/statefull_serialize/statefull-serializeable-classes';
import { StatefullSerializer } from '../../../source/statefull_serialize/statefull-serializer';
import { ObjectifiedReference, ObjectifiedValue } from '../../../source/statefull_serialize/types/Objectified.type';

describe('StatefullDeserializer', () => {
    describe('Method: deobjectify', () => {
        describe('-- Simple values', () => {
            it('-- Number', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: number = 241;

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- String', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: string = 'mystring';

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- Boolean', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: boolean = true;

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- Undefined', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: undefined = undefined;

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- Null', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: null = null;

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- Function', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: any = () => { /* Empty */ };

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.be.undefined;
            });
        });

        it('-- Symbol', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lDescription: string = 'My Description';
            const lValue: symbol = Symbol(lDescription);

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: symbol = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult.description).to.be.equal(lValue.description);
        });

        it('-- BigInt', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: bigint = 241n;

            // Setup. Objectify value.
            const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

            // Process.
            const lResult: bigint = lDeserializer.deobjectify(lObjectifiedValue);

            // Evaluation.
            expect(lResult).to.be.equal(lValue);
        });

        describe('-- Reference', () => {
            it('-- Valid reference', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: { a: object; } = { a: {} };
                lValue.a = lValue;

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult: { a: object; } = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.be.equal(lResult.a);
            });

            it('-- Invalid reference', () => {
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
                expect(lErrorFunction).to.throw(`Referenced object not found.`);
            });
        });

        describe('-- Predefined', () => {
            it('-- Object', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue = { a: '241', b: '420' };

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult: { a: object; } = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.be.deep.equal(lValue);
            });

            it('-- Array', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: Array<string> = ['241', '420'];

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult: Array<string> = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult).to.be.deep.equal(lValue);
            });

            it('-- Date', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValue: Date = new Date('1995-12-17T03:24:00');

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult: Date = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect(lResult.getTime()).to.be.equal(lValue.getTime());
            });

            it('-- Set', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lSetValueList: Array<string> = ['241', '420'];
                const lValue: Set<string> = new Set<string>(lSetValueList);

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult: Set<string> = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect([...lResult]).to.be.deep.equal(lSetValueList);
            });

            it('-- Map', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lKeyValueTuble: [string, string] = ['241', '420'];
                const lValue: Map<string, string> = new Map<string, string>([lKeyValueTuble]);

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult: Map<string, string> = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect([...lResult.entries()]).to.be.deep.equal([...lValue.entries()]);
            });

            it('-- TypedArray', () => {
                // Setup.
                const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
                const lValueList: Array<number> = [87, 27];
                const lValue: Uint8Array = new Uint8Array(lValueList);

                // Setup. Objectify value.
                const lObjectifiedValue: ObjectifiedValue = new StatefullSerializer().objectify(lValue);

                // Process.
                const lResult: Uint8Array = lDeserializer.deobjectify(lObjectifiedValue);

                // Evaluation.
                expect([...lResult]).to.be.deep.equal([...lValue]);
                expect(lResult).to.be.instanceOf(Uint8Array);
            });
        });

        describe('-- Class', () => {
            it('-- Class with simple types', () => {
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
                expect(lResult).to.be.deep.equal(lTestObject);
                expect(lResult).to.be.instanceOf(TestClass);
            });

            it('-- Class with inner object', () => {
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
                expect(lResult).to.be.deep.equal(lTestObject);
                expect(lResult).to.be.instanceOf(TestClass);
                expect(lResult.object).to.be.instanceOf(TestClassChild);
            });

            it('-- Required values', () => {
                // Setup.
                const lRequiredName: string = 'requiredValue';
                const lRequiredValue: number = 241;
                const lClassId: string = 'ec3de59d-664e-4c3c-bc71-d862344bf502';

                // Setup. Create class.
                class TestClass {
                }

                // Setup. Register class.
                StatefullSerializeableClasses.instance.registerClass(TestClass, lClassId, () => {
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
                expect((<any>lResult).requiredValue).to.be.equal(lRequiredValue);
            });

            it('-- Required function value', () => {
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
                StatefullSerializeableClasses.instance.registerClass(TestClass, lClassId, () => {
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
                expect(lResult[lInnerPropertyName]).to.be.equal(lRequiredValue);
            });

            it('-- Required function value array', () => {
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
                StatefullSerializeableClasses.instance.registerClass(TestClass, lClassId, () => {
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
                expect(lResult[lInnerPropertyNameOne]).to.be.equal(lRequiredValueList[0]);
                expect(lResult[lInnerPropertyNameTwo]).to.be.equal(lRequiredValueList[1]);
            });
        });
    });

    describe('Method: deserialize', () => {
        it('-- Default', () => {
            // Setup.
            const lDeserializer: StatefullDeserializer = new StatefullDeserializer();
            const lValue: number = 241;
            const lSerializedValue: string = new StatefullSerializer().serialize(lValue);

            // Process.
            const lResult: number = lDeserializer.deserialize(lSerializedValue);

            // Evaluation.
            expect(lResult).to.equal(lValue);
        });
    });
});


