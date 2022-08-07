import { SerializeableConstructor, SerializeableGuid } from '../../type';
import { StatefullSerializeableMap } from '../statefull-serializeable-map';

/**
 * AtScript.
 * Marks class as serializeable. 
 * All child types present as properties must be marked too.
 * @param pGuid - Global unique id.
 */
export function StatefullSerializeable(pGuid: SerializeableGuid) {
    return function (pConstructor: SerializeableConstructor): any {
        // Extends original constructor that maps any parameter of constructed objects.
        const lParameterProxyConstructor = class extends pConstructor {
            public constructor(...pParameter: Array<any>) {
                super(...pParameter);

                // Map constructed object.
                StatefullSerializeableMap.instance.registerObject(this, pParameter);
            }
        };

        // Map serializable class.
        StatefullSerializeableMap.instance.registerClass(lParameterProxyConstructor, pGuid);

        // Override original constrcutor.
        return lParameterProxyConstructor;
    };
}
