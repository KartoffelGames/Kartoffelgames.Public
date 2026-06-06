import { Injection } from '@kartoffelgames/core-dependency-injection';
import { IPotatnoDocumentItem } from "../../document/i-potatno-document-item.interface.ts";
import { PotatnoDocumentFunction, type PotatnoDocumentFunctionConstructorParameter } from '../../document/potatno-document-function.ts';
import { PotatnoDocumentNode, type PotatnoDocumentNodeTransformation } from '../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../document/potatno-document-port.ts';
import { PotatnoDocument } from '../../document/potatno-document.ts';
import type { PotatnoNodeDefinition } from '../../project/node_definition/potatno-node-definition.ts';
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics, type PotatnoFunctionDefinitionNodes } from '../../project/potatno-function-definition.ts';
import { PotatnoDeserializer } from '../../serialization/potatno-deserializer.ts';
import type { PotatnoCodeFileSerializationResult } from '../../serialization/potatno-serialization.type.ts';
import { PotatnoSerializer } from '../../serialization/potatno-serializer.ts';
import type { PotatnoPreviewTabDescriptor } from '../component/potatno_preview/potatno-preview.ts';
import { PotatnoHistory } from '../potatno-history.ts';
import { PotatnoUiPreviewManager } from '../potatno-ui-preview-manager.ts';
import type { PotatnoUiProject } from '../potatno-ui-project.ts';
import { PotatnoUiManagerIntegrity } from "./manager_component/potatno-ui-manager-integrity.ts";

/**
 * Central, shared state owner for the whole Potatno-code editor UI.
 *
 * Every UI component injects this singleton ({@link Injection.use}) instead of receiving its
 * data through a chain of template bindings. The manager holds the current project and document,
 * the active function, validation results, undo/redo history and the preview lifecycle. All
 * document mutations funnel through its methods so the side effects — re-validation, history
 * snapshots, preview rebuilds — happen in one place.
 *
 * It extends {@link EventTarget} and fires a typed {@link PotatnoCodeUiManagerChangeType} event for
 * every meaningful change. Components subscribe via {@link subscribe} and call their own
 * `updater.update()` in response, so they refresh from the shared state without owning a private
 * `@ComponentState` copy of it. This removes the version-token plumbing the old editor used to
 * keep fragmented component state in sync.
 */
@Injection.injectable('singleton')
export class PotatnoUiManager extends EventTarget {
    private mActiveFunctionId: string;
    private mDocument: PotatnoDocument<PotatnoUiProject> | null;

    private readonly mHistory: PotatnoHistory;
    private mHistoryDebounceTimer: number | null;
    private mPreviewDebounceTimer: number | null;
    private mPreviewManager: PotatnoUiPreviewManager<PotatnoUiProject> | null;
    private mPreviewTabs: ReadonlyArray<PotatnoPreviewTabDescriptor>;
    private mProject: PotatnoUiProject | null;

    // Manager components.
    private readonly mIntegrity: PotatnoUiManagerIntegrity;

    /**
     * The currently active document function, or `null` when none is resolvable.
     */
    public get activeFunction(): PotatnoDocumentFunction<PotatnoUiProject> | null {
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mDocument;
        if (!lDocument) {
            return null;
        }

        for (const lFunction of lDocument.functions) {
            if (lFunction.id === this.mActiveFunctionId) {
                return lFunction;
            }
        }

        return null;
    }

    /**
     * Id of the active function.
     */
    public get activeFunctionId(): string {
        return this.mActiveFunctionId;
    }

    /**
     * Whether a redo snapshot is available.
     */
    public get canRedo(): boolean {
        return this.mHistory.canRedo;
    }

    /**
     * Whether an undo snapshot is available.
     */
    public get canUndo(): boolean {
        return this.mHistory.canUndo;
    }

    /**
     * Current document, or `null` when none is loaded.
     */
    public get document(): PotatnoDocument<PotatnoUiProject> | null {
        return this.mDocument;
    }

    /**
     * The current project, or `null` before initialization.
     */
    public get project(): PotatnoUiProject | null {
        return this.mProject;
    }

    /**
     * The preview lifecycle helper, or `null` before initialization. The preview panel reads the
     * active preview's display/output selection and its available options directly from it.
     */
    public get previewManager(): PotatnoUiPreviewManager<PotatnoUiProject> | null {
        return this.mPreviewManager;
    }

