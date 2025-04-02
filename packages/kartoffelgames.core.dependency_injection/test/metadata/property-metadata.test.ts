import { expect } from '@kartoffelgames/core-test';
import { Metadata } from '../../source/metadata/metadata.ts';
import { PropertyMetadata } from '../../source/metadata/property-metadata.ts';

Deno.test('PropertyMetadata.getMetadata()', async (pContext) => {
    await pContext.step('Available Metadata', () => {
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

    await pContext.step('Missing Metadata', () => {
        // Setup. Specify values.
        const lMetadata: PropertyMetadata = new PropertyMetadata();

        // Process.
        const lResultMetadatavalue: string | null = lMetadata.getMetadata('AnyKey');

        // Evaluation.
        expect(lResultMetadatavalue).toBeNull();
    });
});

Deno.test('PropertyMetadata.setMetadata()', async (pContext) => {
    await pContext.step('Default', () => {
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

    await pContext.step('Overwrite value', () => {
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

    await pContext.step('Get inside decorator', () => {
        // Setup. Create decorator that reads metadata inside decorator.
        let lInnerPropertyMetadata: PropertyMetadata | null = null;
        const lInnerDecorator = (_pOriginalTarget: any, pContext: ClassFieldDecoratorContext) => {
            lInnerPropertyMetadata = Metadata.forInternalDecorator(pContext.metadata).getProperty(pContext.name);
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