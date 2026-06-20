import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ComponentState, PwbChild, PwbComponent, PwbExport, type IComponentOnConnect, type IComponentOnDeconstruct, type IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import connectionLayerCss from './potatno-connection-layer.css' with { type: 'text' };
import connectionLayerTemplate from './potatno-connection-layer.html' with { type: 'text' };

const gHitAreaStrokeWidth: number = 12;
const gSvgNamespace: string = 'http://www.w3.org/2000/svg';
const gTempConnectionAttribute: string = 'data-temp-connection';

/**
 * SVG connection layer for the node graph.
 *
 * Owns persistent and transient wire rendering. The layer resolves port anchors through the shared
 * {@link PotatnoUiManager} grid component and routes wires on the graph grid instead of drawing
 * free-form curves.
 */
@PwbComponent({
    selector: 'potatno-connection-layer',
    template: connectionLayerTemplate,
    style: connectionLayerCss,
})
export class PotatnoConnectionLayer implements IComponentOnConnect, IComponentOnDeconstruct, IComponentOnUpdate {
    private readonly mConnectionRegistry: Map<string, PotatnoConnectionLayerRecord>;
    private readonly mManager: PotatnoUiManager;
    private mPendingRenderFrame: number;
    private mUnsubscribe: (() => void) | null;

    /**
     * The graph's interaction state, read for the current zoom when converting screen anchor
     * positions to graph world coordinates.
     */
    @PwbExport
    @ComponentState.state()
    public accessor interaction: PotatnoCanvasInteraction | null = null;

    /**
     * Temporary connection path rendered while a wire is dragged.
     */
    @PwbExport
    @ComponentState.state({ complexValue: true })
    public accessor tempConnection: PotatnoConnectionLayerTempConnection | null = null;

    /**
     * SVG element that hosts the connection paths.
     */
    @PwbChild('svgLayer')
    public accessor svgLayer!: SVGSVGElement;

    /**
     * Create the connection layer.
     *
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mConnectionRegistry = new Map<string, PotatnoConnectionLayerRecord>();
        this.mManager = pManager;
        this.mPendingRenderFrame = 0;
        this.mUnsubscribe = null;
    }

    /**
     * Subscribe to the manager events that change the rendered connection set and draw once.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.subscribe(
            PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.NodeTransform | PotatnoCodeUiManagerChangeType.Connection,
            null,
            () => {
                this.scheduleRender();
            });

        this.scheduleRender();
    }

    /**
     * Detach the manager subscription and cancel any pending render frame.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe?.();
        this.mUnsubscribe = null;

        if (this.mPendingRenderFrame !== 0) {
            cancelAnimationFrame(this.mPendingRenderFrame);
            this.mPendingRenderFrame = 0;
        }
    }

    /**
     * Redraw the transient connection when the graph updates it.
     */
    public onUpdate(): void {
        this.renderTempConnection();
    }

    /**
     * Delete the connection under a right-click on its hit path.
     *
     * @param pEvent - Context menu event from the SVG layer.
     */
    public onContextMenu(pEvent: MouseEvent): void {
        if (!(pEvent.target instanceof Element)) {
            return;
        }

        const lConnectionId: string | null = pEvent.target.getAttribute('data-connection-id');
        if (!lConnectionId) {
            return;
        }

        pEvent.preventDefault();
        pEvent.stopPropagation();
        this.deleteConnectionById(lConnectionId);
    }

    /**
     * Clear connection paths from the SVG layer.
     *
     * @param pSvg - SVG layer to clear.
     * @param pIncludeTemporary - Whether the temporary path should be removed too.
     */
    private clearPaths(pSvg: SVGSVGElement, pIncludeTemporary: boolean): void {
        const lSelector: string = pIncludeTemporary ? 'path' : `path:not([${gTempConnectionAttribute}])`;
        const lPaths: NodeListOf<Element> = pSvg.querySelectorAll(lSelector);
        for (const lPath of lPaths) {
            lPath.remove();
        }
    }

    /**
     * Delete a connection by its rendered connection id.
     *
     * @param pConnectionId - Rendered connection id from the SVG hit path.
     */
    private deleteConnectionById(pConnectionId: string): void {
        const lConnection: PotatnoConnectionLayerRecord | undefined = this.mConnectionRegistry.get(pConnectionId);
        if (!lConnection) {
            return;
        }

        const lSource: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = lConnection.sourcePort.node.outputs.map.get(lConnection.sourcePort.definitionId) ?? lConnection.sourcePort;
        const lTarget: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = lConnection.targetPort.node.inputs.map.get(lConnection.targetPort.definitionId) ?? lConnection.targetPort;
        this.mManager.graph.disconnectPorts(lSource, lTarget);
    }

