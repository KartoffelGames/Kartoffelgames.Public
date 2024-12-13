import { expect } from 'chai';
import { PropertyMetadata } from '../../../source/metadata/property-metadata';
import { InjectionConstructor } from '../../../source/type';
import { Metadata } from '../../../source/metadata/metadata';

describe('PropertyMetadata', () => {
    describe('Property: parameterTypes', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lParameterTypeList: Array<InjectionConstructor> = [String, Number];
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');
            lMetadata.setMetadata('design:paramtypes', lParameterTypeList);

            // Process.
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.have.ordered.members(lParameterTypeList);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lParameterTypeList: Array<InjectionConstructor> = [String, Number];
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            lMetadata.setMetadata('design:paramtypes', lParameterTypeList);
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.have.ordered.members(lParameterTypeList);
        });

        it('-- Write null', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            lMetadata.setMetadata('design:paramtypes', null);
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.be.null;
        });
    });

    describe('Property: returnType', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lReturnType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');
            lMetadata.setMetadata('design:returntype', lReturnType);

            // Process.
            const lResultReturnType: InjectionConstructor | null = lMetadata.returnType;

            // Evaluation.
            expect(lResultReturnType).to.equal(lReturnType);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            const lResultReturnType: InjectionConstructor | null = lMetadata.returnType;

            // Evaluation.
            expect(lResultReturnType).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lReturnType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            lMetadata.setMetadata('design:returntype', lReturnType);
            const lResultReturnType: InjectionConstructor | null = lMetadata.returnType;

            // Evaluation.
            expect(lResultReturnType).to.equal(lReturnType);
        });
    });

    describe('Property: type', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');
            lMetadata.setMetadata('design:type', lType);

            // Process.
            const lResultType: InjectionConstructor | null = lMetadata.type;

            // Evaluation.
            expect(lResultType).to.equal(lType);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            const lResultType: InjectionConstructor | null = lMetadata.type;

            // Evaluation.
            expect(lResultType).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            lMetadata.setMetadata('design:type', lType);
            const lResultType: InjectionConstructor | null = lMetadata.type;

            // Evaluation.
            expect(lResultType).to.equal(lType);
        });
    });

    describe('Method: getMetadata', () => {
        it('-- Available Metadata', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'MetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Missing Metadata', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            const lResultMetadatavalue: string | null = lMetadata.getMetadata('AnyKey');

            // Evaluation.
            expect(lResultMetadatavalue).to.be.null;
        });
    });

    describe('Method: getMetadata', () => {
        it('-- Default', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'MetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Overwrite value', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'NewMetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata(class { }, '');

            // Process.
            lMetadata.setMetadata(lMetadataKey, 'OldMetadataValue');
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);
            const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Get inside decorator', () => {
            // Setup. Create decorator that reads metadata inside decorator.
            let lInnerPropertyMetadata: PropertyMetadata | null = null;
            const lInnerDecorator = (pTarget: object, pPropertyKey: string): any => {
                lInnerPropertyMetadata = Metadata.get((<any>pTarget).constructor).getProperty(pPropertyKey);
            };

            // Process.
            class Test {
                @lInnerDecorator
                public id!: number;
            }

            // Process. Read outer metadata.
            const lOuterPropertyMetadata: PropertyMetadata = Metadata.get(Test).getProperty('id');

            // Evaluation.
            expect(lInnerPropertyMetadata).to.equal(lOuterPropertyMetadata);
        });
    });

    describe('Method: getInheritedMetadata', () => {
        it('-- Without inherited data', () => {
            // Setup. Global information.
            const lPropertyKey: string = 'PropertyKey';

            // Setup. Inheritance chain.
            class A { }
            class B extends A { }
            class C extends B { }

            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'NewMetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata(C, lPropertyKey);

            // Setup set metadata.
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: Array<string> = lMetadata.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.deep.equal([lMetadataValue]);
        });

        it('-- With inherited data', () => {
            // Setup. Global information.
            const lPropertyKey: string = 'PropertyKey';

            // Setup. Inheritance chain.
            class A { }
            class B extends A { }
            class C extends B { }

            const lMetadataKey: string = 'MetadataKey';

            // Setup. C.
            const lMetadataValueC: string = 'NewMetadataValueC';
            const lMetadataC: PropertyMetadata = Metadata.get(C).getProperty(lPropertyKey);
            lMetadataC.setMetadata(lMetadataKey, lMetadataValueC);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: PropertyMetadata = Metadata.get(B).getProperty(lPropertyKey);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: PropertyMetadata = Metadata.get(A).getProperty(lPropertyKey);
            lMetadataA.setMetadata(lMetadataKey, lMetadataValueA);

            // Process.
            const lResultMetadatavalue: Array<string> = lMetadataC.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.deep.equal([lMetadataValueA, lMetadataValueB, lMetadataValueC]);
        });

        it('-- With only inherited data', () => {
            // Setup. Global information.
            const lPropertyKey: string = 'PropertyKey';

            // Setup. Inheritance chain.
            class A { }
            class B extends A { }
            class C extends B { }

            const lMetadataKey: string = 'MetadataKey';

            // Setup. C.
            const lMetadataC: PropertyMetadata = Metadata.get(C).getProperty(lPropertyKey);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: PropertyMetadata = Metadata.get(B).getProperty(lPropertyKey);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: PropertyMetadata = Metadata.get(A).getProperty(lPropertyKey);
            lMetadataA.setMetadata(lMetadataKey, lMetadataValueA);

            // Process.
            const lResultMetadatavalue: Array<string> = lMetadataC.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.deep.equal([lMetadataValueA, lMetadataValueB]);
        });

        it('-- Read inherited data from parent', () => {
            // Setup. Global information.
            const lPropertyKey: string = 'PropertyKey';

            // Setup. Inheritance chain.
            class A { }
            class B extends A { }
            class C extends B { }

            const lMetadataKey: string = 'MetadataKey';

            // Setup. C.
            const lMetadataValueC: string = 'NewMetadataValueC';
            const lMetadataC: PropertyMetadata = Metadata.get(C).getProperty(lPropertyKey);
            lMetadataC.setMetadata(lMetadataKey, lMetadataValueC);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: PropertyMetadata = Metadata.get(B).getProperty(lPropertyKey);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: PropertyMetadata = Metadata.get(A).getProperty(lPropertyKey);
            lMetadataA.setMetadata(lMetadataKey, lMetadataValueA);

            // Process.
            const lResultMetadatavalue: Array<string> = lMetadataB.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.deep.equal([lMetadataValueA, lMetadataValueB]);
        });
    });
});