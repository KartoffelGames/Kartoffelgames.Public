import { expect } from 'chai';
import { StatefullSerializeable } from '../../../source/statefull_serialize/decorator/statefull-serializeable.decorator';
import { StatefullSerializeableClasses, StatefullSerializerInitializationParameter } from '../../../source/statefull_serialize/statefull-serializeable-classes';
import { SerializeableConstructor, SerializeableGuid } from '../../../source/type';

describe('StatefullSerializer', () => {
    describe('Method: getClass', () => {
        it('-- Existing class', () => {
            // Setup.
            const lClassId: SerializeableGuid = 'b0748b84-114c-4898-b646-179b8469f586';

            // Create class.
            @StatefullSerializeable(lClassId)
            class TestObject { }

            // Process.
            const lConstructor: SerializeableConstructor = StatefullSerializeableClasses.instance.getClass(lClassId);

            // Evaluation.
            expect(lConstructor).to.equal(TestObject);
        });

        it('-- Missing class', () => {
            // Setup.
            const lClassId: SerializeableGuid = '7d5ce7ce-3185-4afa-b5ee-520384030bb6';

            // Process.
            const lErrorFunction = () => {
                StatefullSerializeableClasses.instance.getClass(lClassId);
            };

            // Evaluation.
            expect(lErrorFunction).to.throw('ClassId is not registered.');
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
            const lResultClassId: SerializeableGuid = StatefullSerializeableClasses.instance.getClassId(TestObject);

            // Evaluation.
            expect(lResultClassId).to.equal(lClassId);
        });

        it('-- Missing class', () => {
            // Setup.
            class TestObject { }

            // Process.
            const lErrorFunction = () => {
                StatefullSerializeableClasses.instance.getClassId(TestObject);
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(`Constructor "${TestObject.name}" is not registered.`);
        });
    });

    it('-- Method: registerClass', () => {
        // Setup.
        const lClassId: SerializeableGuid = 'fada8701-adfe-4058-839b-dbd41941b1b5';
        class TestObject { }

        // Process.
        StatefullSerializeableClasses.instance.registerClass(TestObject, lClassId, () => {
            return {};
        });

        // Evaluation.
        expect(StatefullSerializeableClasses.instance.getClass(lClassId)).to.equal(TestObject);
        expect(StatefullSerializeableClasses.instance.getClassId(TestObject)).to.equal(lClassId);
        expect(StatefullSerializeableClasses.instance.getObjectConstructionParameter(new TestObject())).to.deep.equal({});
    });

    it('-- Method: getObjectConstructionParameter', () => {
        // Setup. Create StatefullSerializerInitializationParameter.
        const lParameter: StatefullSerializerInitializationParameter = {
            parameter: [241, 420]
        };

        // Setup.
        class TestObject { }
        StatefullSerializeableClasses.instance.registerClass(TestObject, '99835662-21fb-409d-a629-3d0c7db0a6e6', () => {
            return lParameter;
        });

        // Process.
        const lResult = StatefullSerializeableClasses.instance.getObjectConstructionParameter(new TestObject());

        // Evaluation.
        expect(lResult).to.equal(lParameter);
    });
});