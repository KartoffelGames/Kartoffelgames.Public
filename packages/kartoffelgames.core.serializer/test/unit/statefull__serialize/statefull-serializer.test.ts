import { expect } from 'chai';
import { StatefullSerializeable } from '../../../source/statefull_serialize/decorator/statefull-serializeable.decorator';
import { StatefullSerializeableMap } from '../../../source/statefull_serialize/statefull-serializeable-map';
import { StatefullSerializer } from '../../../source/statefull_serialize/statefull-serializer';
import { ObjectifiedAnonymousObject, ObjectifiedArray, ObjectifiedBigInt, ObjectifiedClass, ObjectifiedSymbol } from '../../../source/statefull_serialize/types/Objectified.type';

describe('StatefullSerializer', () => {
    describe('Method: objectify', () => {
        describe('-- Simple values', () => {
            it('-- Number', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: number = 241;

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- String', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: string = 'mystring';

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- Boolean', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: boolean = true;

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- Undefined', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: undefined = undefined;

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- Null', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: null = null;

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).to.equal(lValue);
            });

            it('-- Function', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: any = () => { /* Empty */ };

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).to.be.undefined;
            });
        });

        it('-- Symbol', () => {
            // Setup.
            const lSerializer: StatefullSerializer = new StatefullSerializer();
            const lDescription: string = 'My Description';
            const lValue: symbol = Symbol(lDescription);

            // Process.
            const lResult: ObjectifiedSymbol = <ObjectifiedSymbol>lSerializer.objectify(lValue);

            // Evaluation.
            expect(lResult).to.deep.equal({
                '&type': 'symbol',
                '&objectId': lResult['&objectId'], // Auto generated.
                '&values': {
                    'description': lDescription
                }
            });
        });

        it('-- BigInt', () => {
            // Setup.
            const lSerializer: StatefullSerializer = new StatefullSerializer();
            const lValue: bigint = 241n;

            // Process.
            const lResult: ObjectifiedBigInt = <ObjectifiedBigInt>lSerializer.objectify(lValue);

            // Evaluation.
            expect(lResult).to.deep.equal({
                '&type': 'bigint',
                '&values': {
                    'number': lValue.toString()
                }
            });
        });

        it('-- Array', () => {
            // Setup.
            const lSerializer: StatefullSerializer = new StatefullSerializer();
            const lValueList: Array<number> = [2, 4, 1];

            // Process.
            const lResult: ObjectifiedArray = <ObjectifiedArray>lSerializer.objectify(lValueList);

            // Evaluation.
            expect(lResult).to.deep.equal({
                '&type': 'array',
                '&objectId': lResult['&objectId'],
                '&values': lValueList
            });
        });

        it('-- Anonymous object', () => {
            // Setup.
            const lSerializer: StatefullSerializer = new StatefullSerializer();
            const lValueList: any = {
                a: 2,
                b: 4,
                c: 1
            };

            // Process.
            const lResult: ObjectifiedAnonymousObject = <ObjectifiedAnonymousObject>lSerializer.objectify(lValueList);

            // Evaluation.
            expect(lResult).to.deep.equal({
                '&type': 'anonymous-object',
                '&objectId': lResult['&objectId'],
                '&values': lValueList
            });
        });

        it('-- Reference', () => {
            // Setup.
            const lSerializer: StatefullSerializer = new StatefullSerializer();
            const lValueList: any = { a: null };
            lValueList.a = lValueList;

            // Process.
            const lResult: ObjectifiedAnonymousObject = <ObjectifiedAnonymousObject>lSerializer.objectify(lValueList);

            // Evaluation. Property "a" has a reference on parent object. 
            expect(lResult['&values']['a']).to.deep.equal({
                '&type': 'reference',
                '&objectId': lResult['&objectId'],
            });
        });

        describe('-- Class', () => {
            it('-- Class with simple types', () => {
                // Setup. CLass id.
                const lClassId: string = '9a9056e7-1233-4ebc-9d4e-4155dd1e8da2';

                // Setup. Create class.
                @StatefullSerializeable(lClassId)
                class TestClass {
                    private readonly mInner: number;
                    public constructor(pValue: number) {
                        this.mInner = pValue;
                    }
                }

                // Setup. Define test values.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lParameter = [241];
                const lTestObject: TestClass = new TestClass(lParameter[0]);

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lTestObject);

                // Evaluation.
                expect(lResult).to.deep.equal({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&parameter': lParameter,
                    '&values': { mInner: lParameter[0] }
                });
            });

            it('-- Class with inner object', () => {
                // Setup. CLass id.
                const lClassId: string = 'f9adbd66-47a1-43ab-8c99-0dc0944389b4';
                const lClassIdChild: string = '8a4298ba-e014-4566-9d8b-9b8562948464';

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
                    private readonly mObject: TestClassChild;
                    public constructor(pValue: number) {
                        this.mObject = new TestClassChild(pValue);
                    }
                }

                // Setup. Define test values.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lParameter = [241];
                const lTestObject: TestClass = new TestClass(lParameter[0]);

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lTestObject);

                // Evaluation.
                expect(lResult).to.deep.equal({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&parameter': lParameter,
                    '&values': {
                        mObject: {
                            '&type': 'class',
                            '&constructor': lClassIdChild,
                            '&objectId': (<ObjectifiedClass>lResult['&values']['mObject'])['&objectId'],
                            '&parameter': lParameter,
                            '&values': { mInner: lParameter[0] }
                        }
                    }
                });
            });

            it('-- Not registered class', () => {
                // Setup. Create class.
                class TestClass {
                    public constructor(_pValue: number) { /* Empty */ }
                }

                // Setup. Create object.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lTestObject: TestClass = new TestClass(1);

                // Process.
                const lErrorFunction = () => {
                    lSerializer.objectify(lTestObject);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(`Constructor "${TestClass.name}" is not registered.`);
            });

            it('-- Not registered objects', () => {
                // Setup. Create class.
                class TestClass {
                    public constructor(_pValue: number) { /* Empty */ }
                }

                // Setup. Create object.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lTestObject: TestClass = new TestClass(1);

                // Setup. Register class after creation.
                StatefullSerializeableMap.instance.registerClass(TestClass, '99d6bd98-99dc-45b1-9144-6b9a7b99e664');

                // Process.
                const lErrorFunction = () => {
                    lSerializer.objectify(lTestObject);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(`Object has no registered constructor parameter`);
            });

            it('-- Ignore set and get', () => {
                // Setup. CLass id.
                const lClassId: string = '7cb5a25d-6211-4ff5-9614-5f9307f2cfaa';

                // Setup. Create class.
                @StatefullSerializeable(lClassId)
                class TestClass {
                    private mInner: number;

                    public get inner(): number {
                        return this.mInner;
                    } set inner(pValue: number) {
                        this.mInner = pValue;
                    }

                    public constructor(pValue: number) {
                        this.mInner = pValue;
                    }
                }

                // Setup. Define test values.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lParameter = [241];
                const lTestObject: TestClass = new TestClass(lParameter[0]);

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lTestObject);

                // Evaluation.
                expect(lResult).to.deep.equal({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&parameter': lParameter,
                    '&values': { mInner: lParameter[0] }
                });
            });

            it('-- Ignore readonly properties.', () => {
                // Setup. CLass id.
                const lClassId: string = '3f8063ae-00b2-4b89-968f-51992938b031';

                // Setup. Create class.
                @StatefullSerializeable(lClassId)
                class TestClass { }

                // Setup. Define test values.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lTestObject: TestClass = new TestClass();

                // Setup. Define own readonly property
                Object.defineProperty(lTestObject, 'myPropertyShouldNotBeIncluded', {
                    value: 241,
                    writable: false
                });

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lTestObject);

                // Evaluation.
                expect(lResult).to.deep.equal({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&parameter': [],
                    '&values': {}
                });
            });
        });
    });

    describe('Method: serialize', () => {
        it('-- Default', () => {
            // Setup.
            const lSerializer: StatefullSerializer = new StatefullSerializer();
            const lValue: number = 241;

            // Process.
            const lResult: string = lSerializer.serialize(lValue);

            // Evaluation.
            expect(lResult).to.equal('241');
        });
    });
});


