import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import { PotatnoCodeGenerator } from '../parser/potatno-code-generator.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoCodeGeneratorFunctionResult } from '../parser/result/potatno-code-generator-function-result.ts';
import type { PotatnoPreviewDriverHandle } from '../preview/potatno-preview-driver.ts';
import type { PotatnoPreviewEntry } from '../preview/potatno-preview.ts';
import type { PotatnoPreviewTabDescriptor } from './component/potatno_preview/potatno-preview.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager } from './manager/potatno-ui-manager.ts';
import type { PotatnoUiProject } from './potatno-ui-project.ts';

/**
 * One ready-to-render preview built by the manager.
 *
 * Couples a driver with the metadata the UI needs to render it (the chosen tab label, the
 * display id, the DOM element to insert). Per-node descriptors additionally carry the bound
 * document node for the node-graph's lookup-by-node calls.
 *
 * @typeParam TProject - The widened UI project type the descriptors belong to.
 */
export type PotatnoUiPreviewDescriptor<TProject extends PotatnoUiProject> = {
    /**
     * Stable id of the registered display backing this descriptor. Used to identify the
     * descriptor across rebuilds (e.g. so a preview-panel tab stays selected after the user
     * mutates the graph).
     */
    readonly displayId: string;

    /**
     * Human-readable tab/section label derived from the display id.
     */
    readonly label: string;

    /**
     * DOM element produced by the display's `generate()` factory. `null` when the display
     * returned a non-HTMLElement; non-DOM previews are skipped by the UI layer.
     */
    readonly element: HTMLElement | null;

    /**
     * The driver handle the application loop ticks per frame. Exposed as the type-erased
     * `PotatnoPreviewDriverHandle` interface so descriptor consumers don't need to know the
     * driver's narrow generics.
     */
    readonly driver: PotatnoPreviewDriverHandle;

    /**
     * For per-node descriptors, the document node whose port is being previewed. `null` for
     * function-level descriptors.
     */
    readonly node: PotatnoDocumentNode<TProject> | null;
};

/**
 * One selectable output for a user function's main preview — the output port's label, used both
 * as the option id and its display text.
 */
export type PotatnoUiPreviewOutputOption = {
    /**
     * Output port label, used as the stable option id.
     */
    readonly id: string;

    /**
     * Human-readable label shown in the output selector.
     */
    readonly label: string;
};

/**
 * UI-owned lifecycle helper that walks the project's preview registry, constructs
 * `PotatnoPreviewDriver` instances for every applicable preview on the active document, and
 * exposes them to the rest of the editor.
 *
 * Two kinds of drivers are produced:
 *  - Function-level previews — one per registered `(display, executor)` pair whose executor's
 *    bound function is the project's entry-point definition. The driver runs the entire
 *    function and feeds the display.
 *  - Per-node previews — one per document node whose `node.preview` opt-in resolves to a
 *    registered display. The driver runs the function up to the bound node and feeds the
 *    display with the targeted port's value.
 *
 * The manager owns the cache lifecycle. Mutations that affect code generation (`affectsPreview`
 * from the graph, document loads, etc.) call `rebuild()`. While the bound document instance is
 * unchanged (in-place graph edits), function-level drivers are reused — their cache is
 * invalidated so the next render recompiles from the latest graph, but the driver and its DOM
 * element stay stable so the UI never has to swap a live `<canvas>`. A new document instance
 * (load, undo/redo) drops the reusable drivers and builds fresh ones. `render()` is called from
 * the application loop and forwards to every active driver.
 *
 * @typeParam TProject - The widened UI project type the manager operates on.
 */
export class PotatnoUiPreviewManager<TProject extends PotatnoUiProject> {
    private readonly mManager: PotatnoUiManager;
    private readonly mProject: TProject;
    private readonly mUnsubscribe: () => void;
    private mActiveFunction: PotatnoDocumentFunction<TProject> | null;
    private mDescriptorFunction: PotatnoDocumentFunction<TProject> | null;
    private mDocument: PotatnoDocument<TProject>;
    private mDriverDocument: PotatnoDocument<TProject> | null;
    private mFunctionDescriptors: Array<PotatnoUiPreviewDescriptor<TProject>>;
    private mNodeDescriptors: Map<PotatnoDocumentNode<TProject>, PotatnoUiPreviewDescriptor<TProject>>;
    private mPreviewTabs: ReadonlyArray<PotatnoPreviewTabDescriptor>;
    private mSelectedDisplayId: string;
    private mSelectedOutputId: string;
    private mUpdateDebounceTimer: number | null;