    /**
     * Preview tab descriptors for the preview panel.
     */
    public get previewTabs(): ReadonlyArray<PotatnoPreviewTabDescriptor> {
        return this.mPreviewTabs;
    }

    /**
     * Create a new, uninitialized manager. Call {@link initialize} before use.
     */
    public constructor() {
        super();

        // Create manager components.
        this.mIntegrity = new PotatnoUiManagerIntegrity(this);

        this.mActiveFunctionId = '';
        this.mDocument = null;
        this.mHistory = new PotatnoHistory();
        this.mHistoryDebounceTimer = null;
        this.mPreviewDebounceTimer = null;
        this.mPreviewManager = null;
        this.mPreviewTabs = [];
        this.mProject = null;
    }

    /**
     * Add a new user function from a definition id and activate it.
     *
     * @param pDefinitionId - The user function definition id to instantiate.
     */
    public addFunction(pDefinitionId: string): void {
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mDocument;
        const lProject: PotatnoUiProject | null = this.mProject;
        if (!lDocument || !lProject) {
            return;
        }

        const lDefinition: PotatnoFunctionDefinition<PotatnoUiProject> | undefined = lProject.userFunctions.get(pDefinitionId);
        if (!lDefinition) {
            return;
        }

        const lFunction: PotatnoDocumentFunction<PotatnoUiProject> = this.createDocumentFunction(lDocument, lProject, lDefinition, {
            definitionId: lDefinition.id,
            id: crypto.randomUUID(),
            isSystem: false,
            label: `Function ${lDocument.functions.size}`
        });

        lDocument.addFunction(lFunction);
        this.mActiveFunctionId = lFunction.id;
        this.mPreviewManager?.setActiveFunction(lFunction);

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.Function, lFunction);
    }

    /**
     * Place a new node in the active function from a definition.
     *
     * @param pDefinition - The node definition to instantiate.
     * @param pTransformation - Initial grid placement of the node.
     *
     * @returns The created node, or `null` when there is no active function.
     */
    public addNode(pDefinition: PotatnoNodeDefinition<PotatnoUiProject>, pTransformation: PotatnoDocumentNodeTransformation): PotatnoDocumentNode<PotatnoUiProject> | null {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.activeFunction;
        if (!lActiveFunction) {
            return null;
        }

        const lNode: PotatnoDocumentNode<PotatnoUiProject> = lActiveFunction.addNodeByDefinition(pDefinition, pTransformation);

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.Node, lNode);

        return lNode;
    }

    /**
     * Connect two ports and rebuild dependent state.
     *
     * @param pSource - One side of the connection.
     * @param pTarget - The other side of the connection.
     *
     * @returns `true` when the ports were connected, `false` when the connection was rejected.
     */
    public connectPorts(pSource: PotatnoDocumentPort<PotatnoUiProject>, pTarget: PotatnoDocumentPort<PotatnoUiProject>): boolean {
        try {
            pSource.connect(pTarget);
        } catch (pError) {
            console.error('[PotatnoCodeUiManager] Connection failed:', pError);
            return false;
        }

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();

        // Dispatch for from-node as well as to-node.
        this.dispatch(PotatnoCodeUiManagerChangeType.Connection, pSource);
        this.dispatch(PotatnoCodeUiManagerChangeType.Connection, pTarget);

        return true;
    }

    /**
     * Disconnect two ports and rebuild dependent state.
     *
     * @param pSource - One side of the connection.
     * @param pTarget - The other side of the connection.
     */
    public disconnectPorts(pSource: PotatnoDocumentPort<PotatnoUiProject>, pTarget: PotatnoDocumentPort<PotatnoUiProject>): void {
        pSource.disconnect(pTarget);

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();

        // Dispatch for from-node as well as to-node.
        this.dispatch(PotatnoCodeUiManagerChangeType.Connection, pSource);
        this.dispatch(PotatnoCodeUiManagerChangeType.Connection, pTarget);
    }

    /**
     * Release timers held by the manager. Called when the editor is torn down.
     */
    public dispose(): void {
        if (this.mHistoryDebounceTimer !== null) {
            clearTimeout(this.mHistoryDebounceTimer);
            this.mHistoryDebounceTimer = null;
        }

        if (this.mPreviewDebounceTimer !== null) {
            clearTimeout(this.mPreviewDebounceTimer);
            this.mPreviewDebounceTimer = null;
        }
    }

    /**
     * Serialize the current document.
     *
     * @returns The serialized document, or `null` without a document.
     */
    public generateCode(): PotatnoCodeFileSerializationResult | null {
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mDocument;
        if (!lDocument) {
            return null;
        }

        return new PotatnoSerializer<PotatnoUiProject>().serialize(lDocument);
    }

    /**
     * Resolve the per-node inline preview element from the preview manager.
     *
     * @param pNode - The node whose preview element to resolve.
     *
     * @returns The element, or `null` when the node has no active preview.
     */
    public getNodePreviewElement(pNode: PotatnoDocumentNode<PotatnoUiProject>): HTMLElement | null {
        return this.mPreviewManager?.getNodeDescriptor(pNode)?.element ?? null;
    }

    /**
     * List the preview display ids available for a node's outputs.
     *
     * @param pNode - The node whose available preview displays to list.
     *
     * @returns The display ids, or an empty array.
     */
    public getPreviewDisplaysForNode(pNode: PotatnoDocumentNode<PotatnoUiProject>): Array<string> {
        return this.mPreviewManager?.getPreviewDisplaysForNode(pNode) ?? [];
    }

    /**
     * Bind the manager to a project. Resets document, history and the preview manager.
     *
     * @param pProject - The project configuration backing the editor.
     */
    public initialize(pProject: PotatnoUiProject, pDocument: PotatnoDocument<PotatnoUiProject>): void {
        this.mProject = pProject;
        this.mPreviewManager = new PotatnoUiPreviewManager<PotatnoUiProject>(pProject, pDocument);
        this.mActiveFunctionId = '';
        this.mDocument = null;
        this.mHistory.clear();

        this.dispatch(PotatnoCodeUiManagerChangeType.Document, pDocument);
    }

    /**
     * Subscribe to one or more manager events.
     * The callback fires after the manager state is already updated, so consumers can read the fresh state directly.
     *
     * @param pTypes - Event types to listen for.
     * @param pTargets - Potatno document targets for this listener. Threated as reference. Targets can be changed after subscribing.
     * @param pListener - Handler invoked with the change detail.
     *
     * @returns An unsubscribe function removing every registered listener.
     */
    public subscribe(pTypes: PotatnoCodeUiManagerChangeType, pTargets: Set<PotatnoUiManagerChangeEventTarget> | null, pListener: (pEvent: PotatnoUiManagerChangeEvent) => void): () => void {
        const lTargetMatched = (pItem: PotatnoUiManagerChangeEventTarget): boolean => {
            if (!pTargets) {
                return true;
            }

            // Intialize waterfall buffer.
            let lItem: PotatnoUiManagerChangeEventTarget | null = pItem;
            while (lItem !== null) {
                // Check for a existing target. 
                if (pTargets.has(lItem)) {
                    return true;
                }

                // Cascade down from port -> node -> function to check all levels for targets.
                switch (true) {
                    case lItem instanceof PotatnoDocumentPort: {
                        lItem = lItem.node;
                        break;
                    }
                    case lItem instanceof PotatnoDocumentNode: {
                        lItem = lItem.function;
                        break;
                    }
                    case lItem instanceof PotatnoDocumentFunction: {
                        lItem = lItem.document;
                        break;
                    }
                }
            }

            return false;
        };

        // Custom wrapper for scoping the actual event listener.
        const lEventHandler = (pEvent: PotatnoUiManagerChangeEvent): void => {
            // Skip event when handler is not "any" and does not contains the change type.
            if (pTypes !== PotatnoCodeUiManagerChangeType.Any && (pEvent.changeType % pTypes) === 0) {
                return;
            }

            // Skip if no target can be matched.
            if (pTargets !== null && !lTargetMatched(pEvent.item)) {
                return;
            }

            // Not its fine to fire the actual handler.
            pListener(pEvent);
        };

        // Add wrapped callback as listner.
        this.addEventListener(PotatnoUiManagerChangeEvent.EVENT_TYPE, lEventHandler as (pEvent: Event) => void);

        // Return a unsubscribe callback.
        return () => {
            this.removeEventListener(PotatnoUiManagerChangeEvent.EVENT_TYPE, lEventHandler as (pEvent: Event) => void);
        };
    }

    /**
     * Replace the document with a freshly deserialized one.
     *
     * @param pData - Serialized document data.
     */
    public loadCode(pData: PotatnoCodeFileSerializationResult): void {
        const lProject: PotatnoUiProject | null = this.mProject;
        if (!lProject) {
            return;
        }

        const lDocument: PotatnoDocument<PotatnoUiProject> = new PotatnoDeserializer<PotatnoUiProject>(lProject).deserialize(pData);
        this.adoptDocument(lDocument);
    }

    /**
     * Announce a transient, in-place node geometry change (a live drag or resize) so the connection
     * layer can redraw its wires. Carries no history/preview/validation side effects — those are
     * committed separately on pointer-up via {@link commitNodeChange}.
     */
    public transformNode(pNode: PotatnoDocumentNode<PotatnoUiProject>, pTransformation: Partial<PotatnoDocumentNodeTransformation>): void {
        // Build full transformation and override provided data.
        const lTransformation: PotatnoDocumentNodeTransformation = {
            x: pNode.transformation.x,
            y: pNode.transformation.y,
            width: pNode.transformation.width,
            height: pNode.transformation.height,

            // Override with provided data.
            ...pTransformation
        };

        // Move and resize.
        pNode.moveTo(lTransformation.x, lTransformation.y);
        pNode.resizeTo(lTransformation.width, lTransformation.height);

        this.dispatch(PotatnoCodeUiManagerChangeType.NodeTransform, pNode);
    }

    /**
     * Paste clipboard contents into the active function.
     *
     * @param pNodes - The freshly pasted nodes produced by the clipboard.
     */
    public notifyNodesPasted(pNodes: ReadonlyArray<PotatnoDocumentNode<PotatnoUiProject>>): void {
        if (pNodes.length === 0) {
            return;
        }

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.NodeAdd);
    }

    /**
     * Commit an in-place node edit the caller already applied to the document (a move, a resize,
     * or a comment/label change). Records history and notifies listeners. Preview regeneration is
     * opt-in since layout and label edits do not change generated code.
     *
     * @param pAffectsPreview - Whether the edit should also rebuild the preview.
     * @param pNode - The node that changed, when known.
     */
    public commitNodeChange(pAffectsPreview: boolean = false, pNode?: PotatnoDocumentNode<PotatnoUiProject>): void {
        this.scheduleHistorySnapshot();
        if (pAffectsPreview) {
            this.schedulePreviewUpdate();
        }
        this.dispatch(PotatnoCodeUiManagerChangeType.NodeChange, pNode ? { node: pNode } : {});
    }

    /**
     * Resolve and activate the document function a function node points at.
     *
     * @param pNode - The function node whose target function to open.
     */
    public openNodeFunction(pNode: PotatnoDocumentNode<PotatnoUiProject>): void {
        const lDefinitionId: string = pNode.definitionId;
        const lFunctionId: string = lDefinitionId.startsWith('USERFUNCTION_')
            ? lDefinitionId.slice('USERFUNCTION_'.length)
            : lDefinitionId;
        this.setActiveFunction(lFunctionId);
    }

    /**
     * Redo the next history snapshot, if any.
     */
    public redo(): void {
        const lSnapshot: PotatnoCodeFileSerializationResult | null = this.mHistory.redo();
        if (lSnapshot) {
            this.restoreSnapshot(lSnapshot);
        }
    }

    /**
     * Remove a function from the document.
     *
     * @param pFunctionId - Id of the function to remove.
     */
    public removeFunction(pFunctionId: string): void {
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mDocument;
        if (!lDocument) {
            return;
        }

        for (const lFunction of lDocument.functions) {
            if (lFunction.id === pFunctionId) {
                lDocument.removeFunction(lFunction);
                break;
            }
        }

        if (this.mActiveFunctionId === pFunctionId) {
            this.mActiveFunctionId = [...lDocument.functions][0]?.id ?? '';
            this.mPreviewManager?.setActiveFunction(this.activeFunction);
        }

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.FunctionDelete);
        this.dispatch(PotatnoCodeUiManagerChangeType.FunctionActivate);
    }

    /**
     * Remove a set of nodes from the active function.
     *
     * @param pNodes - The nodes to remove.
     *
     * @returns `true` when at least one node was removed.
     */
    public removeNodes(pNodes: Iterable<PotatnoDocumentNode<PotatnoUiProject>>): boolean {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.activeFunction;
        if (!lActiveFunction) {
            return false;
        }

        let lDeleted: boolean = false;
        for (const lNode of [...pNodes]) {
            lActiveFunction.removeNode(lNode);
            lDeleted = true;
        }

        if (!lDeleted) {
            return false;
        }

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.NodeDelete);

        return true;
    }

    /**
     * Activate a function by id.
     *
     * @param pFunctionId - Id of the function to activate.
     */
    public setActiveFunction(pFunctionId: string): void {
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mDocument;
        if (!lDocument || this.mActiveFunctionId === pFunctionId) {
            return;
        }

        for (const lFunction of lDocument.functions) {
            if (lFunction.id === pFunctionId) {
                this.mActiveFunctionId = pFunctionId;
                this.mPreviewManager?.setActiveFunction(lFunction);
                this.schedulePreviewUpdate();
                this.dispatch(PotatnoCodeUiManagerChangeType.FunctionActivate);
                return;
            }
        }
    }

    /**
     * Bind a new document instance (load, set or clear).
     *
     * @param pDocument - The document to bind, or `null` to clear.
     */
    public setDocument(pDocument: PotatnoDocument<PotatnoUiProject> | null): void {
        if (!pDocument) {
            this.mDocument = null;
            this.mActiveFunctionId = '';
            this.mHistory.clear();
            this.mPreviewManager?.setActiveFunction(null);
            this.mPreviewManager?.setDocument(null);
            this.mPreviewTabs = [];
            this.dispatch(PotatnoCodeUiManagerChangeType.DocumentChange);
            return;
        }

        // Seed an empty document with its system entry function so the user always has a graph.
        const lProject: PotatnoUiProject | null = this.mProject;
        if (lProject && pDocument.functions.size === 0) {
            this.initializeMainFunctions(pDocument, lProject);
        }

        this.adoptDocument(pDocument);
    }

    /**
     * Choose which display renders the main preview and rebuild immediately.
     *
     * @param pDisplayId - The chosen display id.
     */
    public setPreviewDisplay(pDisplayId: string): void {
        this.mPreviewManager?.setActivePreviewDisplay(pDisplayId);
        this.rebuildPreviewDrivers();
    }

    /**
     * Set a port's direct value.
     *
     * @param pPort - The value port to set.
     * @param pValues - The new direct value strings.
     */
    public setPortDirectValue(pPort: PotatnoDocumentPort<PotatnoUiProject>, pValues: Array<string>): void {
        pPort.setDirectValue(pValues);

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.NodeChange, { node: pPort.node });
    }

    /**
     * Choose which output port a user function's main preview shows and rebuild immediately.
     *
     * @param pOutputId - The chosen output port label.
     */
    public setPreviewOutput(pOutputId: string): void {
        this.mPreviewManager?.setActivePreviewOutput(pOutputId);
        this.rebuildPreviewDrivers();
    }

    /**
     * Set a node's inline preview opt-in (or clear it). Re-selecting the active port turns the
     * preview off; an empty port id explicitly clears it.
     *
     * @param pNode - The node whose preview to change.
     * @param pPortId - The value output port id to preview, or `''` to clear.
     */
    public setNodePreview(pNode: PotatnoDocumentNode<PotatnoUiProject>, pPortId: string): void {
        if (pPortId === '' || pNode.preview?.portId === pPortId) {
            pNode.preview = null;
        } else {
            const lDisplays: Array<string> = this.getPreviewDisplaysForNode(pNode);
            const lDisplayId: string | undefined = (pNode.preview && lDisplays.includes(pNode.preview.displayId))
                ? pNode.preview.displayId
                : lDisplays[0];
            if (!lDisplayId) {
                return;
            }
            pNode.preview = { portId: pPortId, displayId: lDisplayId };
        }

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.NodeChange, { node: pNode });
    }

    /**
     * Change the display ("style") of a node's active inline preview.
     *
     * @param pNode - The node whose preview display to change.
     * @param pDisplayId - The chosen display id.
     */
    public setNodePreviewDisplay(pNode: PotatnoDocumentNode<PotatnoUiProject>, pDisplayId: string): void {
        if (!pNode.preview) {
            return;
        }

        pNode.preview = { portId: pNode.preview.portId, displayId: pDisplayId };

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.NodeChange, { node: pNode });
    }

    /**
     * Drive one preview render tick. Forwarded by the application loop.
     *
     * @returns A promise resolving once the render pass finishes.
     */
    public triggerPreviewUpdate(): Promise<void> {
        // Suppress preview generation while the document has validation errors. Drivers are
        // pull-model — code only executes when their `render()` is called from here — so passing
        // the error flag down is what actually keeps work from running, not just hidden:
        //  - The main (function-level) preview is skipped entirely: `render(true)` drops the
        //    function descriptors, so its compiled callable is never invoked. It is not shown
        //    during errors (only the error list is), so nothing should run for it in the background.
        //  - Per-node previews keep rendering their last cached callable (`allowCompile: false`),
        //    so a value already computed before the error still shows, but no fresh — failing —
        //    generation is triggered.
        const lHasValidationErrors: boolean = this.mErrorList.length > 0;
        return this.mPreviewManager?.render(lHasValidationErrors) ?? Promise.resolve();
    }

    /**
     * Undo the previous history snapshot, if any.
     */
    public undo(): void {
        const lSnapshot: PotatnoCodeFileSerializationResult | null = this.mHistory.undo();
        if (lSnapshot) {
            this.restoreSnapshot(lSnapshot);
        }
    }

    /**
     * Apply right-panel property changes to the active function.
     *
     * @param pData - The changed function properties.
     */
    public updateFunctionProperties(pData: PotatnoCodeUiManagerPropertiesChange): void {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        if (pData.name !== undefined) {
            lActiveFunction.label = pData.name;
        }

        if (pData.inputs !== undefined) {
            // Rebuild the input list from the panel's desired state so renames and type changes
            // apply, not just additions and removals. Entry/exit node ports resync during validation.
            for (const lPort of [...lActiveFunction.inputs]) {
                lActiveFunction.removeInput(lPort);
            }
            for (const lPortData of pData.inputs) {
                lActiveFunction.addInput({ dataType: lPortData.type, label: lPortData.name });
            }
        }

        if (pData.outputs !== undefined) {
            for (const lPort of [...lActiveFunction.outputs]) {
                lActiveFunction.removeOutput(lPort);
            }
            for (const lPortData of pData.outputs) {
                lActiveFunction.addOutput({ dataType: lPortData.type, label: lPortData.name });
            }
        }

        if (pData.imports !== undefined) {
            const lExistingImports: Set<string> = new Set<string>(lActiveFunction.imports);
            const lNewImports: Set<string> = new Set<string>(pData.imports);
            for (const lImport of [...lActiveFunction.imports]) {
                if (!lNewImports.has(lImport)) {
                    lActiveFunction.removeImport(lImport);
                }
            }
            for (const lImport of pData.imports) {
                if (!lExistingImports.has(lImport)) {
                    lActiveFunction.addImport(lImport);
                }
            }
        }

        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.FunctionChange);
    }

    /**
     * Take ownership of a document instance, point the preview manager at it, validate and notify.
     *
     * @param pDocument - The document to adopt.
     */
    private adoptDocument(pDocument: PotatnoDocument<PotatnoUiProject>): void {
        this.mDocument = pDocument;
        this.mActiveFunctionId = [...pDocument.functions][0]?.id ?? '';
        this.mHistory.clear();
        this.mPreviewManager?.setActiveFunction(this.activeFunction);

        // Push the initial snapshot so the first edit is undoable.
        this.pushHistorySnapshot();
        this.rebuildPreviewDrivers();
        this.dispatch(PotatnoCodeUiManagerChangeType.DocumentChange);
    }

    /**
     * Build a document function from a definition, placing its default entry/exit nodes and
     * enabling project imports when the definition declares them.
     *
     * @param pDocument - Document the function belongs to.
     * @param pProject - Project that owns the definition and imports.
     * @param pDefinition - The function definition to instantiate.
     * @param pParameter - Identity/metadata for the new function instance.
     *
     * @returns The populated function instance, not yet added to the document.
     */
    private createDocumentFunction(pDocument: PotatnoDocument<PotatnoUiProject>, pProject: PotatnoUiProject, pDefinition: PotatnoFunctionDefinition<PotatnoUiProject>, pParameter: PotatnoDocumentFunctionConstructorParameter): PotatnoDocumentFunction<PotatnoUiProject> {
        const lFunction: PotatnoDocumentFunction<PotatnoUiProject> = new PotatnoDocumentFunction(pProject, pDocument, pParameter);

        // Place the default entry/exit nodes. Entry nodes stack down from 0,0; exit nodes from 40,0.
        const lFunctionNodes: PotatnoFunctionDefinitionNodes<PotatnoUiProject> = pDefinition.getNodeDefinitions(lFunction);
        lFunctionNodes.entry.forEach((pNodeDefinition, pIndex) => {
            lFunction.addNodeByDefinition(pNodeDefinition, { height: 4, width: 10, x: 0, y: pIndex * 20 });
        });
        lFunctionNodes.exit.forEach((pNodeDefinition, pIndex) => {
            lFunction.addNodeByDefinition(pNodeDefinition, { height: 4, width: 10, x: 40, y: pIndex * 20 });
        });

        // Enable every project import when the definition opts into imports.
        if ((pDefinition.statics & PotatnoFunctionDefinitionStatics.imports) !== 0) {
            for (const lImport of pProject.imports) {
                lFunction.addImport(lImport.label);
            }
        }

        return lFunction;
    }

    /**
     * Dispatch a manager event with an optional detail payload.
     *
     * @param pType - Event type to dispatch.
     * @param pDetail - Optional change detail.
     */
    private dispatch(pType: PotatnoCodeUiManagerChangeType, pItem: PotatnoUiManagerChangeEventTarget): void {
        // Create and dispatch custom change event.
        this.dispatchEvent(new PotatnoUiManagerChangeEvent(pType, pItem));
    }

    /**
     * Create the system entry function for a new empty document.
     *
     * @param pDocument - Document receiving the entry function.
     * @param pProject - Project that owns the entry point definition.
     */
    private initializeMainFunctions(pDocument: PotatnoDocument<PotatnoUiProject>, pProject: PotatnoUiProject): void {
        const lEntryPoint: PotatnoFunctionDefinition<PotatnoUiProject> | undefined = pProject.entryPoint;
        if (!lEntryPoint) {
            return;
        }

        const lFunction: PotatnoDocumentFunction<PotatnoUiProject> = this.createDocumentFunction(pDocument, pProject, lEntryPoint, {
            definitionId: lEntryPoint.id,
            id: crypto.randomUUID(),
            isSystem: true,
            label: 'Main'
        });

        pDocument.addFunction(lFunction);
    }

    /**
     * Push the current document snapshot into history.
     */
    private pushHistorySnapshot(): void {
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mDocument;
        if (!lDocument) {
            return;
        }

        this.mHistory.push(new PotatnoSerializer<PotatnoUiProject>().serialize(lDocument));
    }

    /**
     * Rebuild every preview driver from the latest document state and republish the tab list.
     * Skipped while the document has validation errors (a rebuild would re-run — and fail — the
     * generator), leaving the existing drivers in place so per-node previews keep their last value.
     */
    private rebuildPreviewDrivers(): void {
        const lManager: PotatnoUiPreviewManager<PotatnoUiProject> | null = this.mPreviewManager;
        if (!lManager) {
            this.mPreviewTabs = [];
            return;
        }

        if (this.mErrorList.length > 0) {
            return;
        }

        try {
            lManager.setActiveFunction(this.activeFunction);
            lManager.setDocument(this.mDocument);
        } catch (pError) {
            console.error('[PotatnoCodeUiManager] Preview manager rebuild failed:', pError);
            this.mPreviewTabs = [];
            this.dispatch(PotatnoCodeUiManagerChangeType.PreviewChange);
            return;
        }

        const lTabs: Array<PotatnoPreviewTabDescriptor> = [];
        for (const lDescriptor of lManager.functionDescriptors) {
            if (!lDescriptor.element) {
                continue;
            }
            lTabs.push({ id: lDescriptor.displayId, label: lDescriptor.label, element: lDescriptor.element });
        }

        this.mPreviewTabs = lTabs;
        this.dispatch(PotatnoCodeUiManagerChangeType.PreviewChange);
    }

    /**
     * Restore a serialized snapshot into the editor without clearing history.
     *
     * @param pSnapshot - Snapshot to deserialize and display.
     */
    private restoreSnapshot(pSnapshot: PotatnoCodeFileSerializationResult): void {
        const lProject: PotatnoUiProject | null = this.mProject;
        if (!lProject) {
            return;
        }

        this.mDocument = new PotatnoDeserializer<PotatnoUiProject>(lProject).deserialize(pSnapshot);

        if (![...this.mDocument.functions].some((pFunction) => pFunction.id === this.mActiveFunctionId)) {
            this.mActiveFunctionId = [...this.mDocument.functions][0]?.id ?? '';
        }

        this.mPreviewManager?.setActiveFunction(this.activeFunction);
        this.schedulePreviewUpdate();
        this.dispatch(PotatnoCodeUiManagerChangeType.DocumentChange);
    }

    /**
     * Schedule a debounced history snapshot, collapsing rapid edits into one snapshot.
     */
    private scheduleHistorySnapshot(): void {
        if (this.mHistoryDebounceTimer !== null) {
            clearTimeout(this.mHistoryDebounceTimer);
        }

        this.mHistoryDebounceTimer = globalThis.setTimeout(() => {
            this.mHistoryDebounceTimer = null;
            this.pushHistorySnapshot();
        }, 500) as unknown as number;
    }

    /**
     * Schedule a debounced preview driver rebuild, collapsing rapid mutations into one rebuild.
     */
    private schedulePreviewUpdate(): void {
        if (this.mPreviewDebounceTimer !== null) {
            clearTimeout(this.mPreviewDebounceTimer);
        }

        this.mPreviewDebounceTimer = globalThis.setTimeout(() => {
            this.mPreviewDebounceTimer = null;
            this.rebuildPreviewDrivers();
        }, 50) as unknown as number;
    }
}

