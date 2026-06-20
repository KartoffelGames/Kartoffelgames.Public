import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';

/**
 * Ui manager grid component.
 * Owns grid sizing and rendered port component lookup for the graph UI.
 */
export class PotatnoUiManagerGrid {
    private static readonly GRID_SIZE: number = 25;

    private readonly mElementPorts: WeakMap<Element, PotatnoDocumentPort<PotatnoProjectTypesDefinition>>;
    private readonly mInteraction: PotatnoCanvasInteraction;
    private readonly mPortElements: WeakMap<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, Element>;

    /**
     * Currently dragged port.
     */
    public draggedPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;

    /**
     * Grid size in pixels.
     */
    public get gridSize(): number {
        return PotatnoUiManagerGrid.GRID_SIZE;
    }

    /**
     * Shared canvas pan and zoom interaction state.
     */
    public get interaction(): PotatnoCanvasInteraction {
        return this.mInteraction;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mElementPorts = new WeakMap<Element, PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        this.mInteraction = new PotatnoCanvasInteraction(PotatnoUiManagerGrid.GRID_SIZE);
        this.mPortElements = new WeakMap<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, Element>();
        this.draggedPort = null;
    }

    /**
     * Create an orthogonal grid-routed SVG path between two points.
     *
     * @param pStart - Start point.
     * @param pEnd - End point.
     * @param pSourcePort - Source port of the connection.
     *
     * @returns SVG path data.
     */
    public createConnectionPath(pStart: Point, pEnd: Point, pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null): string {
        const lGridSize: number = this.gridSize;
        const lDirection: number = pEnd.x >= pStart.x ? 1 : -1;
        const lStartRoute: Point = {
            x: this.snapToGridCenter(pStart.x + lDirection * lGridSize),
            y: this.snapToGridCenter(pStart.y)
        };
        const lEndRoute: Point = {
            x: this.snapToGridCenter(pEnd.x - lDirection * lGridSize),
            y: this.snapToGridCenter(pEnd.y)
        };
        const lMinRouteX: number = Math.min(lStartRoute.x, lEndRoute.x);
        const lMaxRouteX: number = Math.max(lStartRoute.x, lEndRoute.x);
        const lBaseMidX: number = this.snapToGridCenter(lStartRoute.x + (lEndRoute.x - lStartRoute.x) / 2);
        const lLaneOffset: number = this.getSourceConnectionLaneOffset(pSourcePort) * lDirection;
        const lMidX: number = Math.max(lMinRouteX, Math.min(lMaxRouteX, this.snapToGridCenter(lBaseMidX + lLaneOffset)));

        return this.generateRoundedPath([
            pStart,
            lStartRoute,
            { x: lMidX, y: lStartRoute.y },
            { x: lMidX, y: lEndRoute.y },
            lEndRoute,
            pEnd
        ]);
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
     * Snap a coordinate to the center lane of a grid cell.
     *
     * @param pValue - Coordinate value.
     *
     * @returns Snapped value.
     */
    public snapToGridCenter(pValue: number): number {
        return Math.round((pValue - this.gridSize / 2) / this.gridSize) * this.gridSize + this.gridSize / 2;
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

    /**
     * Calculate the horizontal lane offset for a source port.
     *
     * @param pSourcePort - Source port of the connection.
     *
     * @returns Lane offset in pixels.
     */
    private getSourceConnectionLaneOffset(pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null): number {
        if (!pSourcePort || pSourcePort.direction !== 'output') {
            return 0;
        }

        const lOutputPorts: ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = pSourcePort.node.outputs.list;
        const lPortIndex: number = lOutputPorts.indexOf(pSourcePort);
        if (lPortIndex === -1) {
            return 0;
        }

        return (lOutputPorts.length - lPortIndex - 1) * this.gridSize;
    }

    /**
     * Generate a rounded path through a set of orthogonal route points.
     *
     * @param pPoints - Route points.
     *
     * @returns SVG path data.
     */
    private generateRoundedPath(pPoints: Array<Point>): string {
        const lRadius: number = Math.min(8, this.gridSize / 3);
        const lPoints: Array<Point> = [];

        for (const lPoint of pPoints) {
            const lPreviousPoint: Point | undefined = lPoints[lPoints.length - 1];
            if (!lPreviousPoint || lPreviousPoint.x !== lPoint.x || lPreviousPoint.y !== lPoint.y) {
                lPoints.push(lPoint);
            }
        }

        if (lPoints.length < 2) {
            return '';
        }

        let lPath: string = `M ${lPoints[0].x} ${lPoints[0].y}`;
        for (let lIndex: number = 1; lIndex < lPoints.length - 1; lIndex++) {
            const lPreviousPoint: Point = lPoints[lIndex - 1];
            const lCurrentPoint: Point = lPoints[lIndex];
            const lNextPoint: Point = lPoints[lIndex + 1];
            const lPreviousDistance: number = Math.hypot(lCurrentPoint.x - lPreviousPoint.x, lCurrentPoint.y - lPreviousPoint.y);
            const lNextDistance: number = Math.hypot(lNextPoint.x - lCurrentPoint.x, lNextPoint.y - lCurrentPoint.y);
            const lCornerRadius: number = Math.min(lRadius, lPreviousDistance / 2, lNextDistance / 2);

            if (lCornerRadius <= 0) {
                lPath += ` L ${lCurrentPoint.x} ${lCurrentPoint.y}`;
                continue;
            }

            const lBeforeCorner: Point = this.moveTowards(lCurrentPoint, lPreviousPoint, lCornerRadius);
            const lAfterCorner: Point = this.moveTowards(lCurrentPoint, lNextPoint, lCornerRadius);
            lPath += ` L ${lBeforeCorner.x} ${lBeforeCorner.y} Q ${lCurrentPoint.x} ${lCurrentPoint.y} ${lAfterCorner.x} ${lAfterCorner.y}`;
        }

        const lLastPoint: Point = lPoints[lPoints.length - 1];
        return `${lPath} L ${lLastPoint.x} ${lLastPoint.y}`;
    }

    /**
     * Move from one point toward another by a distance.
     *
     * @param pPoint - Origin point.
     * @param pTarget - Target point.
     * @param pDistance - Distance to move.
     *
     * @returns Moved point.
     */
    private moveTowards(pPoint: Point, pTarget: Point, pDistance: number): Point {
        const lDistance: number = Math.hypot(pTarget.x - pPoint.x, pTarget.y - pPoint.y);
        if (lDistance === 0) {
            return pPoint;
        }

        return {
            x: pPoint.x + (pTarget.x - pPoint.x) / lDistance * pDistance,
            y: pPoint.y + (pTarget.y - pPoint.y) / lDistance * pDistance
        };
    }

}

type Point = {
    x: number;
    y: number;
};
