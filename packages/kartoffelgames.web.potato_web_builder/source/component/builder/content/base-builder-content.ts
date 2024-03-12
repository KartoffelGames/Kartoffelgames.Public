import { List } from '@kartoffelgames/core.data';
import { ComponentConnection } from '../../component-connection';
import { ComponentManager } from '../../component-manager';
import { ComponentModules } from '../../component-modules';
import { ElementCreator } from '../../element-creator';
import { BaseBuilder } from '../base-builder';

export abstract class BaseBuilderContent {
    private readonly mChildBuilderList: List<BaseBuilder>;
    private readonly mContentAnchor: Comment;
    private readonly mContentBoundary: RawContentBoundary;
    private readonly mModules: ComponentModules;
    private readonly mRootChildList: List<Content>;

    /**
     * Get content anchor.
     * All content of this content manager gets append after this anchor.
     */
    public get anchor(): Comment {
        return this.mContentAnchor;
    }

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
        this.mChildBuilderList = new List<BaseBuilder>();
        this.mRootChildList = new List<Content>();

        // Create anchor of content. Anchors marks the beginning of all content nodes.
        this.mContentAnchor = ElementCreator.createComment(Math.random().toString(16).substring(3).toUpperCase()); // TODO: A good way to have better anchor names.

        // Set starting boundary. Existing only of anchor.
        this.mContentBoundary = {
            start: this.mContentAnchor,
            end: this.mContentAnchor
        };
    }

    /**
     * Append child element after target. // TODO: Do we need this?
     * @param pChild - Child node.
     * @param pTarget - Target where child gets append after. 
     */
    public after(pChild: Content, pTarget: Content): void {
        this.insertContent(pChild, pTarget, 'After');
    }

    /**
     * Append child element to parent.  // TODO: Do we need this?
     * Appends to root if no parent is specified. 
     * @param pChild - Child node.
     * @param pParentElement - Parent element of child.
     */
    public append(pChild: Content, pParentElement: Element | null): void {
        this.insertContent(pChild, pParentElement, 'Append');
    }

    public deconstruct(): void {
        // Deconstruct builder.
        for (const lBuilder of this.mChildBuilderList) {
            lBuilder.deconstruct();
        }

        // Deconstruct components.
        for (const lComponent of this.mChildComponentList) {
            // Child component has always an component manager.
            const lComponentManager: ComponentManager = <ComponentManager>ComponentConnection.componentManagerOf(lComponent);
            lComponentManager.deconstruct();
        }

        // Remove all content. Only remove root elements. GC makes the rest.
        this.anchor.remove();
        for (const lRootChild of this.mRootChildList) {
            // Only remove elements. Builder are already deconstructed.
            if (!(lRootChild instanceof BaseBuilder)) {
                this.remove(lRootChild);
            }
        }

        this.onDeconstruct();
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
     * Prepend child element to parent.  // TODO: Do we need this?
     * Prepends to root if no parent is specified. 
     * @param pChild - Child node.
     */
    public prepend(pChild: Content): void {
        this.insertContent(pChild, null, 'Prepend');
    }

    /**
     * Remove and deconstruct content. // TODO: We can do better.
     * @param pChild - Child element of layer.
     */
    public remove(pChild: Content): void {
        if (pChild instanceof BaseBuilder) {
            // Remove from builder or component storage.
            this.mChildBuilderList.remove(pChild);

            pChild.deconstruct();
        } else {
            // Check if element is a component. If so deconstruct.
            const lComponentManager: ComponentManager | undefined = ComponentConnection.componentManagerOf(pChild);
            lComponentManager?.deconstruct();

            // Remove from parent.
            if (pChild.parentElement) {
                pChild.parentElement.removeChild(pChild);
            } else {
                pChild.getRootNode().removeChild(pChild);
            }
        }

        // Remove from storages.
        this.unregisterContent(pChild);
    }

    /**  // TODO: Please remake this. It is a abominationof code.
     * Add element to content.
     * @param pChild - The element that should be added.
     * @param pTarget - Parent element or target node.
     * @param pMode - Add mode for child.
     */
    private insertContent(pChild: Content, pTarget: Content, pMode: 'After'): void;
    private insertContent(pChild: Content, pParent: Element | null, pMode: 'Append' | 'Prepend'): void;
    private insertContent(pChild: Content, pTarget: Content | null, pMode: 'Append' | 'After' | 'Prepend'): void {
        // Add to builder or component storage.
        if (pChild instanceof BaseBuilder) {
            this.mChildBuilderList.push(pChild);
        }

        // Get anchor of child if child is a builder.
        const lRealChildNode: Node = (pChild instanceof BaseBuilder) ? pChild.anchor : pChild;

        // Get real parent element. 
        let lRealParent: Element | ShadowRoot;
        if (pMode === 'Append' || pMode === 'Prepend') {
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
        if (pMode === 'Append') {
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
        } else if (pMode === 'Prepend') {
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
            if (pMode === 'Prepend') {
                // Sibling before first element => null.
                lTargetContent = null;
            } else if (pMode === 'Append') {
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
            lRealParent.insertBefore(lRealChildNode, lRealTarget.nextSibling);
        } else {
            // No target means prepend to parent. Parent is allways an element and never a builder.
            lRealParent.prepend(lRealChildNode);
        }

        // Register content.
        if (lIsRoot) {
            if (lTargetContent !== null) {
                this.registerContent(pChild, lTargetContent);
            } else {
                this.registerContent(pChild);
            }
        }
    }

    /**
     * Saves element into child storage or root storage.
     * Extends boundary.
     * @param pChild - Child element.
     * @param pRoot - If child is an root element.
     */
    private registerContent(pChild: Content, pPreviousSibling?: Content): void {
        // Set index to -1 of no previous sibling exists.
        const lSiblingIndex: number = (pPreviousSibling) ? this.mRootChildList.indexOf(pPreviousSibling) : -1;

        // Extend boundary if child is new last element.
        if ((lSiblingIndex + 1) === this.mRootChildList.length) {
            this.mContentBoundary.end = pChild;
        }

        // Add root child after previous sibling.
        this.mRootChildList.splice(lSiblingIndex + 1, 0, pChild);
    }

    /**
     * Removes child from all storages and shrink boundary.
     * @param pChild - Child element.
     */
    private unregisterContent(pChild: Content) {
        // Remove from root childs and shrink boundary.
        const lChildRootIndex: number = this.mRootChildList.indexOf(pChild);

        // Check for boundary shrink.
        if ((lChildRootIndex + 1) === this.mRootChildList.length) {
            // Check if one root child remains otherwise use anchor as end boundary.
            if (this.mRootChildList.length > 1) {
                this.mContentBoundary.end = this.mRootChildList[lChildRootIndex - 1];
            } else {
                this.mContentBoundary.end = this.mContentAnchor;
            }
        }

        this.mRootChildList.remove(pChild);
    }

    /**
     * On deconstruction.
     * Called after any builder and element of this builder was deconstructed. 
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

export type Content = Node | BaseBuilder;