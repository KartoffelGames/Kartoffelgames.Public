import { Exception } from '@kartoffelgames/core';
import { Graph } from './graph.ts';

/**
 * Represents a node in a graph structure.
 * 
 * @template TTokenType - The type of the token associated with the node.
 * @template TResultData - The type of the current result object.
 */
export class GraphNode<TTokenType extends string, TResultData extends object = object> {
    /**
     * Start a new branch node.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    public static new<TTokenType extends string>(): GraphNode<TTokenType, {}> {
        // Create an empty node.
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        const lAnonymousNode: GraphNode<TTokenType, {}> = new GraphNode<TTokenType>('', false, []);

        // Shady shit. 
        // Assign null as root node, so the next node that gets chained receives NULL as `pRootNode` in its constructor
        // This than sets the chained node itself as the root node, discarding this actual root node. 
        lAnonymousNode.mRootNode = null as any;

        // Return shady node.
        return lAnonymousNode;
    }

    private readonly mConnections: GraphNodeConnections<TTokenType>;
    private readonly mIdentifier: GraphNodeIdentifier;
    private mRootNode: GraphNode<TTokenType>;

    /**
     * Overall graph node configuration.
     * Dont use it for production code.
     */
    public get configuration(): GraphNodeConfiguration {
        return {
            dataKey: this.mIdentifier.dataKey,
            isList: this.mIdentifier.isList,
            isRequired: this.mConnections.required,
            isBranch: this.mConnections.values.length > 1
        };
    }

    public get connections(): GraphNodeConnections<TTokenType> {
        return this.mConnections;
    }

    /**
     * Get the root node of this branch.
     */
    public get root(): GraphNode<TTokenType> {
        // Can happen when Graph.new is called.
        if (!this.mRootNode) {
            throw new Exception('Staring nodes must be chained with another node to be used.', this);
        }

        return this.mRootNode;
    }

    /**
     * Creates an instance of GraphNode.
     * 
     * @param pIdentifier - The identifier for the graph node.
     * @param pRequired - A boolean indicating whether the node is required.
     * @param pValues - An array of values associated with the node.
     * @param pRootNode - (Optional) The root node of the graph. If not provided, this node will be considered the root node.
     */
    private constructor(pIdentifier: GraphNodeKey, pRequired: boolean, pValues: Array<GraphParameterValue<TTokenType>>, pRootNode?: GraphNode<TTokenType>) {
        // Split idenfifier into {empty: boolean, key: string, list: boolean, mergeKey: string}
        if (pIdentifier === '') {
            this.mIdentifier = {
                dataKey: '', isList: false, mergeKey: '',
                omitData: true
            };
        } else if (pIdentifier.endsWith('[]')) {
            this.mIdentifier = {
                omitData: false, isList: true, mergeKey: '',
                dataKey: pIdentifier.substring(0, pIdentifier.length - 2), // Remove [] from key.
            };
        } else if (pIdentifier.includes('<-')) {
            const lSplit: Array<string> = pIdentifier.split('<-');
            this.mIdentifier = {
                omitData: false,
                isList: true,
                dataKey: lSplit[0],
                mergeKey: lSplit[1]
            };
        }
        else {
            this.mIdentifier = {
                omitData: false, isList: false, mergeKey: '',
                dataKey: pIdentifier
            };
        }

        // Convert all graph nodes to graphs
        const lNodeValues: Array<GraphValue<TTokenType>> = pValues.map((pItem) => {
            if (pItem instanceof GraphNode) {
                return Graph.define(() => pItem);
            }

            return pItem;
        });

        // Save values. Spool back all values to the root node.
        this.mConnections = {
            required: pRequired,
            values: lNodeValues,

            // Is set when the node is chained.
            next: null,
        };

        // If the root node is not set, then this node is the root node.
        if (!pRootNode) {
            this.mRootNode = this;
        } else {
            this.mRootNode = pRootNode;
        }
    }

