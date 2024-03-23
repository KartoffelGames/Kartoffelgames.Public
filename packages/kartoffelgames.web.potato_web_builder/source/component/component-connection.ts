import { Component } from './component';

export class ComponentConnection {
    private static readonly mComponentConnections: WeakMap<object, Component> = new WeakMap<object, Component>();

    /**
     * Get connected component manager of object.
     * Supported types are HTMLElements or component processors.
     * @param pObject - Instace that is connected to 
     * @returns 
     */
    public static componentOf(pObject: object): Component | undefined {
        return ComponentConnection.mComponentConnections.get(pObject);
    }

    /**
     * Connect instance with component manager.
     * @param pObject - Instance.
     * @param pComponent - Component manager of instance.
     */
    public static connectComponentWith(pObject: object, pComponent: Component): void {
        ComponentConnection.mComponentConnections.set(pObject, pComponent);
    }
}