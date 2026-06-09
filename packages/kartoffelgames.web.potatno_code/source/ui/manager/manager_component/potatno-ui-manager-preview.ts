import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoCodeGenerator } from '../../../parser/potatno-code-generator.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../../../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoPreviewDriver, PotatnoPreviewDriverPortTarget } from '../../../preview/potatno-preview-driver.ts';
import type { PotatnoPreviewEntry } from '../../../preview/potatno-preview.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager, type PotatnoUiProject } from '../potatno-ui-manager.ts';

/**
 * Owner of every live preview driver. Each previewable document item — a node with a preview opt-in
 * or a document function shown in the main panel — maps to at most one {@link PotatnoPreviewDriver}.
 * Components request a driver via {@link nodeDriver} / {@link functionDriver}; a weak list of all
 * live drivers is recompiled on a structural change ({@link refresh}) and rendered every frame
 * ({@link execute}).
 */
export class PotatnoUiManagerPreview {
    private readonly mDrivers: WeakMap<IPotatnoDocumentItem<PotatnoUiProject>, PotatnoUiManagerPreviewBinding>;
    private readonly mDriverList: Array<WeakRef<PotatnoPreviewDriver<PotatnoUiProject>>>;
    private readonly mManager: PotatnoUiManager;

    /**
     * Constructor.
     *
     * @param pManager - Parent ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;
        this.mDrivers = new WeakMap<IPotatnoDocumentItem<PotatnoUiProject>, PotatnoUiManagerPreviewBinding>();
        this.mDriverList = new Array<WeakRef<PotatnoPreviewDriver<PotatnoUiProject>>>();

        // A new document instance replaces every item; drop the drivers so components re-request
        // fresh ones against the live graph.
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document, null, () => {
            this.mDriverList.splice(0, this.mDriverList.length);
        });

        // In-place edits keep the same items: recompile live drivers after a debounce.
        let lDebounce: number = 0;
        const lStructuralEvents: number = PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.Node;
        this.mManager.subscribe(lStructuralEvents, null, () => {
            globalThis.clearTimeout(lDebounce);
            lDebounce = globalThis.setTimeout(() => this.refresh(), 1000) as unknown as number;
        });
    }

    /**
     * Tick every live driver once, isolating per-driver failures. Drivers never compile here, so an
     * invalid document keeps its last rendered preview.
     *
     * @returns A promise resolving once every driver finished its render pass.
     */
    public async execute(): Promise<void> {
        await Promise.all(this.liveDrivers().map(async (pDriver) => {
            try {
                await pDriver.execute();
            } catch (pError) {
                // eslint-disable-next-line no-console
                console.error('[PotatnoUiManagerPreview] Driver render failed:', pError);
            }
        }));
    }

    /**
     * Get or create the main-panel driver for a document function under the chosen display. The
     * entry function previews its full output; a user function previews the selected output.
     *
     * @param pFunction - The document function to preview.
     * @param pDisplayId - The chosen display id.
     * @param pOutputId - The chosen output label for user functions; ignored for the entry function.
     *
     * @returns The driver, or `null` when no matching preview is registered.
     */
    public functionDriver(pFunction: PotatnoDocumentFunction<PotatnoUiProject>, pDisplayId: string, pOutputId: string): PotatnoPreviewDriver<PotatnoUiProject> | null {
        const lProject: PotatnoUiProject | null = this.mManager.project;
        const lFunctionDefinition = lProject?.getFunction(pFunction.definitionId);
        if (!lProject?.previews || !lFunctionDefinition) {
            this.release(pFunction);
            return null;
        }

        const lIsUserFunction: boolean = lFunctionDefinition.id !== lProject.entryPoint.id;
        const lTarget: string = lIsUserFunction ? pOutputId : '';

        return this.acquire(pFunction, pDisplayId, lTarget, (): PotatnoPreviewDriver<PotatnoUiProject> | null => {
            const lEntry: PotatnoPreviewEntry<PotatnoUiProject['types']> | undefined = lProject.previews!.availablePreviews(lFunctionDefinition, '').find((pEntry) => pEntry.display.id === pDisplayId);
            if (!lEntry) {
                return null;
            }

            // User function → preview the selected output via the exit node's value-input port; the
            // executor returns the value keyed by label. Entry function → function-level (no target).
            let lPortTarget: PotatnoPreviewDriverPortTarget<PotatnoUiProject> | null = null;
            if (lIsUserFunction) {
                const lExitPort: PotatnoDocumentPort<PotatnoUiProject> | null = pOutputId === '' ? null : this.findFunctionOutputPort(pFunction, pOutputId);
                if (!lExitPort) {
                    return null;
                }

                lPortTarget = { documentPort: lExitPort, valueResolver: (): string => pOutputId };
            }

            return lEntry.createDriver<PotatnoUiProject>({
                portTarget: lPortTarget,
                generatorResultProvider: (): PotatnoCodeGeneratorDocumentResult<PotatnoUiProject> => new PotatnoCodeGenerator<PotatnoUiProject>(lProject).generateFunction(pFunction, true)
            });
        });
    }

