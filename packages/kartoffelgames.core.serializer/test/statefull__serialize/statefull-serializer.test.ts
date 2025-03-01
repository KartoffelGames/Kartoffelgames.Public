import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { StatefullSerializeable } from '../../source/statefull_serialize/decorator/statefull-serializeable.decorator.ts';
import { StatefullSerializeableClasses } from '../../source/statefull_serialize/statefull-serializeable-classes.ts';
import { StatefullSerializer } from '../../source/statefull_serialize/statefull-serializer.ts';
import type { ObjectifiedBigInt, ObjectifiedClass, ObjectifiedSymbol } from '../../source/statefull_serialize/types/Objectified.type.ts';

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
                expect(lResult).toBe(lValue);
            });

            it('-- String', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: string = 'mystring';

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBe(lValue);
            });

            it('-- Boolean', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: boolean = true;

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBe(lValue);
            });

            it('-- Undefined', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: undefined = undefined;

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBe(lValue);
            });

            it('-- Null', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: null = null;

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBe(lValue);
            });

            it('-- Function', () => {
                // Setup.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lValue: any = () => { /* Empty */ };

                // Process.
                const lResult = lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBeUndefined();
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
            expect(lResult).toBeDeepEqual({
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
            expect(lResult).toBeDeepEqual({
                '&type': 'bigint',
                '&number': lValue.toString()
            });
        });

        it('-- Reference', () => {
            // Setup.
            const lSerializer: StatefullSerializer = new StatefullSerializer();
            const lValueList: any = { a: null };
            lValueList.a = lValueList;

            // Process.
            const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lValueList);

            // Evaluation. Property "a" has a reference on parent object. 
            expect(lResult['&values']['a']).toBeDeepEqual({
                '&type': 'reference',
                '&objectId': lResult['&objectId'],
            });
        });

        describe('-- Predefined', () => {
            it('-- Object', () => {
                // Setup.
                const lValue = { a: '241', b: '420' };
                const lSerializer: StatefullSerializer = new StatefullSerializer();

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lResult['&constructor'],
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': [],
                        'requiredValues': []
                    },
                    '&values': {
                        a: lValue.a,
                        b: lValue.b
                    }
                });
            });

            it('-- Array', () => {
                // Setup.
                const lValue: Array<string> = ['241', '420'];
                const lSerializer: StatefullSerializer = new StatefullSerializer();

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lResult['&constructor'],
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': [],
                        'requiredValues': []
                    },
                    '&values': {
                        0: lValue[0],
                        1: lValue[1],
                        length: lValue.length
                    }
                });
            });

            it('-- Date', () => {
                // Setup.
                const lValue: Date = new Date('1995-12-17T03:24:00');
                const lSerializer: StatefullSerializer = new StatefullSerializer();

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lResult['&constructor'],
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': [lValue.toString()],
                        'requiredValues': []
                    },
                    '&values': {}
                });
            });

            it('-- Set', () => {
                // Setup.
                const lSetValueList: Array<string> = ['241', '420'];
                const lValue: Set<string> = new Set<string>(lSetValueList);
                const lSerializer: StatefullSerializer = new StatefullSerializer();

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lResult['&constructor'],
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': [{
                            '&type': 'class',
                            '&constructor': (<ObjectifiedClass>lResult['&initialisation']['parameter'][0])['&constructor'],
                            '&objectId': (<ObjectifiedClass>lResult['&initialisation']['parameter'][0])['&objectId'],
                            '&initialisation': {
                                'parameter': [],
                                'requiredValues': []
                            },
                            '&values': {
                                '0': lSetValueList[0],
                                '1': lSetValueList[1],
                                'length': lSetValueList.length
                            }
                        }],
                        'requiredValues': []
                    },
                    '&values': {}
                });
            });

            it('-- Map', () => {
                // Setup.
                const lKeyValueTuble: [string, string] = ['241', '420'];
                const lValue: Map<string, string> = new Map<string, string>([lKeyValueTuble]);
                const lSerializer: StatefullSerializer = new StatefullSerializer();

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lResult['&constructor'],
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': [{
                            '&type': 'class',
                            '&constructor': (<ObjectifiedClass>lResult['&initialisation']['parameter'][0])['&constructor'],
                            '&objectId': (<ObjectifiedClass>lResult['&initialisation']['parameter'][0])['&objectId'],
                            '&initialisation': {
                                'parameter': [],
                                'requiredValues': []
                            },
                            '&values': {
                                '0': {
                                    '&constructor': (<ObjectifiedClass>(<ObjectifiedClass>lResult['&initialisation']['parameter'][0])['&values']['0'])['&constructor'],
                                    '&initialisation': {
                                        'parameter': [],
                                        'requiredValues': []
                                    },
                                    '&objectId': (<ObjectifiedClass>(<ObjectifiedClass>lResult['&initialisation']['parameter'][0])['&values']['0'])['&objectId'],
                                    '&type': 'class',
                                    '&values': {
                                        '0': lKeyValueTuble[0],
                                        '1': lKeyValueTuble[1],
                                        'length': lKeyValueTuble.length
                                    }
                                },
                                'length': 1
                            }
                        }],
                        'requiredValues': []
                    },
                    '&values': {}
                });
            });

            it('-- TypedArray', () => {
                // Setup.
                const lValueList: Array<number> = [87, 27];
                const lValue: Uint8Array = new Uint8Array(lValueList);
                const lSerializer: StatefullSerializer = new StatefullSerializer();

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lValue);

                // Evaluation.
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lResult['&constructor'],
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': [lValueList.length],
                        'requiredValues': []
                    },
                    '&values': {
                        0: lValue[0],
                        1: lValue[1],
                    }
                });
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
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': lParameter,
                        'requiredValues': []
                    },
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
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': lParameter,
                        'requiredValues': []
                    },
                    '&values': {
                        mObject: {
                            '&type': 'class',
                            '&constructor': lClassIdChild,
                            '&objectId': (<ObjectifiedClass>lResult['&values']['mObject'])['&objectId'],
                            '&initialisation': {
                                'parameter': lParameter,
                                'requiredValues': []
                            },
                            '&values': { mInner: lParameter[0] }
                        }
                    }
                });
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
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': lParameter,
                        'requiredValues': []
                    },
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
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': [],
                        'requiredValues': []
                    },
                    '&values': {}
                });
            });

            it('-- Required values', () => {
                // Setup.
                const lRequiredName: string = 'RequiredValue';
                const lRequiredValue: number = 241;
                const lClassId: string = '474b291a-4b9e-497d-a491-5813e90ae6ad';

                // Setup. Create class.
                class TestClass { }

                // Setup. Register class.
                new StatefullSerializeableClasses().registerClass(TestClass, lClassId, () => {
                    return {
                        requiredValues: [{ propertyName: lRequiredName, value: lRequiredValue }]
                    };
                });

                // Setup. Define test values.
                const lSerializer: StatefullSerializer = new StatefullSerializer();
                const lTestObject: TestClass = new TestClass();

                // Process.
                const lResult: ObjectifiedClass = <ObjectifiedClass>lSerializer.objectify(lTestObject);

                // Evaluation.
                expect(lResult).toBeDeepEqual({
                    '&type': 'class',
                    '&constructor': lClassId,
                    '&objectId': lResult['&objectId'],
                    '&initialisation': {
                        'parameter': [],
                        'requiredValues': [{ propertyName: lRequiredName, value: lRequiredValue }]
                    },
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
            expect(lResult).toBe('241');
        });
    });
});