    /**
     * Generate an orthogonal grid-routed path between two points.
     *
     * @param pStart - Start point.
     * @param pEnd - End point.
     *
     * @returns SVG path data.
     */
    private generateGridPath(pStart: Point, pEnd: Point, pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null): string {
        const lGridSize: number = this.mManager.grid.gridSize;
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

        return (lOutputPorts.length - lPortIndex - 1) * this.mManager.grid.gridSize;
    }

    /**
     * Generate a rounded path through a set of orthogonal route points.
     *
     * @param pPoints - Route points.
     *
     * @returns SVG path data.
     */
    private generateRoundedPath(pPoints: Array<Point>): string {
        const lGridSize: number = this.mManager.grid.gridSize;
        const lRadius: number = Math.min(8, lGridSize / 3);
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
     * Resolve the visual anchor element inside a registered port component.
     *
     * @param pPortElement - Registered port component element.
     *
     * @returns The visible port handle element, or the component element when the handle is unavailable.
     */
    private getPortAnchorElement(pPortElement: Element): Element {
        if (pPortElement instanceof HTMLElement) {
            const lPortHandleElement: Element | null = pPortElement.shadowRoot?.querySelector('.port-handle') ?? null;
            if (lPortHandleElement) {
                return lPortHandleElement;
            }
        }

        return pPortElement;
    }

    /**
     * Calculate the rendered port anchor position in graph world coordinates.
     *
     * @param pPort - Port whose anchor should be located.
     *
     * @returns World position for the port.
     */
    private getPortPosition(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): Point {
        const lZoom: number = this.interaction?.zoom ?? 1;
        const lGridSize: number = this.mManager.grid.gridSize;
        const lPortElement: Element | undefined = this.mManager.grid.getPortElement(pPort);
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();

        if (lPortElement && lSvg) {
            const lAnchorElement: Element = this.getPortAnchorElement(lPortElement);
            const lSvgRect: DOMRect = lSvg.getBoundingClientRect();
            const lAnchorRect: DOMRect = lAnchorElement.getBoundingClientRect();
            return {
                x: this.snapToGridCenter((lAnchorRect.left + lAnchorRect.width / 2 - lSvgRect.left) / lZoom),
                y: this.snapToGridCenter((lAnchorRect.top + lAnchorRect.height / 2 - lSvgRect.top) / lZoom)
            };
        }

        const lNode = pPort.node;
        const lNodeX: number = lNode.transformation.x * lGridSize;
        const lNodeY: number = lNode.transformation.y * lGridSize;
        const lNodeW: number = lNode.transformation.width * lGridSize;
        const lPortList: ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = pPort.direction === 'output' ? lNode.outputs.list : lNode.inputs.list;
        let lIndex: number = 0;

        for (const lCandidatePort of lPortList) {
            if (lCandidatePort === pPort) {
                break;
            }
            lIndex++;
        }

        return {
            x: pPort.direction === 'output' ? lNodeX + lNodeW - lGridSize / 2 : lNodeX + lGridSize / 2,
            y: lNodeY + lGridSize + (lIndex + 0.5) * lGridSize
        };
    }

    /**
     * Find the SVG layer if it is already connected.
     *
     * @returns SVG layer or null before render.
     */
    private getSvgLayerOrNull(): SVGSVGElement | null {
        try {
            return this.svgLayer;
        } catch {
            return null;
        }
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

    /**
     * Render the current graph connections into the SVG layer.
     */
    private renderConnections(): void {
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (!lSvg) {
            return;
        }

        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            this.clearPaths(lSvg, true);
            this.mConnectionRegistry.clear();
            return;
        }

        this.clearPaths(lSvg, false);
        this.mConnectionRegistry.clear();

        const lErrorItems: ReadonlySet<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>> = this.mManager.integrity.errorItems;
        let lConnectionIndex: number = 0;
        for (const lNode of lActiveFunction.nodes) {
            for (const lOutputPort of lNode.outputs.list) {
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    const lId: string = `c${lConnectionIndex++}`;
                    const lSourcePosition: Point = this.getPortPosition(lOutputPort);
                    const lTargetPosition: Point = this.getPortPosition(lConnectedPort);
                    const lHasError: boolean = lErrorItems.has(lOutputPort) || lErrorItems.has(lConnectedPort);

                    this.mConnectionRegistry.set(lId, {
                        sourcePort: lOutputPort,
                        targetPort: lConnectedPort
                    });

                    this.renderConnectionPath(lSvg, lId, lOutputPort, lSourcePosition, lTargetPosition, !lHasError);
                }
            }
        }

        this.renderTempConnection();
    }

