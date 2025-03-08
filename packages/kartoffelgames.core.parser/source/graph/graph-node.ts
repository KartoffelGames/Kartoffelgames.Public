import { Exception } from "@kartoffelgames/core";
import type { Graph } from "./graph.ts";

export class GraphNode<TTokenType extends string, TCurrentResult extends object = object> {

    /**
     * Start a new branch node.
     */
    public static new<TTokenType extends string>() {
        // Create an empty node.
        const lAnonymousNode: GraphNode<TTokenType> = new GraphNode<TTokenType>(null, false, []);

        // Shady shit. 
        // Assign null as root node, so the next node that gets chained receives NULL as `pRootNode` in its constructor
        // This than sets the chained node itself as the root node, discarding this actual root node. 
        lAnonymousNode.mRootNode = null as any;

        // Return shady node.
        return lAnonymousNode;
    }

    private mChainedNode: GraphNode<TTokenType> | null;
    private readonly mIdentifier: string | null;
    private mRootNode: GraphNode<TTokenType>;
    private readonly mRequired: boolean;
    private readonly mValues: Array<GraphValue<TTokenType>>;

    /**
     * Get the root node of this branch.
     */
    public get root(): GraphNode<TTokenType> {
        return this.mRootNode;
    }

    /**
     * Node value identifier.
     * Used to store the node token value into a object.
     * The objects property name is this identifier.
     */
    public get identifier(): string | null {
        return this.mIdentifier;
    }


    private constructor(pIdentifier: string | null, pRequired: boolean, pValues: Array<GraphValue<TTokenType>>, pRootNode?: GraphNode<TTokenType>) {
        this.mChainedNode = null;
        this.mIdentifier = pIdentifier;
        this.mRequired = pRequired;

        // When the value is a graph node, spool it back to its root node.
        this.mValues = pValues.map(pValue => {
            if (pValue instanceof GraphNode) {
                return pValue.root;
            }

            return pValue;
        });

        // If the root node is not set, then this node is the root node.
        if (!pRootNode) {
            this.mRootNode = this;
        } else {
            this.mRootNode = pRootNode;
        }
    }
    
    /**
     * Get the next graph node values.
     * Includes NULL when graph node has no next value.
     * This NULL value can only be returned when the node is not required or when the chained node is forced.
     * 
     * When the node is not required, the chained node is added to the list as well.
     * 
     * @param pJustChained - When true, only the chained node is returned and all inner values are ignored. 
     * 
     * @returns The next graph node values.
     */
    public next(pJustChained: boolean = false): Array<GraphValue<TTokenType> | null> {
        // Return only the chained node when the inner values should be ignored.
        if (pJustChained) {
            return [this.mChainedNode];
        }

        // Collect all inner values.
        const lNextTokenNodes: Array<GraphValue<TTokenType> | null> = [...this.mValues];

        // When the node is not required, add the chained node to the list so the parser can skip any inner node.
        if (!this.mRequired) {
            lNextTokenNodes.push(this.mChainedNode);
        }

        // Return chained node.
        return lNextTokenNodes;
    }

    /**
     * Creates and return a new required branch node.
     * Sets the result value with the identifier.
     * Chains the node after the current node and sets the correct previous node.
     * 
     * When another chain method ({@link GraphNode.optional}, {@link GraphNode.required}, {@link GraphNode.branch} or {@link GraphNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pIdentifier - Value identifier of node values.
     * @param pBranches - Node branches.
     * 
     * @throws {@link Exception}
     * When another chain method was called,
     * 
     * @returns A new branch node. 
     */
    public branch<TKey extends string, const TValue extends Array<GraphValue<TTokenType>>>(pIdentifier: TKey, pBranches: TValue): RequiredBranchChainResult<TTokenType, TCurrentResult, TKey, TValue>;


    /**
     * Creates and return a new required branch node.
     * Discards any result value.
     * Chains the new node with the current and uses the root node from the current node.
     * 
     * When another chain method ({@link GraphNode.optional}, {@link GraphNode.required}, {@link GraphNode.branch} or {@link GraphNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pBranches - Node branches.
     * 
     * @throws {@link Exception}
     * When the node was already chained before.
     * 
     * @returns A new required branch node.
     */
    public branch<const TValue extends Array<GraphValue<TTokenType>>>(pBranches: TValue): RequiredBranchChainResult<TTokenType, TCurrentResult, '', TValue>;


