import { expect } from 'chai';
import { StatefullSerializeable } from '../../../source/statefull_serialize/decorator/statefull-serializeable.decorator';
import { ObjectifiedAnonymousObject, ObjectifiedArray, ObjectifiedBigInt, ObjectifiedClass, ObjectifiedSymbol, StatefullSerializer } from '../../../source/statefull_serialize/statefull-serializer';

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

        it('-- BigInt', () => {
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
        });
    });
});


