import { expect } from 'chai';
import { ConstructorMetadata } from '../../../source/metadata/constructor-metadata';
import { PropertyMetadata } from '../../../source/metadata/property-metadata';
import { InjectionConstructor } from '../../../source/type';

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
            const lMetadataC: ConstructorMetadata = new ConstructorMetadata(C);
            lMetadataC.setMetadata(lMetadataKey, lMetadataValueC);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: ConstructorMetadata = new ConstructorMetadata(B);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: ConstructorMetadata = new ConstructorMetadata(A);
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
            const lMetadataC: ConstructorMetadata = new ConstructorMetadata(C);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: ConstructorMetadata = new ConstructorMetadata(B);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: ConstructorMetadata = new ConstructorMetadata(A);
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
            const lMetadataC: ConstructorMetadata = new ConstructorMetadata(C);
            lMetadataC.setMetadata(lMetadataKey, lMetadataValueC);

            // Setup. B.
            const lMetadataValueB: string = 'NewMetadataValueB';
            const lMetadataB: ConstructorMetadata = new ConstructorMetadata(B);
            lMetadataB.setMetadata(lMetadataKey, lMetadataValueB);

            // Setup. A.
            const lMetadataValueA: string = 'NewMetadataValueA';
            const lMetadataA: ConstructorMetadata = new ConstructorMetadata(A);
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