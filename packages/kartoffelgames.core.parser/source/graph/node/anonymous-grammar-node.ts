import { Exception } from '@kartoffelgames/core';
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
export class AnonymousGrammarNode<TTokenType extends string> extends BaseGrammarNode<TTokenType, {}> {
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
    public override branch(pIdentifierOrBranches: string | null | Array<GrammarGraphValue<TTokenType>>, pBranches?: Array<GrammarGraphValue<TTokenType>>): GrammarBranchNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (Array.isArray(pIdentifierOrBranches)) ? null : pIdentifierOrBranches;
        const lBranches: Array<GrammarGraphValue<TTokenType>> = (Array.isArray(pIdentifierOrBranches)) ? pIdentifierOrBranches : pBranches!;

        // Create new node and chain it after this node.
        return new GrammarBranchNode<TTokenType>(null, lBranches, true, lIdentifier);
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
    public override loop(pIdentifierOrValue: string | null | GrammarGraphValue<TTokenType>, pValue?: GrammarGraphValue<TTokenType>): GrammarLoopNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (typeof pValue === 'undefined') ? null : <string | null>pIdentifierOrValue;
        const lValue: GrammarGraphValue<TTokenType> = (typeof pValue === 'undefined') ? <GrammarGraphValue<TTokenType>>pIdentifierOrValue : pValue!;

        // Create new node and chain it after this node.
        return new GrammarLoopNode<TTokenType>(null, lValue, lIdentifier);
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
    public override optional(pIdentifierOrValue: string | null | GrammarGraphValue<TTokenType>, pValue?: GrammarGraphValue<TTokenType>): GrammarSingleNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (typeof pValue === 'undefined') ? null : <string | null>pIdentifierOrValue;
        const lValue: GrammarGraphValue<TTokenType> = (typeof pValue === 'undefined') ? <GrammarGraphValue<TTokenType>>pIdentifierOrValue : pValue!;

        // Create new node and chain it after this node.
        return new GrammarSingleNode<TTokenType>(null, lValue, false, lIdentifier);
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
    public override optionalBranch(pIdentifierOrBranches: string | null | Array<GrammarGraphValue<TTokenType>>, pBranches?: Array<GrammarGraphValue<TTokenType>>): GrammarBranchNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (Array.isArray(pIdentifierOrBranches)) ? null : pIdentifierOrBranches;
        const lBranches: Array<GrammarGraphValue<TTokenType>> = (Array.isArray(pIdentifierOrBranches)) ? pIdentifierOrBranches : pBranches!;

        // Create new node and chain it after this node.
        return new GrammarBranchNode<TTokenType>(null, lBranches, false, lIdentifier);
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
    public override single(pIdentifierOrValue: string | null | GrammarGraphValue<TTokenType>, pValue?: GrammarGraphValue<TTokenType>): GrammarSingleNode<TTokenType> {
        // Read mixed parameter with correct value. 
        const lIdentifier: string | null = (typeof pValue === 'undefined') ? null : <string | null>pIdentifierOrValue;
        const lValue: GrammarGraphValue<TTokenType> = (typeof pValue === 'undefined') ? <GrammarGraphValue<TTokenType>>pIdentifierOrValue : pValue!;

        // Create new node and chain it after this node.
        return new GrammarSingleNode<TTokenType>(null, lValue, true, lIdentifier);
    }
}

// Load child branches after parent to prevent circular dependency problems.
import { GrammarBranchNode } from './grammer-branch-node';
import { GrammarLoopNode } from './grammer-loop-node';
import { GrammarSingleNode } from './grammer-single-node';