    /**
     * Get or create the inline driver for a node's preview opt-in.
     *
     * @param pNode - The node whose inline preview to resolve.
     *
     * @returns The driver, or `null` when the node has no opt-in or no matching display.
     */
    public nodeDriver(pNode: PotatnoDocumentNode<PotatnoUiProject>): PotatnoPreviewDriver<PotatnoUiProject> | null {
        const lBinding = pNode.preview;
        const lPort: PotatnoDocumentPort<PotatnoUiProject> | undefined = lBinding ? pNode.outputs.map.get(lBinding.portId) : undefined;
        if (!lBinding || !lPort || lPort.portType !== 'value') {
            this.release(pNode);
            return null;
        }

        return this.acquire(pNode, lBinding.displayId, lBinding.portId, (): PotatnoPreviewDriver<PotatnoUiProject> | null => {
            const lProject: PotatnoUiProject | null = this.mManager.project;
            const lFunctionDefinition = lProject?.getFunction(pNode.function.definitionId);
            if (!lProject?.previews || !lFunctionDefinition) {
                return null;
            }

            const lEntry: PotatnoPreviewEntry<PotatnoUiProject['types']> | undefined = lProject.previews.availablePreviews(lFunctionDefinition, lPort.resolvedDataType).find((pEntry) => pEntry.display.id === lBinding.displayId);
            if (!lEntry) {
                return null;
            }

            return lEntry.createDriver<PotatnoUiProject>({
                portTarget: { documentPort: lPort, valueResolver: (pResult: PotatnoCodeGeneratorDocumentResult<PotatnoUiProject>): string | null => this.findPortValueId(pResult, lPort) },
                generatorResultProvider: (): PotatnoCodeGeneratorDocumentResult<PotatnoUiProject> => new PotatnoCodeGenerator<PotatnoUiProject>(lProject).generateFunction(pNode.function, true)
            });
        });
    }

    /**
     * Recompile every live driver from the latest graph. Skipped while the document is invalid so
     * drivers keep their last value instead of re-running the failing generator.
     */
    public refresh(): void {
        if (!this.mManager.integrity.isValid) {
            return;
        }

        for (const lDriver of this.liveDrivers()) {
            lDriver.refresh();
        }
    }

    /**
     * Drop the driver bound to a document item, if any.
     *
     * @param pItem - The document item whose driver to release.
     */
    public release(pItem: IPotatnoDocumentItem<PotatnoUiProject>): void {
        const lExisting: PotatnoUiManagerPreviewBinding | undefined = this.mDrivers.get(pItem);
        if (lExisting) {
            this.mDrivers.delete(pItem);
            this.removeFromList(lExisting.driver);
        }
    }

