import { Component } from './component';

export class ComponentConnection {
    private static readonly mComponentManagerConnections: WeakMap<object, Component> = new WeakMap<object, Component>();

    /**
     * Get connected component manager of object.
     * Supported types are HTMLElements or UserObjects.
     * @param pObject - Instace that is connected to 
     * @returns 
     */
    public static componentManagerOf(pObject: object): Component | undefined {
        return ComponentConnection.mComponentManagerConnections.get(pObject);
    }

    /**
     * Connect instance with component manager.
     * @param pObject - Instance.
     * @param pComponentManager - Component manager of instance.
     */
    public static connectComponentManagerWith(pObject: object, pComponentManager: Component): void {
        ComponentConnection.mComponentManagerConnections.set(pObject, pComponentManager);
    }
}