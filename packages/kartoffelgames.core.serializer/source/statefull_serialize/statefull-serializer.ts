import { Dictionary } from '@kartoffelgames/core.data';
import { SerializeableConstructor, SerializeableGuid } from '../type';
import { StatefullSerializeableMap } from './statefull-serializeable-map';
import { ObjectifiedValue, ObjectifiedArray, ObjectifiedClass, ObjectifiedObject, ObjectifiedSimple } from './types/Objectified';

// istanbul ignore next
// Cross platform cryto solution. Please dont, i know. I haven't found any better solution.
if (!globalThis.crypto) { // No Cryto should be nodeJS.
    globalThis.crypto = eval('require')('crypto');
}

export class StatefullSerializer {
    /**
     * Objectify value.
     * @param pObject - Object.
     */
    public objectify(pObject: any): ObjectifiedValue {
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
        // Order property keys so an constistent reference chain can be achived.
        const lValueObject: { [key: string]: ObjectifiedValue; } = {};
        const lDescriptorList = Object.getOwnPropertyDescriptors(pObject);
        for (const lDescriptorKey of Object.keys(lDescriptorList).sort()) {
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
        const lObjectId: SerializeableGuid = globalThis.crypto.randomUUID();
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
            const lSimpleArray: Array<ObjectifiedValue> = pObject.map(pItem => this.objectifyUnknown(pItem, pObjectIds));

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
            // Order property keys so an constistent reference chain can be achived.
            const lAnonymousObject: { [key: string]: ObjectifiedValue; } = {};
            for (const lKey of Object.keys(lObject).sort()) {
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
    private objectifyUnknown(pUnknown: unknown, pObjectIds: Dictionary<any, SerializeableGuid>): ObjectifiedValue {
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
