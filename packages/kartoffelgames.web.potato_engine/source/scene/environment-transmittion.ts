import type { Component } from './component.ts';
import { Scene } from "./scene.ts";

/**
 * Transmits environment state changes from various sources to a registered event handler.
 * Acts as a relay for component lifecycle events including addition, removal, activation, deactivation and updates.
 */
export class EnvironmentTransmission {
    /**
     * Event handler function that processes environment state changes.
     */
    private readonly mEventHandler: (pEvent: EnvironmentStateChange) => void;
    private readonly mScene: Scene;

    /**
     * Creates a new environment transmission relay with the specified event handler.
     *
     * @param pEventHandler - Function invoked whenever an environment state change occurs.
     */
    public constructor(pScene: Scene, pEventHandler: (pEvent: EnvironmentStateChange) => void) {
        this.mEventHandler = pEventHandler;
        this.mScene = pScene;
    }

    /**
     * Transmits a component activation event to the environment handler.
     *
     * @param pComponent - The component being activated.
     */
    public activate(pComponent: Component): void {
        this.mEventHandler({
            type: 'activate',
            component: pComponent,
            scene: this.mScene
        });
    }

    /**
     * Transmits a component addition event to the environment handler.
     *
     * @param pComponent - The component being added to the environment.
     */
    public add(pComponent: Component): void {
        this.mEventHandler({
            type: 'add',
            component: pComponent,
            scene: this.mScene
        });
    }

    /**
     * Transmits a component deactivation event to the environment handler.
     *
     * @param pComponent - The component being deactivated.
     */
    public deactivate(pComponent: Component): void {
        this.mEventHandler({
            type: 'deactivate',
            component: pComponent,
            scene: this.mScene
        });
    }

    /**
     * Transmits a component removal event to the environment handler.
     *
     * @param pComponent - The component being removed from the environment.
     */
    public remove(pComponent: Component): void {
        this.mEventHandler({
            type: 'remove',
            component: pComponent,
            scene: this.mScene
        });
    }

    /**
     * Transmits a component update event to the environment handler.
     * Used to indicate a change in a component that was done outside of a system loop.
     *
     * @param pComponent - The component being updated.
     */
    public update(pComponent: Component): void {
        this.mEventHandler({
            type: 'update',
            component: pComponent,
            scene: this.mScene
        });
    }
}

/**
 * Union type representing all possible environment state changes.
 */
export type EnvironmentStateChange = EnvironmentStateChangeActivate | EnvironmentStateChangeDeactivate | EnvironmentStateChangeAdd | EnvironmentStateChangeRemove | EnvironmentStateChangeUpdate;
export type EnvironmentStateChangeType = 'activate' | 'deactivate' | 'add' | 'remove' | 'update';

/**
 * Base structure for all environment state change events.
 */
type EnvironmentStateChangeBase = {
    /**
     * The type of state change that occurred.
     */
    type: EnvironmentStateChangeType;

    /**
     * The component involved in the state change.
     */
    component: Component;

    /**
     * The scene in which the state change occurred.
     */
    scene: Scene;
};

/**
 * Event emitted when a component is activated in the environment.
 */
export type EnvironmentStateChangeActivate = {
    type: 'activate';
} & EnvironmentStateChangeBase;

/**
 * Event emitted when a component is deactivated in the environment.
 */
export type EnvironmentStateChangeDeactivate = {
    type: 'deactivate';
} & EnvironmentStateChangeBase;

/**
 * Event emitted when a component is added to the environment.
 */
export type EnvironmentStateChangeAdd = {
    type: 'add';
} & EnvironmentStateChangeBase;

/**
 * Event emitted when a component is removed from the environment.
 */
export type EnvironmentStateChangeRemove = {
    type: 'remove';
} & EnvironmentStateChangeBase;

/**
 * Event emitted when a component is updated outside of a system loop.
 */
export type EnvironmentStateChangeUpdate = {
    type: 'update';
} & EnvironmentStateChangeBase;