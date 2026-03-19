import { Exception } from '@kartoffelgames/core';
import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import type { IAnyParameterConstructor } from '../../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { GameComponent, GameComponentConstructor } from '../component/game-component.ts';
import type { GameEnvironmentStateType } from '../environment/game-environment-event-transmittion.ts';
import { GameEntity } from './game-entity.ts';
import type { GameEnvironment } from '../environment/game-environment.ts';

/**
 * A GameEntity is a game node that can have components.
 * It is used to create game objects in the scene, which can have components that define their behavior and state.
 */
@FileSystem.fileClass('71db9e82-6a93-4cae-a530-50c05ceb33c4', FileSystemReferenceType.Instanced)
export class GameObject extends GameEntity {
    private readonly mChildNodeList: Array<GameObject>;
    private readonly mComponentTypeMap: Map<GameComponentConstructor, GameComponent>;
    private readonly mComponentUpdateDependencies: Map<GameComponent, Array<GameComponent>>;
    private readonly mComponents: Set<GameComponent>;
    private mParent: GameObject | null;

    /**
     * Children of this game node.
     */
    public get childNodes(): ReadonlyArray<GameObject> {
        return this.mChildNodeList;
    }

    /**
     * All components attached to this game entity.
     */
    public get components(): ReadonlySet<GameComponent> {
        return this.mComponents;
    }

    /**
     * Environment this game object is in.
     * A game object is in the same environment as its parent, so this gets bubbled up to the parent until it reaches the scene, which has the environment connection.
     */
    public get environment(): GameEnvironment | null {
        if (!this.mParent) {
            return null;
        }
        return this.mParent.environment;
    }

    /**
     * Parent of this object.
     */
    public get parent(): GameObject | null {
        return this.mParent;
    }

    /**
     * Create a new empty game object.
     */
    public constructor() {
        super('GameObject');

        // Init component storage
        this.mComponents = new Set<GameComponent>();
        this.mComponentTypeMap = new Map<GameComponentConstructor, GameComponent>();
        this.mComponentUpdateDependencies = new Map<GameComponent, Array<GameComponent>>();

        // Init hierarchy storage
        this.mChildNodeList = new Array<GameObject>();
        this.mParent = null;
    }

