import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import { PotatnoCodeGenerator } from '../parser/potatno-code-generator.ts';
import type { PotatnoCodeGeneratorFunctionResult } from '../parser/result/potatno-code-generator-function-result.ts';
import type { PotatnoCodeGeneratorNodeResult } from '../parser/result/potatno-code-generator-node-result.ts';
import type { PotatnoPreviewDriverHandle } from '../preview/potatno-preview-driver.ts';
import type { PotatnoPreviewEntry } from '../preview/potatno-preview.ts';
import type { PotatnoUiProject } from './potatno-node-definition-list.ts';

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
 * from the graph, document loads, etc.) call `rebuild()` which throws away the old drivers and
 * builds fresh ones from the latest document state. `render()` is called from the application
 * loop and forwards to every active driver.
 *
 * @typeParam TProject - The widened UI project type the manager operates on.
 */
export class PotatnoUiPreviewManager<TProject extends PotatnoUiProject> {
    private readonly mProject: TProject;
    private mDocument: PotatnoDocument<TProject> | null;
    private mFunctionDescriptors: Array<PotatnoUiPreviewDescriptor<TProject>>;
    private mNodeDescriptors: Map<PotatnoDocumentNode<TProject>, PotatnoUiPreviewDescriptor<TProject>>;

    /**
     * Function-level preview descriptors in registration order. The preview-panel tab UI
     * renders these as tabs and switches the visible element when the user selects one.
     */
    public get functionDescriptors(): ReadonlyArray<PotatnoUiPreviewDescriptor<TProject>> {
        return this.mFunctionDescriptors;
    }

    /**
     * Constructor.
     *
     * @param pProject - Project that owns the preview registry and node definitions.
     */
    public constructor(pProject: TProject) {
        this.mProject = pProject;
        this.mDocument = null;
        this.mFunctionDescriptors = new Array<PotatnoUiPreviewDescriptor<TProject>>();
        this.mNodeDescriptors = new Map<PotatnoDocumentNode<TProject>, PotatnoUiPreviewDescriptor<TProject>>();
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
     * Bind the active document. Triggers an immediate `rebuild()` so descriptors reflect the
     * new document state (or clears them when the document is removed).
     *
     * @param pDocument - The document to bind, or `null` to clear.
     */
    public setDocument(pDocument: PotatnoDocument<TProject> | null): void {
        this.mDocument = pDocument;
        this.rebuild();
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

        // Locate the document's system entry-point function instance — function-level previews
        // run against this. Helper functions can also have previews but only via per-node opt-in
        // on their internal nodes.
        let lEntryDocumentFunction: PotatnoDocumentFunction<TProject> | null = null;
        for (const lFunction of lDocument.functions) {
            if (lFunction.isSystem) {
                lEntryDocumentFunction = lFunction;
                break;
            }
        }

        // Build function-level descriptors. A pair qualifies when its executor wraps the
        // project's entry-point definition; helper-function executors do not show up here.
        // Compare by definition id rather than reference because the registry's executor and
        // the project's entry point carry different TProject generics at the type level even
        // though they are the same definition instance at runtime.
        if (lEntryDocumentFunction) {
            const lEntryPointId: string = this.mProject.entryPoint.id;
            for (const lEntry of lEntries) {
                if (lEntry.executorFunctionId !== lEntryPointId) {
                    continue;
                }

                this.mFunctionDescriptors.push(this.buildFunctionDescriptor(lEntry, lEntryDocumentFunction));
            }
        }

        // Build per-node descriptors. Walk every node in every function and respect the
        // node.preview opt-in. A pair qualifies when its display id matches the opt-in's
        // display id AND its executor wraps the node's owning function definition.
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
     * @returns A promise resolving once every driver has finished its render pass.
     */
    public async render(): Promise<void> {
        // Snapshot the descriptor lists so a rebuild mid-render doesn't disturb iteration.
        const lDescriptors: Array<PotatnoUiPreviewDescriptor<TProject>> = [
            ...this.mFunctionDescriptors,
            ...this.mNodeDescriptors.values()
        ];

        // Drive each render. Errors are isolated per descriptor so one broken preview does
        // not stop the others.
        await Promise.all(lDescriptors.map(async (pDescriptor) => {
            try {
                await pDescriptor.driver.render();
            } catch (pError) {
                console.error(`[PreviewManager] Driver "${pDescriptor.displayId}" render failed:`, pError);
            }
        }));
    }

    /**
     * Build one function-level descriptor for the given registry entry. The driver runs the
     * project's entry-point function on every cache miss and feeds the display.
     *
     * @param pEntry - The registry entry whose executor wraps the entry-point function.
     * @param pDocumentFunction - The document function instance to drive the code generator with.
     *
     * @returns The fresh descriptor.
     */
    private buildFunctionDescriptor(pEntry: PotatnoPreviewEntry<TProject['types']>, pDocumentFunction: PotatnoDocumentFunction<TProject>): PotatnoUiPreviewDescriptor<TProject> {
        // Each driver gets its own generator-result provider closure so the executor's build
        // callback always sees the latest code-gen output for the bound function.
        const lProvider = (): PotatnoCodeGeneratorFunctionResult<TProject> => {
            const lGenerator: PotatnoCodeGenerator<TProject> = new PotatnoCodeGenerator<TProject>(this.mProject);
            return lGenerator.generateFunction(pDocumentFunction, true).entryPoint;
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

        // Generate code with the target node as the exit — used both to populate portValueIds
        // for the port lookup we hand to the executor, and as the per-render result the driver
        // pulls on each cache miss. The closure re-runs the generator on every miss so the
        // valueId map and the body code stay consistent.
        const lProvider = (): PotatnoCodeGeneratorNodeResult<TProject> => {
            const lGenerator: PotatnoCodeGenerator<TProject> = new PotatnoCodeGenerator<TProject>(this.mProject);
            const lDocumentResult = lGenerator.generateNode(pNode, true);
            // generateNode produces a FunctionResult with exactly one graph anchored at the
            // requested exit node — that single graph holds the portValueIds map and the body
            // code the executor needs.
            const lGraphs: ReadonlyArray<PotatnoCodeGeneratorNodeResult<TProject>> = lDocumentResult.entryPoint.graphs;
            return lGraphs[0]!;
        };

        // Resolve the valueId for the targeted port up-front so the executor's build callback
        // gets a stable handle even if the generator re-runs between compile and render.
        const lFirstResult: PotatnoCodeGeneratorNodeResult<TProject> = lProvider();
        const lValueId: string | undefined = lFirstResult.ports.get(lPort);
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
}
