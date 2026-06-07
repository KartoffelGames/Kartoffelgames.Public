import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ComponentState, PwbChild, PwbComponent, PwbExport, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoUiManager, PotatnoCodeUiManagerChangeType } from '../../manager/potatno-ui-manager.ts';
import { PotatnoCanvasRenderer, type ConnectionRenderData } from '../../potatno-canvas-renderer.ts';
import type { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoPortRegistry } from '../../potatno-port-registry.ts';
import type { PotatnoUiProject } from '../../potatno-ui-project.ts';
import connectionLayerCss from './potatno-connection-layer.css' with { type: 'text' };
import connectionLayerTemplate from './potatno-connection-layer.html' with { type: 'text' };

/**
 * SVG connection layer for the node graph.
 *
 * Owns every wire the graph renders — the persistent connection paths between ports and the
 * transient drag wire. It rebuilds the persistent paths from the shared {@link PotatnoUiManager}'s
 * active function whenever a connection/node event fires, and resolves each port's on-screen anchor
 * through the shared {@link PotatnoPortRegistry}. The layer sits inside the graph's transformed
 * `grid-layer`, so pan/zoom is handled by the parent CSS transform and never needs a redraw — only
 * node geometry changes (a live drag, raised by the manager's `NodeTransform` event) and structural
 * changes do. Right-clicking a wire deletes it through the manager. The host graph pushes the live
 * transform in via {@link interaction}; the transient drag wire is drawn by the graph itself.
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
    private readonly mPortRegistry: PotatnoPortRegistry;
    private readonly mRenderer: PotatnoCanvasRenderer;
    private mUnsubscribe: (() => void) | null;

    /**
     * The graph's interaction state, read for the current zoom when converting screen anchor
     * positions to graph world coordinates.
     */
    @PwbExport
    @ComponentState.state()
    public accessor interaction: PotatnoCanvasInteraction | null = null;

    /**
     * SVG element that hosts the connection paths.
     */
    @PwbChild('svgLayer')
    public accessor svgLayer!: SVGSVGElement;

    /**
     * Create the connection layer.
     *
     * @param pManager - Injected shared UI manager singleton.
     * @param pPortRegistry - Injected shared port-element registry.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager), pPortRegistry: PotatnoPortRegistry = Injection.use(PotatnoPortRegistry)) {
        this.mConnectionRegistry = new Map<string, PotatnoConnectionLayerRecord>();
        this.mManager = pManager;
        this.mPendingRenderFrame = 0;
        this.mPortRegistry = pPortRegistry;
        this.mRenderer = new PotatnoCanvasRenderer();
        this.mUnsubscribe = null;
    }

    /**
     * Subscribe to the manager events that change the rendered connection set and draw once.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.subscribe(
            PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.ActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.NodeTransform | PotatnoCodeUiManagerChangeType.Connection,
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

        // Stop the event before it reaches the graph canvas, which would otherwise open the
        // add-node popup at the click position.
        pEvent.preventDefault();
        pEvent.stopPropagation();
        this.deleteConnectionById(lConnectionId);
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

        // Re-resolve the live port objects by their node + definition id. The document recreates
        // port objects during validation (`resyncPorts`/`replacePort`), so the objects captured in
        // the registry at render time can be stale, already-disconnected instances — disconnecting
        // those would no-op. Looking the ports back up on their (stable) nodes yields the current
        // instances the model actually has connected.
        const lSource: PotatnoDocumentPort<PotatnoUiProject> = lConnection.sourcePort.node.outputs.map.get(lConnection.sourcePort.definitionId) ?? lConnection.sourcePort;
        const lTarget: PotatnoDocumentPort<PotatnoUiProject> = lConnection.targetPort.node.inputs.map.get(lConnection.targetPort.definitionId) ?? lConnection.targetPort;
        this.mManager.disconnectPorts(lSource, lTarget);
    }

    /**
     * Calculate the rendered port anchor position in graph world coordinates.
     *
     * Uses the registered circle element's screen position relative to the SVG layer (which lives
     * in the transformed grid-layer, so its top-left is the panned world origin) divided by zoom —
     * a conversion that is independent of pan. Falls back to an estimated position from the node
     * layout constants when the port element has not registered yet.
     *
     * @param pPort - Port whose anchor should be located.
     *
     * @returns World position for the port.
     */
    private getPortPosition(pPort: PotatnoDocumentPort<PotatnoUiProject>): Point {
        const lZoom: number = this.interaction?.zoom ?? 1;
        const lGridSize: number = this.interaction?.gridSize ?? 20;
        const lCircleEl: HTMLElement | undefined = this.mPortRegistry.get(pPort);
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();

        if (lCircleEl && lSvg) {
            const lSvgRect: DOMRect = lSvg.getBoundingClientRect();
            const lCircleRect: DOMRect = lCircleEl.getBoundingClientRect();
            return {
                x: (lCircleRect.left + lCircleRect.width / 2 - lSvgRect.left) / lZoom,
                y: (lCircleRect.top + lCircleRect.height / 2 - lSvgRect.top) / lZoom
            };
        }

        // Fallback: estimated position based on layout constants (all ports in body area).
        const lNode = pPort.node;
        const lNodeX: number = lNode.transformation.x * lGridSize;
        const lNodeY: number = lNode.transformation.y * lGridSize;
        const lNodeW: number = lNode.transformation.width * lGridSize;
        const lHeaderH: number = 28;
        const lPortGap: number = 24;
        const lBodyPad: number = 4;

        const lPortList: ReadonlyArray<PotatnoDocumentPort<PotatnoUiProject>> = pPort.direction === 'output' ? lNode.outputs.list : lNode.inputs.list;
        let lIdx: number = 0;
        let lCount: number = 0;

        for (const lCandidatePort of lPortList) {
            if (lCandidatePort === pPort) {
                lIdx = lCount;
                break;
            }
            lCount++;
        }

        return {
            x: pPort.direction === 'output' ? lNodeX + lNodeW : lNodeX,
            y: lNodeY + lHeaderH + lBodyPad + (lIdx + 0.5) * lPortGap
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

        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            this.mRenderer.clearAll(lSvg);
            this.mConnectionRegistry.clear();
            return;
        }

        const lErrorItems: ReadonlySet<IPotatnoDocumentItem<PotatnoUiProject>> = this.mManager.integrity.errorItems;
        const lConnectionData: Array<ConnectionRenderData> = [];
        this.mConnectionRegistry.clear();

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

                    lConnectionData.push({
                        color: 'var(--pn-text-secondary)',
                        id: lId,
                        sourceX: lSourcePosition.x,
                        sourceY: lSourcePosition.y,
                        targetX: lTargetPosition.x,
                        targetY: lTargetPosition.y,
                        valid: !lHasError
                    });
                }
            }
        }

        this.mRenderer.renderConnections(lSvg, lConnectionData);
    }

    /**
     * Schedule a connection render for the next animation frame, coalescing bursts of events into a
     * single redraw and giving the DOM time to apply node position changes first.
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
    sourcePort: PotatnoDocumentPort<PotatnoUiProject>;
    targetPort: PotatnoDocumentPort<PotatnoUiProject>;
};

type Point = {
    x: number;
    y: number;
};
