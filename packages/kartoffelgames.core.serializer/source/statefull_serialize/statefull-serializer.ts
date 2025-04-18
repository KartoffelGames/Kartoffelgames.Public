import { Dictionary } from '@kartoffelgames/core';
import type { SerializeableConstructor, SerializeableGuid } from '../type.ts';
import { StatefullSerializeableClasses, type StatefullSerializerInitializationParameter } from './statefull-serializeable-classes.ts';
import type { ObjectifiedObject, ObjectifiedSimple, ObjectifiedValue } from './types/Objectified.type.ts';

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
     * Objectify referenceable values, any value that gets passed as reference.
     * @param pObject - Reference.
     * @param pObjectIds - Current serializer runs object ids.
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

        // Objects with constructors.
        const lClassConstructor: SerializeableConstructor = <SerializeableConstructor>pObject.constructor;
        const lStatefullSerializeableClasses = new StatefullSerializeableClasses();
        const lClassId: SerializeableGuid = lStatefullSerializeableClasses.getClassId(lClassConstructor);

        // Read constructor parameter.
        const lInitializationObject: StatefullSerializerInitializationParameter = lStatefullSerializeableClasses.getObjectConstructionParameter(pObject);

        // Build initialization parameter.
        const lInitializationParameter: Array<ObjectifiedValue> | undefined = lInitializationObject.parameter?.map(pValue => {
            return this.objectifyUnknown(pValue, pObjectIds);
        });

        // Build initialization required values.
        const lInitializationRequiredValueList = lInitializationObject.requiredValues?.map(pValue => {
            return {
                propertyName: pValue.propertyName,
                value: this.objectifyUnknown(pValue.value, pObjectIds)
            };
        });

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
            '&objectId': lObjectId,
            '&initialisation': {
                'parameter': lInitializationParameter ?? [], // Default empty array.
                'requiredValues': lInitializationRequiredValueList ?? [] // Default empty array.
            },
            '&values': lValueObject
        };
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
                    '&number': lBigInt.toString()
                };
            }

            // Symbol & Object
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
