import { expect } from 'chai';
import { AddMetadata } from '../../../source/decorator/add-metadata.decorator';
import { Metadata } from '../../../source/metadata/metadata';

describe('ExtendedMetadata', () => {
    describe('Decorator: Metadata', () => {
        it('-- Constructor Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};

            // Process.
            @AddMetadata(lMetadataKey, lMetadataValue)
            class TestA { }

            // Process. Read metadata.
            const lResultMetadataValue: object | null = Metadata.get(TestA).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });

        it('-- Property Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};
            const lPropertyName: unique symbol = Symbol('propertyname');

            // Process.         
            class TestA {
                @AddMetadata(lMetadataKey, lMetadataValue)
                public [lPropertyName]?: string;
            }

            // Process. Read metadata.
            const lResultMetadataValue: object | null = Metadata.get(TestA).getProperty(lPropertyName).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });

        it('-- Property Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};

            // Process.         
            class TestA {
                @AddMetadata(lMetadataKey, lMetadataValue)
                public function(): string { return ''; }
            }

            // Process. Read metadata.
            const lResultMetadataValue: object | null = Metadata.get(TestA).getProperty('function').getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });

        it('-- Accessor Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};
            const lPropertyName: unique symbol = Symbol('propertyname');

            // Process.         
            class TestA {
                @AddMetadata(lMetadataKey, lMetadataValue)
                public get [lPropertyName](): string { return ''; }
            }

            // Process. Read metadata.
            const lResultMetadataValue: object | null = Metadata.get(TestA).getProperty(lPropertyName).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });
    });
});