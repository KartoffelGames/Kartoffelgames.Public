import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { SerializeableGuid } from '../type';
import { ObjectifiedBigInt, ObjectifiedObject, ObjectifiedObjectType, ObjectifiedReference, ObjectifiedSymbol, ObjectifiedValue } from './types/Objectified.type';

export class StatefullDeserializer {
    /**
     * Deobjectifiy objectified values.
     * @param pObjectified - Objectified values.
     */
    public deobjectify<T>(pObjectified: ObjectifiedValue): T {
        const lObjectIds: Dictionary<SerializeableGuid, any> = new Dictionary<SerializeableGuid, any>();
        return <T>this.deobjectifyUnknown(pObjectified, lObjectIds);
    }

    /**
     * Deserialize serialized string.
     * @param pString - Serialized string.
     */
    public deserialize<T>(pString: string): T {
        const lObjectifiedValue: any = JSON.parse(pString);
        return this.deobjectify<T>(lObjectifiedValue);
    }

    private deobjectifyObject(pObjectified: ObjectifiedObject, pObjectIds: Dictionary<SerializeableGuid, any>): unknown {
        // Get object type by [&type].
        const lObjectType: ObjectifiedObjectType = pObjectified['&type'];
        switch (lObjectType) {
            case 'reference': {
                // Hint object type.
                const lReferenceObject: ObjectifiedReference = <ObjectifiedReference>pObjectified;

                // Read object of id.
                const lObjectId: SerializeableGuid = lReferenceObject['&objectId'];

                // Throw not found exception. 
                if (!pObjectIds.has(lObjectId)) {
                    throw new Exception('Referenced object not found.', this);
                }

                // Object can only be found. has() has been called before.
                return <object>pObjectIds.get(lObjectId);
            }

            case 'bigint': {
                // Hint object type.
                const lBigIntObject: ObjectifiedBigInt = <ObjectifiedBigInt>pObjectified;

                // Get bigint value and create bigint number.
                const lNumberAsString: string = lBigIntObject['&values']['number'];
                return BigInt(lNumberAsString);
            }

            case 'symbol': {
                // Hint object type.
                const lSymbolObjectType: ObjectifiedSymbol = <ObjectifiedSymbol>pObjectified;

                // Get symbol values.
                const lObjectId: SerializeableGuid = lSymbolObjectType['&objectId'];
                const lDescription: string | undefined = lSymbolObjectType['&values']['description'];

                // Create symbol and register with object id.
                const lSymbol: symbol = Symbol(lDescription);
                pObjectIds.set(lObjectId, lSymbol);

                return lSymbol;
            }
        }

        // TODO: "anonymous-object"

        // TODO: "array"

        // TODO: "class" 
    }

    /**
     * Deserialize unknown objectified value.
     * @param pObjectified - Objectfied object.
     * @param pObjectIds - Object ids of current deserialize.
     */
    private deobjectifyUnknown(pObjectified: ObjectifiedValue, pObjectIds: Dictionary<SerializeableGuid, any>): unknown {
        const lType: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' = typeof pObjectified;

        // Objectified is simple value. Simply return.
        if (lType !== 'object' && pObjectified !== null) {
            return pObjectified;
        }

        // Only remaining types are object types
        return this.deobjectifyObject(<ObjectifiedObject>pObjectified, pObjectIds);
    }
}