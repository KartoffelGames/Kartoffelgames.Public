import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { StatefullSerializeable } from '../../source/statefull_serialize/decorator/statefull-serializeable.decorator.ts';
import { StatefullSerializeableClasses, StatefullSerializerInitializationParameter } from '../../source/statefull_serialize/statefull-serializeable-classes.ts';
import { SerializeableConstructor, SerializeableGuid } from '../../source/type.ts';

describe('StatefullSerializer', () => {
    describe('Method: getClass', () => {
        it('-- Existing class', () => {
            // Setup.
            const lClassId: SerializeableGuid = 'b0748b84-114c-4898-b646-179b8469f586';

            // Create class.
            @StatefullSerializeable(lClassId)
            class TestObject { }

            // Process.
            const lConstructor: SerializeableConstructor = StatefullSerializeableClasses.getClass(lClassId);

            // Evaluation.
            expect(lConstructor).toBe(TestObject);
        });

        it('-- Missing class', () => {
            // Setup.
            const lClassId: SerializeableGuid = '7d5ce7ce-3185-4afa-b5ee-520384030bb6';

            // Process.
            const lErrorFunction = () => {
                StatefullSerializeableClasses.getClass(lClassId);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow('ClassId is not registered.');
        });
    });

    describe('Method: getClassId', () => {
        it('-- Existing class', () => {
            // Setup.
            const lClassId: SerializeableGuid = 'd51cb88d-df40-4a3a-ac39-2f9ba40031ad';

            // Create class.
            @StatefullSerializeable(lClassId)
            class TestObject { }

            // Process.
            const lResultClassId: SerializeableGuid = StatefullSerializeableClasses.getClassId(TestObject);

            // Evaluation.
            expect(lResultClassId).toBe(lClassId);
        });

        it('-- Missing class', () => {
            // Setup.
            class TestObject { }

            // Process.
            const lErrorFunction = () => {
                StatefullSerializeableClasses.getClassId(TestObject);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(`Constructor "${TestObject.name}" is not registered.`);
        });
    });

    it('-- Method: registerClass', () => {
        // Setup.
        const lClassId: SerializeableGuid = 'fada8701-adfe-4058-839b-dbd41941b1b5';
        class TestObject { }

        // Process.
        StatefullSerializeableClasses.registerClass(TestObject, lClassId, () => {
            return {};
        });

        // Evaluation.
        expect(StatefullSerializeableClasses.getClass(lClassId)).toBe(TestObject);
        expect(StatefullSerializeableClasses.getClassId(TestObject)).toBe(lClassId);
        expect(StatefullSerializeableClasses.getObjectConstructionParameter(new TestObject())).toBeDeepEqual({});
    });

    it('-- Method: getObjectConstructionParameter', () => {
        // Setup. Create StatefullSerializerInitializationParameter.
        const lParameter: StatefullSerializerInitializationParameter = {
            parameter: [241, 420]
        };

        // Setup.
        class TestObject { }
        StatefullSerializeableClasses.registerClass(TestObject, '99835662-21fb-409d-a629-3d0c7db0a6e6', () => {
            return lParameter;
        });

        // Process.
        const lResult = StatefullSerializeableClasses.getObjectConstructionParameter(new TestObject());

        // Evaluation.
        expect(lResult).toBe(lParameter);
    });
});