    /**
     * Creates a new branch node and chains it after the current node.
     * 
     * @param pIdentifierOrBranches - Either a string identifier for the new node or an array of branch values.
     * @param pBranches - An optional array of branch values if the first parameter is a string identifier.
     * 
     * @returns The newly created and chained GraphNode.
     */
    public branch(pIdentifierOrBranches: string | null | Array<GraphValue<TTokenType>>, pBranches?: Array<GraphValue<TTokenType>>): GraphNode<TTokenType, TCurrentResult> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (Array.isArray(pIdentifierOrBranches)) ? null : pIdentifierOrBranches;
        const lBranchValueList: Array<GraphValue<TTokenType>> = (Array.isArray(pIdentifierOrBranches)) ? pIdentifierOrBranches : pBranches!;

        // Create new node and chain it after this node.
        const lNode: GraphNode<TTokenType> = new GraphNode<TTokenType>(lIdentifier, true, lBranchValueList, this.mRootNode);

        // Set the new node as next node of current node.
        this.setChainedNode(lNode);

        return lNode;
    }

    /**
     * Creates and return a new single optional value node.
     * Sets the result value with the identifier.
     * Chains the new node with the current and uses the root node from the current node.
     * 
     * When another chain method ({@link GraphNode.optional}, {@link GraphNode.required}, {@link GraphNode.branch} or {@link GraphNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pIdentifier - Value identifier of node value.
     * @param pValue - Node value.
     * 
     * @throws {@link Exception}
     * When the node was already chained before.
     * 
     * @returns The new single value node. 
     */
    public optional<TKey extends string, TValue extends GraphValue<TTokenType>>(pIdentifier: TKey, pValue: TValue): OptionalChainResult<TTokenType, TCurrentResult, TKey, TValue>;

    /**
     * Creates and return a new single optional value node.
     * Discards any result value.
     * Chains the new node with the current and uses the root node from the current node.
     * 
     * When another chain method ({@link GraphNode.optional}, {@link GraphNode.required}, {@link GraphNode.branch} or {@link GraphNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pValue - Node value.
     * 
     * @throws {@link Exception}
     * When the node was already chained before.
     * 
     * @returns The new single value node. 
     */
    public optional<TValue extends GraphValue<TTokenType>>(pValue: TValue): OptionalChainResult<TTokenType, TCurrentResult, '', TValue>;

    /**
     * Creates a new `GraphNode` with a optional single value and chains it after the current node.
     * 
     * @param pIdentifierOrValue - Either a string identifier or a `GraphValue` object. If `pValue` is provided, this parameter is treated as the identifier.
     * @param pValue - An optional `GraphValue` object. If provided, `pIdentifierOrValue` is treated as the identifier.
     * 
     * @returns The newly created and chained `GraphNode`.
     */
    public optional(pIdentifierOrValue: string | null | GraphValue<TTokenType>, pValue?: GraphValue<TTokenType>): GraphNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (typeof pValue === 'undefined') ? null : <string | null>pIdentifierOrValue;
        const lValue: GraphValue<TTokenType> = (typeof pValue === 'undefined') ? <GraphValue<TTokenType>>pIdentifierOrValue : pValue!;

        // Create new node and chain it after this node.
        const lNode: GraphNode<TTokenType> = new GraphNode<TTokenType>(lIdentifier, false, [lValue], this.mRootNode);

        // Set the new node as next node of current node.
        this.setChainedNode(lNode);

        return lNode;
    }

    /**
     * Creates and return a new optional branch node.
     * Sets the result value with the identifier.
     * Chains the node after the current node and sets the correct previous node.
     * 
     * When another chain method ({@link GraphNode.optional}, {@link GraphNode.required}, {@link GraphNode.branch} or {@link GraphNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pIdentifier - Value identifier of node values.
     * @param pBranches - Node branches.
     * 
     * @throws {@link Exception}
     * When another chain method was called,
     * 
     * @returns A new branch node. 
     */
    public optionalBranch<TKey extends string, const TValue extends Array<GraphValue<TTokenType>>>(pIdentifier: TKey, pBranches: TValue): OptionalBranchChainResult<TTokenType, TCurrentResult, TKey, TValue>;


    /**
     * Creates and return a new optional branch node.
     * Discards any result value.
     * Chains the new node with the current and uses the root node from the current node.
     * 
     * When another chain method ({@link GraphNode.optional}, {@link GraphNode.required}, {@link GraphNode.branch} or {@link GraphNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pBranches - Node branches.
     * 
     * @throws {@link Exception}
     * When the node was already chained before.
     * 
     * @returns A new required branch node.
     */
    public optionalBranch<const TValue extends Array<GraphValue<TTokenType>>>(pBranches: TValue): OptionalBranchChainResult<TTokenType, TCurrentResult, '', TValue>;


    /**
     * Creates a new branch node and chains it after the current node.
     * 
     * @param pIdentifierOrBranches - Either a string identifier for the new node or an array of branch values.
     * @param pBranches - An optional array of branch values if the first parameter is a string identifier.
     * 
     * @returns The newly created and chained GraphNode.
     */
    public optionalBranch(pIdentifierOrBranches: string | null | Array<GraphValue<TTokenType>>, pBranches?: Array<GraphValue<TTokenType>>): GraphNode<TTokenType, TCurrentResult> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (Array.isArray(pIdentifierOrBranches)) ? null : pIdentifierOrBranches;
        const lBranchValueList: Array<GraphValue<TTokenType>> = (Array.isArray(pIdentifierOrBranches)) ? pIdentifierOrBranches : pBranches!;

        // Create new node and chain it after this node.
        const lNode: GraphNode<TTokenType> = new GraphNode<TTokenType>(lIdentifier, false, lBranchValueList, this.mRootNode);

        // Set the new node as next node of current node.
        this.setChainedNode(lNode);

        return lNode;
    }

    /**
     * Creates and return a new single required value node.
     * Sets the result value with the identifier.
     * Chains the new node with the current and uses the root node from the current node.
     * 
     * When another chain method ({@link GraphNode.optional}, {@link GraphNode.required}, {@link GraphNode.branch} or {@link GraphNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pIdentifier - Value identifier of node value.
     * @param pValue - Node value.
     * 
     * @throws {@link Exception}
     * When the node was already chained before.
     * 
     * @returns The new single value node. 
     */
    public required<TKey extends string, TValue extends GraphValue<TTokenType>>(pIdentifier: TKey, pValue: TValue): RequiredChainResult<TTokenType, TCurrentResult, TKey, TValue>;

    /**
     * Creates and return a new single required value node.
     * Discards any result value.
     * Chains the new node with the current and uses the root node from the current node.
     * 
     * When another chain method ({@link GraphNode.optional}, {@link GraphNode.required}, {@link GraphNode.branch} or {@link GraphNode.optionalBranch})
     * was called before this call, this method will throw an error, preventing multi chainings.
     * 
     * @param pValue - Node value.
     * 
     * @throws {@link Exception}
     * When the node was already chained before.
     * 
     * @returns The new single value node. 
     */
    public required<TValue extends GraphValue<TTokenType>>(pValue: TValue): RequiredChainResult<TTokenType, TCurrentResult, '', TValue>;

    /**
     * Creates a new `GraphNode` with a required single value and chains it after the current node.
     * 
     * @param pIdentifierOrValue - Either a string identifier or a `GraphValue` object. If `pValue` is provided, this parameter is treated as the identifier.
     * @param pValue - An optional `GraphValue` object. If provided, `pIdentifierOrValue` is treated as the identifier.
     * 
     * @returns The newly created and chained `GraphNode`.
     */
    public required(pIdentifierOrValue: string | null | GraphValue<TTokenType>, pValue?: GraphValue<TTokenType>): GraphNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (typeof pValue === 'undefined') ? null : <string | null>pIdentifierOrValue;
        const lValue: GraphValue<TTokenType> = (typeof pValue === 'undefined') ? <GraphValue<TTokenType>>pIdentifierOrValue : pValue!;

        // Create new node and chain it after this node.
        const lNode: GraphNode<TTokenType> = new GraphNode<TTokenType>(lIdentifier, true, [lValue], this.mRootNode);

        // Set the new node as next node of current node.
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
    private setChainedNode(pChainedNode: GraphNode<TTokenType>): void {
        // Restrict multi chaining.
        if (this.mChainedNode !== null) {
            throw new Exception(`Node can only be chained to a single node.`, this);
        }

        this.mChainedNode = pChainedNode;
    }
}