    /**
     * Render a persistent connection path and its hit area.
     *
     * @param pSvg - SVG layer to render into.
     * @param pId - Connection id.
     * @param pStart - Start anchor.
     * @param pEnd - End anchor.
     * @param pValid - Whether the connection is valid.
     */
    private renderConnectionPath(pSvg: SVGSVGElement, pId: string, pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pStart: Point, pEnd: Point, pValid: boolean): void {
        const lPathData: string = this.generateGridPath(pStart, pEnd, pSourcePort);

        const lHitPath: SVGPathElement = document.createElementNS(gSvgNamespace, 'path') as SVGPathElement;
        lHitPath.setAttribute('d', lPathData);
        lHitPath.setAttribute('data-connection-id', pId);
        lHitPath.setAttribute('data-hit-area', 'true');
        lHitPath.setAttribute('fill', 'none');
        lHitPath.style.cursor = 'pointer';
        lHitPath.style.pointerEvents = 'stroke';
        lHitPath.style.stroke = 'transparent';
        lHitPath.style.strokeLinecap = 'round';
        lHitPath.style.strokeLinejoin = 'round';
        lHitPath.style.strokeWidth = `${gHitAreaStrokeWidth}`;
        pSvg.appendChild(lHitPath);

        const lPath: SVGPathElement = document.createElementNS(gSvgNamespace, 'path') as SVGPathElement;
        lPath.setAttribute('d', lPathData);
        lPath.setAttribute('data-connection-id', pId);
        lPath.setAttribute('fill', 'none');
        lPath.style.pointerEvents = 'none';
        lPath.style.stroke = pValid ? '#a6adc8' : '#f38ba8';
        lPath.style.strokeLinecap = 'round';
        lPath.style.strokeLinejoin = 'round';
        lPath.style.strokeWidth = '2';

        if (!pValid) {
            lPath.setAttribute('stroke-dasharray', '6 3');
        }

        pSvg.appendChild(lPath);
    }

    /**
     * Render or clear the temporary drag connection path.
     */
    private renderTempConnection(): void {
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (!lSvg) {
            return;
        }

        const lExisting: Element | null = lSvg.querySelector(`[${gTempConnectionAttribute}]`);
        if (lExisting) {
            lExisting.remove();
        }

        const lConnection: PotatnoConnectionLayerTempConnection | null = this.tempConnection;
        if (!lConnection) {
            return;
        }

        const lPath: SVGPathElement = document.createElementNS(gSvgNamespace, 'path') as SVGPathElement;
        lPath.setAttribute('d', this.generateGridPath(lConnection.start, lConnection.end, null));
        lPath.setAttribute('fill', 'none');
        lPath.setAttribute(gTempConnectionAttribute, 'true');
        lPath.style.opacity = '0.6';
        lPath.style.pointerEvents = 'none';
        lPath.style.stroke = '#bac2de';
        lPath.style.strokeDasharray = '8 4';
        lPath.style.strokeLinecap = 'round';
        lPath.style.strokeLinejoin = 'round';
        lPath.style.strokeWidth = '2';
        lSvg.appendChild(lPath);
    }

    /**
     * Schedule a connection render for the next animation frame.
     */
    private scheduleRender(): void {
        if (this.mPendingRenderFrame !== 0) {
            return;
        }

        this.mPendingRenderFrame = requestAnimationFrame(() => {
            this.mPendingRenderFrame = 0;
            this.renderConnections();
        });
    }

    /**
     * Snap a coordinate to the center lane of a grid cell.
     *
     * @param pValue - Coordinate value.
     *
     * @returns Snapped value.
     */
    private snapToGridCenter(pValue: number): number {
        const lGridSize: number = this.mManager.grid.gridSize;
        return Math.round((pValue - lGridSize / 2) / lGridSize) * lGridSize + lGridSize / 2;
    }
}

export type PotatnoConnectionLayerTempConnection = {
    end: Point;
    start: Point;
};

type PotatnoConnectionLayerRecord = {
    sourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
    targetPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
};

type Point = {
    x: number;
    y: number;
};