    /**
     * Adds a component to this game object.
     * Creates a new component of the requested type and adds it to this game object.
     * When a component of the same type already exists on this game object, an exception is thrown, as multiple components of the same type on a single game object are not allowed.
     * When the component has dependencies, all dependencies will be automatically added if not already present.
     * 
     * @param pComponentType - Component type to add.
     * 
     * @return The added component instance.
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
            // Try to read dependency component from this game object or create it if it does not exist.
            let lDependencyComponent: GameComponent | undefined = this.mComponentTypeMap.get(lDependency);
            if (!lDependencyComponent) {
                lDependencyComponent = this.addComponent(lDependency);
            }

            // Read the update dependency list of the dependency component.
            let lDependencyUpdateList: Array<GameComponent> | undefined = this.mComponentUpdateDependencies.get(lDependencyComponent);
            if (!lDependencyUpdateList) {
                lDependencyUpdateList = new Array<GameComponent>();
                this.mComponentUpdateDependencies.set(lDependencyComponent, lDependencyUpdateList);
            }

            // Create a new update dependency list for this component.
            lDependencyUpdateList.push(lComponent);
        }

        // Add component to set and update parent.
        this.mComponents.add(lComponent);

        // Add component to type map for easy access.
        this.mComponentTypeMap.set(pComponentType, lComponent);

        // Set parent and trigger connections.
        lComponent.setParent(this);
        lComponent.connect();

        return lComponent;
    }

    /**
     * Adds a child game object to this game object.
     * 
     * @param pChild - Child game object to add.
     */
    public addObject(pChild: GameObject): void {
        // Add child to set
        this.mChildNodeList.push(pChild);

        // Set parent of child
        pChild.setParent(this);

        // Connect child to environment connection of this game object, if it exists.
        pChild.connect();
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

        // Connect all children
        for (const lChild of this.mChildNodeList) {
            lChild.connect();
        }

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

        // Disconnect all children
        for (const lChild of this.mChildNodeList) {
            lChild.disconnect();
        }

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
    public getGameObjectsWithComponent<T extends GameComponent>(pType: IAnyParameterConstructor<T>): Array<GameObject> {
        // Check if this game object has the component
        const lHasThisComponent: boolean = this.hasComponent<T>(pType);

        // Create result array and add this game object if it has the component
        const lResultList: Array<GameObject> = new Array<GameObject>();
        if (lHasThisComponent) {
            lResultList.push(this);
        }

        // Get child game objects with the component
        for (const lChild of this.childNodes) {
            if (!(lChild instanceof GameObject)) {
                continue;
            }

            const lChildList: Array<GameObject> = lChild.getGameObjectsWithComponent<T>(pType);

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
        if (this.hasComponent<T>(pType)) {
            return this.getComponent<T>(pType);
        }

        // Get components from parent objects
        const lParentObjectComponent: T | null = (this.parent instanceof GameObject) ? this.parent.getParentComponent<T>(pType) : null;
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
        // Get components from parent objects
        const lParentObjectComponents: Array<T> = (this.parent instanceof GameObject) ? this.parent.getParentComponents<T>(pType) : [];
        if (!this.hasComponent<T>(pType)) {
            return lParentObjectComponents;
        }

        // When both current and parent components exist, combine them
        return [this.getComponent<T>(pType), ...lParentObjectComponents];
    }

    /**
     * Checks if this game object has a component of the requested type.
     * 
     * @param pType - Component type.
     * 
     * @returns Whether this game object has a component of the requested type. 
     */
    public hasComponent<T extends GameComponent>(pType: IAnyParameterConstructor<T>): boolean {
        return this.mComponentTypeMap.has(pType);
    }

    /**
     * Removes this game object from its parent node.
     * Does nothing if this game object has no parent.
     */
    public remove(): void {
        this.parent?.removeObject(this);
    }

    /**
     * Removes a child game node from this game node.
     * The child is disconnected from the environment before being removed.
     * If the child is not in this node's children, this does nothing.
     *
     * @param pChild - Child game object to remove.
     */
    public removeObject(pChild: GameObject): void {
        // Remove child from list.
        const lIndex: number = this.mChildNodeList.indexOf(pChild);
        if (lIndex !== -1) {
            this.mChildNodeList.splice(lIndex, 1);
        }

        // Disconnect child from environment.
        pChild.disconnect();

        // Set parent of child to null.
        pChild.setParent(null);
    }

    /**
     * Signals the environment connection of this game object, if it exists, that this game object is active and should be included in the environment.
     * This event gets signaled for any dependent components as well.
     * 
     * @param pType - The type of state change that occurred for the component.
     * @param pComponent - The component that triggered the state change event.
     * 
     * @returns Whether the state change event was successfully sent to the environment.
     * 
     * @internal 
     */
    public sendComponentChangeEvent(pType: GameEnvironmentStateType, pComponent: GameComponent): void {
        // Skip when no environment is connected, as there is no need to send change events.
        if(!this.environment){
            return;
        }

        // Send exact change event to any dependend components, so they can react to the change before the environment gets notified.
        if(this.mComponentUpdateDependencies.has(pComponent)) {
            // Read dependent components and send change event to them.
            const lDependentComponents: Array<GameComponent> = this.mComponentUpdateDependencies.get(pComponent)!;
            for(const lDependentComponent of lDependentComponents) {
                this.environment.events.sendChange(pType, lDependentComponent);
            }
        }

        this.environment.events.sendChange(pType, pComponent);
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

        // When the state has changed bubbles down to children and components
        if (lStateChanged) {
            for (const lChild of this.mChildNodeList) {
                lChild.changeEnableState(pEnabled, true);
            }

            for (const lComponent of this.mComponents) {
                // Treat it like a game entity to access the changeEnableState method, since components can also be enabled and disabled.
                (<GameObject><unknown>lComponent).changeEnableState(pEnabled, true); // TODO: There should be a better way.
            }
        }

        return lStateChanged;
    }

    /**
     * Set the parent of this game object.
     * 
     * @param pParent - Parent object.
     */
    protected setParent(pParent: GameObject | null): void {
        this.mParent = pParent;
    }
}