    /**
     * Return the cached driver when the display and target still match, otherwise build a fresh one
     * (superseding the previous), register it and compile it once so it can render immediately.
     *
     * @param pItem - The document item the driver belongs to.
     * @param pDisplayId - The display the driver renders with.
     * @param pTarget - Target identifier (port id, output label, or `''` for function-level).
     * @param pBuild - Factory constructing the driver when a new one is needed.
     *
     * @returns The cached or freshly built driver, or `null` when the factory yielded none.
     */
    private acquire(pItem: IPotatnoDocumentItem<PotatnoUiProject>, pDisplayId: string, pTarget: string, pBuild: () => PotatnoPreviewDriver<PotatnoUiProject> | null): PotatnoPreviewDriver<PotatnoUiProject> | null {
        const lExisting: PotatnoUiManagerPreviewBinding | undefined = this.mDrivers.get(pItem);
        if (lExisting && lExisting.displayId === pDisplayId && lExisting.target === pTarget) {
            return lExisting.driver;
        }

        const lDriver: PotatnoPreviewDriver<PotatnoUiProject> | null = pBuild();
        if (!lDriver) {
            this.release(pItem);
            return null;
        }

        if (lExisting) {
            this.removeFromList(lExisting.driver);
        }
        this.mDrivers.set(pItem, { driver: lDriver, displayId: pDisplayId, target: pTarget });
        this.mDriverList.push(new WeakRef<PotatnoPreviewDriver<PotatnoUiProject>>(lDriver));

        // Compile immediately when the graph is valid so the first frame already renders.
        if (this.mManager.integrity.isValid) {
            lDriver.refresh();
        }

        return lDriver;
    }

    /**
     * Find the exit node's value-input port carrying a function output, by output label.
     *
     * @param pFunction - The function whose exit nodes to search.
     * @param pOutputId - The output port label to match.
     *
     * @returns The matching value input port, or `null`.
     */
    private findFunctionOutputPort(pFunction: PotatnoDocumentFunction<PotatnoUiProject>, pOutputId: string): PotatnoDocumentPort<PotatnoUiProject> | null {
        for (const lExitNode of pFunction.getExitNodes()) {
            const lPort: PotatnoDocumentPort<PotatnoUiProject> | undefined = lExitNode.inputs.map.get(pOutputId);
            if (lPort && lPort.portType === 'value') {
                return lPort;
            }
        }

        return null;
    }

    /**
     * Find the valueId allocated to a port across every graph of a generation result.
     *
     * @param pDocumentResult - The generation result to search.
     * @param pPort - The port whose valueId to find.
     *
     * @returns The valueId, or `null` when the port's value was not emitted.
     */
    private findPortValueId(pDocumentResult: PotatnoCodeGeneratorDocumentResult<PotatnoUiProject>, pPort: PotatnoDocumentPort<PotatnoUiProject>): string | null {
        for (const lFunctionResult of [pDocumentResult.entryPoint, ...pDocumentResult.dependencies]) {
            for (const lGraph of lFunctionResult.graphs) {
                const lValueId: string | undefined = lGraph.ports.get(pPort);
                if (lValueId !== undefined) {
                    return lValueId;
                }
            }
        }

        return null;
    }

    /**
     * The currently live drivers, pruning collected weak references along the way.
     *
     * @returns Every still-referenced driver.
     */
    private liveDrivers(): Array<PotatnoPreviewDriver<PotatnoUiProject>> {
        const lDrivers: Array<PotatnoPreviewDriver<PotatnoUiProject>> = [];
        for (let lIndex: number = this.mDriverList.length - 1; lIndex >= 0; lIndex--) {
            const lDriver: PotatnoPreviewDriver<PotatnoUiProject> | undefined = this.mDriverList[lIndex].deref();
            if (lDriver) {
                lDrivers.push(lDriver);
            } else {
                this.mDriverList.splice(lIndex, 1);
            }
        }

        return lDrivers;
    }

    /**
     * Remove a driver from the weak iteration list.
     *
     * @param pDriver - The driver to remove.
     */
    private removeFromList(pDriver: PotatnoPreviewDriver<PotatnoUiProject>): void {
        const lIndex: number = this.mDriverList.findIndex((pRef) => pRef.deref() === pDriver);
        if (lIndex !== -1) {
            this.mDriverList.splice(lIndex, 1);
        }
    }
}

/**
 * Stored driver together with the display and target it was built for, so a repeat request can be
 * matched against the live binding.
 */
type PotatnoUiManagerPreviewBinding = {
    driver: PotatnoPreviewDriver<PotatnoUiProject>;
    displayId: string;
    target: string;
};