type GraphSingleResultExtend<TTokenType extends string, TKey extends string, TValue, TTarget extends object> = GraphNode<TTokenType, TTarget & { [x in TKey]: TValue }>;
type GraphSingleResultExtendOptional<TTokenType extends string, TKey extends string, TValue, TTarget extends object> = GraphNode<TTokenType, TTarget & { [x in TKey]?: TValue }>;
type GraphSingleResultMerge<TTokenType extends string, TKey extends string, TValue, TTarget extends object> = GraphNode<TTokenType, TTarget & { [x in TKey]: Array<TValue> }>;

type UnwrapArrayTypes<T> = T extends Array<infer U> ? U : T;
type GraphListResultExtend<TTokenType extends string, TKey extends string, TValue extends Array<GraphValue<TTokenType>>, TTarget extends object> = TTarget & { [x in TKey]: (
    UnwrapArrayTypes<{
        [K in keyof TValue]:
        TValue[K] extends Graph<TTokenType, infer T> ? T :
        TValue[K] extends GraphNode<TTokenType, infer T> ? T :
        TValue[K] extends TTokenType ? TValue[K] :
        never
    }>
) };
type GraphListResultExtendOptional<TTokenType extends string, TKey extends string, TValue extends Array<GraphValue<TTokenType>>, TTarget extends object> = TTarget & { [x in TKey]?: (
    UnwrapArrayTypes<{
        [K in keyof TValue]:
        TValue[K] extends Graph<TTokenType, infer T> ? T :
        TValue[K] extends GraphNode<TTokenType, infer T> ? T :
        TValue[K] extends TTokenType ? TValue[K] :
        never
    }>
) };

