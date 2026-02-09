import { IVoidParameterConstructor } from "@kartoffelgames/core";
import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { Component, ComponentConstructor } from "./component.ts";
import { GameNode } from "./game-node.ts";

// TODO: Make it work first, then optimize...
// TODO: Make a "Environment" that can load scenes. On loading it registers all game objects and components in the scene, so that they can be found by type and a easy list is accessable.
// TODO: On any game object, component change this should be bubbled up to the environment, so that it can update its lists. While its bubbling up it should also set a "dirty" flag on all parent game objects, so that they can update their own lists of components when needed.
// TODO: Maybe a tag system for game objects so a custom component-script can easily find all game objects with a specific tag?
// TODO: How does a system initialize a new component?
// TODO: A component as well as a game object can be disabled and enabled again.

export class GameEntity extends GameNode{
    private readonly mComponents: Set<Component>;
    private readonly mComponentTypeMap: Map<ComponentConstructor, Array<Component>>;
    
    /**
     * Create a new empty game object.
     * 
     * @param pLabel - Label of the game object.
     */
    public constructor(pLabel: string) {
        super(pLabel);
        
        // Init component storage
        this.mComponents = new Set<Component>();
        this.mComponentTypeMap = new Map<ComponentConstructor, Array<Component>>();
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
        const lComponentType: ComponentConstructor = pComponentType as ComponentConstructor;

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
        const lParentObjectComponents: Array<T> = this.parent ? this.parent.getParentComponent<T>(pType) : [];
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
    public getGameObjectsWithComponent<T extends Component>(pType: IAnyParameterConstructor<T>): Array<GameEntity> {
        // Check if this game object has the component
        const lHasThisComponent: boolean = this.getComponent<T>(pType) !== null;

        // Create result array and add this game object if it has the component
        const lResultList: Array<GameEntity> = new Array<GameEntity>();
        if (lHasThisComponent) {
            lResultList.push(this);
        }

        // Get child game objects with the component
        for (const lChild of this.childNodes) {
            const lChildList: Array<GameEntity> = lChild.getGameObjectsWithComponent<T>(pType);

            // Simple optimization to use a spread operator only when needed.
            if (lChildList.length > 0) {
                lResultList.push(...lChildList);
            }
        }

        return lResultList;
    }

    public override connect(): void {
        // Call connect to all components to bubble up to environment connection.
        for (const lComponent of this.mComponents) {
            lComponent.connect();
        }

        // Call child connect to bubble up to environment connection.
        super.connect();
    }

    public override disconnect(): void {
        // Call disconnect to all components to bubble up to environment connection.
        for (const lComponent of this.mComponents) {
            lComponent.disconnect();
        }

        // Call child disconnect to bubble up to environment connection.
        super.disconnect();
    }

    /**
     * Changes the enable state of this game object.
     * When the enable state changes, the change gets bubbled up to the environment and down to all children.
     *
     * @param enabled - Whether this game object should be enabled.
     * @param inherited - Whether this change is from an inherited state (from parent) or from itself.
     * 
     * @returns whether the enable state of this game object changed.
     */
    protected override changeEnableState(enabled: boolean, inherited: boolean): boolean {
        // Call super to change enable state of this game object.
        const lStateChanged: boolean = super.changeEnableState(enabled, inherited);

        // When the state has changed bubbles down to children
        if (lStateChanged) {
            for (const lComponent of this.mComponents) {
                lComponent.changeEnableState(enabled, true);
            }
        }

        return lStateChanged;
    }
}
