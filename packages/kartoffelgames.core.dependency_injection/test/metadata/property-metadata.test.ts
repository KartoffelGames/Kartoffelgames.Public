import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { Metadata } from '../../source/metadata/metadata.ts';
import { PropertyMetadata } from '../../source/metadata/property-metadata.ts';

describe('PropertyMetadata', () => {
    describe('Method: getMetadata', () => {
        it('-- Available Metadata', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'MetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).toBe(lMetadataValue);
        });

        it('-- Missing Metadata', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultMetadatavalue: string | null = lMetadata.getMetadata('AnyKey');

            // Evaluation.
            expect(lResultMetadatavalue).toBeNull;
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
            const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).toBe(lMetadataValue);
        });

        it('-- Overwrite value', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'NewMetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            lMetadata.setMetadata(lMetadataKey, 'OldMetadataValue');
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);
            const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).toBe(lMetadataValue);
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
            expect(lInnerPropertyMetadata).toBe(lOuterPropertyMetadata);
        });
    });
});