import { Exception } from '@kartoffelgames/core';
import { GraphPartReference } from '../part/graph-part-reference';
import { GrammarNodeValueType } from './grammer-node-value-type.enum';

/**
 * Basic grammar node. Base parent for all native nodes.
 * Defines chain methods to chain other nodes after another. 
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export abstract class BaseGrammarNode<TTokenType extends string, TResult extends object = object> {
    private mChainedNode: BaseGrammarNode<TTokenType> | null;
    private readonly mIdentifier: string | null;
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
    protected get chainedNode(): BaseGrammarNode<TTokenType> | null {
        return this.mChainedNode;
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
        this.mChainedNode = null;
    }

    /**
     * Creates and return a new branch node.
     * Chains the node after the current node and sets the correct previous node.
     * 
     * When another chain method ({@link BaseGrammarNode.loop}, {@link BaseGrammarNode.optional}, {@link BaseGrammarNode.single}, {@link BaseGrammarNode.branch} or {@link BaseGrammarNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pBranches - Node branches.
     * @param pIdentifier - Value identifier of node values.
     * 
     * @throws {@link Exception}
     * When another chain method was called,
     * 
     * @returns The new branch node. 
     */
    public branch<TKey extends string, const TValue extends Array<GrammarGraphValue<TTokenType>>>(pIdentifier: string, pBranches: TValue): GrammarBranchNode<TTokenType, NodeValueExtendBranch<TTokenType, TKey, TValue, TResult>>;
    public branch(pBranches: Array<GrammarGraphValue<TTokenType>>): GrammarBranchNode<TTokenType, TResult>;
    public branch(pIdentifierOrBranches: string | null | Array<GrammarGraphValue<TTokenType>>, pBranches?: Array<GrammarGraphValue<TTokenType>>): GrammarBranchNode<TTokenType, TResult> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (Array.isArray(pIdentifierOrBranches)) ? null : pIdentifierOrBranches;
        const lBranches: Array<GrammarGraphValue<TTokenType>> = (Array.isArray(pIdentifierOrBranches)) ? pIdentifierOrBranches : pBranches!;

        // Create new node and chain it after this node.
        const lNode: GrammarBranchNode<TTokenType> = new GrammarBranchNode<TTokenType>(this, lBranches, true, lIdentifier);
        this.setChainedNode(lNode);

        return lNode;
    }

    /**
     * Creates and return a new loop node.
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
     * @returns The new loop node. 
     */
    public loop<TKey extends string, TValue>(pIdentifier: TKey, pValue: GraphPartReference<TTokenType, TValue>): GrammarLoopNode<TTokenType, NodeValueExtend<TKey, Array<TValue>, TResult>>;
    public loop<TKey extends string>(pIdentifier: TKey, pValue: TTokenType): GrammarLoopNode<TTokenType, NodeValueExtend<TKey, Array<string>, TResult>>;
    public loop<TKey extends string, TValue extends object>(pIdentifier: TKey, pValue: BaseGrammarNode<TTokenType, TValue>): GrammarLoopNode<TTokenType, NodeValueExtend<TKey, Array<TValue>, TResult>>;
    public loop(pValue: GrammarGraphValue<TTokenType>): GrammarLoopNode<TTokenType, TResult>;
    public loop(pIdentifierOrValue: string | null | GrammarGraphValue<TTokenType>, pValue?: GrammarGraphValue<TTokenType>): GrammarLoopNode<TTokenType, TResult> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (typeof pValue === 'undefined') ? null : <string | null>pIdentifierOrValue;
        const lValue: GrammarGraphValue<TTokenType> = (typeof pValue === 'undefined') ? <GrammarGraphValue<TTokenType>>pIdentifierOrValue : pValue!;

        // Create new node and chain it after this node.
        const lNode: GrammarLoopNode<TTokenType> = new GrammarLoopNode<TTokenType>(this, lValue, lIdentifier);
        this.setChainedNode(lNode);

        return lNode;
    }

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
    public optional<TKey extends string, TValue>(pIdentifier: TKey, pValue: GraphPartReference<TTokenType, TValue>): GrammarSingleNode<TTokenType, NodeValueExtendOptional<TKey, TValue, TResult>>;
    public optional<TKey extends string>(pIdentifier: TKey, pValue: TTokenType): GrammarSingleNode<TTokenType, NodeValueExtendOptional<TKey, string, TResult>>;
    public optional<TKey extends string, TValue extends object>(pIdentifier: TKey, pValue: BaseGrammarNode<TTokenType, TValue>): GrammarSingleNode<TTokenType, NodeValueExtendOptional<TKey, TValue, TResult>>;
    public optional(pValue: GrammarGraphValue<TTokenType>): GrammarSingleNode<TTokenType, TResult>;
    public optional(pIdentifierOrValue: string | null | GrammarGraphValue<TTokenType>, pValue?: GrammarGraphValue<TTokenType>): GrammarSingleNode<TTokenType, TResult> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (typeof pValue === 'undefined') ? null : <string | null>pIdentifierOrValue;
        const lValue: GrammarGraphValue<TTokenType> = (typeof pValue === 'undefined') ? <GrammarGraphValue<TTokenType>>pIdentifierOrValue : pValue!;

        // Create new node and chain it after this node.
        const lNode: GrammarSingleNode<TTokenType> = new GrammarSingleNode<TTokenType>(this, lValue, false, lIdentifier);
        this.setChainedNode(lNode);

        return lNode;
    }

    /**
     * Creates and return a new optional branch node.
     * Chains the node after the current node and sets the correct previous node.
     * This node is optional and can be skipped for the parsing process.
     * 
     * When another chain method ({@link BaseGrammarNode.loop}, {@link BaseGrammarNode.optional}, {@link BaseGrammarNode.single}, {@link BaseGrammarNode.branch} or {@link BaseGrammarNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pBranches - Node branches.
     * @param pIdentifier - Value identifier of node values.
     * 
     * @throws {@link Exception}
     * When another chain method was called,
     * 
     * @returns The new optional branch node. 
     */
    public optionalBranch<TKey extends string, const TValue extends Array<GrammarGraphValue<TTokenType>>>(pIdentifier: string, pBranches: TValue): GrammarBranchNode<TTokenType, NodeValueExtendBranchOptional<TTokenType, TKey, TValue, TResult>>;
    public optionalBranch(pBranches: Array<GrammarGraphValue<TTokenType>>): GrammarBranchNode<TTokenType>;
    public optionalBranch(pIdentifierOrBranches: string | null | Array<GrammarGraphValue<TTokenType>>, pBranches?: Array<GrammarGraphValue<TTokenType>>): GrammarBranchNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (Array.isArray(pIdentifierOrBranches)) ? null : pIdentifierOrBranches;
        const lBranches: Array<GrammarGraphValue<TTokenType>> = (Array.isArray(pIdentifierOrBranches)) ? pIdentifierOrBranches : pBranches!;

        // Create new node and chain it after this node.
        const lNode: GrammarBranchNode<TTokenType> = new GrammarBranchNode<TTokenType>(this, lBranches, false, lIdentifier);
        this.setChainedNode(lNode);

        return lNode;
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
    public single<TKey extends string, TValue>(pIdentifier: TKey, pValue: GraphPartReference<TTokenType, TValue>): GrammarSingleNode<TTokenType, NodeValueExtend<TKey, TValue, TResult>>;
    public single<TKey extends string>(pIdentifier: TKey, pValue: TTokenType): GrammarSingleNode<TTokenType, NodeValueExtend<TKey, string, TResult>>;
    public single<TKey extends string, TValue extends object>(pIdentifier: TKey, pValue: BaseGrammarNode<TTokenType, TValue>): GrammarSingleNode<TTokenType, NodeValueExtend<TKey, TValue, TResult>>;
    public single(pValue: GrammarGraphValue<TTokenType>): GrammarSingleNode<TTokenType, TResult>;
    public single(pIdentifierOrValue: string | null | GrammarGraphValue<TTokenType>, pValue?: GrammarGraphValue<TTokenType>): GrammarSingleNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (typeof pValue === 'undefined') ? null : <string | null>pIdentifierOrValue;
        const lValue: GrammarGraphValue<TTokenType> = (typeof pValue === 'undefined') ? <GrammarGraphValue<TTokenType>>pIdentifierOrValue : pValue!;

        // Create new node and chain it after this node.
        const lNode: GrammarSingleNode<TTokenType> = new GrammarSingleNode<TTokenType>(this, lValue, true, lIdentifier);
        this.setChainedNode(lNode);

        return lNode;
    }

    /**
     * Chain node after this node.
     * Validates and restricts multi chaining.
     * 
     * @param pChainedNode - Node that should be chained after this node.
     * 
     * @throws {@link Exception}
     * When {@link BaseGrammarNode.setChainedNode} was called once before for this node instance, preventing multi chainings.
     */
    private setChainedNode(pChainedNode: BaseGrammarNode<TTokenType>): void {
        // Restrict multi chaining.
        if (this.mChainedNode !== null) {
            throw new Exception(`Node can only be chained to a single node.`, this);
        }

        this.mChainedNode = pChainedNode;
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

type NodeValueExtend<TKey extends string, TValue, TTarget extends object> = TTarget & { [x in TKey]: TValue };
type NodeValueExtendOptional<TKey extends string, TValue, TTarget extends object> = TTarget & { [x in TKey]?: TValue };

type UnwrapArrayTypes<T> = T extends Array<infer U> ? U : T;
type NodeValueExtendBranch<TTokenType extends string, TKey extends string, TValue extends Array<GrammarGraphValue<TTokenType>>, TTarget extends object> = TTarget & { [x in TKey]: (
    UnwrapArrayTypes<{
        [K in keyof TValue]:
        TValue[K] extends GraphPartReference<any, infer T> ? T :
        TValue[K] extends BaseGrammarNode<any, infer T> ? T :
        TValue[K] extends string ? TValue[K] :
        never
    }>
) };
type NodeValueExtendBranchOptional<TTokenType extends string, TKey extends string, TValue extends Array<GrammarGraphValue<TTokenType>>, TTarget extends object> = TTarget & { [x in TKey]?: (
    UnwrapArrayTypes<{
        [K in keyof TValue]:
        TValue[K] extends GraphPartReference<any, infer T> ? T :
        TValue[K] extends BaseGrammarNode<any, infer T> ? T :
        TValue[K] extends string ? TValue[K] :
        never
    }>
) };

export type GrammarGraphValue<TTokenType extends string> = GraphPartReference<TTokenType, unknown> | TTokenType | BaseGrammarNode<TTokenType>;

// Load child branches after parent to prevent circular dependency problems.
import { GrammarBranchNode } from './grammer-branch-node';
import { GrammarLoopNode } from './grammer-loop-node';
import { GrammarSingleNode } from './grammer-single-node';

