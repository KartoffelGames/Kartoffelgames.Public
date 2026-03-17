import { GameEnvironment } from "../environment/game-environment.ts";
import { GameObject } from './game-object.ts';

/**
 * A GameNode is a game object that can have child game nodes.
 * It is used to create a hierarchy of game objects, which can be used to manage the environment connection and enable state of the game objects.
 */
export abstract class GameNode extends GameObject {
    private readonly mChildNodeList: Array<GameNode>;
    private mParent: GameNode | null;

    /**
     * Children of this game node.
     */
    public get childNodes(): ReadonlyArray<GameNode> {
        return this.mChildNodeList;
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
    public get parent(): GameNode | null {
        return this.mParent;
    }

    /**
     * Constructor.
     * 
     * @param pLabel - Describing label of this object.
     */
    public constructor(pLabel: string) {
        super(pLabel);

        this.mChildNodeList = new Array<GameNode>();
        this.mParent = null;
    }

    /**
     * Adds a child game object to this game object.
     * 
     * @param pChild - Child game object to add.
     */
    public addObject(pChild: GameNode): void {
        // Add child to set
        this.mChildNodeList.push(pChild);

        // Set parent of child
        pChild.setParent(this);

        // Connect child to environment connection of this game object, if it exists.
        pChild.connect();
    }

    /**
     * Connect this game node to the environment connection of this game node, if it exists.
     * This gets bubbled up to every child game node, so that they can also signal the environment connection.
     * When this game node is not in an environment, this does nothing.
     * 
     * @internal
     */
    public override connect(): void {
        super.connect();

        // Connect all children
        for (const lChild of this.mChildNodeList) {
            lChild.connect();
        }
    }

    /**
     * Disconnect this game object from the environment connection of this game object, if it exists.
     * This gets bubbled up to every child game object, so that they can also signal the environment connection.
     * When this game object is not in an environment, this does nothing.
     * 
     * @internal
     */
    public override disconnect(): void {
        // Disconnect all children
        for (const lChild of this.mChildNodeList) {
            lChild.disconnect();
        }

        super.disconnect();
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
     * @param pChild - Child game node to remove.
     */
    public removeObject(pChild: GameNode): void {
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
            for (const lChild of this.mChildNodeList) {
                lChild.changeEnableState(pEnabled, true);
            }
        }

        return lStateChanged;
    }

    /**
     * Set the parent of this game object.
     * 
     * @param pParent - Parent object.
     */
    protected setParent(pParent: GameNode | null): void {
        this.mParent = pParent;
    }
}