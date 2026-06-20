import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';

/**
 * Ui manager grid component.
 * Owns grid sizing and rendered port component lookup for the graph UI.
 */
export class PotatnoUiManagerGrid {
    public static readonly GRID_SIZE: number = 25;

    private readonly mElementPorts: WeakMap<Element, PotatnoDocumentPort<PotatnoProjectTypesDefinition>>;
    private readonly mPortElements: WeakMap<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, Element>;

    /**
     * Grid size in pixels.
     */
    public get gridSize(): number {
        return PotatnoUiManagerGrid.GRID_SIZE;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mElementPorts = new WeakMap<Element, PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        this.mPortElements = new WeakMap<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, Element>();
    }

    /**
     * Resolve the rendered component element for a document port.
     *
     * @param pPort - Port whose element should be returned.
     *
     * @returns The live port component element, or undefined when it is not currently registered.
     */
    public getPortElement(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): Element | undefined {
        return this.mPortElements.get(pPort);
    }

    /**
     * Find the registered port under a viewport position.
     *
     * @param pClientX - Viewport x coordinate.
     * @param pClientY - Viewport y coordinate.
     *
     * @returns The port under the position, or null when none exists.
     */
    public getPortFromPosition(pClientX: number, pClientY: number): PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null {
        // Read element from position.
        const lElement: Element | null = this.getElementFromPosition(pClientX, pClientY);
        if (!lElement) {
            return null;
        }

        // When a element is hit, try to get the component host element from it.
        const lComponentElement: Element = (() => {
            const lRoot: Node = lElement.getRootNode();

            // Root must be a shadow root to exclude window elements.
            if (lRoot instanceof ShadowRoot && lRoot.host instanceof Element) {
                return lRoot.host;
            }

            return lElement;
        })();

        // Try to return the registered components port.
        return this.mElementPorts.get(lComponentElement) ?? null;
    }

    /**
     * Register a rendered port component element.
     *
     * @param pPort - Port represented by the element.
     * @param pElement - Rendered port component element.
     */
    public registerPortElement(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pElement: Element): void {
        this.mElementPorts.set(pElement, pPort);
        this.mPortElements.set(pPort, pElement);
    }

    /**
     * Find the top most element under a viewport position, including elements inside open shadow roots.
     *
     * @param pRoot - Document or shadow root to inspect.
     * @param pClientX - Viewport x coordinate.
     * @param pClientY - Viewport y coordinate.
     *
     * @returns Elements under the position.
     */
    private getElementFromPosition(pClientX: number, pClientY: number): Element | null {
        // Recursive function that finds element from a position nexted in shadow roots.
        const lReadElementInRoot = (pRoot: Document | ShadowRoot, pClientX: number, pClientY: number): Element | null => {
            // Try to read the hit element inside the current root.
            const lElement: Element | null = pRoot.elementFromPoint(pClientX, pClientY);
            if (!lElement) {
                return null;
            }

            // If the element has a shadow root, look into that shadow root.
            if (lElement.shadowRoot) {
                const lShadowRootElement: Element | null = lReadElementInRoot(lElement.shadowRoot, pClientX, pClientY);
                if (lShadowRootElement) {
                    return lShadowRootElement;
                }
            }

            return lElement;
        };

        return lReadElementInRoot(document, pClientX, pClientY);
    }
}