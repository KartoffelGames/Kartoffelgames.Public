import type { ClassDecorator } from '@kartoffelgames/core';
import type { SerializeableConstructor, SerializeableGuid } from '../../type.ts';
import { StatefullSerializeableClasses } from '../statefull-serializeable-classes.ts';

/**
 * AtScript.
 * Marks class as serializeable. 
 * All child types present as properties must be marked too.
 * @param pGuid - Global unique id.
 */
export function StatefullSerializeable(pGuid: SerializeableGuid): ClassDecorator<SerializeableConstructor, SerializeableConstructor> {
    return function (pConstructor: SerializeableConstructor): any {
        const lObjectToConstructorParameter: WeakMap<object, Array<any>> = new WeakMap<object, Array<any>>();

        // Extends original constructor that maps any parameter of constructed objects.
        const lParameterProxyConstructor = class extends pConstructor {
            public constructor(...pParameter: Array<any>) {
                super(...pParameter);

                // Map constructor parameter.
                lObjectToConstructorParameter.set(this, pParameter);
            }
        };

        // Map serializable class.
        new StatefullSerializeableClasses().registerClass(lParameterProxyConstructor, pGuid, (pObject: object) => {
            return {
                parameter: <Array<any>>lObjectToConstructorParameter.get(pObject),
                requiredValues: []
            };
        });

        // Override original constrcutor.
        return lParameterProxyConstructor;
    };
}