    /**
     * Function-level preview descriptors in registration order. The preview-panel tab UI
     * renders these as tabs and switches the visible element when the user selects one.
     */
    public get functionDescriptors(): ReadonlyArray<PotatnoUiPreviewDescriptor<TProject>> {
        return this.mFunctionDescriptors;
    }

    /**
     * Function-level preview tab descriptors for the preview panel, republished on every rebuild.
     */
    public get previewTabs(): ReadonlyArray<PotatnoPreviewTabDescriptor> {
        return this.mPreviewTabs;
    }

    /**
     * Constructor.
     *
     * @param pProject - Project that owns the preview registry and node definitions.
     * @param pDocument - The document instance the previews are built from.
     * @param pManager - The owning UI manager whose change events drive the rebuilds.
     */
    public constructor(pProject: TProject, pDocument: PotatnoDocument<TProject>, pManager: PotatnoUiManager) {
        this.mProject = pProject;
        this.mDocument = pDocument;
        this.mManager = pManager;

        this.mActiveFunction = null;
        this.mDescriptorFunction = null;
        this.mDriverDocument = null;
        this.mFunctionDescriptors = new Array<PotatnoUiPreviewDescriptor<TProject>>();
        this.mNodeDescriptors = new Map<PotatnoDocumentNode<TProject>, PotatnoUiPreviewDescriptor<TProject>>();
        this.mPreviewTabs = [];
        this.mSelectedDisplayId = '';
        this.mSelectedOutputId = '';
        this.mUpdateDebounceTimer = null;

        // Rebuild the previews whenever the manager reports a change that can alter generated code.
        // Live node transforms (NodeTransform) are intentionally excluded so dragging/resizing a
        // node does not churn the drivers; cosmetic move/label commits flow through that channel too.
        this.mUnsubscribe = pManager.subscribe(
            PotatnoCodeUiManagerChangeType.Connection
            | PotatnoCodeUiManagerChangeType.Document
            | PotatnoCodeUiManagerChangeType.Function
            | PotatnoCodeUiManagerChangeType.Node
            | PotatnoCodeUiManagerChangeType.ActiveFunction,
            null,
            () => {
                this.scheduleUpdate();
            });
    }

    /**
     * The display ("style") id chosen for the main preview, defaulting to the first display the
     * active function supports. Empty when the active function has no registered preview.
     */
    public get activePreviewDisplayId(): string {
        const lDisplays: Array<string> = this.getActivePreviewDisplays();
        if (this.mSelectedDisplayId !== '' && lDisplays.includes(this.mSelectedDisplayId)) {
            return this.mSelectedDisplayId;
        }
        return lDisplays[0] ?? '';
    }

    /**
     * Whether the active function is a non-entry (user) function, which the main preview shows
     * one selected output of. The entry/main function always shows its full output instead.
     */
    public get activePreviewIsUserFunction(): boolean {
        const lFunctionDefinition = this.activeFunctionDefinition();
        return lFunctionDefinition !== null && lFunctionDefinition.id !== this.mProject.entryPoint.id;
    }

    /**
     * The output port label chosen for a user function's main preview, defaulting to the first
     * output. Empty for the entry/main function (which shows its full output) or when there are
     * no outputs.
     */
    public get activePreviewOutputId(): string {
        const lOutputs: Array<PotatnoUiPreviewOutputOption> = this.getActivePreviewOutputs();
        if (this.mSelectedOutputId !== '' && lOutputs.some((pOutput) => pOutput.id === this.mSelectedOutputId)) {
            return this.mSelectedOutputId;
        }
        return lOutputs[0]?.id ?? '';
    }

    /**
     * Look up the per-node descriptor for the given document node. Returns `null` when the
     * node has no preview opt-in or the opt-in points at an unknown display/executor pair.
     *
     * @param pNode - The document node to look up.
     *
     * @returns The matching descriptor, or `null`.
     */
    public getNodeDescriptor(pNode: PotatnoDocumentNode<TProject>): PotatnoUiPreviewDescriptor<TProject> | null {
        return this.mNodeDescriptors.get(pNode) ?? null;
    }

