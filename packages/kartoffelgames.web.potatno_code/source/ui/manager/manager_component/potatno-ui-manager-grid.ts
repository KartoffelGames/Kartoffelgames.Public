import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPortDefinitionDirection } from '../../../project/potatno-port-definition.ts';
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
        this.draggedPort = null;
    }

    /**
     * Create an orthogonal grid-routed SVG path between two grid cells.
     *
     * @param pStart - Start grid cell.
     * @param pEnd - End grid cell.
     * @param pSourcePort - Source port of the connection.
     *
     * @returns SVG path data.
     */
    public createConnectionPath(pStart: PotatnoUiManagerGridPoint, pEnd: PotatnoUiManagerGridPoint, pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): string {
        const lDirection: number = pSourcePort.direction === 'output' ? 1 : -1;
        const lStartRoute: PotatnoUiManagerGridPoint = {
            x: pStart.x + lDirection,
            y: pStart.y
        };
        const lEndRoute: PotatnoUiManagerGridPoint = {
            x: pEnd.x - lDirection,
            y: pEnd.y
        };
        const lMinRouteX: number = Math.min(lStartRoute.x, lEndRoute.x);
        const lMaxRouteX: number = Math.max(lStartRoute.x, lEndRoute.x);
        const lBaseMidX: number = Math.round(lStartRoute.x + (lEndRoute.x - lStartRoute.x) / 2);
        const lLaneOffset: number = this.getSourceConnectionLaneOffset(pSourcePort) * lDirection;
        const lMidX: number = Math.max(lMinRouteX, Math.min(lMaxRouteX, lBaseMidX + lLaneOffset));
        const lEndDirection: PotatnoPortDefinitionDirection = this.getOppositePortDirection(pSourcePort.direction);

        return this.generateRoundedPath([
            this.getGridPointSide(pStart, pSourcePort.direction),
            this.getGridPointCenter(lStartRoute),
            this.getGridPointCenter({ x: lMidX, y: lStartRoute.y }),
            this.getGridPointCenter({ x: lMidX, y: lEndRoute.y }),
            this.getGridPointCenter(lEndRoute),
            this.getGridPointSide(pEnd, lEndDirection)
        ]);
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
     * Calculate the port anchor grid cell.
     *
     * @param pPort - Port whose anchor should be located.
     *
     * @returns Grid cell for the port.
     */
    public getPortGridPoint(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): PotatnoUiManagerGridPoint {
        const lNode = pPort.node;
        const lPortList: ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = pPort.direction === 'output' ? lNode.outputs.list : lNode.inputs.list;
        let lIndex: number = 0;

        for (const lCandidatePort of lPortList) {
            if (lCandidatePort === pPort) {
                break;
            }
            lIndex++;
        }

        return {
            x: pPort.direction === 'output' ? lNode.transformation.x + lNode.transformation.width - 1 : lNode.transformation.x,
            y: lNode.transformation.y + 1 + lIndex
        };
    }

    /**
     * Convert pixel coordinates to grid space.
     *
     * @param pX - Pixel x coordinate.
     * @param pY - Pixel y coordinate.
     *
     * @returns Grid point.
     */
    public pixelToGridSpace(pX: number, pY: number): PotatnoUiManagerGridPoint {
        return {
            x: Math.floor(pX / this.gridSize),
            y: Math.floor(pY / this.gridSize)
        };
    }

    /**
     * Register a rendered port component element.
     *
     * @param pPort - Port represented by the element.
     * @param pElement - Rendered port component element.
     */
    public registerPortElement(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pElement: Element): void {
        this.mElementPorts.set(pElement, pPort);
    }

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

    private getSourceConnectionLaneOffset(pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): number {
        if (pSourcePort.direction !== 'output') {
            return 0;
        }

        const lOutputPorts: ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = pSourcePort.node.outputs.list;
        const lPortIndex: number = lOutputPorts.indexOf(pSourcePort);
        if (lPortIndex === -1) {
            return 0;
        }

        return lOutputPorts.length - lPortIndex - 1;
    }

    private getGridPointCenter(pPoint: PotatnoUiManagerGridPoint): Point {
        return {
            x: pPoint.x * this.gridSize + this.gridSize / 2,
            y: pPoint.y * this.gridSize + this.gridSize / 2
        };
    }

    private getGridPointSide(pPoint: PotatnoUiManagerGridPoint, pDirection: PotatnoPortDefinitionDirection): Point {
        return {
            x: (pPoint.x + (pDirection === 'output' ? 1 : 0)) * this.gridSize,
            y: pPoint.y * this.gridSize + this.gridSize / 2
        };
    }

    private getOppositePortDirection(pDirection: PotatnoPortDefinitionDirection): PotatnoPortDefinitionDirection {
        return pDirection === 'output' ? 'input' : 'output';
    }

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

export type PotatnoUiManagerGridPoint = {
    x: number;
    y: number;
};

type Point = {
    x: number;
    y: number;
};
