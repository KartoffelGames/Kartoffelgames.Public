import { expect } from '@kartoffelgames/core-test';
import { Serializer } from '../../source/core/serializer.ts';

Deno.test('Serializer.class()', async (pContext) => {
    await pContext.step('Register class with UUID', () => {
        // Setup.
        const lUuid: string = 'test-class-uuid-1';

        // Process.
        @Serializer.serializeableClass(lUuid)
        class TestClass { }

        // Evaluation.
        const lMetadata = Serializer.metadataOf(TestClass);
        expect(lMetadata).not.toBeNull();
        expect(lMetadata!.uuid).toBe(lUuid);
    });

    await pContext.step('Resolve registered constructor by UUID', () => {
        // Setup.
        const lUuid: string = 'test-class-uuid-resolve';

        @Serializer.serializeableClass(lUuid)
        class TestClass { }

        // Process.
        const lResolved = Serializer.classOfUuid(lUuid);

        // Evaluation.
        expect(lResolved).toBe(TestClass);
    });

    await pContext.step('Throw on duplicate UUID registration', () => {
        // Setup.
        const lUuid: string = 'test-class-uuid-duplicate';

        @Serializer.serializeableClass(lUuid)
        class TestClassA { }

        void TestClassA;

        // Process.
        const lIllegalInstruction = () => {
            @Serializer.serializeableClass(lUuid)
            class TestClassB { }

            void TestClassB;
        };

        // Evaluation.
        expect(lIllegalInstruction).toThrow(`Serializer UUID "${lUuid}" is already registered.`);
    });

    await pContext.step('Throw when resolving unregistered UUID', () => {
        // Process.
        const lIllegalInstruction = () => {
            Serializer.classOfUuid('nonexistent-uuid');
        };

        // Evaluation.
        expect(lIllegalInstruction).toThrow('Serializer type "nonexistent-uuid" is not registered. Ensure @Serializer.class() is applied and the class is imported before deserialization.');
    });

    await pContext.step('Return null metadata for unregistered class', () => {
        // Setup.
        class UnregisteredClass { }

        // Process.
        const lMetadata = Serializer.metadataOf(UnregisteredClass);

        // Evaluation.
        expect(lMetadata).toBeNull();
    });
});

Deno.test('Serializer.property()', async (pContext) => {
    await pContext.step('Register property without config', () => {
        // Setup.
        const lUuid: string = 'test-prop-uuid-1';

        // Process.
        @Serializer.serializeableClass(lUuid)
        class TestClass {
            @Serializer.property()
            public name: string = '';
        }

        // Evaluation. Prevent unused warning.
        void TestClass;
        const lMetadata = Serializer.metadataOf(TestClass)!;
        expect(lMetadata.propertyNames).toBeDeepEqual(['name']);
    });

    await pContext.step('Register property with alias', () => {
        // Setup.
        const lUuid: string = 'test-prop-uuid-alias';
        const lAlias: string = 'n';

        // Process.
        @Serializer.serializeableClass(lUuid)
        class TestClass {
            @Serializer.property({ alias: lAlias })
            public name: string = '';
        }

        // Evaluation.
        void TestClass;
        const lMetadata = Serializer.metadataOf(TestClass)!;
        const lConfig = lMetadata.getPropertyConfig('name');
        expect(lConfig.alias).toBe(lAlias);
    });

    await pContext.step('Register multiple properties', () => {
        // Setup.
        const lUuid: string = 'test-prop-uuid-multi';

        // Process.
        @Serializer.serializeableClass(lUuid)
        class TestClass {
            @Serializer.property()
            public active: boolean = false;

            @Serializer.property()
            public age: number = 0;

            @Serializer.property()
            public name: string = '';
        }

        // Evaluation.
        void TestClass;
        const lMetadata = Serializer.metadataOf(TestClass)!;
        const lPropertyNames = lMetadata.propertyNames;
        expect(lPropertyNames.length).toBe(3);
        expect(lPropertyNames.includes('name')).toBeTruthy();
        expect(lPropertyNames.includes('age')).toBeTruthy();
        expect(lPropertyNames.includes('active')).toBeTruthy();
    });

    await pContext.step('Undecorated properties are excluded', () => {
        // Setup.
        const lUuid: string = 'test-prop-uuid-exclude';

        // Process.
        @Serializer.serializeableClass(lUuid)
        class TestClass {
            @Serializer.property()
            public name: string = '';

            public notSerialized: string = '';
        }

        // Evaluation.
        void TestClass;
        const lMetadata = Serializer.metadataOf(TestClass)!;
        expect(lMetadata.propertyNames).toBeDeepEqual(['name']);
    });

    await pContext.step('Register getter property', () => {
        // Setup.
        const lUuid: string = 'test-prop-uuid-getter';

        // Process.
        @Serializer.serializeableClass(lUuid)
        class TestClass {
            private mValue: string = '';

            @Serializer.property()
            public get value(): string {
                return this.mValue;
            }

            public set value(pValue: string) {
                this.mValue = pValue;
            }
        }

        // Evaluation.
        void TestClass;
        const lMetadata = Serializer.metadataOf(TestClass)!;
        expect(lMetadata.propertyNames).toBeDeepEqual(['value']);
    });

    await pContext.step('Throw on static property', () => {
        // Process.
        const lIllegalInstruction = () => {
            class TestClass {
                @Serializer.property()
                public static name: string = '';
            }

            void TestClass;
        };

        // Evaluation.
        expect(lIllegalInstruction).toThrow('@Serializer.property() is not supported for static members.');
    });
});