    /**
     * List the display ids that can preview an output of the given node — the registered displays
     * whose executor wraps the node's owning function definition. Drives the node's "style"
     * selector and supplies the default display when a preview port is first chosen. Empty when
     * the node's function has no registered preview.
     *
     * @param pNode - The node whose available preview displays to list.
     *
     * @returns The matching display ids, in registration order, deduplicated.
     */
    public getPreviewDisplaysForNode(pNode: PotatnoDocumentNode<TProject>): Array<string> {
        const lRegistry = this.mProject.previews;
        if (!lRegistry) {
            return [];
        }

        // The display's executor must wrap the node's owning function definition, mirroring the
        // match `tryBuildNodeDescriptor` performs when it actually builds the driver.
        const lOwningFunctionDefinition = this.mProject.getFunction(pNode.function.definitionId);
        if (!lOwningFunctionDefinition) {
            return [];
        }

        const lDisplays: Set<string> = new Set<string>();
        for (const lEntry of lRegistry.entries) {
            if (lEntry.executorFunctionId === lOwningFunctionDefinition.id) {
                lDisplays.add(lEntry.displayId);
            }
        }

        return [...lDisplays];
    }

    /**
     * The output port options for the active function's main preview — empty for the entry/main
     * function (full output) and for functions with no registered preview.
     *
     * @returns The selectable outputs (id + label).
     */
    public getActivePreviewOutputs(): Array<PotatnoUiPreviewOutputOption> {
        const lFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (!lFunction || !this.activePreviewIsUserFunction) {
            return [];
        }

        return lFunction.outputs.map((pOutput) => ({ id: pOutput.label, label: pOutput.label }));
    }

    /**
     * The display ("style") ids available for the active function's main preview — the registered
     * displays whose executor wraps the active function's definition.
     *
     * @returns The matching display ids, deduplicated.
     */
    public getActivePreviewDisplays(): Array<string> {
        const lFunctionDefinition = this.activeFunctionDefinition();
        if (!lFunctionDefinition) {
            return [];
        }

        const lRegistry = this.mProject.previews;
        if (!lRegistry) {
            return [];
        }

        const lDisplays: Set<string> = new Set<string>();
        for (const lEntry of lRegistry.entries) {
            if (lEntry.executorFunctionId === lFunctionDefinition.id) {
                lDisplays.add(lEntry.displayId);
            }
        }

        return [...lDisplays];
    }

    /**
     * Bind the function whose preview the main panel shows. Stored without rebuilding; the editor
     * triggers the rebuild via `setDocument`.
     *
     * @param pFunction - The active function, or `null` to clear.
     */
    public setActiveFunction(pFunction: PotatnoDocumentFunction<TProject> | null): void {
        this.mActiveFunction = pFunction;
    }

    /**
     * Choose which display renders the main preview. The editor re-runs the rebuild afterwards.
     *
     * @param pDisplayId - The chosen display id.
     */
    public setActivePreviewDisplay(pDisplayId: string): void {
        this.mSelectedDisplayId = pDisplayId;
    }

    /**
     * Choose which output port a user function's main preview shows. The editor re-runs the
     * rebuild afterwards.
     *
     * @param pOutputId - The chosen output port label.
     */
    public setActivePreviewOutput(pOutputId: string): void {
        this.mSelectedOutputId = pOutputId;
    }

    /**
     * Schedule a debounced rebuild, collapsing rapid manager mutations into one rebuild.
     */
    private scheduleUpdate(): void {
        if (this.mUpdateDebounceTimer !== null) {
            clearTimeout(this.mUpdateDebounceTimer);
        }

        this.mUpdateDebounceTimer = globalThis.setTimeout(() => {
            this.mUpdateDebounceTimer = null;
            this.update();
        }, 50) as unknown as number;
    }

    /**
     * Resolve the active function's definition, or `null` when none is bound or it has no
     * definition in the project.
     */
    private activeFunctionDefinition(): PotatnoFunctionDefinition<TProject> | null {
        const lFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (!lFunction) {
            return null;
        }

        return this.mProject.getFunction(lFunction.definitionId) ?? null;
    }

    /**
     * Remove the manager subscription and cancel any pending rebuild. Called when this preview
     * manager is replaced (a new document is adopted) or the editor is torn down.
     */
    public dispose(): void {
        this.mUnsubscribe();

        if (this.mUpdateDebounceTimer !== null) {
            clearTimeout(this.mUpdateDebounceTimer);
            this.mUpdateDebounceTimer = null;
        }
    }

