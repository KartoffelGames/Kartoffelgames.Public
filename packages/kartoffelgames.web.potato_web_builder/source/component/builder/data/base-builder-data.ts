import { Dictionary, Exception, List } from '@kartoffelgames/core.data';
import { ComponentManager } from '../../component-manager';
import { ComponentModules } from '../../component-modules';
import { ElementCreator } from '../../element-creator';
import { BaseBuilder } from '../base-builder';

export abstract class BaseBuilderData {
    private readonly mChildBuilderList: List<BaseBuilder>;
    private readonly mChildComponents: Dictionary<Content, ComponentManager>;
    private readonly mContentAnchor: Comment;
    private readonly mContentBoundary: RawContentBoundary;
    private readonly mLinkedContent: WeakSet<Content>;
    private readonly mModules: ComponentModules;
    private readonly mRootChildList: List<Content>;

    /**
     * Get core content of builder content.
     * Elements are returned in DOM order.
     */
    public get body(): Array<Content> {
        return this.mRootChildList;
    }

    /**
     * Any child builder in direct content.
     * Builders nested in another builder is ignored.
     */
    public get builders(): Array<BaseBuilder> {
        return this.mChildBuilderList;
    }

    /**
     * Get content anchor.
     * All content of this builder data gets append after this anchor.
     */
    public get contentAnchor(): Comment {
        return this.mContentAnchor;
    }

    /**
     * Component modules of builder layer.
     */
    public get modules(): ComponentModules {
        return this.mModules;
    }

    /**
     * Constructor.
     * @param pModules - Available modules of builder-
     */
    public constructor(pModules: ComponentModules) {
        this.mModules = pModules;

        // Init quick access buffers.
        this.mChildBuilderList = new List<BaseBuilder>();
        this.mRootChildList = new List<Content>();
        this.mChildComponents = new Dictionary<Content, ComponentManager>();
        this.mLinkedContent = new WeakSet<Content>();

        // Create anchor of content. Anchors marks the beginning of all content nodes.
        this.mContentAnchor = ElementCreator.createComment(Math.random().toString(16).substring(3).toUpperCase()); // TODO: A good way to have better anchor names.

        // Set starting boundary. Existing only of anchor.
        this.mContentBoundary = {
            start: this.mContentAnchor,
            end: this.mContentAnchor
        };
    }

    /**
     * Deconstruct builders deconstructable data and removes any content from the current document.
     * 
     * @remarks
     * {@link deconstruct} can be called multiple times but does nothing on further calls.
     */
    public deconstruct(): void {
        // Deconstruct additional data.
        this.onDeconstruct();

        // Deconstruct builder while clearing list.
        let lBuilder: BaseBuilder | undefined;
        while ((lBuilder = this.mChildBuilderList.pop())) {
            lBuilder.deconstruct();
        }

        // Deconstruct components.
        for (const lComponentManager of this.mChildComponents.values()) {
            lComponentManager.deconstruct();
        }
        this.mChildComponents.clear();

        // Get current builder parent element. Skip deletion when it is not attached to any document.
        // Remove all content. Only remove root elements. GC makes the rest.
        let lRootChild: Content | undefined;
        while ((lRootChild = this.mRootChildList.pop())) {
            // Only remove elements. Builder and componentes are already deconstructed.
            if (!(lRootChild instanceof BaseBuilder)) {
                lRootChild.remove();
            }
        }

        // Remove self from document.
        this.contentAnchor.remove();
    }

    /**
     * Get content start and end node.
     * If the current last node of content is a builder, the last node of this builder is returned.
     * This recursion will take place until an node is found.
     */
    public getBoundary(): Boundary {
        // Top is always the anchor.
        const lTopNode: Comment = this.mContentBoundary.start;

        // Get last element of builder if bottom element is a builder 
        // or use node as bottom element.
        let lBottomNode: Node;
        if (this.mContentBoundary.end instanceof BaseBuilder) {
            lBottomNode = this.mContentBoundary.end.boundary.end;
        } else {
            lBottomNode = this.mContentBoundary.end;
        }

        return {
            start: lTopNode,
            end: lBottomNode
        };
    }

