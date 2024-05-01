import { expect } from 'chai';
import { PropertyMetadata } from '../../../source/metadata/property-metadata';
import { InjectionConstructor } from '../../../source/type';

describe('ConstructorMetadata', () => {
    describe('Property: parameterTypes', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lParameterTypeList: Array<InjectionConstructor> = [String, Number];
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.setMetadata('design:paramtypes', lParameterTypeList);

            // Process.
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.have.ordered.members(lParameterTypeList);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lParameterTypeList: Array<InjectionConstructor> = [String, Number];
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            lMetadata.setMetadata('design:paramtypes', lParameterTypeList);
            const lResultParameterList: Array<InjectionConstructor> | null = lMetadata.parameterTypes;

            // Evaluation.
            expect(lResultParameterList).to.have.ordered.members(lParameterTypeList);
        });

        it('-- Write null', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

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
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.setMetadata('design:returntype', lReturnType);

            // Process.
            const lResultReturnType: InjectionConstructor | null = lMetadata.returnType;

            // Evaluation.
            expect(lResultReturnType).to.equal(lReturnType);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultReturnType: InjectionConstructor | null = lMetadata.returnType;

            // Evaluation.
            expect(lResultReturnType).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lReturnType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata();

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
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.setMetadata('design:type', lType);

            // Process.
            const lResultType: InjectionConstructor | null = lMetadata.type;

            // Evaluation.
            expect(lResultType).to.equal(lType);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultType: InjectionConstructor | null = lMetadata.type;

            // Evaluation.
            expect(lResultType).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata();

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
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: string = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Missing Metadata', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultMetadatavalue: string = lMetadata.getMetadata('AnyKey');

            // Evaluation.
            expect(lResultMetadatavalue).to.be.null;
        });
    });

    describe('Method: getMetadata', () => {
        it('-- Default', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'MetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: string = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Overwrite value', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'NewMetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            lMetadata.setMetadata(lMetadataKey, 'OldMetadataValue');
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);
            const lResultMetadatavalue: string = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });
    });
});