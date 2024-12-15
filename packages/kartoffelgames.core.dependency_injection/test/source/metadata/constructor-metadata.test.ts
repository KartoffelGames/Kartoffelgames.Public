import { expect } from 'chai';
import { ConstructorMetadata } from '../../../source/metadata/constructor-metadata';
import { PropertyMetadata } from '../../../source/metadata/property-metadata';
import { InjectionConstructor } from '../../../source/type';
import { Metadata } from '../../../source';

describe('ConstructorMetadata', () => {
    describe('Property: parameterTypes', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lParameterTypeList: Array<InjectionConstructor> = [String, Number];
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });
            lMetadata.setMetadata('design:paramtypes', lParameterTypeList);

            // Process.
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.have.ordered.members(lParameterTypeList);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lParameterTypeList: Array<InjectionConstructor> = [String, Number];
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            lMetadata.setMetadata('design:paramtypes', lParameterTypeList);
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.have.ordered.members(lParameterTypeList);
        });
    });

    describe('Method: getMetadata', () => {
        it('-- Available Metadata', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'MetadataValue';
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Missing Metadata', () => {
            // Setup. Specify values.
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            const lResultMetadatavalue: string | null = lMetadata.getMetadata('AnyKey');

            // Evaluation.
            expect(lResultMetadatavalue).to.be.null;
        });

        it('-- Overwrite value', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'NewMetadataValue';
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            lMetadata.setMetadata(lMetadataKey, 'OldMetadataValue');
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);
            const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Get inside decorator', () => {
            // Setup. Create decorator that reads metadata inside decorator.
            let lInnerConstructorMetadata: ConstructorMetadata | null = null;
            const lInnerDecorator = (pConstructor: InjectionConstructor): any => {
                lInnerConstructorMetadata = Metadata.get(<any>pConstructor.prototype.constructor);
            };

            // Process.
            @lInnerDecorator
            class Test { }

            // Process. Read outer metadata.
            const lOuterConstructorMetadata: ConstructorMetadata = Metadata.get(Test);

            // Evaluation.
            expect(lInnerConstructorMetadata).to.equal(lOuterConstructorMetadata);
        });
    });

    describe('Method: getInheritedMetadata', () => {
        it('-- Without inherited data', () => {
            // Setup. Inheritance chain.
            class A { }
            class B extends A { }
            class C extends B { }

            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'NewMetadataValue';
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(C);

            // Setup set metadata.
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: Array<string> = lMetadata.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.deep.equal([lMetadataValue]);
        });

        it('-- With inherited data', () => {
            // Setup. Inheritance chain.
            class A { }
            class B extends A { }
            class C extends B { }

            const lMetadataKey: string = 'MetadataKey';

            // Setup. C.
            const lMetadataValueC: string = 'NewMetadataValueC';
            const lMetadataC: ConstructorMetadata = Metadata.get(C);
            lMetadataC.setMetadata(lMetadataKey, lMetadataValueC);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: ConstructorMetadata = Metadata.get(B);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: ConstructorMetadata = Metadata.get(A);
            lMetadataA.setMetadata(lMetadataKey, lMetadataValueA);

            // Process.
            const lResultMetadatavalue: Array<string> = lMetadataC.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.deep.equal([lMetadataValueA, lMetadataValueB, lMetadataValueC]);
        });

        it('-- With only inherited data', () => {
            // Setup. Inheritance chain.
            class A { }
            class B extends A { }
            class C extends B { }

            const lMetadataKey: string = 'MetadataKey';

            // Setup. C.
            const lMetadataC: ConstructorMetadata = Metadata.get(C);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: ConstructorMetadata = Metadata.get(B);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: ConstructorMetadata = Metadata.get(A);
            lMetadataA.setMetadata(lMetadataKey, lMetadataValueA);

            // Process.
            const lResultMetadatavalue: Array<string> = lMetadataC.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.deep.equal([lMetadataValueA, lMetadataValueB]);
        });

        it('-- Read inherited data from parent', () => {
            // Setup. Inheritance chain.
            class A { }
            class B extends A { }
            class C extends B { }

            const lMetadataKey: string = 'MetadataKey';

            // Setup. C.
            const lMetadataValueC: string = 'NewMetadataValueC';
            const lMetadataC: ConstructorMetadata = Metadata.get(C);
            lMetadataC.setMetadata(lMetadataKey, lMetadataValueC);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: ConstructorMetadata = Metadata.get(B);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: ConstructorMetadata = Metadata.get(A);
            lMetadataA.setMetadata(lMetadataKey, lMetadataValueA);

            // Process.
            const lResultMetadatavalue: Array<string> = lMetadataB.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.deep.equal([lMetadataValueA, lMetadataValueB]);
        });
    });

    describe('-- Static Method: get', () => {
        it('-- Create New Metadata', () => {
            // Setup.
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            const lConstructorMetadata = lMetadata.getProperty('SomeProperty');

            // Evaluation.
            expect(lConstructorMetadata).to.be.instanceOf(PropertyMetadata);
        });

        it('-- Get Existing Metadata ', () => {
            // Setup.
            const lPropertyName: string = 'SomeProperty';
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            const lOldConstructorMetadata = lMetadata.getProperty(lPropertyName);
            const lNewConstructorMetadata = lMetadata.getProperty(lPropertyName);

            // Evaluation.
            expect(lOldConstructorMetadata).to.equal(lNewConstructorMetadata);
        });
    });
});