/**
 * Event types fired by {@link PotatnoUiManager}.
 */
export const PotatnoCodeUiManagerChangeType = {
    Any: 0,
    Connection: 1,
    Document: 2,
    Function: 4,
    Node: 8,
    NodeTransform: 16
} as const;
export type PotatnoCodeUiManagerChangeType = typeof PotatnoCodeUiManagerChangeType[keyof typeof PotatnoCodeUiManagerChangeType];

/**
 * Custom change event dispatched by the {@link PotatnoUiManager}
 */
class PotatnoUiManagerChangeEvent extends Event {
    public static readonly EVENT_TYPE: string = 'PotatnoUiManagerChangeEvent';

    private readonly mChangeType: PotatnoCodeUiManagerChangeType;
    private readonly mEventItem: PotatnoUiManagerChangeEventTarget;

    /**
     * The event type that produced this event.
     */
    public get changeType(): PotatnoCodeUiManagerChangeType {
        return this.mChangeType;
    }

    /**
     * The potatno document item the event refers to.
     */
    public get item(): PotatnoUiManagerChangeEventTarget {
        return this.mEventItem;
    }

    public constructor(pChangeType: PotatnoCodeUiManagerChangeType, pEventItem: PotatnoUiManagerChangeEventTarget) {
        super(PotatnoUiManagerChangeEvent.EVENT_TYPE);

        this.mChangeType = pChangeType;
        this.mEventItem = pEventItem;
    }
}

export type PotatnoUiManagerChangeEventTarget = IPotatnoDocumentItem<PotatnoUiProject> | PotatnoDocument<PotatnoUiProject>;

/**
 * A function port descriptor for the properties panel.
 */
export type PotatnoCodeUiManagerPortView = {
    name: string;
    type: string;
};

/**
 * Property changes applied to the active function.
 */
export type PotatnoCodeUiManagerPropertiesChange = {
    imports?: Array<string>;
    inputs?: Array<PotatnoCodeUiManagerPortView>;
    name?: string;
    outputs?: Array<PotatnoCodeUiManagerPortView>;
};
