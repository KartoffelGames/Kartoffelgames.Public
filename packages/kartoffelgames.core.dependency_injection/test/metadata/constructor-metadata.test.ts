import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { ConstructorMetadata } from '../../source/metadata/constructor-metadata.ts';
import { Metadata } from "../../source/metadata/metadata.ts";
import { PropertyMetadata } from '../../source/metadata/property-metadata.ts';
import { InjectionConstructor } from '../../source/type.ts';

describe('ConstructorMetadata', () => {
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
            expect(lResultMetadatavalue).toBe(lMetadataValue);
        });

        it('-- Missing Metadata', () => {
            // Setup. Specify values.
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            const lResultMetadatavalue: string | null = lMetadata.getMetadata('AnyKey');

            // Evaluation.
            expect(lResultMetadatavalue).toBeNull();
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
            expect(lResultMetadatavalue).toBe(lMetadataValue);
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
            expect(lInnerConstructorMetadata).toBe(lOuterConstructorMetadata);
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
            const lResultMetadatavalue: Array<string> | null = lMetadata.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).toBeDeepEqual([lMetadataValue]);
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
            const lResultMetadatavalue: Array<string> | null = lMetadataC.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).toBeDeepEqual([lMetadataValueA, lMetadataValueB, lMetadataValueC]);
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
            const lResultMetadatavalue: Array<string> | null = lMetadataC.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).toBeDeepEqual([lMetadataValueA, lMetadataValueB]);
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
            const lResultMetadatavalue: Array<string> | null = lMetadataB.getInheritedMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).toBeDeepEqual([lMetadataValueA, lMetadataValueB]);
        });
    });

    describe('-- Static Method: get', () => {
        it('-- Create New Metadata', () => {
            // Setup.
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            const lConstructorMetadata = lMetadata.getProperty('SomeProperty');

            // Evaluation.
            expect(lConstructorMetadata).toBeInstanceOf(PropertyMetadata);
        });

        it('-- Get Existing Metadata ', () => {
            // Setup.
            const lPropertyName: string = 'SomeProperty';
            const lMetadata: ConstructorMetadata = new ConstructorMetadata(class { });

            // Process.
            const lOldConstructorMetadata = lMetadata.getProperty(lPropertyName);
            const lNewConstructorMetadata = lMetadata.getProperty(lPropertyName);

            // Evaluation.
            expect(lOldConstructorMetadata).toBe(lNewConstructorMetadata);
        });
    });
});