    /**
     * Merge data from chained nodes into current node data.
     * 
     * @param pNodeData - Value that this node has generated.
     * @param pChainData - Value that the chained node has generated.
     * @returns 
     */
    public mergeData(pNodeData: unknown | undefined, pChainData: object): TResultData {
        // Nothing to do on empty nodes.
        if (this.mIdentifier.omitData) {
            return pChainData as TResultData;
        }

        // Merge as single key. Single keys are never merge keys
        if (!this.mIdentifier.isList) {
            // Throw when key already exists in chain data.
            if (this.mIdentifier.dataKey in pChainData) {
                throw new Exception(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`, this);
            }

            // Skip adding node data when it is not set.
            if (typeof pNodeData === 'undefined') {
                return pChainData as TResultData;
            }

            // Merge as single key.
            (<Record<string, unknown>>pChainData)[this.mIdentifier.dataKey] = pNodeData;

            return pChainData as TResultData;
        }

        // Data that should be merged into the chain data.
        const lNodeData: unknown = (() => {
            // Node is optional and data is undefined, node data is a empty array.
            if (!this.mConnections.required && typeof pNodeData === 'undefined') {
                return new Array<unknown>();
            }

            // Merge with merge key.
            if (this.mIdentifier.mergeKey) {
                // Node data must be an object
                if (typeof pNodeData !== 'object' || pNodeData === null) {
                    throw new Exception('Node data must be an object when merge key is set.', this);
                }

                // Chain data must contain the merge key.
                if (!(this.mIdentifier.mergeKey in pNodeData)) {
                    throw new Exception(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`, this);
                }

                // Read value from node data.
                return (<Record<string, unknown>>pNodeData)[this.mIdentifier.mergeKey];
            }

            // Node data is the value.
            return pNodeData;
        })();

        // Merge as list.

        // Read value from chain data.
        let lChainMergeValue: unknown = (<Record<string, unknown>>pChainData)[this.mIdentifier.dataKey];
        const lChainMergeValueIsArray: boolean = Array.isArray(lChainMergeValue);

        // Throw when chain merge value exists but is not an array.
        if (typeof lChainMergeValue !== 'undefined' && !lChainMergeValueIsArray) {
            throw new Exception(`Chain data merge value is not an array but should be.`, this);
        }

        // Create and add new array when is does not already exists in the chain data.
        if (!lChainMergeValueIsArray) {
            lChainMergeValue = new Array<unknown>();
            (<Record<string, unknown>>pChainData)[this.mIdentifier.dataKey] = lChainMergeValue;
        }

        // Merge node and chain data. must be pushed in reversed order to represent the bottom up approach.
        if (Array.isArray(lNodeData)) {
            (<Array<unknown>>lChainMergeValue).unshift(...lNodeData);
        } else {
            (<Array<unknown>>lChainMergeValue).unshift(lNodeData);
        }

        return pChainData as TResultData;
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
    public optional<TKey extends GraphNodeKey, TValue extends GraphParameterValue<TTokenType>>(pIdentifier: TKey, pValue: TValue): OptionalChainResult<TTokenType, TResultData, TKey, TValue>;

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
    public optional<TValue extends GraphParameterValue<TTokenType>>(pValue: TValue): OptionalChainResult<TTokenType, TResultData, GraphNodeEmptyKey, TValue>;

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
    public optional<TKey extends GraphNodeKey, const TValue extends Array<GraphParameterValue<TTokenType>>>(pIdentifier: TKey, pBranches: TValue): OptionalBranchChainResult<TTokenType, TResultData, TKey, TValue>;

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
    public optional<const TValue extends Array<GraphParameterValue<TTokenType>>>(pBranches: TValue): OptionalBranchChainResult<TTokenType, TResultData, GraphNodeEmptyKey, TValue>;

    /**
     * Creates a new `GraphNode` with a optional single value and chains it after the current node.
     * 
     * @param pIdentifierOrValue - Either a string identifier or a `GraphValue` object. If `pValue` is provided, this parameter is treated as the identifier.
     * @param pValue - An optional `GraphValue` object. If provided, `pIdentifierOrValue` is treated as the identifier.
     * 
     * @returns The newly created and chained `GraphNode`.
     */
    public optional(pIdentifierOrValue: GraphNodeKey | GraphParameterValue<TTokenType> | Array<GraphParameterValue<TTokenType>>, pValue?: GraphParameterValue<TTokenType> | Array<GraphParameterValue<TTokenType>>): GraphNode<TTokenType, any> {
        // Read mixed parameter with correct value. 
        const lIdentifier: GraphNodeKey = (typeof pValue === 'undefined') ? '' : <GraphNodeKey>pIdentifierOrValue;

        // Read values.
        const lRawValues: GraphParameterValue<TTokenType> | Array<GraphParameterValue<TTokenType>> | undefined = (typeof pValue === 'undefined') ?
            pIdentifierOrValue as (GraphParameterValue<TTokenType> | Array<GraphParameterValue<TTokenType>>) :
            pValue;

        // Save value as array.
        const lValues: Array<GraphParameterValue<TTokenType>> = new Array<GraphParameterValue<TTokenType>>();
        if (Array.isArray(lRawValues)) {
            lValues.push(...lRawValues);
        }
        else {
            lValues.push(lRawValues);
        }

        // Create new node and chain it after this node.
        const lNode: GraphNode<TTokenType, any> = new GraphNode<TTokenType, any>(lIdentifier, false, lValues, this.mRootNode);

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
    public required<TKey extends GraphNodeKey, TValue extends GraphParameterValue<TTokenType>>(pIdentifier: TKey, pValue: TValue): RequiredChainResult<TTokenType, TResultData, TKey, TValue>;

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
    public required<TValue extends GraphParameterValue<TTokenType>>(pValue: TValue): RequiredChainResult<TTokenType, TResultData, GraphNodeEmptyKey, TValue>;

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
    public required<TKey extends GraphNodeKey, const TValue extends Array<GraphParameterValue<TTokenType>>>(pIdentifier: TKey, pBranches: TValue): RequiredBranchChainResult<TTokenType, TResultData, TKey, TValue>;

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
    public required<const TValue extends Array<GraphParameterValue<TTokenType>>>(pBranches: TValue): RequiredBranchChainResult<TTokenType, TResultData, GraphNodeEmptyKey, TValue>;

    /**
     * Creates a new `GraphNode` with a required single value and chains it after the current node.
     * 
     * @param pIdentifierOrValue - Either a string identifier or a `GraphValue` object. If `pValue` is provided, this parameter is treated as the identifier.
     * @param pValue - An optional `GraphValue` object. If provided, `pIdentifierOrValue` is treated as the identifier.
     * 
     * @returns The newly created and chained `GraphNode`.
     */
    public required(pIdentifierOrValue: GraphNodeKey | GraphParameterValue<TTokenType> | Array<GraphParameterValue<TTokenType>>, pValue?: GraphParameterValue<TTokenType> | Array<GraphParameterValue<TTokenType>>): GraphNode<TTokenType, any> {
        // Read mixed parameter with correct value. 
        const lIdentifier: GraphNodeKey = (typeof pValue === 'undefined') ? '' : <GraphNodeKey>pIdentifierOrValue;

        // Read values.
        const lRawValues: GraphParameterValue<TTokenType> | Array<GraphParameterValue<TTokenType>> | undefined = (typeof pValue === 'undefined') ?
            pIdentifierOrValue as (GraphParameterValue<TTokenType> | Array<GraphParameterValue<TTokenType>>) :
            pValue;

        // Save value as array.
        const lValues: Array<GraphParameterValue<TTokenType>> = new Array<GraphParameterValue<TTokenType>>();
        if (Array.isArray(lRawValues)) {
            lValues.push(...lRawValues);
        }
        else {
            lValues.push(lRawValues);
        }

        // Create new node and chain it after this node.
        const lNode: GraphNode<TTokenType, any> = new GraphNode<TTokenType, any>(lIdentifier, true, lValues, this.mRootNode);

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
        if (this.mConnections.next !== null) {
            throw new Exception(`Node can only be chained to a single node.`, this);
        }

        this.mConnections.next = pChainedNode;
    }
}

