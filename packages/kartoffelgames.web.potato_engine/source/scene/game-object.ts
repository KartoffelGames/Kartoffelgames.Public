import { IVoidParameterConstructor } from "@kartoffelgames/core";
import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { GameComponent, GameComponentConstructor } from "./game-component.ts";

// TODO: Make it work first, then optimize...

export class GameObject {
    private readonly mChildren: Set<GameObject>;
    private readonly mLabel: string;
    private mParent: GameObject | null = null;

    private readonly mComponents: Set<GameComponent>;
    private readonly mComponentTypeMap: Map<GameComponentConstructor, Array<GameComponent>>;

    /**
     * Label of this game object.
     */
    public get label(): string {
        return this.mLabel;
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
        this.mLabel = pLabel;
        this.mChildren = new Set<GameObject>();

        // Init component storage
        this.mComponents = new Set<GameComponent>();
        this.mComponentTypeMap = new Map<GameComponentConstructor, Array<GameComponent>>();
    }

    /**
     * Adds a child game object to this game object.
     * 
     * @param pChild - Child game object to add.
     */
    public addChild(pChild: GameObject): void {
        // Set parent of child
        pChild.mParent = this;

        // Add child to set
        this.mChildren.add(pChild);
    }

    /**
     * Adds a component to this game object.
     * 
     * @param pComponent - Component to add.
     */
    public addComponent<T extends GameComponent>(pComponentType: IVoidParameterConstructor<T>): T {
        // Create component
        const lComponent: T = new pComponentType();

        // Add component to set
        this.mComponents.add(lComponent);

        // Get component type.
        const lComponentType: GameComponentConstructor = pComponentType as GameComponentConstructor;

        // Get existing components of this type.
        let lComponentsOfType: Array<GameComponent> | undefined = this.mComponentTypeMap.get(lComponentType);
        if (!lComponentsOfType) {
            lComponentsOfType = new Array<GameComponent>();
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
    public getComponent<T extends GameComponent>(pType: IAnyParameterConstructor<T>): T | null {
        // Get all components of the requested type
        const lComponentsOfType: Array<GameComponent> | undefined = this.mComponentTypeMap.get(pType);
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
    public getComponents<T extends GameComponent>(pType: IAnyParameterConstructor<T>): Array<T> {
        // Get all components of the requested type
        const lComponentsOfType: Array<GameComponent> | undefined = this.mComponentTypeMap.get(pType);
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
    public getParentComponent<T extends GameComponent>(pType: IAnyParameterConstructor<T>): Array<T> {
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
    public getGameObjectsWithComponent<T extends GameComponent>(pType: IAnyParameterConstructor<T>): Array<GameObject> {
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
            if (lChildList.length > 0) {
                lResultList.push(...lChildList);
            }
        }

        return lResultList;
    }
}