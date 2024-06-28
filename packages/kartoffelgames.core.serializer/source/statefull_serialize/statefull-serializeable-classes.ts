import { Dictionary, Exception } from '@kartoffelgames/core';
import { SerializeableConstructor, SerializeableGuid } from '../type';

/**
 * Map for all registered serializable classes.
 * Singleton pattern.
 */
export class StatefullSerializeableClasses {
    private static mInstance: StatefullSerializeableClasses;

    /**
     * Singleton instance.
     */
    public static get instance(): StatefullSerializeableClasses {
        if (!StatefullSerializeableClasses.mInstance) {
            this.mInstance = new StatefullSerializeableClasses();
        }

        return this.mInstance;
    }

    private readonly mConstructionParameterRetriever: Dictionary<SerializeableGuid, ParameterRetrieveCallback>;
    private readonly mConstructorToGuidMap: Dictionary<SerializeableConstructor, SerializeableGuid>;
    private readonly mGuidToConstructorMap: Dictionary<SerializeableGuid, SerializeableConstructor>;

    /**
     * Private constructor.
     * Initialize lists.
     */
    private constructor() {
        this.mGuidToConstructorMap = new Dictionary<SerializeableGuid, SerializeableConstructor>();
        this.mConstructorToGuidMap = new Dictionary<SerializeableConstructor, SerializeableGuid>();
        this.mConstructionParameterRetriever = new Dictionary<SerializeableGuid, ParameterRetrieveCallback>();

        // Define default classes.
        this.registerClass(Object, 'e00cb495-e7ae-4b7f-8366-8bd706a326be', () => {
            return {}; // Empty.
        });
        this.registerClass(Array, 'fada0e18-119a-4668-80b6-bff1ca22547a', () => {
            return {}; // Empty
        });
        this.registerClass(Date, 'b1e709cb-34d3-46f2-a9f0-f1bf57c04e69', (pObject: Date) => {
            return {
                parameter: [pObject.toString()]
            };
        });
        this.registerClass(Set, '70752b96-49c5-407c-a560-c4a294fb90ae', (pObject: Set<any>) => {
            return {
                parameter: [[...pObject]]
            };
        });
        this.registerClass(Map, '084af2dd-573f-4bf9-bbc5-c9b627d4baf2', (pObject: Map<any, any>) => {
            return {
                parameter: [[...pObject.entries()]]
            };
        });

        // Define defaults for types arrays.
        const lDefaultTypedArrayRetriever = (pArray: Int8Array) => {
            return { parameter: [pArray.length] };
        };

        // Define typed array classes.
        this.registerClass(Int8Array, '63240f98-4309-479f-869c-db2cbf8a9fda', lDefaultTypedArrayRetriever);
        this.registerClass(Uint8Array, 'd4fb16bb-29d8-4835-b6c4-f3f8ab10715a', lDefaultTypedArrayRetriever);
        this.registerClass(Uint8ClampedArray, 'f38e3d89-5df3-41b8-b34b-c1dc2bba69bd', lDefaultTypedArrayRetriever);
        this.registerClass(Int16Array, 'e7b7193a-c8d1-4d40-a19a-1d5174d431a4', lDefaultTypedArrayRetriever);
        this.registerClass(Uint16Array, '6c13f6c0-5dd2-456d-bdd4-dcded1a9b815', lDefaultTypedArrayRetriever);
        this.registerClass(Int32Array, 'b79a08f2-a566-4fae-b587-3ae298545556', lDefaultTypedArrayRetriever);
        this.registerClass(Uint32Array, '138511cb-8584-47a8-aa3a-08bb6488bd5b', lDefaultTypedArrayRetriever);
        this.registerClass(Float32Array, 'a0f6704d-42bc-4c1b-9acb-80dad04c51af', lDefaultTypedArrayRetriever);
        this.registerClass(Float64Array, '30444e6c-456f-413e-b522-26c7057fd68b', lDefaultTypedArrayRetriever);
        this.registerClass(BigInt64Array, '855c609e-1497-46cf-8c12-5e01346b38ae', lDefaultTypedArrayRetriever);
        this.registerClass(BigUint64Array, 'a4a0d93b-36cf-422b-8323-75484c58a0ae', lDefaultTypedArrayRetriever);
    }

    /**
     * Get registered class by id.
     * @param pId - Class constructor.
     */
    public getClass(pId: SerializeableGuid): SerializeableConstructor {
        const lGuid: SerializeableConstructor | undefined = this.mGuidToConstructorMap.get(pId);

        // Catch not registered constructors.
        if (!lGuid) {
            throw new Exception('ClassId is not registered.', this);
        }

        return lGuid;
    }

    /**
     * Get id of registered class.
     * @param pConstructor - Class constructor.
     */
    public getClassId(pConstructor: SerializeableConstructor): SerializeableGuid {
        const lConstructor: SerializeableGuid | undefined = this.mConstructorToGuidMap.get(pConstructor);

        // Catch not registered constructors.
        if (!lConstructor) {
            throw new Exception(`Constructor "${pConstructor.name}" is not registered.`, this);
        }

        return lConstructor;
    }

    /**
     * Get construction parameter of registered objects.
     * @param pObject - Object.
     */
    public getObjectConstructionParameter(pObject: object): StatefullSerializerInitializationParameter {
        const lObjectClassId: SerializeableGuid = this.getClassId(<SerializeableConstructor>pObject.constructor);

        // Retriever is allways registered when an class id is found.
        const lParameterRetriever: ParameterRetrieveCallback = <ParameterRetrieveCallback>this.mConstructionParameterRetriever.get(lObjectClassId);

        return lParameterRetriever(pObject);
    }

    /**
     * Register serializeable object.
     * @param pConstructor - Constructor.
     * @param pGuid - Guid assigned to set constructor.
     */
    public registerClass(pConstructor: SerializeableConstructor, pGuid: SerializeableGuid, pParameterRetrieve: ParameterRetrieveCallback): void {
        this.mGuidToConstructorMap.add(pGuid, pConstructor);
        this.mConstructorToGuidMap.add(pConstructor, pGuid);
        this.mConstructionParameterRetriever.add(pGuid, pParameterRetrieve);
    }
}

export type StatefullSerializerRequiredValue = {
    propertyName: string;
    value: any | Array<any>;
};
export type StatefullSerializerInitializationParameter = {
    parameter?: Array<any>,
    requiredValues?: Array<StatefullSerializerRequiredValue>;
};
export type ParameterRetrieveCallback = (pObject: any) => StatefullSerializerInitializationParameter;