    /**
     * Add element to content by mode.
     * Can't add {@link pSource} to any {@link pTarget} that is not a content of the builder.
     * 
     * @param pSource - The element that should be added.
     * @param pMode - Insert mode for child.
     * @param pTarget - Parent element or target node.
     * 
     * @throws {@link Exception}
     * When {@link pTarget} is not a direct content of this builder. Even when pTarget is a content of a nested builder.
     */
    public insert(pSource: Content, pMode: InserMode, pTarget: Content): void {
        // Validate if target is part of builder.
        if (!this.mLinkedContent.has(pTarget)) {
            throw new Exception(`Can't add content to builder. Target is not part of builder.`, this);
        }

        // Get anchor of source if it is a builder.
        const lSourceNode: Node = (pSource instanceof BaseBuilder) ? pSource.anchor : pSource;

        // Attach source based on mode.
        switch (pMode) {
            case 'After': {
                this.insertAfter(lSourceNode, pTarget);
                break;
            }
            case 'First': {
                this.insertFirst(lSourceNode, pTarget);
                break;
            }
            case 'Last': {
                this.insertLast(lSourceNode, pTarget);
                break;
            }
        }

        // Link content to this builder.
        this.mLinkedContent.add(pSource);

        // Add to builder or component storage.
        if (pSource instanceof BaseBuilder) {
            this.mChildBuilderList.push(pSource);
        }

        // Read new parent of source node and current builder.
        const lSourceParentNode: Element | ShadowRoot = lSourceNode.parentElement ?? <ShadowRoot>lSourceNode.getRootNode();
        const lBuilderParentNode: Element | ShadowRoot = this.mContentAnchor.parentElement ?? <ShadowRoot>this.mContentAnchor.getRootNode();

        // If parent of source node is the same as parent of builder, it is allways in root.
        if (lSourceParentNode === lBuilderParentNode) {
            // "Calculate" new position index in root child list.
            let lIndexInRootList: number;
            switch (pMode) {
                case 'After': {
                    lIndexInRootList = this.mRootChildList.indexOf(pTarget) + 1;
                    break;
                }
                case 'First': {
                    lIndexInRootList = 0;
                    break;
                }
                case 'Last': {
                    lIndexInRootList = this.mRootChildList.length;
                    break;
                }
            }

            // Extend boundary if child is new last element.
            if (lIndexInRootList === this.mRootChildList.length) {
                this.mContentBoundary.end = pSource;
            }

            // Add root child after previous sibling.
            this.mRootChildList.splice(lIndexInRootList + 1, 0, pSource);
        }
    }

    /**
     * Remove and deconstruct content.
     * Can change the content boundary when the last element of the root content list is deleted.
     * 
     * @param pContent - Content of builder data.
     * 
     * @throws {@link Exception}
     * When {@link pContent} is not a direct content of this builder. Even when pTarget is a content of a nested builder.
     */
    public remove(pContent: Content): void {
        // Validate if child is linked to this builder data.
        if (!this.mLinkedContent.has(pContent)) {
            throw new Exception('Child node cant be deleted from builder when it not a child of them', this);
        }

        // Remove content link.
        this.mLinkedContent.delete(pContent);

        // Different removing strategies for builder and node content.
        if (pContent instanceof BaseBuilder) {
            // Remove from builder or component storage.
            this.mChildBuilderList.remove(pContent);

            // Deconstruct builder.
            pContent.deconstruct();
        } else {
            // Get elements component manager. If it exists deconstruct it.
            const lComponentManager: ComponentManager | undefined = this.mChildComponents.get(pContent);
            if (lComponentManager) {
                // Trigger component deconstruction.
                lComponentManager.deconstruct();

                // Remove content from child components.
                this.mChildComponents.delete(pContent);
            }

            // Remove from parent.
            pContent.remove();
        }

        // Remove child from root list.
        // If was in the list, recalculate boundary.
        if (this.mRootChildList.remove(pContent)) {
            // Update boundary end with last content of root. 
            // When no content exists, the boundary end ist the content anchor.
            this.mContentBoundary.end = this.mRootChildList.at(-1) ?? this.mContentAnchor;
        }
    }

