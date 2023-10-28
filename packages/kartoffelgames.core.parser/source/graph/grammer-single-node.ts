import { Stack } from '@kartoffelgames/core.data';
import { BaseGrammarNode } from './base-grammar-node';
import { GraphPartReference } from './graph-part-reference';

// TODO: VERY BIG. Is there a way to prevent stack cloning. FUgging slow.

export class GrammarSingleNode<TTokenType extends string> extends BaseGrammarNode<TTokenType> {
    private readonly mIdentifier: string | null;
    private readonly mNodeValue: TTokenType | GraphPartReference<TTokenType>;
    private readonly mOptional: boolean;

    public constructor(pNodeValue: TTokenType | GraphPartReference<TTokenType>, pOptional: boolean, pIdentifier: string | null) {
        super();

        this.mOptional = pOptional;
        this.mNodeValue = pNodeValue;
        this.mIdentifier = pIdentifier;
    }

    public override retrieveNext(pToken: TTokenType, pParentStack: Stack<BaseGrammarNode<TTokenType>>, pRequestingNode: BaseGrammarNode<TTokenType> | null): BaseGrammarNode<TTokenType>[] {
        throw new Error('Method not implemented.');

        // TODO: Get all nodes that are available after this node. NextNode, ChildGraph... and check if pToken is available for next token::validTokens
        // TODO: How to skip optional or void nodes???
    }

    /**
     * Get valid tokens for this node. Takes the current route into account.\
     * 
     * When the last node of a child graph requests:\
     * This node is skipped and the valid types of the {@link GrammarSingleNode.nextNode} are returned.\
     * 
     * When {@link GrammarSingleNode.previousNode} or {@link pParentNode} requests:\
     * The current node value or when the node value is a {@link GraphPartReference}, then the valid token of the child graph is returned. 
     * 
     * When this node is an optional node:\
     * All valid types for this node and all types of {@link GrammarSingleNode.nextNode} are returned.\
     * 
     * @param pParentStack - Nodes that host this nodes branch. Not the node that is chained before this node. 
     * @param pRequestingNode - Node that requests this information. 
     * 
     * @returns All valid token types for this node.
     */
    public override validTokens(pParentStack: Stack<BaseGrammarNode<TTokenType>>, pRequestingNode: BaseGrammarNode<TTokenType> | null): Array<TTokenType> {
        // When requesting node is part of mNodeValue::GraphPartReference return only from nextNode.
        if (typeof this.mNodeValue !== 'string' && pRequestingNode && this.mNodeValue.graph().branchRoot === pRequestingNode.branchRoot) {
            return this.nextNodeValidToken(this.nextNode, pParentStack);
        }

        const lValidTokenList: Array<TTokenType> = new Array<TTokenType>();

        // Get starting token type of child graph..
        if (typeof this.mNodeValue !== 'string') {
            // Copy parent stack and add current node as parent.
            const lParentStack: Stack<BaseGrammarNode<TTokenType>> = pParentStack.clone();
            lParentStack.push(this);

            lValidTokenList.push(...this.mNodeValue.graph().validTokens(lParentStack, this));
        } else {
            // Get token type this node.
            lValidTokenList.push(this.mNodeValue);
        }

        // Add next nodes types when token is optional.
        if (this.mOptional) {
            lValidTokenList.push(...this.nextNodeValidToken(this.nextNode, pParentStack));
        }

        return lValidTokenList;
    }

    /**
     * Get all valid types of the {@link GrammarSingleNode.nextNode}  or inner {@link GraphPartReference}.
     * 
     * @param pNextNode - Value of {@link GrammarSingleNode.nextNode} 
     * @param pParentStack - Nodes that host this nodes branch. Not the node that is chained before this node.
     * 
     * @returns All valid types of the {@link GrammarSingleNode.nextNode}  or inner {@link GraphPartReference}
     */
    private nextNodeValidToken(pNextNode: BaseGrammarNode<TTokenType> | null, pParentStack: Stack<BaseGrammarNode<TTokenType>>): Array<TTokenType> {
        const lValidTokenList: Array<TTokenType> = new Array<TTokenType>();

        if (pNextNode) {
            lValidTokenList.push(...pNextNode.validTokens(pParentStack, this));
        } else if (pParentStack.top) {
            // Clone parent stack and pop a layer.
            const lParentStack: Stack<BaseGrammarNode<TTokenType>> = pParentStack.clone();
            const lParentNode: BaseGrammarNode<TTokenType> = lParentStack.pop()!;

            lParentNode.validTokens(lParentStack, this);
        }

        return lValidTokenList;
    }
}