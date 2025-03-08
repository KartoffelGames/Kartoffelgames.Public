import { Exception } from "@kartoffelgames/core";
import type { Graph } from "./graph.ts";

export class GraphNode<TTokenType extends string, TCurrentResult extends object = object> {
    /**
     * Start a new branch node.
     */
    public static new<TTokenType extends string>(): GraphNode<TTokenType, {}> {
        // Create an empty node.
        const lAnonymousNode: GraphNode<TTokenType, {}> = new GraphNode<TTokenType>('', false, []);

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


    private constructor(pIdentifier: GraphNodeKey, pRequired: boolean, pValues: Array<GraphValue<TTokenType>>, pRootNode?: GraphNode<TTokenType>) {
        this.mChainedNode = null;
        this.mRequired = pRequired;

        // TODO: Split idenfifier into {empty: boolean, key: string, list: boolean, mergeKey: string}
        this.mIdentifier = pIdentifier;

        // When the value is a graph node, spool it back to its root node. // TODO: Convert it into a graph.
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
    public branch<TKey extends GraphNodeKey, const TValue extends Array<GraphValue<TTokenType>>>(pIdentifier: TKey, pBranches: TValue): RequiredBranchChainResult<TTokenType, TCurrentResult, TKey, TValue>;


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
    public branch<const TValue extends Array<GraphValue<TTokenType>>>(pBranches: TValue): RequiredBranchChainResult<TTokenType, TCurrentResult, GraphNodeEmptyKey, TValue>;


    /**
     * Creates a new branch node and chains it after the current node.
     * 
     * @param pIdentifierOrBranches - Either a string identifier for the new node or an array of branch values.
     * @param pBranches - An optional array of branch values if the first parameter is a string identifier.
     * 
     * @returns The newly created and chained GraphNode.
     */
    public branch(pIdentifierOrBranches: GraphNodeKey | Array<GraphValue<TTokenType>>, pBranches?: Array<GraphValue<TTokenType>>): GraphNode<TTokenType, TCurrentResult> {
        // Read mixed parameter with correct value. 
        const lIdentifier: GraphNodeKey = Array.isArray(pIdentifierOrBranches) ? '' : pIdentifierOrBranches;
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
    public optional<TKey extends GraphNodeKey, TValue extends GraphValue<TTokenType>>(pIdentifier: TKey, pValue: TValue): OptionalChainResult<TTokenType, TCurrentResult, TKey, TValue>;

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
    public optional<TValue extends GraphValue<TTokenType>>(pValue: TValue): OptionalChainResult<TTokenType, TCurrentResult, GraphNodeEmptyKey, TValue>;

    /**
     * Creates a new `GraphNode` with a optional single value and chains it after the current node.
     * 
     * @param pIdentifierOrValue - Either a string identifier or a `GraphValue` object. If `pValue` is provided, this parameter is treated as the identifier.
     * @param pValue - An optional `GraphValue` object. If provided, `pIdentifierOrValue` is treated as the identifier.
     * 
     * @returns The newly created and chained `GraphNode`.
     */
    public optional(pIdentifierOrValue: GraphNodeKey | GraphValue<TTokenType>, pValue?: GraphValue<TTokenType>): GraphNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: GraphNodeKey = (typeof pValue === 'undefined') ? '' : <GraphNodeKey>pIdentifierOrValue;
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
    public optionalBranch<TKey extends GraphNodeKey, const TValue extends Array<GraphValue<TTokenType>>>(pIdentifier: TKey, pBranches: TValue): OptionalBranchChainResult<TTokenType, TCurrentResult, TKey, TValue>;


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
    public optionalBranch<const TValue extends Array<GraphValue<TTokenType>>>(pBranches: TValue): OptionalBranchChainResult<TTokenType, TCurrentResult, GraphNodeEmptyKey, TValue>;


    /**
     * Creates a new branch node and chains it after the current node.
     * 
     * @param pIdentifierOrBranches - Either a string identifier for the new node or an array of branch values.
     * @param pBranches - An optional array of branch values if the first parameter is a string identifier.
     * 
     * @returns The newly created and chained GraphNode.
     */
    public optionalBranch(pIdentifierOrBranches: GraphNodeKey | Array<GraphValue<TTokenType>>, pBranches?: Array<GraphValue<TTokenType>>): GraphNode<TTokenType, TCurrentResult> {
        // Read mixed parameter with correct value. 
        const lIdentifier: GraphNodeKey = Array.isArray(pIdentifierOrBranches) ? '' : pIdentifierOrBranches;
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
    public required<TKey extends GraphNodeKey, TValue extends GraphValue<TTokenType>>(pIdentifier: TKey, pValue: TValue): RequiredChainResult<TTokenType, TCurrentResult, TKey, TValue>;

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
    public required<TValue extends GraphValue<TTokenType>>(pValue: TValue): RequiredChainResult<TTokenType, TCurrentResult, GraphNodeEmptyKey, TValue>;

    /**
     * Creates a new `GraphNode` with a required single value and chains it after the current node.
     * 
     * @param pIdentifierOrValue - Either a string identifier or a `GraphValue` object. If `pValue` is provided, this parameter is treated as the identifier.
     * @param pValue - An optional `GraphValue` object. If provided, `pIdentifierOrValue` is treated as the identifier.
     * 
     * @returns The newly created and chained `GraphNode`.
     */
    public required(pIdentifierOrValue: GraphNodeKey | GraphValue<TTokenType>, pValue?: GraphValue<TTokenType>): GraphNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: GraphNodeKey = (typeof pValue === 'undefined') ? '' : <GraphNodeKey>pIdentifierOrValue;
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

/*
 * Graph node keys.
 */
type GraphNodeListKey = `${string}[]`;
type GraphNodeEmptyKey = '';
type GraphNodeMergeKey = `${string}<-${string}`;
type GraphNodeSingleKey = string;
type GraphNodeKey = GraphNodeListKey | GraphNodeEmptyKey | GraphNodeMergeKey | GraphNodeSingleKey;

/*
 * Utility. 
 */

type Prettify<T> = {
    [K in keyof T]: T[K];
} & unknown;

type MergeObjects<T extends object, U extends object> = Prettify<{ [K in keyof T]: K extends keyof U ? U[K] : T[K] } & U>;

/*
 * Branch result extend types. 
 */

type UnwrapBranchResult<TTokenType extends string, TValue extends Array<GraphValue<TTokenType>>> = {
    [K in keyof TValue]: (
        TValue[K] extends GraphNodeValue<TTokenType, infer T> ? T :
        TValue[K] extends TTokenType ? TValue[K] :
        never
    )
} extends Array<infer U> ? U : never;

/*
 * Branch node result types.
 */

type OptionalChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends GraphNodeKey, TValue extends GraphValue<TTokenType>> =
    TKey extends GraphNodeEmptyKey ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends `${infer TPropertyKey}[]` ? (
        TValue extends TTokenType ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]?: Array<string> }>> :
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]?: Array<TNodeResultValue> }>> :
        never
    ) :
    TKey extends `${infer TPropertyKey}<-${infer TMergeKey}` ? (
        TCurrentResult extends { [x in TPropertyKey]: Array<infer TCurrentResultValue> } ? (
            TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
                TNodeResultValue extends { [x in TMergeKey]: Array<TCurrentResultValue> } ? GraphNode<TTokenType, TCurrentResult> :
                TNodeResultValue extends { [x in TMergeKey]: TCurrentResultValue } ? GraphNode<TTokenType, TCurrentResult> :
                never
            ) :
            never
        ) :
        TCurrentResult extends { [x in TPropertyKey]: any } ? never : // Should not have the key. 
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
            TNodeResultValue extends { [x in TMergeKey]: Array<infer TMergeValue> } ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]?: Array<TMergeValue> }>> :
            TNodeResultValue extends { [x in TMergeKey]: infer TMergeValue } ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]?: TMergeValue }>> :
            never
        ) :
        never
    ) :
    TKey extends GraphNodeSingleKey ? (
        TValue extends TTokenType ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: string }>> :
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: TNodeResultValue }>> :
        never
    ) :
    never;

type RequiredChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends GraphNodeKey, TValue extends GraphValue<TTokenType>> =
    TKey extends GraphNodeEmptyKey ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends `${infer TPropertyKey}[]` ? (
        TValue extends TTokenType ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<string> }>> :
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<TNodeResultValue> }>> :
        never
    ) :
    TKey extends `${infer TPropertyKey}<-${infer TMergeKey}` ? (
        TCurrentResult extends { [x in TPropertyKey]: Array<infer TCurrentResultValue> } ? (
            TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
                TNodeResultValue extends { [x in TMergeKey]: Array<TCurrentResultValue> } ? GraphNode<TTokenType, TCurrentResult> :
                TNodeResultValue extends { [x in TMergeKey]: TCurrentResultValue } ? GraphNode<TTokenType, TCurrentResult> :
                never
            ) :
            never
        ) :
        TCurrentResult extends { [x in TPropertyKey]: any } ? never : // Should not have the key. 
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
            TNodeResultValue extends { [x in TMergeKey]: Array<infer TMergeValue> } ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<TMergeValue> }>> :
            TNodeResultValue extends { [x in TMergeKey]: infer TMergeValue } ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: TMergeValue }>> :
            never
        ) :
        never
    ) :
    TKey extends GraphNodeSingleKey ? (
        TValue extends TTokenType ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: string }>> :
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: TNodeResultValue }>> :
        never
    ) :
    never;

type RequiredBranchChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends GraphNodeKey, TValue extends Array<GraphValue<TTokenType>>> =
    TKey extends GraphNodeEmptyKey ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends GraphNodeMergeKey ? never : // Not allowed on branches.
    TKey extends `${infer TPropertyKey}[]` ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<UnwrapBranchResult<TTokenType, TValue>> }>> :
    TKey extends GraphNodeSingleKey ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: UnwrapBranchResult<TTokenType, TValue> }>> :
    never;

type OptionalBranchChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends GraphNodeKey, TValue extends Array<GraphValue<TTokenType>>> =
    TKey extends GraphNodeEmptyKey ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends GraphNodeMergeKey ? never : // Not allowed on branches.
    TKey extends `${infer TPropertyKey}[]` ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]?: Array<UnwrapBranchResult<TTokenType, TValue>> }>> :
    TKey extends GraphNodeSingleKey ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]?: UnwrapBranchResult<TTokenType, TValue> }>> :
    never;

/*
 * Graph value types 
 */

type GraphNodeValue<TTokenType extends string, TResult> = TResult extends object ? Graph<TTokenType, TResult> | GraphNode<TTokenType, TResult> : Graph<TTokenType, object, TResult>;
type GraphValue<TTokenType extends string> = TTokenType | GraphNodeValue<TTokenType, any>;


