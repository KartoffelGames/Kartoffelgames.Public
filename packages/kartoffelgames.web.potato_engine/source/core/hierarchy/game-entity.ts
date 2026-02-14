import { Exception } from '@kartoffelgames/core';
import type { IAnyParameterConstructor } from '../../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { GameComponent, GameComponentConstructor } from '../component/game-component.ts';
import { GameNode } from '../hierarchy/game-node.ts';

/**
 * A GameEntity is a game node that can have components.
 * It is used to create game objects in the scene, which can have components that define their behavior and state.
 */
export class GameEntity extends GameNode {
    private readonly mComponentTypeMap: Map<GameComponentConstructor, GameComponent>;
    private readonly mComponents: Set<GameComponent>;

    /**
     * Create a new empty game object.
     * 
     * @param pLabel - Label of the game object.
     */
    public constructor(pLabel: string) {
        super(pLabel);

        // Init component storage
        this.mComponents = new Set<GameComponent>();
        this.mComponentTypeMap = new Map<GameComponentConstructor, GameComponent>();
    }

    /**
     * Adds a component to this game object.
     * 
     * @param pComponent - Component to add.
     */
    public addComponent<T extends GameComponent>(pComponentType: GameComponentConstructor<T>): T {
        // Restrict multiple components of the same type on a single game object.
        if (this.mComponentTypeMap.has(pComponentType)) {
            throw new Exception(`Game entity "${this.label}" already has a component of type "${pComponentType.name}". Multiple components of the same type are not allowed on a single game object.`, this);
        }

        // Create component
        const lComponent: T = new pComponentType();

        // Resolve dependencies - auto-add any missing dependency components.
        for (const lDependency of lComponent.dependencies) {
            if (!this.mComponentTypeMap.has(lDependency)) {
                this.addComponent(lDependency);
            }
        }

        // Add component to set and update parent.
        this.mComponents.add(lComponent);

        // Add component to type map for easy access.
        this.mComponentTypeMap.set(pComponentType, lComponent);

        // Set parent and trigger connections.
        (<GameEntity><unknown>lComponent).setParent(this);
        lComponent.connect();

        return lComponent;
    }

    /**
     * Connect this game object to the environment connection of this game object, if it exists.
     * This gets bubbled up to every child game object, so that they can also signal the environment connection.
     * When this game object is not in an environment, this does nothing.
     * 
     * @internal
     */
    public override connect(): void {
        // Call connect to all components to bubble up to environment connection.
        for (const lComponent of this.mComponents) {
            lComponent.connect();
        }

        // Call child connect to bubble up to environment connection.
        super.connect();
    }

    /**
     * Disconnect this game object from the environment connection of this game object, if it exists.
     * This gets bubbled up to every child game object, so that they can also signal the environment connection.
     * When this game object is not in an environment, this does nothing.
     * 
     * @internal
     */
    public override disconnect(): void {
        // Call disconnect to all components to bubble up to environment connection.
        for (const lComponent of this.mComponents) {
            lComponent.disconnect();
        }

        // Call child disconnect to bubble up to environment connection.
        super.disconnect();
    }

    /**
     * Adds a component to this game object.
     * Returns the first found component of the requested type, or null if none found.
     * 
     * @param pType - Component type.
     * 
     * @returns The first component of the requested type, or null if none found. 
     */
    public getComponent<T extends GameComponent>(pType: IAnyParameterConstructor<T>): T {
        // Get all components of the requested type
        const lComponent: GameComponent | undefined = this.mComponentTypeMap.get(pType);
        if (!lComponent) {
            throw new Error(`Component of type "${pType.name}" not found on game object "${this.label}".`);
        }

        // Return the first component of the requested type
        return lComponent as T;
    }


    /**
     * Returns all game objects in this object's hierarchy (including itself) that have the requested component.
     *
     * @param pType - Component type.
     *
     * @returns An array of game objects that have the requested component.
     */
    public getGameObjectsWithComponent<T extends GameComponent>(pType: IAnyParameterConstructor<T>): Array<GameEntity> {
        // Check if this game object has the component
        const lHasThisComponent: boolean = this.getComponent<T>(pType) !== null;

        // Create result array and add this game object if it has the component
        const lResultList: Array<GameEntity> = new Array<GameEntity>();
        if (lHasThisComponent) {
            lResultList.push(this);
        }

        // Get child game objects with the component
        for (const lChild of this.childNodes) {
            if (!(lChild instanceof GameEntity)) {
                continue;
            }

            const lChildList: Array<GameEntity> = lChild.getGameObjectsWithComponent<T>(pType);

            // Simple optimization to use a spread operator only when needed.
            if (lChildList.length > 0) {
                lResultList.push(...lChildList);
            }
        }

        return lResultList;
    }

    /**
     * Gets all components of the requested type moving up the parent chain.
     * The first found components are from this game object, then from the parent, and so on.
     * 
     * @param pType - Component type.
     * 
     * @returns An iterable of all found components of the requested type. 
     */
    public getParentComponent<T extends GameComponent>(pType: IAnyParameterConstructor<T>): T | null {
        // Get component from current object
        const lCurrentObjectComponent: T | null = this.getComponent<T>(pType);
        if (lCurrentObjectComponent) {
            return lCurrentObjectComponent;
        }

        // Get components from parent objects
        const lParentObjectComponent: T | null = (this.parent instanceof GameEntity) ? this.parent.getParentComponent<T>(pType) : null;
        if (lParentObjectComponent) {
            return lParentObjectComponent;
        }

        return null;
    }

    /**
     * Gets all components of the requested type moving up the parent chain.
     * The first found components are from this game object, then from the parent, and so on.
     * 
     * @param pType - Component type.
     * 
     * @returns An iterable of all found components of the requested type. 
     */
    public getParentComponents<T extends GameComponent>(pType: IAnyParameterConstructor<T>): Array<T> {
        // Get component from current object
        const lCurrentObjectComponent: T | null = this.getComponent<T>(pType);

        // Get components from parent objects
        const lParentObjectComponents: Array<T> = (this.parent instanceof GameEntity) ? this.parent.getParentComponents<T>(pType) : [];
        if (!lCurrentObjectComponent) {
            return lParentObjectComponents;
        }

        // When both current and parent components exist, combine them
        return [lCurrentObjectComponent, ...lParentObjectComponents];
    }

    /**
     * Changes the enable state of this game object.
     * When the enable state changes, the change gets bubbled up to the environment and down to all children.
     *
     * @param pEnabled - Whether this game object should be enabled.
     * @param pInherited - Whether this change is from an inherited state (from parent) or from itself.
     * 
     * @returns whether the enable state of this game object changed.
     */
    protected override changeEnableState(pEnabled: boolean, pInherited: boolean): boolean {
        // Call super to change enable state of this game object.
        const lStateChanged: boolean = super.changeEnableState(pEnabled, pInherited);

        // When the state has changed bubbles down to children
        if (lStateChanged) {
            for (const lComponent of this.mComponents) {
                // Treat it like a game entity to access the changeEnableState method, since components can also be enabled and disabled.
                (<GameEntity><unknown>lComponent).changeEnableState(pEnabled, true); // TODO: There should be a better way.
            }
        }

        return lStateChanged;
    }
}