    private insertAfter(pSourceNode: Node, pTarget: Content) {
        // TODO: Get real target node. Get bounds for builder target.
        // Attach after target node.


        // Get real parent element. 
        let lRealParent: Element | ShadowRoot;
        if (pMode === 'Last' || pMode === 'First') {
            lRealParent = <Element>pTarget;
            if (!lRealParent) {
                // Parent is null, because element should be append to builder root.
                // Builder parent is builder anchor parent. If anchor parent is null, builder parent is the component shadow root.
                lRealParent = this.mContentAnchor.parentElement ?? <ShadowRoot>this.mContentAnchor.getRootNode();
            }
        } else { // pMode === 'After'
            // Native elements currently not used. But good to have.
            /* istanbul ignore next */
            lRealParent = (pTarget instanceof BaseBuilder) ? <Element>pTarget.anchor.parentElement : <Element>(<Node>pTarget).parentElement;

            // Parent is null, because direct parent is the component shadow root.
            // When parent element is null "this.mContentAnchor.parentElement" is also null. So this check would be unnessessary. 
            lRealParent = lRealParent ?? <ShadowRoot>this.mContentAnchor.getRootNode();
        }

        // If child gets append to builder root. Is is root if real parent is this builders parent element or component shadow root.
        const lIsRoot: boolean = (lRealParent === this.mContentAnchor.parentElement || lRealParent === this.mContentAnchor.getRootNode());

        // Get node the child gets insert AFTER.
        let lRealTarget: Node | null;
        if (pMode === 'Last') {
            const lParent: Element | null = <Element | null>pTarget;
            // Last element of parent.
            if (lParent) {
                // Parent is element. Get last child of element.
                const lParentChildNodes: NodeListOf<ChildNode> = lParent.childNodes;
                lRealTarget = lParentChildNodes[lParentChildNodes.length - 1];
            } else {
                // "Parent" is this builder. Get last element boundary.
                lRealTarget = this.getBoundary().end;
            }
        } else if (pMode === 'First') {
            // When parent is set, parent is an element, therefore there is no target before the first element.
            /* istanbul ignore if */
            if (pTarget) {
                // Not used but good to have.
                lRealTarget = null;
            } else {
                // "Parent" is this builder. Get first element, that is always this builders anchor.
                lRealTarget = this.getBoundary().start;
            }
        } else { // pMode === "After"
            // Native elements currently not used. But good to have.
            /* istanbul ignore next */
            lRealTarget = (pTarget instanceof BaseBuilder) ? pTarget.boundary.end : pTarget;
        }

        // Get previous sibling content only if added on root.
        let lTargetContent: Content | null = null;
        if (lIsRoot) {
            if (pMode === 'First') {
                // Sibling before first element => null.
                lTargetContent = null;
            } else if (pMode === 'Last') {
                // Last content of builder.
                lTargetContent = this.mRootChildList[this.mRootChildList.length - 1];
            } else { // pMode === "After"
                lTargetContent = pTarget;
            }
        }

        // Insert element.
        if (lRealTarget) {
            // When there is a target. Get next sibling and append element after that sibling.
            // Like: parent.insertAfter(child, target);
            // If nextSibling is null, insertBefore is called as appendChild(child).
            lRealParent.insertBefore(lSourceNode, lRealTarget.nextSibling);
        } else {
            // No target means prepend to parent. Parent is allways an element and never a builder.
            lRealParent.prepend(lSourceNode);
        }
    }

    private insertFirst(pSourceNode: Node, pTarget: Content) {
        // TODO: If target is builder. Get anchor and call insertAfter with anchor as target.
        // TODO: If target is a node, prepend.
    }

    private insertLast(pSourceNode: Node, pTarget: Content) {
        // TODO: If target is builder. Get calculated bound.end and call insertAfter with end node as target
        // TODO: If target is a node, append.
    }

    /**
     * On deconstruction.
     * Called before any builder and element of this builder was deconstructed. 
     */
    protected abstract onDeconstruct(): void;
}

/**
 * Raw content boundary. Can have builder as boundary.
 */
type RawContentBoundary = {
    start: Comment;
    end: Node | BaseBuilder;
};

/**
 * Calculated content boundary.
 * Calculated end node contains any nested builder end node.
 */
export type Boundary = {
    start: Comment;
    end: Node;
};

export type Content = ChildNode | BaseBuilder;

/**
 * Content insert mode.
 */
export type InserMode = 'Last' | 'After' | 'First';