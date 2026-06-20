import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbChild, PwbComponent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import connectionLayerCss from './potatno-connection-layer.css' with { type: 'text' };
import connectionLayerTemplate from './potatno-connection-layer.html' with { type: 'text' };

const gHitAreaStrokeWidth: number = 12;
const gSvgNamespace: string = 'http://www.w3.org/2000/svg';

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
export class PotatnoConnectionLayer implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mConnectionRegistry: Map<string, PotatnoConnectionLayerRecord>;
    private readonly mManager: PotatnoUiManager;
    private mPendingRenderFrame: number;
    private mUnsubscribe: (() => void) | null;

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
     */
    private clearPaths(pSvg: SVGSVGElement): void {
        const lPaths: NodeListOf<Element> = pSvg.querySelectorAll('path');
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
     * Calculate the rendered port anchor position in graph world coordinates.
     *
     * @param pPort - Port whose anchor should be located.
     *
     * @returns World position for the port.
     */
    private getPortPosition(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): Point {
        const lZoom: number = this.mManager.grid.interaction.zoom;
        const lGridSize: number = this.mManager.grid.gridSize;
        const lPortElement: Element | undefined = this.mManager.grid.getPortElement(pPort);
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();

        if (lPortElement && lSvg) {
            const lSvgRect: DOMRect = lSvg.getBoundingClientRect();
            const lPortRect: DOMRect = lPortElement.getBoundingClientRect();
            const lPortAnchorX: number = pPort.direction === 'output' ? lPortRect.right : lPortRect.left;
            return {
                x: this.mManager.grid.snapToGridCenter((lPortAnchorX - lSvgRect.left) / lZoom),
                y: this.mManager.grid.snapToGridCenter((lPortRect.top + lPortRect.height / 2 - lSvgRect.top) / lZoom)
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
     * Render the current graph connections into the SVG layer.
     */
    private renderConnections(): void {
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (!lSvg) {
            return;
        }

        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            this.clearPaths(lSvg);
            this.mConnectionRegistry.clear();
            return;
        }

        this.clearPaths(lSvg);
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
        const lPathData: string = this.mManager.grid.createConnectionPath(pStart, pEnd, pSourcePort);

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

}

type PotatnoConnectionLayerRecord = {
    sourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
    targetPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
};

type Point = {
    x: number;
    y: number;
};
