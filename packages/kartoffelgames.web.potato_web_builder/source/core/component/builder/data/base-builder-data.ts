import { Exception } from '@kartoffelgames/core';
import type { Component } from '../../component.ts';
import { BaseBuilder } from '../base-builder.ts';

export abstract class BaseBuilderData {
    private readonly mChildBuilderList: Array<BaseBuilder>;
    private readonly mChildComponents: Map<BuilderContent, Component>;
    private readonly mContentAnchor: Comment;
    private readonly mContentBoundary: BaseBuilderDataBoundaryNodes;
    private readonly mLinkedContent: WeakSet<BuilderContent>;
    private readonly mRootChildList: Array<BuilderContent>;

    /**
     * Get core content of builder content.
     * Elements are returned in DOM order.
     */
    public get body(): Array<BuilderContent> {
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
    public get contentAnchor(): ChildNode {
        return this.mContentAnchor;
    }

    /**
     * Constructor.
     * 
     * @param pAnchorName - Name of generated content anchor.
     */
    public constructor(pAnchorName: string) {
        // Init quick access buffers.
        this.mChildBuilderList = new Array<BaseBuilder>();
        this.mRootChildList = new Array<BuilderContent>();
        this.mChildComponents = new Map<BuilderContent, Component>();
        this.mLinkedContent = new WeakSet<BuilderContent>();

        // Create anchor of content. Anchors marks the beginning of all content nodes.
        this.mContentAnchor = document.createComment(pAnchorName);

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
        for (const lComponent of this.mChildComponents.values()) {
            lComponent.deconstruct();
        }
        this.mChildComponents.clear();

        // Get current builder parent element. Skip deletion when it is not attached to any document.
        // Remove all content. Only remove root elements. GC makes the rest.
        let lRootChild: BuilderContent | undefined;
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
    public getBoundary(): BaseBuilderDataBoundary {
        // Get last element of builder if bottom element is a builder  or use node as bottom element.
        const lBottomNode: Node = (() => {
            if (this.mContentBoundary.end instanceof BaseBuilder) {
                return this.mContentBoundary.end.content.getBoundary().end;
            }

            return this.mContentBoundary.end;
        })();

        return {
            // Top is always the anchor.
            start: this.mContentBoundary.start,
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
    public insert(pSource: BuilderContent, pMode: BaseBuilderDataInserMode, pTarget: BuilderContent): void {
        // Validate if target is part of builder.
        if (!this.mLinkedContent.has(pTarget)) {
            throw new Exception(`Can't add content to builder. Target is not part of builder.`, this);
        }

        // Get anchor of source if it is a builder.
        const lSourceNode: ChildNode = (pSource instanceof BaseBuilder) ? pSource.anchor : pSource;

        // Attach source based on mode.
        switch (pMode) {
            case 'After': {
                this.insertAfter(lSourceNode, pTarget);
                break;
            }
            case 'TopOf': {
                this.insertTop(lSourceNode, pTarget);
                break;
            }
            case 'BottomOf': {
                this.insertBottom(lSourceNode, pTarget);
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

        // If parent of source node is the same as parent of builder, it is in root.
        if (lSourceParentNode === lBuilderParentNode) {
            // "Calculate" new position index in root child list.
            const lIndexInRootList: number = (() => {
                switch (pMode) {
                    case 'After': return this.mRootChildList.indexOf(pTarget) + 1;
                    case 'TopOf': return 0;
                    case 'BottomOf': return this.mRootChildList.length;
                }
            })();

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
    public remove(pContent: BuilderContent): void {
        // Validate if child is linked to this builder data.
        if (!this.mLinkedContent.has(pContent)) {
            throw new Exception('Child node cant be deleted from builder when it not a child of them', this);
        }

        // Remove content link.
        this.mLinkedContent.delete(pContent);

        // Different removing strategies for builder and node content.
        if (pContent instanceof BaseBuilder) {
            // Remove from builder or component storage.
            const lIndex: number = this.mChildBuilderList.indexOf(pContent);
            if (lIndex !== -1) {
                this.mChildBuilderList.splice(lIndex, 1);
            }

            // Deconstruct builder.
            pContent.deconstruct();
        } else {
            // Get elements component manager. If it exists deconstruct it.
            const lComponent: Component | undefined = this.mChildComponents.get(pContent);
            if (lComponent) {
                // Trigger component deconstruction.
                lComponent.deconstruct();

                // Remove content from child components.
                this.mChildComponents.delete(pContent);
            }

            // Remove from parent.
            pContent.remove();
        }

        // Remove child from root list.
        // If was in the list, recalculate boundary.
        const lIndex: number = this.mRootChildList.indexOf(pContent);
        if (lIndex !== -1) {
            this.mRootChildList.splice(lIndex, 1);
            // Update boundary end with last content of root. 
            // When no content exists, the boundary end ist the content anchor.
            this.mContentBoundary.end = this.mRootChildList.at(-1) ?? this.mContentAnchor;
        }
    }

    /**
     * Set core builder of this data.
     * Function is required as the builder is not available when the builder data is constructed.
     * 
     * @param pCoreBuilder - Core builder. Owning this data.
     */
    public setCoreBuilder(pCoreBuilder: BaseBuilder): void {
        this.mLinkedContent.add(pCoreBuilder);
    }

    /**
     * Insert {@link pSourceNode} after {@link pTarget} in DOM.
     * 
     * @param pSourceNode - Source node that should be inserted.
     * @param pTarget - Target content. Anchor point for inserting.
     */
    private insertAfter(pSourceNode: ChildNode, pTarget: BuilderContent): void {
        // Get node of target where source node can be attached after.
        // If target is a builder, get the end bound node of it.
        let lTargetNode: Node = (() => {
            if (pTarget instanceof BaseBuilder) {
                return pTarget.content.getBoundary().end;
            }

            return pTarget;
        })();

        // Get parent of target node.
        const lTargetParentNode: Element | ShadowRoot = lTargetNode.parentElement ?? <ShadowRoot>lTargetNode.getRootNode();

        // Attach after target node.
        // Behaves like: parent.insertAfter(child, target);
        // If nextSibling is null, insertBefore is called as appendChild(child).
        lTargetParentNode.insertBefore(pSourceNode, lTargetNode.nextSibling);
    }

    /**
     * Insert {@link pSourceNode} at bottom inside {@link pTarget} in DOM.
     * 
     * @param pSourceNode - Source node that should be inserted.
     * @param pTarget - Target content. Anchor point for inserting.
     * 
     * @throws {@link Exception}
     * When target node does not support any child nodes.
     */
    private insertBottom(pSourceNode: ChildNode, pTarget: BuilderContent): void {
        // Insert source "after" target when the target is a builder.
        // Builders are not nested so appending after the builder is basicly appending inside the builder.
        if (pTarget instanceof BaseBuilder) {
            this.insertAfter(pSourceNode, pTarget);
            return;
        }

        // Target is a normal element. Append source node. Fails when node can't have child nodes.
        if (pTarget instanceof Element) {
            pTarget.appendChild(pSourceNode);
            return;
        }

        // Fails when node can't have child nodes.
        throw new Exception(`Source node does not support child nodes.`, this);
    }

    /**
     * Insert {@link pSourceNode} at top inside {@link pTarget} in DOM.
     * 
     * @param pSourceNode - Source node that should be inserted.
     * @param pTarget - Target content. Anchor point for inserting.
     * 
     * @throws {@link Exception}
     * When target node does not support any child nodes.
     */
    private insertTop(pSourceNode: ChildNode, pTarget: BuilderContent): void {
        // Get anchor and call insertAfter with anchor as target when target is a builder.
        if (pTarget instanceof BaseBuilder) {
            this.insertAfter(pSourceNode, pTarget.anchor);
            return;
        }

        // Target is a normal element. Prepend source node.
        if (pTarget instanceof Element) {
            pTarget.prepend(pSourceNode);
            return;
        }

        // Fails when node can't have child nodes.
        throw new Exception(`Source node does not support child nodes.`, this);
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
type BaseBuilderDataBoundaryNodes = {
    start: Comment;
    end: Node | BaseBuilder;
};

/**
 * Content insert mode.
 */
type BaseBuilderDataInserMode = 'BottomOf' | 'After' | 'TopOf';

/**
 * Calculated content boundary.
 * Calculated end node contains any nested builder end node.
 */
export type BaseBuilderDataBoundary = {
    start: Comment;
    end: Node;
};

export type BuilderContent = ChildNode | BaseBuilder;
