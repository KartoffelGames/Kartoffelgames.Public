import { expect } from '@kartoffelgames/core-test';
import { ConstructorMetadata } from '../../source/metadata/constructor-metadata.ts';
import { Metadata } from '../../source/metadata/metadata.ts';
import { PropertyMetadata } from '../../source/metadata/property-metadata.ts';

Deno.test('ConstructorMetadata.getMetadata()', async (pContext) => {
    await pContext.step('Available Metadata', () => {
        // Setup. Specify values.
        const lMetadataKey: string = 'MetadataKey';
        const lMetadataValue: string = 'MetadataValue';
        const lMetadata: ConstructorMetadata = new ConstructorMetadata({});
        lMetadata.setMetadata(lMetadataKey, lMetadataValue);

        // Process.
        const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

        // Evaluation.
        expect(lResultMetadatavalue).toBe(lMetadataValue);
    });

    await pContext.step('Missing Metadata', () => {
        // Setup. Specify values.
        const lMetadata: ConstructorMetadata = new ConstructorMetadata({});

        // Process.
        const lResultMetadatavalue: string | null = lMetadata.getMetadata('AnyKey');

        // Evaluation.
        expect(lResultMetadatavalue).toBeNull();
    });

    await pContext.step('Overwrite value', () => {
        // Setup. Specify values.
        const lMetadataKey: string = 'MetadataKey';
        const lMetadataValue: string = 'NewMetadataValue';
        const lMetadata: ConstructorMetadata = new ConstructorMetadata({});

        // Process.
        lMetadata.setMetadata(lMetadataKey, 'OldMetadataValue');
        lMetadata.setMetadata(lMetadataKey, lMetadataValue);
        const lResultMetadatavalue: string | null = lMetadata.getMetadata(lMetadataKey);

        // Evaluation.
        expect(lResultMetadatavalue).toBe(lMetadataValue);
    });

    await pContext.step('Get inside decorator', () => {
        // Setup. Create decorator that reads metadata inside decorator.
        let lInnerConstructorMetadata: ConstructorMetadata | null = null;
        const lInnerDecorator = (_pTarget: any, pContext: ClassDecoratorContext): any => {
            lInnerConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);
        };

        // Process.
        @lInnerDecorator
        class Test { }

        // Process. Read outer metadata.
        const lOuterConstructorMetadata: ConstructorMetadata = Metadata.get(Test);

        // Evaluation.
        expect(lInnerConstructorMetadata).toBe(lOuterConstructorMetadata);
    });
});

Deno.test('ConstructorMetadata.getInheritedMetadata()', async (pContext) => {
    await pContext.step('Without inherited data', () => {
        // Setup. Inheritance chain.
        class A { }
        class B extends A { }
        class C extends B { }

        // Setup. Specify values.
        const lMetadataKey: string = 'MetadataKey';
        const lMetadataValue: string = 'NewMetadataValue';
        const lMetadata: ConstructorMetadata = Metadata.get(C);

        // Setup set metadata.
        lMetadata.setMetadata(lMetadataKey, lMetadataValue);

        // Process.
        const lResultMetadatavalue: Array<string> = lMetadata.getInheritedMetadata(lMetadataKey);

        // Evaluation.
        expect(lResultMetadatavalue).toBeDeepEqual([lMetadataValue]);
    });

    await pContext.step('With inherited data', () => {
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
        expect(lResultMetadatavalue).toBeDeepEqual([lMetadataValueA, lMetadataValueB, lMetadataValueC]);
    });

    await pContext.step('With only inherited data', () => {
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
        expect(lResultMetadatavalue).toBeDeepEqual([lMetadataValueA, lMetadataValueB]);
    });

    await pContext.step('Read inherited data from parent', () => {
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
        expect(lResultMetadatavalue).toBeDeepEqual([lMetadataValueA, lMetadataValueB]);
    });
});

Deno.test('ConstructorMetadata.get()', async (pContext) => {
    await pContext.step('Create New Metadata', () => {
        // Setup.
        const lMetadata: ConstructorMetadata = new ConstructorMetadata({});

        // Process.
        const lConstructorMetadata = lMetadata.getProperty('SomeProperty');

        // Evaluation.
        expect(lConstructorMetadata).toBeInstanceOf(PropertyMetadata);
    });

    await pContext.step('Get Existing Metadata', () => {
        // Setup.
        const lPropertyName: string = 'SomeProperty';
        const lMetadata: ConstructorMetadata = new ConstructorMetadata({});

        // Process.
        const lOldConstructorMetadata = lMetadata.getProperty(lPropertyName);
        const lNewConstructorMetadata = lMetadata.getProperty(lPropertyName);

        // Evaluation.
        expect(lOldConstructorMetadata).toBe(lNewConstructorMetadata);
    });
});