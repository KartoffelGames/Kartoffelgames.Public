import { expect } from '@kartoffelgames/core-test';
import { StatefullSerializeable } from '../../source/statefull_serialize/decorator/statefull-serializeable.decorator.ts';
import { StatefullSerializeableClasses, type StatefullSerializerInitializationParameter } from '../../source/statefull_serialize/statefull-serializeable-classes.ts';
import type { SerializeableConstructor, SerializeableGuid } from '../../source/type.ts';

Deno.test('StatefullSerializeableClasses.getClass()', async (pContext) => {
    await pContext.step('Existing class', () => {
        // Setup.
        const lClassId: SerializeableGuid = 'b0748b84-114c-4898-b646-179b8469f586';

        // Create class.
        @StatefullSerializeable(lClassId)
        class TestObject { }

        // Process.
        const lConstructor: SerializeableConstructor = new StatefullSerializeableClasses().getClass(lClassId);

        // Evaluation.
        expect(lConstructor).toBe(TestObject);
    });

    await pContext.step('Missing class', () => {
        // Setup.
        const lClassId: SerializeableGuid = '7d5ce7ce-3185-4afa-b5ee-520384030bb6';

        // Process.
        const lErrorFunction = () => {
            new StatefullSerializeableClasses().getClass(lClassId);
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('ClassId is not registered.');
    });
});

Deno.test('StatefullSerializeableClasses.getClassId()', async (pContext) => {
    await pContext.step('Existing class', () => {
        // Setup.
        const lClassId: SerializeableGuid = 'd51cb88d-df40-4a3a-ac39-2f9ba40031ad';

        // Create class.
        @StatefullSerializeable(lClassId)
        class TestObject { }

        // Process.
        const lResultClassId: SerializeableGuid = new StatefullSerializeableClasses().getClassId(TestObject);

        // Evaluation.
        expect(lResultClassId).toBe(lClassId);
    });

    await pContext.step('Missing class', () => {
        // Setup.
        class TestObject { }

        // Process.
        const lErrorFunction = () => {
            new StatefullSerializeableClasses().getClassId(TestObject);
        };

        // Evaluation.
        expect(lErrorFunction).toThrow(`Constructor "${TestObject.name}" is not registered.`);
    });
});

Deno.test('StatefullSerializeableClasses.registerClass()', () => {
    // Setup.
    const lStatefullSerializeableClasses: StatefullSerializeableClasses = new StatefullSerializeableClasses();
    const lClassId: SerializeableGuid = 'fada8701-adfe-4058-839b-dbd41941b1b5';
    class TestObject { }

    // Process.
    lStatefullSerializeableClasses.registerClass(TestObject, lClassId, () => {
        return {};
    });

    // Evaluation.
    expect(lStatefullSerializeableClasses.getClass(lClassId)).toBe(TestObject);
    expect(lStatefullSerializeableClasses.getClassId(TestObject)).toBe(lClassId);
    expect(lStatefullSerializeableClasses.getObjectConstructionParameter(new TestObject())).toBeDeepEqual({});
});

Deno.test('StatefullSerializeableClasses.getObjectConstructionParameter()', () => {
    // Setup. Create StatefullSerializerInitializationParameter.
    const lParameter: StatefullSerializerInitializationParameter = {
        parameter: [241, 420]
    };

    // Setup.
    const lStatefullSerializeableClasses: StatefullSerializeableClasses = new StatefullSerializeableClasses();
    class TestObject { }
    lStatefullSerializeableClasses.registerClass(TestObject, '99835662-21fb-409d-a629-3d0c7db0a6e6', () => {
        return lParameter;
    });

    // Process.
    const lResult = lStatefullSerializeableClasses.getObjectConstructionParameter(new TestObject());

    // Evaluation.
    expect(lResult).toBe(lParameter);
});