/*
 * Branch node result types.
 */

type OptionalChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends string, TValue extends GraphValue<TTokenType>> =
    TKey extends '' ? GraphNode<TTokenType, TCurrentResult> : // No identifier
    TValue extends TTokenType ? GraphSingleResultExtendOptional<TTokenType, TKey, string, TCurrentResult> :
    TValue extends Graph<TTokenType, infer TGraphResultValue> ? GraphSingleResultExtendOptional<TTokenType, TKey, TGraphResultValue, TCurrentResult> :
    TValue extends GraphNode<TTokenType, infer TNodeResultValue> ? GraphSingleResultExtendOptional<TTokenType, TKey, TNodeResultValue, TCurrentResult> :
    never;

type RequiredChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends string, TValue extends GraphValue<TTokenType>> =
    TKey extends '' ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends '->' ? (
        TValue extends TTokenType ? GraphSingleResultMerge<TTokenType, TKey, string, TCurrentResult> :
        TValue extends Graph<TTokenType, infer TGraphResultValue> ? GraphSingleResultMerge<TTokenType, TKey, TGraphResultValue, TCurrentResult> :
        TValue extends GraphNode<TTokenType, infer TNodeResultValue> ? GraphSingleResultMerge<TTokenType, TKey, TNodeResultValue, TCurrentResult> :
        never
    ) :
    TKey extends string ? (
        TValue extends TTokenType ? GraphSingleResultExtend<TTokenType, TKey, string, TCurrentResult> :
        TValue extends Graph<TTokenType, infer TGraphResultValue> ? GraphSingleResultExtend<TTokenType, TKey, TGraphResultValue, TCurrentResult> :
        TValue extends GraphNode<TTokenType, infer TNodeResultValue> ? GraphSingleResultExtend<TTokenType, TKey, TNodeResultValue, TCurrentResult> :
        never
    ) :
    never;

type RequiredBranchChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends string, TValue extends Array<GraphValue<TTokenType>>> =
    TKey extends '' ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends '->' ? (
        1 // TODO:
    ) :
    TKey extends string ? (
        TValue extends Array<GraphValue<TTokenType>> ? GraphNode<TTokenType, GraphListResultExtend<TTokenType, TKey, TValue, TCurrentResult>> :
        never
    ) :
    never;


type OptionalBranchChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends string, TValue extends Array<GraphValue<TTokenType>>> =
    TKey extends '' ? GraphNode<TTokenType, TCurrentResult> : // No identifier
    TValue extends Array<GraphValue<TTokenType>> ? GraphNode<TTokenType, GraphListResultExtendOptional<TTokenType, TKey, TValue, TCurrentResult>> :
    never;

export type GraphValue<TTokenType extends string> = Graph<TTokenType> | TTokenType | GraphNode<TTokenType>;


