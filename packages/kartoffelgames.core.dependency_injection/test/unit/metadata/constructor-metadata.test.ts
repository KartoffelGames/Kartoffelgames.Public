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
    });

    describe('Method: getMetadata', () => {
        it('-- Default', () => {
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