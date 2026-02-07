import { IVoidParameterConstructor } from "@kartoffelgames/core";
import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { Component, GameComponentConstructor } from "./component.ts";
import { Environment } from "./environment.ts";
import { EnvironmentStateChangeType, EnvironmentTransmission } from "./environment-transmittion.ts";

// TODO: Make it work first, then optimize...
// TODO: Make a "Environment" that can load scenes. On loading it registers all game objects and components in the scene, so that they can be found by type and a easy list is accessable.
// TODO: On any game object, component change this should be bubbled up to the environment, so that it can update its lists. While its bubbling up it should also set a "dirty" flag on all parent game objects, so that they can update their own lists of components when needed.
// TODO: Maybe a tag system for game objects so a custom component-script can easily find all game objects with a specific tag?
// TODO: How does a system initialize a new component?
// TODO: A component as well as a game object can be disabled and enabled again.

export class GameObject {
    private readonly mChildren: Set<GameObject>;
    private readonly mLabel: string;
    private mParent: GameObject | null = null;
    private mTransmission: EnvironmentTransmission | null;
    private readonly mComponents: Set<Component>;
    private readonly mComponentTypeMap: Map<GameComponentConstructor, Array<Component>>;
    private mEnableState: GameObjectEnableState;

    /**
     * Label of this game object.
     */
    public get label(): string {
        return this.mLabel;
    }

    /**
     * Whether this game object is enabled.
     * A game object is enabled when it is enabled itself and all its parents are enabled.
     */
    public get enabled(): boolean {
        return this.mEnableState.enabled;
    }

    /**
     * Parent of this game object.
     */
    public get parent(): GameObject | null {
        return this.mParent;
    }

    /**
     * Create a new empty game object.
     * 
     * @param pLabel - Label of the game object.
     */
    public constructor(pLabel: string) {
        this.mParent = null;
        this.mTransmission = null;
        this.mLabel = pLabel;
        this.mChildren = new Set<GameObject>();

        // A game object is enabled by default and inherits the enabled state from its parent.
        this.mEnableState = {
            enabled: true,
            inheritedState: true,
            selfState: true
        };

        // Init component storage
        this.mComponents = new Set<Component>();
        this.mComponentTypeMap = new Map<GameComponentConstructor, Array<Component>>();
    }

    /**
     * Activate this game object.
     */
    public activate(): void {
        this.changeEnableState(true, false);
    }

    /**
     * Adds a component to this game object.
     * 
     * @param pComponent - Component to add.
     */
    public addComponent<T extends Component>(pComponentType: IVoidParameterConstructor<T>): T {
        // Create component
        const lComponent: T = new pComponentType();

        // Add component to set
        this.mComponents.add(lComponent);

        // Get component type.
        const lComponentType: GameComponentConstructor = pComponentType as GameComponentConstructor;

        // Get existing components of this type.
        let lComponentsOfType: Array<Component> | undefined = this.mComponentTypeMap.get(lComponentType);
        if (!lComponentsOfType) {
            lComponentsOfType = new Array<Component>();
            this.mComponentTypeMap.set(lComponentType, lComponentsOfType);
        }

        // Add component to type array.
        lComponentsOfType.push(lComponent);

        return lComponent;
    }

    /**
     * Adds a child game object to this game object.
     * 
     * @param pChild - Child game object to add.
     */
    public addGameObject(pChild: GameObject): void {
        // Set parent of child
        pChild.mParent = this;

        // Add child to set
        this.mChildren.add(pChild);
    }

    /**
     * Deactivates this game object.
     */
    public deactivate(): void {
        this.changeEnableState(false, false);
    }

    /**
     * Adds a component to this game object.
     * Returns the first found component of the requested type, or null if none found.
     * 
     * @param pType - Component type.
     * 
     * @returns The first component of the requested type, or null if none found. 
     */
    public getComponent<T extends Component>(pType: IAnyParameterConstructor<T>): T | null {
        // Get all components of the requested type
        const lComponentsOfType: Array<Component> | undefined = this.mComponentTypeMap.get(pType);
        if (!lComponentsOfType || lComponentsOfType.length === 0) {
            return null;
        }

        // Return the first component of the requested type
        return lComponentsOfType[0] as T;
    }

    /**
     * Returns all components of the requested type.
     * 
     * @param pType - Component type.
     * 
     * @returns All components of the requested type. 
     */
    public getComponents<T extends Component>(pType: IAnyParameterConstructor<T>): Array<T> {
        // Get all components of the requested type
        const lComponentsOfType: Array<Component> | undefined = this.mComponentTypeMap.get(pType);
        if (!lComponentsOfType) {
            return new Array<T>();
        }

        return [...lComponentsOfType] as Array<T>;
    }

