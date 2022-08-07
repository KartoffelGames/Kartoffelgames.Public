import { Dictionary } from '@kartoffelgames/core.data';
import { SerializeableConstructor, SerializeableGuid } from '../type';
import { StatefullSerializeableMap } from './statefull-serializeable-map';

export class StatefullSerializer {
    /**
     * Objectify value.
     * @param pObject - Object.
     */
    public objectify(pObject: any): ObjectifedValue {
        const lObjectIds: Dictionary<any, SerializeableGuid> = new Dictionary<any, SerializeableGuid>();
        return this.objectifyUnknown(pObject, lObjectIds);
    }

    /**
     * Objectify and stringify value.
     * @param pObject - Object.
     */
    public serialize(pObject: any): string {
        return JSON.stringify(this.objectify(pObject));
    }

    /**
     * Generates a none cryptografic UUID.
     */
    private generateNoneCryptograficUuid(): SerializeableGuid {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (pCharacter) {
            const lRandomNumber = Math.random() * 16 | 0;
            const lCharacterResult = pCharacter === 'x' ? lRandomNumber : (lRandomNumber & 0x3 | 0x8);
            return lCharacterResult.toString(16);
        });
    }

    /**
     * Objectify objects that got created from a class.
     * @param pObject - Object from class.
     * @param pObjectIds - Curren serializer runs object ids.
     */
    private objectifyClass(pObject: object, pObjectId: SerializeableGuid, pObjectIds: Dictionary<any, SerializeableGuid>): ObjectifiedClass {
        const lClassConstructor: SerializeableConstructor = <SerializeableConstructor>pObject.constructor;
        const lClassId: SerializeableGuid = StatefullSerializeableMap.instance.getClassId(lClassConstructor);

        // Read constructor parameter.
        const lParameterList: Array<any> = StatefullSerializeableMap.instance.getObjectConstructionParameter(pObject);
        const lObjectifiedParameterList: ObjectifiedArray = <ObjectifiedArray>this.objectifyUnknown(lParameterList, pObjectIds);

        // Read all property descriptors and objectify all none readonly values.
        const lValueObject: { [key: string]: ObjectifedValue; } = {};
        const lDescriptorList = Object.getOwnPropertyDescriptors(pObject);
        for (const lDescriptorKey in lDescriptorList) {
            const lPropertyDescriptor: PropertyDescriptor = lDescriptorList[lDescriptorKey];

            // Only none readonly values.
            if (lPropertyDescriptor.writable) {
                lValueObject[lDescriptorKey] = this.objectifyUnknown(lPropertyDescriptor.value, pObjectIds);
            }
        }

        return {
            '&type': 'class',
            '&constructor': lClassId,
            '&objectId': pObjectId,
            '&parameter': lObjectifiedParameterList['&values'],
            '&values': lValueObject
        };
    }

    /**
     * Objectify referenceable values, any value that gets passed as reference.
     * @param pObject - Reference.
     * @param pObjectIds - Curren serializer runs object ids.
     */
    private objectifyObject(pObject: object | symbol, pObjectIds: Dictionary<any, SerializeableGuid>): ObjectifiedObject {
        // Load cached objectification.
        if (pObjectIds.has(pObject)) {
            const lObjectId: SerializeableGuid = <string>pObjectIds.get(pObject);

            // Create circular reference.
            return {
                '&type': 'reference',
                '&objectId': lObjectId,
            };
        }

        // Create new guid and register as symbols id.
        const lObjectId: SerializeableGuid = this.generateNoneCryptograficUuid();
        pObjectIds.set(pObject, lObjectId);

        // Symbol
        if (typeof pObject === 'symbol') {
            return {
                '&type': 'symbol',
                '&objectId': lObjectId,
                '&values': {
                    'description': pObject.description
                }
            };
        }

        // Array.
        if (Array.isArray(pObject)) {
            const lSimpleArray: Array<ObjectifedValue> = pObject.map(pItem => this.objectifyUnknown(pItem, pObjectIds));

            return {
                '&type': 'array',
                '&objectId': lObjectId,
                '&values': lSimpleArray
            };
        }

        // Anonymous object.
        if (pObject.constructor === Object) {
            const lObject: any = <any>pObject;

            // Objectify each key of object.
            const lAnonymousObject: { [key: string]: ObjectifedValue; } = {};
            for (const lKey in lObject) {
                // Ignores SET and GET and METHODS
                lAnonymousObject[lKey] = this.objectifyUnknown(lObject[lKey], pObjectIds);
            }

            return {
                '&type': 'anonymous-object',
                '&objectId': lObjectId,
                '&values': lAnonymousObject
            };
        }

        // Class and other types.
        return this.objectifyClass(pObject, lObjectId, pObjectIds);
    }

    /**
     * Objectify unknown values.
     * @param pUnknown - Unknown value.
     * @param pObjectIds - Object ids of current serialization.
     */
    private objectifyUnknown(pUnknown: unknown, pObjectIds: Dictionary<any, SerializeableGuid>): ObjectifedValue {
        const lType: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' = typeof pUnknown;
        switch (lType) {
            // Native simple types.
            case 'string':
            case 'number':
            case 'boolean':
            case 'undefined': {
                return <ObjectifiedSimple>pUnknown;
            }

            // BigInt
            case 'bigint': {
                const lBigInt: bigint = <bigint>pUnknown;
                return {
                    '&type': 'bigint',
                    '&values': {
                        'number': lBigInt.toString()
                    }
                };
            }

            // Symbol &Object
            case 'symbol':
            case 'object': {
                const lObject: object = <object>pUnknown;

                // Null object.
                if (lObject === null) {
                    return null;
                }

                return this.objectifyObject(lObject, pObjectIds);
            }

            // Function: Ignore
            default: {
                return undefined;
            }
        }
    }
}

export type ObjectifedValue = ObjectifiedSimple | ObjectifiedBigInt | ObjectifiedObject;

export type ObjectifiedSimple = string | number | boolean | undefined | null;

export type ObjectifiedObject = ObjectifiedSymbol | ObjectifiedArray | ObjectifiedReference | ObjectifiedAnonymousObject | ObjectifiedClass;

export type ObjectifiedBigInt = {
    '&type': 'bigint',
    '&values': {
        'number': string;
    };
};

export type ObjectifiedSymbol = {
    '&type': 'symbol',
    '&objectId': SerializeableGuid,
    '&values': {
        'description': string | undefined;
    };
};

export type ObjectifiedArray = {
    '&type': 'array',
    '&objectId': SerializeableGuid,
    '&values': Array<ObjectifedValue>;
};

export type ObjectifiedReference = {
    '&type': 'reference',
    '&objectId': SerializeableGuid,
};

export type ObjectifiedAnonymousObject = {
    '&type': 'anonymous-object',
    '&objectId': SerializeableGuid,
    '&values': { [key: string]: ObjectifedValue; };
};

export type ObjectifiedClass = {
    '&type': 'class',
    '&constructor': SerializeableGuid,
    '&objectId': SerializeableGuid,
    '&parameter': Array<ObjectifedValue>,
    '&values': { [key: string]: ObjectifedValue; };
};