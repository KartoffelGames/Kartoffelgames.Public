import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { SerializeableConstructor, SerializeableGuid } from '../type';

/**
 * Map for all registered serializable classes.
 * Singleton pattern.
 */
export class StatefullSerializeableMap {
    private static mInstance: StatefullSerializeableMap;

    /**
     * Singleton instance.
     */
    public static get instance(): StatefullSerializeableMap {
        if (!StatefullSerializeableMap.mInstance) {
            this.mInstance = new StatefullSerializeableMap();
        }

        return this.mInstance;
    }

    private readonly mConstructorParameterMap: WeakMap<object, Array<any>>;
    private readonly mConstructorToGuidMap: Dictionary<SerializeableConstructor, SerializeableGuid>;
    private readonly mGuidToConstructorMap: Dictionary<SerializeableGuid, SerializeableConstructor>;

    /**
     * Private constructor.
     * Initialize lists.
     */
    private constructor() {
        this.mGuidToConstructorMap = new Dictionary<SerializeableGuid, SerializeableConstructor>();
        this.mConstructorToGuidMap = new Dictionary<SerializeableConstructor, SerializeableGuid>();
        this.mConstructorParameterMap = new WeakMap<object, Array<any>>();
    }

    /**
     * Get registered class by id.
     * @param pId - Class constructor.
     */
    public getClass(pId: SerializeableGuid): SerializeableConstructor {
        const lGuid: SerializeableConstructor | undefined = this.mGuidToConstructorMap.get(pId);

        // Catch not registered constructors.
        if (!lGuid) {
            throw new Exception('Id is not registered.', this);
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
    public getObjectConstructionParameter(pObject: object): Array<any> {
        const lParameter: Array<any> | undefined = this.mConstructorParameterMap.get(pObject);

        // Catch not registered objects.
        if (!lParameter) {
            throw new Exception('Object has no registered constructor parameter', this);
        }

        return lParameter;
    }

    /**
     * Register serializeable object.
     * @param pConstructor - Constructor.
     * @param pGuid - Guid assigned to set constructor.
     */
    public registerClass(pConstructor: SerializeableConstructor, pGuid: SerializeableGuid): void {
        this.mGuidToConstructorMap.add(pGuid, pConstructor);
        this.mConstructorToGuidMap.add(pConstructor, pGuid);
    }

    /**
     * Register constructed object.
     * @param pObject - Constructed object.
     * @param pParameter - Construction parameter.
     */
    public registerObject(pObject: object, pParameter: Array<any>): void {
        this.mConstructorParameterMap.set(pObject, pParameter);
    }
}