    /**
     * Gets all components of the requested type moving up the parent chain.
     * The first found components are from this game object, then from the parent, and so on.
     * 
     * @param pType - Component type.
     * 
     * @returns An iterable of all found components of the requested type. 
     */
    public getParentComponent<T extends Component>(pType: IAnyParameterConstructor<T>): Array<T> {
        // Get component from current object
        const lCurrentObjectComponent: T | null = this.getComponent<T>(pType);

        // Get components from parent objects
        const lParentObjectComponents: Array<T> = this.mParent ? this.mParent.getParentComponent<T>(pType) : [];
        if (!lCurrentObjectComponent) {
            return lParentObjectComponents;
        }

        // When both current and parent components exist, combine them
        return [lCurrentObjectComponent, ...lParentObjectComponents];
    }

    /**
     * Returns all game objects in this object's hierarchy (including itself) that have the requested component.
     *
     * @param pType - Component type.
     *
     * @returns An array of game objects that have the requested component.
     */
    public getGameObjectsWithComponent<T extends Component>(pType: IAnyParameterConstructor<T>): Array<GameObject> {
        // Check if this game object has the component
        const lHasThisComponent: boolean = this.getComponent<T>(pType) !== null;

        // Create result array and add this game object if it has the component
        const lResultList: Array<GameObject> = new Array<GameObject>();
        if (lHasThisComponent) {
            lResultList.push(this);
        }

        // Get child game objects with the component
        for (const lChild of this.mChildren) {
            const lChildList: Array<GameObject> = lChild.getGameObjectsWithComponent<T>(pType);

            // Simple optimization to use a spread operator only when needed.
            if (lChildList.length > 0) {
                lResultList.push(...lChildList);
            }
        }

        return lResultList;
    }

    /**
     * Loads the game object into the given environment.
     * This call handles the signaling to the environment itself.
     * This call gets bubbled down to all child game objects, so that they can also signal the environment.
     * 
     * @param pEnvironment 
     */
    public establishEnvironmentConnection(pConnection: EnvironmentTransmission) {
        // Save environment connection for later use.
        this.mTransmission = pConnection;

        // Add all components to environment
        for (const lComponent of this.mComponents) {
            this.mTransmission.add(lComponent);
        }

        // Bubble down to children
        for (const lChild of this.mChildren) {
            lChild.establishEnvironmentConnection(pConnection);
        }
    }

    /**
     * Pushes a component state change to the environment connection of this game object, if it exists.
     * 
     * @param pComponent - Component 
     * @param pType - Type of the state change that occurred. 
     */
    public pushChangeState(pComponent: Component, pType: EnvironmentStateChangeType): void {
        if (!this.mTransmission) {
            return;
        }

        switch (pType) {
            case 'add':
                this.mTransmission.add(pComponent);
                break;
            case 'remove':
                this.mTransmission.remove(pComponent);
                break;
            case 'activate':
                this.mTransmission.activate(pComponent);
                break;
            case 'deactivate':
                this.mTransmission.deactivate(pComponent);
                break;
            case 'update':
                this.mTransmission.update(pComponent);
                break;
        }
    }

    /**
     * Changes the enable state of this game object.
     * When the enable state changes, the change gets bubbled up to the environment and down to all children.
     *
     * @param enabled - Whether this game object should be enabled.
     * @param inherited - Whether this change is from an inherited state (from parent) or from itself.
     */
    private changeEnableState(enabled: boolean, inherited: boolean): void {
        // Last state of this game object
        const lLastState: boolean = this.mEnableState.enabled;

        // Update inherited state when this change is from parent, otherwise keep the inherited state.
        // Update self state when this change is from itself, otherwise keep the self state.
        if (inherited) {
            this.mEnableState.inheritedState = enabled;
        } else {
            this.mEnableState.selfState = enabled;
        }

        // When the current inherited state is disabled, this game object is also disabled.
        // When the current inherited state is enabled, this game object is enabled when it is enabled itself.
        this.mEnableState.enabled = this.mEnableState.inheritedState ? this.mEnableState.selfState : false;

        if (lLastState !== this.mEnableState.enabled) {
            // Signal enable state of all components.
            for (const lComponent of this.mComponents) {
                lComponent.changeEnableState(this.mEnableState.enabled, true);
            }

            // Bubble down to children.
            for (const lChild of this.mChildren) {
                lChild.changeEnableState(this.mEnableState.enabled, true);
            }
        }
    }
}

type GameObjectEnableState = {
    enabled: boolean;
    inheritedState: boolean;
    selfState: boolean;
};