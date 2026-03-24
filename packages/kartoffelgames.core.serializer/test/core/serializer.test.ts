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
        expect(lMetadata!.identifier).toBe(lUuid);
    });

    await pContext.step('Resolve registered constructor by UUID', () => {
        // Setup.
        const lUuid: string = 'test-class-uuid-resolve';

        @Serializer.serializeableClass(lUuid)
        class TestClass { }

        // Process.
        const lResolved = Serializer.classOfIdentifier(lUuid);

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
        expect(lIllegalInstruction).toThrow(`Serializer identifier "${lUuid}" is already registered.`);
    });

    await pContext.step('Throw when resolving unregistered UUID', () => {
        // Process.
        const lIllegalInstruction = () => {
            Serializer.classOfIdentifier('nonexistent-uuid');
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
        expect(lPropertyNames).toContain('name');
        expect(lPropertyNames).toContain('age');
        expect(lPropertyNames).toContain('active');
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

Deno.test('Serializer inheritance', async (pContext) => {
    await pContext.step('Child inherits parent serializable properties', () => {
        // Setup.
        @Serializer.serializeableClass('test-inherit-parent-1')
        class Parent {
            @Serializer.property()
            public name: string = '';
        }

        @Serializer.serializeableClass('test-inherit-child-1')
        class Child extends Parent {
            @Serializer.property()
            public age: number = 0;
        }

        // Process.
        const lMetadata = Serializer.metadataOf(Child)!;

        // Evaluation.
        expect(lMetadata).not.toBeNull();
        expect(lMetadata.propertyNames.length).toBe(2);
        expect(lMetadata.propertyNames).toContain('name');
        expect(lMetadata.propertyNames).toContain('age');
        expect(lMetadata.identifier).toBe('test-inherit-child-1');
    });

    await pContext.step('Parent metadata is not affected by child', () => {
        // Setup.
        @Serializer.serializeableClass('test-inherit-parent-2')
        class Parent {
            @Serializer.property()
            public name: string = '';
        }

        @Serializer.serializeableClass('test-inherit-child-2')
        class Child extends Parent {
            @Serializer.property()
            public age: number = 0;
        }

        void Child;

        // Process.
        const lMetadata = Serializer.metadataOf(Parent)!;

        // Evaluation.
        expect(lMetadata.propertyNames.length).toBe(1);
        expect(lMetadata.propertyNames).toBeDeepEqual(['name']);
        expect(lMetadata.identifier).toBe('test-inherit-parent-2');
    });

    await pContext.step('Multi-level inheritance collects all properties', () => {
        // Setup.
        @Serializer.serializeableClass('test-inherit-base-3')
        class Base {
            @Serializer.property()
            public id: number = 0;
        }

        @Serializer.serializeableClass('test-inherit-middle-3')
        class Middle extends Base {
            @Serializer.property()
            public name: string = '';
        }

        @Serializer.serializeableClass('test-inherit-leaf-3')
        class Leaf extends Middle {
            @Serializer.property()
            public active: boolean = false;
        }

        // Process.
        const lMetadata = Serializer.metadataOf(Leaf)!;

        // Evaluation.
        expect(lMetadata).not.toBeNull();
        expect(lMetadata.propertyNames.length).toBe(3);
        expect(lMetadata.propertyNames).toContain('id');
        expect(lMetadata.propertyNames).toContain('name');
        expect(lMetadata.propertyNames).toContain('active');
        expect(lMetadata.identifier).toBe('test-inherit-leaf-3');
    });

    await pContext.step('Child overrides parent property config', () => {
        // Setup.
        @Serializer.serializeableClass('test-inherit-parent-4')
        class Parent {
            @Serializer.property({ alias: 'parent_alias' })
            public name: string = '';
        }

        @Serializer.serializeableClass('test-inherit-child-4')
        class Child extends Parent {
            @Serializer.property({ alias: 'child_alias' })
            public override name: string = '';
        }

        // Process.
        const lMetadata = Serializer.metadataOf(Child)!;

        // Evaluation.
        expect(lMetadata.propertyNames.length).toBe(1);
        expect(lMetadata.getPropertyConfig('name').alias).toBe('child_alias');
    });

    await pContext.step('Child without own properties inherits parent properties', () => {
        // Setup.
        @Serializer.serializeableClass('test-inherit-parent-5')
        class Parent {
            @Serializer.property()
            public name: string = '';

            @Serializer.property()
            public value: number = 0;
        }

        @Serializer.serializeableClass('test-inherit-child-5')
        class Child extends Parent { }

        // Process.
        const lMetadata = Serializer.metadataOf(Child)!;

        // Evaluation.
        expect(lMetadata).not.toBeNull();
        expect(lMetadata.propertyNames.length).toBe(2);
        expect(lMetadata.propertyNames).toContain('name');
        expect(lMetadata.propertyNames).toContain('value');
        expect(lMetadata.identifier).toBe('test-inherit-child-5');
    });

    await pContext.step('Parent without class decorator propagates properties to child', () => {
        // Setup. Parent has @Serializer.property() but no @Serializer.serializeableClass().
        class Parent {
            @Serializer.property()
            public name: string = '';
        }

        @Serializer.serializeableClass('test-inherit-child-6')
        class Child extends Parent {
            @Serializer.property()
            public age: number = 0;
        }

        // Process.
        const lMetadata = Serializer.metadataOf(Child)!;

        // Evaluation.
        expect(lMetadata).not.toBeNull();
        expect(lMetadata.propertyNames.length).toBe(2);
        expect(lMetadata.propertyNames).toContain('name');
        expect(lMetadata.propertyNames).toContain('age');
        expect(lMetadata.identifier).toBe('test-inherit-child-6');
    });
});