type GraphNodeConfiguration = {
    dataKey: string;
    isList: boolean;
    isRequired: boolean;
    isBranch: boolean;
};

type GraphNodeIdentifier = {
    omitData: boolean;
    dataKey: string;
    isList: boolean;
    mergeKey: string;
};

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

type MergeObjects<TTarget extends object, TSource extends object> = Prettify<{ [K in keyof TTarget]: K extends keyof TSource ? TSource[K] : TTarget[K] } & TSource>;

/*
 * Branch result extend types. 
 */

type UnwrapBranchResult<TTokenType extends string, TValue extends Array<GraphParameterValue<TTokenType>>> = {
    [K in keyof TValue]: (
        TValue[K] extends GraphNodeValue<TTokenType, infer T> ? T :
        TValue[K] extends TTokenType ? TValue[K] :
        never
    )
} extends Array<infer U> ? U : never;

/*
 * Branch node result types.
 */

type OptionalChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends GraphNodeKey, TValue extends GraphParameterValue<TTokenType>> =
    TKey extends GraphNodeEmptyKey ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends `${infer TPropertyKey}[]` ? (
        TValue extends TTokenType ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<string> }>> :
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
            TNodeResultValue extends Array<infer TArrayType> ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<TArrayType> }>> :
            GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<TNodeResultValue> }>>
        ) :
        never
    ) :
    TKey extends `${infer TPropertyKey}<-${infer TMergeKey}` ? (
        TCurrentResult extends { [x in TPropertyKey]: Array<infer TCurrentResultValue> } ? (
            TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
                TNodeResultValue extends { [x in TMergeKey]: Array<TCurrentResultValue> } ? GraphNode<TTokenType, TCurrentResult> :
                TNodeResultValue extends { [x in TMergeKey]: TCurrentResultValue } ? GraphNode<TTokenType, TCurrentResult> :
                unknown
            ) :
            unknown
        ) :
        TCurrentResult extends { [x in TPropertyKey]: any } ? unknown : // Should not have the key. 
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
            TNodeResultValue extends { [x in TMergeKey]: Array<infer TMergeValue> } ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<TMergeValue> }>> :
            TNodeResultValue extends { [x in TMergeKey]: infer TMergeValue } ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: TMergeValue }>> :
            unknown
        ) :
        unknown
    ) :
    TKey extends GraphNodeSingleKey ? (
        TValue extends TTokenType ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: string }>> :
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: TNodeResultValue }>> :
        never
    ) :
    never;

type RequiredChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends GraphNodeKey, TValue extends GraphParameterValue<TTokenType>> =
    TKey extends GraphNodeEmptyKey ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends `${infer TPropertyKey}[]` ? (
        TValue extends TTokenType ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<string> }>> :
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
            TNodeResultValue extends Array<infer TArrayType> ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<TArrayType> }>> :
            GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<TNodeResultValue> }>>
        ) :
        never
    ) :
    TKey extends `${infer TPropertyKey}<-${infer TMergeKey}` ? (
        TCurrentResult extends { [x in TPropertyKey]: Array<infer TCurrentResultValue> } ? (
            TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
                TNodeResultValue extends { [x in TMergeKey]: Array<TCurrentResultValue> } ? GraphNode<TTokenType, TCurrentResult> :
                TNodeResultValue extends { [x in TMergeKey]: TCurrentResultValue } ? GraphNode<TTokenType, TCurrentResult> :
                unknown
            ) :
            unknown
        ) :
        TCurrentResult extends { [x in TPropertyKey]: any } ? unknown : // Should not have the key. 
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? (
            TNodeResultValue extends { [x in TMergeKey]: Array<infer TMergeValue> } ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<TMergeValue> }>> :
            TNodeResultValue extends { [x in TMergeKey]: infer TMergeValue } ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: TMergeValue }>> :
            unknown
        ) :
        unknown
    ) :
    TKey extends GraphNodeSingleKey ? (
        TValue extends TTokenType ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: string }>> :
        TValue extends GraphNodeValue<TTokenType, infer TNodeResultValue> ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: TNodeResultValue }>> :
        never
    ) :
    never;

type RequiredBranchChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends GraphNodeKey, TValue extends Array<GraphParameterValue<TTokenType>>> =
    TKey extends GraphNodeEmptyKey ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends GraphNodeMergeKey ? unknown : // Not allowed on branches.
    TKey extends `${infer TPropertyKey}[]` ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]: Array<UnwrapBranchResult<TTokenType, TValue>> }>> :
    TKey extends GraphNodeSingleKey ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]: UnwrapBranchResult<TTokenType, TValue> }>> :
    never;

type OptionalBranchChainResult<TTokenType extends string, TCurrentResult extends object, TKey extends GraphNodeKey, TValue extends Array<GraphParameterValue<TTokenType>>> =
    TKey extends GraphNodeEmptyKey ? GraphNode<TTokenType, TCurrentResult> :
    TKey extends GraphNodeMergeKey ? unknown : // Not allowed on branches.
    TKey extends `${infer TPropertyKey}[]` ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TPropertyKey]?: Array<UnwrapBranchResult<TTokenType, TValue>> }>> :
    TKey extends GraphNodeSingleKey ? GraphNode<TTokenType, MergeObjects<TCurrentResult, { [x in TKey]?: UnwrapBranchResult<TTokenType, TValue> }>> :
    never;

/*
 * Graph value types 
 */

type GraphNodeValue<TTokenType extends string, TResult> = TResult extends object ? Graph<TTokenType, any, TResult> | GraphNode<TTokenType, TResult> : Graph<TTokenType, object, TResult>;
type GraphParameterValue<TTokenType extends string> = TTokenType | GraphNodeValue<TTokenType, any>;


export type GraphValue<TTokenType extends string> = TTokenType | Graph<TTokenType, object, any>;

export type GraphNodeConnections<TTokenType extends string> = {
    required: boolean;
    next: GraphNode<TTokenType> | null;
    values: Array<GraphValue<TTokenType>>;
};