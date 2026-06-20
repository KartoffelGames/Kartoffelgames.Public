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
        const lElement: Element | undefined = this.mPortElements.get(pPort);
        if (!lElement || this.mElementPorts.get(lElement) !== pPort) {
            return undefined;
        }

        return lElement;
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
        for (const lElement of document.elementsFromPoint(pClientX, pClientY)) {
            if (!(lElement instanceof Element)) {
                continue;
            }

            const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = this.mElementPorts.get(lElement);
            if (lPort) {
                return lPort;
            }
        }

        return null;
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
}
