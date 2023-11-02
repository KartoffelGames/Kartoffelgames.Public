import { Exception } from '@kartoffelgames/core.data';
import { BaseGrammarNode, GrammarGraphValue } from './base-grammar-node';
import { GrammarNodeValueType } from './grammer-node-value-type.enum';

/**
 * Anonymous node.
 * Acts as a starting point of a branch.
 * Does not set itself a the previous node when it got chained.
 * 
 * Overrides every chain method.
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export class AnonymoutGrammarNode<TTokenType extends string> extends BaseGrammarNode<TTokenType> {
    /**
     * Throws an error.
     * This node should not be uses in any graph. Only exist when this node does't get chained.
     */
    public get nodeValues(): Array<GrammarGraphValue<TTokenType>> {
        throw new Exception(`Anonymous nodes can't act as a ordinary node. To start a branch, this node needs to be chained.`, this);
    }

    /**
     * Constructor.
     */
    public constructor() {
        super(null, false, GrammarNodeValueType.Single, null);
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
    public override branch(pIdentifier: string | null, pBranches: Array<GrammarGraphValue<TTokenType>>): GrammarBranchNode<TTokenType> {
        // Create new node and chain it after this node.
        return new GrammarBranchNode<TTokenType>(null, pBranches, true, pIdentifier);
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
    public override loop(pIdentifier: string | null, pValue: GrammarGraphValue<TTokenType>): GrammarLoopNode<TTokenType> {
        // Create new node and chain it after this node.
        return new GrammarLoopNode<TTokenType>(null, pValue, pIdentifier);
    }

    /**
     * Throws an error.
     * This node should not be uses in any graph. Only exist when this node does't get chained.
     * 
     * @internal
     */
    public override next(): Array<BaseGrammarNode<TTokenType> | null> {
        throw new Exception(`Anonymous nodes can't act as a ordinary node. To start a branch, this node needs to be chained.`, this);
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
    public override optional(pValue: GrammarGraphValue<TTokenType>, pIdentifier: string | null = null): GrammarSingleNode<TTokenType> {
        // Create new node and chain it after this node.
        return new GrammarSingleNode<TTokenType>(null, pValue, false, pIdentifier);
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
    public override optionalBranch(pIdentifier: string | null, pBranches: Array<GrammarGraphValue<TTokenType>>): GrammarBranchNode<TTokenType> {
        // Create new node and chain it after this node.
        return new GrammarBranchNode<TTokenType>(null, pBranches, false, pIdentifier);
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
    public override single(pValue: GrammarGraphValue<TTokenType>, pIdentifier: string | null = null): GrammarSingleNode<TTokenType> {
        // Create new node and chain it after this node.
        return new GrammarSingleNode<TTokenType>(null, pValue, true, pIdentifier);
    }
}

// Load child branches after parent to prevent circular dependency problems.
import { GrammarBranchNode } from './grammer-branch-node';
import { GrammarLoopNode } from './grammer-loop-node';
import { GrammarSingleNode } from './grammer-single-node';