    /**
     * Rebuild every preview driver from the latest manager state and republish the tab list, then
     * notify listeners with a {@link PotatnoCodeUiManagerChangeType.Preview} event. Skipped while the
     * document has validation errors so the existing drivers keep their last value instead of
     * re-running — and failing — the generator.
     */
    public update(): void {
        // Sync the bound document and active function from the manager. A document swap (undo/redo)
        // replaces the instance, so this keeps the drivers building against the live graph.
        const lDocument: PotatnoDocument<TProject> | null = this.mManager.graph.document as PotatnoDocument<TProject> | null;
        if (!lDocument) {
            this.mPreviewTabs = [];
            return;
        }
        this.mDocument = lDocument;
        this.mActiveFunction = this.mManager.activeFunction as PotatnoDocumentFunction<TProject> | null;

        // Keep the last drivers while the document is invalid.
        if (!this.mManager.integrity.isValid) {
            return;
        }

        // Rebuild the drivers, then republish the function-level tab descriptors.
        try {
            this.rebuild();
        } catch (pError) {
            console.error('[PotatnoUiPreviewManager] Preview rebuild failed:', pError);
            this.mPreviewTabs = [];
            this.mManager.dispatch(PotatnoCodeUiManagerChangeType.Preview, this.mDocument);
            return;
        }

        const lTabs: Array<PotatnoPreviewTabDescriptor> = [];
        for (const lDescriptor of this.mFunctionDescriptors) {
            if (!lDescriptor.element) {
                continue;
            }
            lTabs.push({ id: lDescriptor.displayId, label: lDescriptor.label, driver: lDescriptor.driver });
        }

        this.mPreviewTabs = lTabs;
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.Preview, this.mDocument);
    }

    /**
     * Re-walk the project's registry and the current document, throwing away any previous
     * drivers and constructing a fresh set. Call after any mutation that can change code-gen
     * output or invalidate per-node opt-ins.
     *
     * Tolerates the project having no registry (returns empty descriptors) and a missing
     * document (no per-node drivers; function-level drivers also require a document to
     * resolve the system entry function instance).
     */
    public rebuild(): void {
        // Snapshot the previous function descriptors so unchanged previews can keep their driver
        // (and live element) instead of being rebuilt. Reuse is only safe while the bound document
        // instance is unchanged: a new instance (load, undo/redo) leaves the old drivers' provider
        // closures pointing at a stale document, so they must be dropped and rebuilt.
        const lPreviousFunctionDescriptors: Array<PotatnoUiPreviewDescriptor<TProject>> = this.mFunctionDescriptors;
        // Reuse the function-level driver (and its live element) only for an in-place edit of the
        // SAME active function. The active-function guard is essential: the entry function and a
        // user function can expose the same display id, so without it a user → entry switch would
        // match by display id and reuse the user function's driver (baked with that function's exit
        // port and a provider that generates the user function) for the entry/main preview, leaving
        // the main preview rendering the wrong function.
        const lReuseDrivers: boolean = this.mDocument !== null
            && this.mDocument === this.mDriverDocument
            && this.mActiveFunction === this.mDescriptorFunction;
        this.mDriverDocument = this.mDocument;
        this.mDescriptorFunction = this.mActiveFunction;

        this.mFunctionDescriptors = new Array<PotatnoUiPreviewDescriptor<TProject>>();
        this.mNodeDescriptors = new Map<PotatnoDocumentNode<TProject>, PotatnoUiPreviewDescriptor<TProject>>();

        // No registry → nothing to build.
        const lRegistry = this.mProject.previews;
        if (!lRegistry) {
            return;
        }

        // No document → no drivers, since both function-level and per-node paths need a
        // document function instance to run the code generator against.
        const lDocument: PotatnoDocument<TProject> | null = this.mDocument;
        if (!lDocument) {
            return;
        }

        // Registry entries are typed against the project's types definition. The registry
        // captured them with the precise generic; here we rebind to the manager's TProject
        // so the rest of the file talks in project terms instead of types terms.
        const lEntries: ReadonlyArray<PotatnoPreviewEntry<TProject['types']>> = lRegistry.entries;

        // Build the single main-panel descriptor for the ACTIVE function: the entry/main function
        // shows its full output, a user function shows one selected output (default inputs). Reuse
        // the previous descriptor for the same display id only for the entry function — a user
        // function descriptor bakes the selected output's exit port + valueId, both of which move
        // with the selection and the graph, so it is always rebuilt. Otherwise invalidate the
        // reused driver's cache so it recompiles while keeping its element stable.
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (lActiveFunction) {
            const lReusedDescriptor: PotatnoUiPreviewDescriptor<TProject> | undefined = (lReuseDrivers && !this.activePreviewIsUserFunction)
                ? lPreviousFunctionDescriptors.find((pDescriptor) => pDescriptor.displayId === this.activePreviewDisplayId)
                : undefined;

            if (lReusedDescriptor) {
                lReusedDescriptor.driver.invalidateCache();
                this.mFunctionDescriptors.push(lReusedDescriptor);
            } else {
                const lDescriptor: PotatnoUiPreviewDescriptor<TProject> | null = this.buildActiveFunctionDescriptor(lActiveFunction, lEntries);
                if (lDescriptor) {
                    this.mFunctionDescriptors.push(lDescriptor);
                }
            }
        }

        // Build per-node descriptors. Walk every node in every function and respect the
        // node.preview opt-in. A pair qualifies when its display id matches the opt-in's
        // display id AND its executor wraps the node's owning function definition.
        //
        // Unlike function-level descriptors these are always rebuilt: a per-node driver bakes the
        // targeted port's valueId into its port target at build time, and that valueId can shift
        // whenever the graph changes, so a reused driver would splice in a stale id.
        for (const lDocumentFunction of lDocument.functions) {
            for (const lNode of lDocumentFunction.nodes) {
                const lDescriptor: PotatnoUiPreviewDescriptor<TProject> | null = this.tryBuildNodeDescriptor(lNode, lDocumentFunction, lEntries);
                if (lDescriptor) {
                    this.mNodeDescriptors.set(lNode, lDescriptor);
                }
            }
        }
    }

    /**
     * Tick every active driver once. Awaited so callers can chain when needed; in the typical
     * `requestAnimationFrame` loop this is fire-and-forget.
     *
     * @param pSuppressInvalidGeneration - When `true`, the document currently has validation
     * errors: the main (function-level) preview is skipped entirely (it is not shown anyway), and
     * per-node previews render only from their cached callable so no fresh — and failing —
     * generation is triggered.
     *
     * @returns A promise resolving once every driver has finished its render pass.
     */
    public async render(pSuppressInvalidGeneration: boolean = false): Promise<void> {
        // While the document is invalid the main preview is not run; per-node previews keep their
        // last cached value but must not recompile (compilation would re-run the failing generator).
        const lFunctionDescriptors: Array<PotatnoUiPreviewDescriptor<TProject>> = pSuppressInvalidGeneration
            ? []
            : this.mFunctionDescriptors;
        const lAllowCompile: boolean = !pSuppressInvalidGeneration;

        // Snapshot the descriptor lists so a rebuild mid-render doesn't disturb iteration.
        const lDescriptors: Array<PotatnoUiPreviewDescriptor<TProject>> = [
            ...lFunctionDescriptors,
            ...this.mNodeDescriptors.values()
        ];

        // Drive each render. Errors are isolated per descriptor so one broken preview does
        // not stop the others.
        await Promise.all(lDescriptors.map(async (pDescriptor) => {
            try {
                await pDescriptor.driver.render(lAllowCompile);
            } catch (pError) {
                console.error(`[PreviewManager] Driver "${pDescriptor.displayId}" render failed:`, pError);
            }
        }));
    }

    /**
     * Build the main-panel descriptor for the active function. The entry/main function uses the
     * function-level path (full output); a user function uses the per-node path to preview a single
     * selected output, evaluated with default inputs by the registered user-function executor.
     *
     * @param pFunction - The active document function to preview.
     * @param pEntries - All registered `(display, executor)` pairs.
     *
     * @returns The descriptor, or `null` when the function has no matching registered preview.
     */
    private buildActiveFunctionDescriptor(pFunction: PotatnoDocumentFunction<TProject>, pEntries: ReadonlyArray<PotatnoPreviewEntry<TProject['types']>>): PotatnoUiPreviewDescriptor<TProject> | null {
        const lFunctionDefinition = this.activeFunctionDefinition();
        if (!lFunctionDefinition) {
            return null;
        }

        // Pick the registered pair for the active function and the chosen display.
        const lDisplayId: string = this.activePreviewDisplayId;
        const lEntry: PotatnoPreviewEntry<TProject['types']> | undefined = pEntries.find((pEntry) => {
            return pEntry.executorFunctionId === lFunctionDefinition.id && pEntry.displayId === lDisplayId;
        });
        if (!lEntry) {
            return null;
        }

        // Entry/main function → full output via the function-level path.
        if (!this.activePreviewIsUserFunction) {
            return this.buildFunctionDescriptor(lEntry, pFunction);
        }

        // User function → preview one selected output. Route through the per-node path: the target
        // is the exit node's value-input port for the selected output, and the value the executor
        // returns is keyed by the output label.
        const lOutputId: string = this.activePreviewOutputId;
        const lExitPort: PotatnoDocumentPort<TProject> | null = lOutputId === '' ? null : this.findFunctionOutputPort(pFunction, lOutputId);
        if (!lExitPort) {
            return null;
        }

        const lProvider = (): PotatnoCodeGeneratorDocumentResult<TProject> => {
            const lGenerator: PotatnoCodeGenerator<TProject> = new PotatnoCodeGenerator<TProject>(this.mProject);
            return lGenerator.generateFunction(pFunction, true);
        };

        const lDriver: PotatnoPreviewDriverHandle = lEntry.createDriver<TProject>({
            portTarget: { documentPort: lExitPort, value: lOutputId },
            generatorResultProvider: lProvider
        });

        const lElement: Element = lDriver.element;

        return {
            displayId: lEntry.displayId,
            label: `${lEntry.displayId} · ${lOutputId}`,
            element: lElement instanceof HTMLElement ? lElement : null,
            driver: lDriver,
            node: null
        };
    }

    /**
     * Find the exit node's value-input port carrying a given function output, by output label.
     *
     * @param pFunction - The function whose exit nodes to search.
     * @param pOutputId - The output port label to match.
     *
     * @returns The matching value input port, or `null`.
     */
    private findFunctionOutputPort(pFunction: PotatnoDocumentFunction<TProject>, pOutputId: string): PotatnoDocumentPort<TProject> | null {
        for (const lExitNode of pFunction.getExitNodes()) {
            const lPort: PotatnoDocumentPort<TProject> | undefined = lExitNode.inputs.map.get(pOutputId);
            if (lPort && lPort.portType === 'value') {
                return lPort;
            }
        }

        return null;
    }

    /**
     * Build one function-level descriptor for the given registry entry. The driver runs the
     * bound function on every cache miss and feeds the display.
     *
     * @param pEntry - The registry entry whose executor wraps the function definition.
     * @param pDocumentFunction - The document function instance to drive the code generator with.
     *
     * @returns The fresh descriptor.
     */
    private buildFunctionDescriptor(pEntry: PotatnoPreviewEntry<TProject['types']>, pDocumentFunction: PotatnoDocumentFunction<TProject>): PotatnoUiPreviewDescriptor<TProject> {
        // Each driver gets its own generator-result provider closure so the executor's build
        // callback always sees the latest code-gen output for the bound function. The whole
        // document result is handed over (not just the entry point) so dependency function
        // declarations are in scope when the previewed graph calls user functions.
        const lProvider = (): PotatnoCodeGeneratorDocumentResult<TProject> => {
            const lGenerator: PotatnoCodeGenerator<TProject> = new PotatnoCodeGenerator<TProject>(this.mProject);
            return lGenerator.generateFunction(pDocumentFunction, true);
        };

        // Delegate construction to the entry's factory via its function-level branch. The
        // factory still owns the precise narrow generics captured at `addDisplay` time; we get
        // back the project-agnostic handle.
        const lDriver: PotatnoPreviewDriverHandle = pEntry.createDriver<TProject>({
            portTarget: null,
            generatorResultProvider: lProvider
        });

        const lElement: Element = lDriver.element;

        return {
            displayId: pEntry.displayId,
            label: pEntry.displayId,
            element: lElement instanceof HTMLElement ? lElement : null,
            driver: lDriver,
            node: null
        };
    }

    /**
     * Attempt to build a per-node descriptor for the given node. Returns `null` when the node
     * has no preview opt-in, the port id does not resolve to a value output on the node, or
     * no `(display, executor)` pair matches the opt-in and the node's owning function.
     *
     * @param pNode - The document node to consider.
     * @param pDocumentFunction - The function instance the node belongs to.
     * @param pEntries - All registered `(display, executor)` pairs.
     *
     * @returns The descriptor, or `null` if the node should not have a preview.
     */
    private tryBuildNodeDescriptor(pNode: PotatnoDocumentNode<TProject>, pDocumentFunction: PotatnoDocumentFunction<TProject>, pEntries: ReadonlyArray<PotatnoPreviewEntry<TProject['types']>>): PotatnoUiPreviewDescriptor<TProject> | null {
        const lBinding = pNode.preview;
        if (!lBinding) {
            return null;
        }

        // Resolve the targeted value output port. Per-node previews only make sense on value
        // outputs — a flow port has nothing to expose; an input would not have a stable
        // valueId allocated for it.
        const lPort: PotatnoDocumentPort<TProject> | undefined = pNode.outputs.map.get(lBinding.portId);
        if (!lPort || lPort.portType !== 'value') {
            return null;
        }

        // Find a registered pair matching the binding's display and the node's owning function.
        // The executor must wrap the SAME function definition the node lives in — running a
        // pixel-shader executor on a helper-function node would yield meaningless code.
        const lOwningFunctionDefinition = this.mProject.getFunction(pDocumentFunction.definitionId);
        if (!lOwningFunctionDefinition) {
            return null;
        }

        const lOwningFunctionDefinitionId: string = lOwningFunctionDefinition.id;
        const lEntry: PotatnoPreviewEntry<TProject['types']> | undefined = pEntries.find((pEntry) => {
            return pEntry.displayId === lBinding.displayId && pEntry.executorFunctionId === lOwningFunctionDefinitionId;
        });
        if (!lEntry) {
            return null;
        }

        // Generate the FULL owning function (with its dependencies). The input node supplies the
        // JS-function interface and the previewed value is computed in context; the executor's
        // build callback then replaces the target output port's valueId hook with a return so the
        // function yields that intermediate value. The closure re-runs the generator on every
        // cache miss so the valueId map and body code stay consistent.
        const lProvider = (): PotatnoCodeGeneratorDocumentResult<TProject> => {
            const lGenerator: PotatnoCodeGenerator<TProject> = new PotatnoCodeGenerator<TProject>(this.mProject);
            return lGenerator.generateFunction(pDocumentFunction, true);
        };

        // Resolve the valueId allocated to the targeted port in the full generation. Generation is
        // deterministic, so the id stays stable across the provider's re-runs. A `null` here means
        // the port's value is not emitted (e.g. nothing downstream consumes it), so there is no
        // hook to anchor the preview on.
        const lValueId: string | undefined = this.findPortValueId(lProvider(), lPort);
        if (!lValueId) {
            return null;
        }

        // Delegate construction to the entry's factory so the precise display/executor
        // generics stay encapsulated.
        const lDriver: PotatnoPreviewDriverHandle = lEntry.createDriver<TProject>({
            portTarget: {
                documentPort: lPort,
                value: lValueId
            },
            generatorResultProvider: lProvider
        });

        const lElement: Element = lDriver.element;

        return {
            displayId: lEntry.displayId,
            label: lEntry.displayId,
            element: lElement instanceof HTMLElement ? lElement : null,
            driver: lDriver,
            node: pNode
        };
    }

    /**
     * Find the valueId allocated to a port across every graph of a generation result. The
     * previewed port can live in the entry function or any dependency function, so all results
     * are searched.
     *
     * @param pDocumentResult - The generation result to search.
     * @param pPort - The port whose valueId to find.
     *
     * @returns The valueId, or `undefined` when the port's value was not emitted.
     */
    private findPortValueId(pDocumentResult: PotatnoCodeGeneratorDocumentResult<TProject>, pPort: PotatnoDocumentPort<TProject>): string | undefined {
        const lFunctionResults: Array<PotatnoCodeGeneratorFunctionResult<TProject>> = [pDocumentResult.entryPoint, ...pDocumentResult.dependencies];
        for (const lFunctionResult of lFunctionResults) {
            for (const lGraph of lFunctionResult.graphs) {
                const lValueId: string | undefined = lGraph.ports.get(pPort);
                if (lValueId !== undefined) {
                    return lValueId;
                }
            }
        }

        return undefined;
    }
}
