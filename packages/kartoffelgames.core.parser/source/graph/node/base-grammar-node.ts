import { Exception } from '@kartoffelgames/core.data';
import { GrammarNodeValueType } from './grammer-node-value-type.enum';
import { GrammarSingleNode } from './grammer-single-node';
import { GraphPartReference } from '../part/graph-part-reference';

/**
 * Basic grammar node. Base parent for all native nodes.
 * Defines chain methods to chain other nodes after another. 
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export abstract class BaseGrammarNode<TTokenType extends string> {
    private readonly mIdentifier: string | null;
    private mNextNode: BaseGrammarNode<TTokenType> | null;
    private readonly mPreviousNode: BaseGrammarNode<TTokenType> | null;
    private readonly mRequired: boolean;
    private readonly mValueType: GrammarNodeValueType;

    /**
     * Node values. Can be a set of tokens or a graph part reference.
     */
    public abstract readonly nodeValues: Array<GrammarGraphValue<TTokenType>>;

    /**
     * Get the root node of this branch.
     */
    public get branchRoot(): BaseGrammarNode<TTokenType> {
        // Get parent of parent when a parent exists.
        // Real cool property recursion.
        if (this.mPreviousNode) {
            return this.mPreviousNode.branchRoot;
        }

        // When no parent exists, you have offically reached the endpoint (root).
        return this;
    }

    /**
     * Node value identifier.
     * Used to store the node token value into a object.
     * The objects property name is this identifier.
     */
    public get identifier(): string | null {
        return this.mIdentifier;
    }

    /**
     * If this node is required or is needed to fit perfectly.
     */
    public get required(): boolean {
        return this.mRequired;
    }

    /**
     * Type with wich the node token value should be stored.
     */
    public get valueType(): GrammarNodeValueType {
        return this.mValueType;
    }

    /**
     * Node that is directly chained after this node.
     */
    protected get nextNode(): BaseGrammarNode<TTokenType> | null {
        return this.mNextNode;
    }

    /**
     * Node that is directly chained before this node.
     */
    protected get previousNode(): BaseGrammarNode<TTokenType> | null {
        return this.mPreviousNode;
    }

    /**
     * Constructor.
     * 
     * @param pPreviousNode - Node that is chained before this node.
     * @param pRequired - If this node is required or is needed to fit perfectly.
     * @param pValueType - Type with wich the node token value should be stored.
     * @param pIdentifier - Name of the property, the node token value will be stored.
     */
    constructor(pPreviousNode: BaseGrammarNode<TTokenType> | null, pRequired: boolean, pValueType: GrammarNodeValueType, pIdentifier: string | null) {
        this.mPreviousNode = pPreviousNode;
        this.mRequired = pRequired;
        this.mIdentifier = pIdentifier;
        this.mValueType = pValueType;

        // Default to no chained node.
        this.mNextNode = null;
    }

    // TODO: loop, branch, optionalBranch

    /**
     * Creates and return a new  optional single value node.
     * Chains the node after the current node and sets the correct previous node.
     * This node is optional and can be skipped for the parsing process.
     * 
     * When another chain method ({@link BaseGrammarNode.loop}, {@link BaseGrammarNode.optional}, {@link BaseGrammarNode.single}, {@link BaseGrammarNode.branch} or {@link BaseGrammarNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pValue - Node value.
     * @param pIdentifier - Value identifier of node value.
     * 
     * @throws {@link Exception}
     * When another chain method was called,
     * 
     * @returns The new optional single value node. 
     */
    public optional(pValue: GrammarGraphValue<TTokenType>, pIdentifier: string | null = null): GrammarSingleNode<TTokenType> {
        // Create new node and chain it after this node.
        const lSingleNode: GrammarSingleNode<TTokenType> = new GrammarSingleNode<TTokenType>(this, pValue, false, pIdentifier);
        this.setNextNode(lSingleNode);

        return lSingleNode;
    }

    /**
     * Creates and return a new single value node.
     * Chains the node after the current node and sets the correct previous node.
     * 
     * When another chain method ({@link BaseGrammarNode.loop}, {@link BaseGrammarNode.optional}, {@link BaseGrammarNode.single}, {@link BaseGrammarNode.branch} or {@link BaseGrammarNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pValue - Node value.
     * @param pIdentifier - Value identifier of node value.
     * 
     * @throws {@link Exception}
     * When another chain method was called,
     * 
     * @returns The new single value node. 
     */
    public single(pValue: GrammarGraphValue<TTokenType>, pIdentifier: string | null = null): GrammarSingleNode<TTokenType> {
        // Create new node and chain it after this node.
        const lSingleNode: GrammarSingleNode<TTokenType> = new GrammarSingleNode<TTokenType>(this, pValue, true, pIdentifier);
        this.setNextNode(lSingleNode);

        return lSingleNode;
    }

    /**
     * Chain node after this node.
     * Validates and restricts multi chaining.
     * 
     * @param pNextNode - Node that should be chained after this node.
     * 
     * @throws {@link Exception}
     * When {@link BaseGrammarNode.setNextNode} was called once before for this node instance, preventing multi chainings.
     */
    private setNextNode(pNextNode: BaseGrammarNode<TTokenType>): void {
        // Restrict multi chaining.
        if (this.mNextNode !== null) {
            throw new Exception(`Node can only be chained to a single node.`, this);
        }

        this.mNextNode = pNextNode;
    }

    /**
     * Retrieve next grammar nodes that are chained after this node.
     * Null value is used to represent a node chain end.
     * 
     * @returns The next grammar nodes or null when the end of this chain is reached.
     * 
     * @internal
     */
    public abstract next(): Array<BaseGrammarNode<TTokenType> | null>;
}

export type GrammarGraphValue<TTokenType extends string> = GraphPartReference<TTokenType> | TTokenType;