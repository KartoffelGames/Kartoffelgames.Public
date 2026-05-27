import { ComponentState, PwbChild, PwbComponent, PwbExport, type ComponentEvent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoDocument } from '../../../document/potatno-document.ts';
import { PotatnoFunctionDefinitionNodes, PotatnoFunctionDefinitionStatics } from '../../../project/potatno-function-definition.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoDeserializer } from '../../../serialization/potatno-deserializer.ts';
import type { PotatnoCodeFileSerializationResult } from '../../../serialization/potatno-serialization.type.ts';
import { PotatnoSerializer } from '../../../serialization/potatno-serializer.ts';
import { PotatnoHistory } from '../../potatno-history.ts';
import type { PotatnoUiProject } from '../../potatno-node-definition-list.ts';
import { PotatnoUiPreviewManager } from '../../potatno-ui-preview-manager.ts';
import type { PotatnoPreviewTabDescriptor } from '../potatno_preview/potatno-preview.ts';
import type { GraphChangeDetail, OpenFunctionRequestDetail } from '../potatno_node_graph/potatno-node-graph.ts';
import editorCss from './potatno-code-editor.css' with { type: 'text' };
import editorTemplate from './potatno-code-editor.html' with { type: 'text' };

// Import child components to ensure they are registered.
import '../potatno_function_list/potatno-function-list.ts';
import '../potatno_node_graph/potatno-node-graph.ts';
import '../potatno_node_library/potatno-node-library.ts';
import '../potatno_panel_left/potatno-panel-left.ts';
import '../potatno_panel_properties/potatno-panel-properties.ts';
import '../potatno_preview/potatno-preview.ts';
import '../potatno_resize_handle/potatno-resize-handle.ts';
import '../potatno_search_input/potatno-search-input.ts';
import '../potatno_tabs/potatno-tabs.ts';

/**
 * Top-level UI orchestrator for the potatno-code visual programming environment.
 */
@PwbComponent({
    selector: 'potatno-code-editor',
    template: editorTemplate,
    style: editorCss,
})
export class PotatnoCodeEditor<TProject extends PotatnoUiProject> implements IComponentOnDeconstruct {
    private readonly mHistory: PotatnoHistory;
    private mActiveFunctionId: string = '';
    private mFile: PotatnoDocument<TProject> | undefined;
    private mHistoryDebounceTimer: number | null;
    private mPreviewDebounceTimer: number | null;
    private mPreviewManager: PotatnoUiPreviewManager<TProject> | null;
    private mProject: TProject | undefined;
    private mResizeMoveHandler: ((pEvent: PointerEvent) => void) | null;
    private mResizeState: { panel: 'left' | 'right'; startX: number; startWidth: number; } | null;
    private mResizeUpHandler: (() => void) | null;

    /**
     * Cached data for panels and preview chrome.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mCachedData: CachedViewData<TProject>;

    /**
     * Tab descriptors handed to the preview panel. Rebuilt from the preview manager on each
     * cache invalidation so the panel sees a fresh list whenever drivers come or go.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mPreviewTabs: ReadonlyArray<PotatnoPreviewTabDescriptor> = [];

    /**
     * Explicit graph refresh token for non-graph document edits.
     */
    @ComponentState.state()
    private accessor mGraphRefreshVersion: number = 0;

    /**
     * Explicit node-library refresh token.
     */
    @ComponentState.state()
    private accessor mNodeLibraryRefreshVersion: number = 0;

    /**
     * Explicit preview visual refresh token. Bumped after every manager rebuild so the
     * node-graph re-fetches its per-node preview elements from the manager.
     */
    @ComponentState.state()
    private accessor mPreviewUpdateVersion: number = 0;

    /**
     * Left panel DOM element used for resizing.
     */
    @PwbChild('panelLeft')
    public accessor panelLeft!: HTMLElement;

    /**
     * Right panel DOM element used for resizing.
     */
    @PwbChild('panelRight')
    public accessor panelRight!: HTMLElement;

    /**
     * Resolve the currently active document function by id.
     */
    public get activeFunction(): PotatnoDocumentFunction<TProject> | null {
        const lFile: PotatnoDocument<TProject> | undefined = this.mFile;
        if (!lFile) {
            return null;
        }

        for (const lFunction of lFile.functions) {
            if (lFunction.id === this.mActiveFunctionId) {
                return lFunction;
            }
        }

        return null;
    }

    /**
     * Active function id used by the function list.
     */
    public get activeFunctionId(): string {
        return this.mActiveFunctionId;
    }

    /**
     * Current function name shown in the right panel.
     */
    public get activeFunctionName(): string {
        return this.mCachedData.activeFunctionName;
    }

    /**
     * Current function inputs shown in the right panel.
     */
    public get activeFunctionInputs(): Array<{ name: string; type: string; }> {
        return this.mCachedData.activeFunctionInputs;
    }

    /**
     * Current function outputs shown in the right panel.
     */
    public get activeFunctionOutputs(): Array<{ name: string; type: string; }> {
        return this.mCachedData.activeFunctionOutputs;
    }

    /**
     * Current enabled imports shown in the right panel.
     */
    public get activeFunctionImports(): Array<string> {
        return this.mCachedData.activeFunctionImports;
    }

    /**
     * Whether the active function is system-owned.
     */
    public get activeFunctionIsSystem(): boolean {
        return this.mCachedData.activeFunctionIsSystem;
    }

    /**
     * Whether active function structure can be edited by the user.
     */
    public get activeFunctionEditableByUser(): boolean {
        return this.mCachedData.activeFunctionEditableByUser;
    }

    /**
     * Available import names for the right panel.
     */
    public get availableImportsList(): Array<string> {
        return this.mCachedData.availableImports;
    }

    /**
     * Available type names for the right panel.
     */
    public get availableTypes(): Array<string> {
        return this.mCachedData.availableTypes;
    }

    /**
     * Current validation errors for the preview panel.
     */
    public get editorErrors(): Array<{ message: string; location: string; }> {
        return this.mCachedData.errors;
    }

    /**
     * Node error set derived from document validation, passed to the graph for highlighting.
     */
    public get graphErrorNodes(): ReadonlySet<PotatnoDocumentNode<TProject>> {
        return this.mCachedData.graphErrorNodes;
    }

    /**
     * Port error set derived from document validation, passed to the graph for highlighting.
     */
    public get graphErrorPorts(): ReadonlySet<PotatnoDocumentPort<TProject>> {
        return this.mCachedData.graphErrorPorts;
    }

    /**
     * Function entries shown in the left panel.
     */
    public get functionList(): Array<{ id: string; name: string; label: string; system: boolean; }> {
        return this.mCachedData.functionList;
    }

    /**
     * Graph refresh token passed into the graph component.
     */
    public get graphRefreshVersion(): number {
        return this.mGraphRefreshVersion;
    }

    /**
     * Whether the preview panel should be shown.
     */
    public get hasPreview(): boolean {
        return this.mCachedData.hasPreview;
    }

    /**
     * Tab descriptors handed to the preview panel.
     */
    public get previewTabs(): ReadonlyArray<PotatnoPreviewTabDescriptor> {
        return this.mPreviewTabs;
    }

    /**
     * Preview manager passed down to child components so the node-graph can resolve per-node
     * preview elements without owning the driver lifecycle itself.
     */
    public get previewManager(): PotatnoUiPreviewManager<TProject> | null {
        return this.mPreviewManager;
    }

    /**
     * Node library refresh token passed into the left panel.
     */
    public get nodeLibraryRefreshVersion(): number {
        return this.mNodeLibraryRefreshVersion;
    }

    /**
     * Preview visual refresh token passed into the graph component.
     */
    public get previewUpdateVersion(): number {
        return this.mPreviewUpdateVersion;
    }

    /**
     * User function definitions available for creation.
     */
    public get userFunctionDefinitions(): Array<{ id: string; }> {
        const lProject: TProject | undefined = this.mProject;
        if (!lProject) {
            return [];
        }

        return [...lProject.userFunctions.values()].map((pDefinition) => ({ id: pDefinition.id }));
    }

    /**
     * Current document state.
     */
    public get file(): PotatnoDocument<TProject> | null {
        return this.mFile ?? null;
    }

    /**
     * Create a new editor orchestrator.
     */
    public constructor() {
        this.mCachedData = this.createEmptyCachedData();
        this.mHistory = new PotatnoHistory();
        this.mHistoryDebounceTimer = null;
        this.mPreviewDebounceTimer = null;
        this.mPreviewManager = null;
        this.mResizeMoveHandler = null;
        this.mResizeState = null;
        this.mResizeUpHandler = null;
    }

    /**
     * Project configuration backing the editor.
     */
    @PwbExport
    public set project(pProject: TProject) {
        this.mProject = pProject;
        this.mPreviewManager = new PotatnoUiPreviewManager<TProject>(pProject);
        this.rebuildCachedData();
        this.refreshNodeLibrary();
    }

    /**
     * Document state backing the editor.
     */
    @PwbExport
    public set file(pFile: PotatnoDocument<TProject> | null) {
        if (pFile) {
            this.mFile = pFile;
            const lProject: TProject | undefined = this.mProject;
            if (lProject && pFile.functions.size === 0) {
                this.initializeMainFunctions(pFile, lProject);
            }
            this.mActiveFunctionId = [...pFile.functions][0]?.id ?? '';
        } else {
            this.mFile = undefined;
            this.mActiveFunctionId = '';
        }

        this.mHistory.clear();
        this.rebuildCachedData();
        this.refreshGraph();
        this.refreshNodeLibrary();
        this.schedulePreviewUpdate();
    }

    /**
     * Load serialized code into a new document.
     *
     * @param pData - Serialized Potatno document data.
     */
    @PwbExport
    public loadCode(pData: PotatnoCodeFileSerializationResult): void {
        const lProject: TProject | undefined = this.mProject;
        if (!lProject) {
            return;
        }

        const lDeserializer: PotatnoDeserializer<TProject> = new PotatnoDeserializer(lProject);
        const lNewFile: PotatnoDocument<TProject> = lDeserializer.deserialize(pData);
        this.mFile = lNewFile;
        this.mActiveFunctionId = [...lNewFile.functions][0]?.id ?? '';
        this.mHistory.clear();
        this.rebuildCachedData();
        this.refreshGraph();
        this.refreshNodeLibrary();
        this.schedulePreviewUpdate();
    }

    /**
     * Generate serializable code from the current document.
     *
     * @returns Serialized Potatno document data, or null without a document.
     */
    @PwbExport
    public generateCode(): PotatnoCodeFileSerializationResult | null {
        const lFile: PotatnoDocument<TProject> | undefined = this.mFile;
        if (!lFile) {
            return null;
        }

        const lSerializer: PotatnoSerializer<TProject> = new PotatnoSerializer<TProject>();
        return lSerializer.serialize(lFile);
    }

    /**
     * Drive one preview tick. Called by the application's render loop; forwards to the
     * preview manager which fans out to every active driver.
     */
    @PwbExport
    public triggerPreviewUpdate(): void {
        // Fire-and-forget — driver errors are isolated inside the manager so any individual
        // failure does not break the loop.
        void this.mPreviewManager?.render();
    }

    /**
     * Clear timers and panel resize listeners.
     */
    public onDeconstruct(): void {
        if (this.mHistoryDebounceTimer !== null) {
            clearTimeout(this.mHistoryDebounceTimer);
            this.mHistoryDebounceTimer = null;
        }

        if (this.mPreviewDebounceTimer !== null) {
            clearTimeout(this.mPreviewDebounceTimer);
            this.mPreviewDebounceTimer = null;
        }

        this.stopPanelResize();
    }

    /**
     * Select an active function from the left function list.
     *
     * @param pEvent - Component event containing the function id.
     */
    public onFunctionSelect(pEvent: ComponentEvent<string>): void {
        this.activateFunction(pEvent.value);
    }

    /**
     * Add a new function from a user function definition.
     *
     * @param pEvent - Component event containing the function definition id.
     */
    public onFunctionAdd(pEvent: ComponentEvent<string>): void {
        const lDefinitionId: string = pEvent.value;
        const lFile: PotatnoDocument<TProject> | undefined = this.mFile;
        const lProject: TProject | undefined = this.mProject;
        if (!lFile || !lProject) {
            return;
        }

        const lFunctionDefinition = lProject.userFunctions.get(lDefinitionId);
        if (!lFunctionDefinition) {
            return;
        }

        const lFunction: PotatnoDocumentFunction<TProject> = new PotatnoDocumentFunction(lProject, lFile, {
            definitionId: lFunctionDefinition.id,
            id: crypto.randomUUID(),
            isSystem: false,
            label: `Function ${lFile.functions.size}`
        });

        if ((lFunctionDefinition.statics & PotatnoFunctionDefinitionStatics.imports) !== 0) {
            for (const lImport of lProject.imports) {
                lFunction.addImport(lImport.label);
            }
        }

        lFile.addFunction(lFunction);
        this.mActiveFunctionId = lFunction.id;
        this.scheduleHistorySnapshot();
        this.rebuildCachedData();
        this.refreshGraph();
        this.refreshNodeLibrary();
    }

    /**
     * Delete a function from the document.
     *
     * @param pEvent - Component event containing the function id.
     */
    public onFunctionDelete(pEvent: ComponentEvent<string>): void {
        const lFunctionId: string = pEvent.value;
        const lFile: PotatnoDocument<TProject> | undefined = this.mFile;
        if (!lFile) {
            return;
        }

        for (const lFunction of lFile.functions) {
            if (lFunction.id === lFunctionId) {
                lFile.removeFunction(lFunction);
                break;
            }
        }

        if (this.mActiveFunctionId === lFunctionId) {
            this.mActiveFunctionId = [...lFile.functions][0]?.id ?? '';
        }

        this.scheduleHistorySnapshot();
        this.rebuildCachedData();
        this.refreshGraph();
        this.refreshNodeLibrary();
        this.schedulePreviewUpdate();
    }

    /**
     * Apply right-panel function property changes.
     *
     * @param pEvent - Component event containing changed function data.
     */
    public onPropertiesChange(pEvent: ComponentEvent<PropertiesChangeData>): void {
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        const lData: PropertiesChangeData = pEvent.value;
        let lLibraryChanged: boolean = false;

        if (lData.name !== undefined) {
            lActiveFunction.label = lData.name;
        }

        if (lData.inputs !== undefined) {
            const lExistingNames: Set<string> = new Set<string>(lActiveFunction.inputs.map((pPort) => pPort.label));
            const lNewNames: Set<string> = new Set<string>(lData.inputs.map((pPort) => pPort.name));
            for (const lPort of [...lActiveFunction.inputs]) {
                if (!lNewNames.has(lPort.label)) {
                    lActiveFunction.removeInput(lPort);
                }
            }

            for (const lPortData of lData.inputs) {
                if (!lExistingNames.has(lPortData.name)) {
                    lActiveFunction.addInput({ dataType: lPortData.type, label: lPortData.name });
                }
            }
            lLibraryChanged = true;
        }

        if (lData.outputs !== undefined) {
            const lExistingNames: Set<string> = new Set<string>(lActiveFunction.outputs.map((pPort) => pPort.label));
            const lNewNames: Set<string> = new Set<string>(lData.outputs.map((pPort) => pPort.name));
            for (const lPort of [...lActiveFunction.outputs]) {
                if (!lNewNames.has(lPort.label)) {
                    lActiveFunction.removeOutput(lPort);
                }
            }

            for (const lPortData of lData.outputs) {
                if (!lExistingNames.has(lPortData.name)) {
                    lActiveFunction.addOutput({ dataType: lPortData.type, label: lPortData.name });
                }
            }
            lLibraryChanged = true;
        }

        if (lData.imports !== undefined) {
            const lExistingImports: Set<string> = new Set<string>(lActiveFunction.imports);
            const lNewImports: Set<string> = new Set<string>(lData.imports);
            for (const lImport of [...lActiveFunction.imports]) {
                if (!lNewImports.has(lImport)) {
                    lActiveFunction.removeImport(lImport);
                }
            }

            for (const lImport of lData.imports) {
                if (!lExistingImports.has(lImport)) {
                    lActiveFunction.addImport(lImport);
                }
            }
            lLibraryChanged = true;
        }

        this.scheduleHistorySnapshot();
        this.rebuildCachedData();
        this.refreshGraph();
        if (lLibraryChanged) {
            this.refreshNodeLibrary();
        }
        this.schedulePreviewUpdate();
    }

    /**
     * React to mutations owned by the node graph component.
     *
     * @param pEvent - Graph change event.
     */
    public onGraphChange(pEvent: ComponentEvent<GraphChangeDetail>): void {
        this.scheduleHistorySnapshot();
        this.rebuildCachedData();

        if (pEvent.value.affectsLibrary) {
            this.refreshNodeLibrary();
        }

        if (pEvent.value.affectsPreview) {
            this.schedulePreviewUpdate();
        }
    }

    /**
     * Open a function requested by the node graph.
     *
     * @param pEvent - Graph open-function request event.
     */
    public onGraphOpenFunction(pEvent: ComponentEvent<OpenFunctionRequestDetail>): void {
        this.activateFunction(pEvent.value.functionId);
    }

    /**
     * Restore the previous document snapshot.
     *
     * @param _pEvent - Unused graph undo event.
     */
    public onGraphUndoRequest(_pEvent: ComponentEvent<void>): void {
        const lSnapshot: PotatnoCodeFileSerializationResult | null = this.mHistory.undo();
        if (lSnapshot) {
            this.restoreSnapshot(lSnapshot);
        }
    }

    /**
     * Restore the next document snapshot.
     *
     * @param _pEvent - Unused graph redo event.
     */
    public onGraphRedoRequest(_pEvent: ComponentEvent<void>): void {
        const lSnapshot: PotatnoCodeFileSerializationResult | null = this.mHistory.redo();
        if (lSnapshot) {
            this.restoreSnapshot(lSnapshot);
        }
    }

    /**
     * Start resizing the left panel.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public onResizeLeftStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('left', pEvent);
    }

    /**
     * Start resizing the right panel.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public onResizeRightStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('right', pEvent);
    }

    /**
     * Activate a function by id and refresh function-owned UI slices.
     *
     * @param pFunctionId - Function id to activate.
     */
    private activateFunction(pFunctionId: string): void {
        const lFile: PotatnoDocument<TProject> | undefined = this.mFile;
        if (!lFile) {
            return;
        }

        for (const lFunction of lFile.functions) {
            if (lFunction.id === pFunctionId) {
                this.mActiveFunctionId = pFunctionId;
                this.rebuildCachedData();
                this.refreshGraph();
                this.refreshNodeLibrary();
                return;
            }
        }
    }

    /**
     * Create an empty cached data object.
     *
     * @returns Empty cached view data.
     */
    private createEmptyCachedData(): CachedViewData<TProject> {
        return {
            activeFunctionEditableByUser: false,
            activeFunctionId: '',
            activeFunctionImports: [],
            activeFunctionInputs: [],
            activeFunctionIsSystem: false,
            activeFunctionName: '',
            activeFunctionOutputs: [],
            availableImports: [],
            availableTypes: [],
            errors: [],
            functionList: [],
            graphErrorNodes: new Set<PotatnoDocumentNode<TProject>>(),
            graphErrorPorts: new Set<PotatnoDocumentPort<TProject>>(),
            hasPreview: false
        };
    }

    /**
     * Determine whether the preview panel should be shown. True when the project's preview
     * registry has at least one `(display, executor)` pair bound to the entry-point function;
     * the panel is suppressed entirely when the registry is empty so the layout reclaims the
     * space for the node graph.
     *
     * @returns Whether to render the preview panel.
     */
    private computeHasPreview(): boolean {
        const lProject: TProject | undefined = this.mProject;
        if (!lProject) {
            return false;
        }

        const lRegistry = lProject.previews;
        if (!lRegistry) {
            return false;
        }

        const lEntryPointId: string = lProject.entryPoint.id;
        for (const lEntry of lRegistry.entries) {
            if (lEntry.executorFunctionId === lEntryPointId) {
                return true;
            }
        }

        return false;
    }

    /**
     * Rebuild every preview driver from the latest document state and re-publish the tab
     * descriptor list to the preview panel.
     *
     * Called from the debounced preview signal whenever a mutation invalidates the previous
     * code-gen output (graph edits with `affectsPreview`, document loads, etc.). Errors are
     * caught so a broken graph keeps the editor usable; failed previews simply disappear from
     * the tab strip until the underlying mutation is fixed.
     */
    private rebuildPreviewDrivers(): void {
        const lManager: PotatnoUiPreviewManager<TProject> | null = this.mPreviewManager;
        if (!lManager) {
            this.mPreviewTabs = [];
            return;
        }

        try {
            lManager.setDocument(this.mFile ?? null);
        } catch (pError) {
            console.error('[Editor] Preview manager rebuild failed:', pError);
            this.mPreviewTabs = [];
            return;
        }

        // Map descriptors with a non-null element into the preview-panel tab contract. Drop
        // any descriptor whose display returned a non-HTMLElement — the tabbed panel only
        // hosts DOM-attachable previews.
        const lTabs: Array<PotatnoPreviewTabDescriptor> = [];
        for (const lDescriptor of lManager.functionDescriptors) {
            if (!lDescriptor.element) {
                continue;
            }
            lTabs.push({ id: lDescriptor.displayId, label: lDescriptor.label, element: lDescriptor.element });
        }

        this.mPreviewTabs = lTabs;
        this.mPreviewUpdateVersion++;
    }

    /**
     * Get all node definitions available to a function.
     *
     * @param pFunction - Function whose available definitions should be read.
     *
     * @returns Available node definitions in display order.
     */
    private getAvailableDefinitionsForFunction(pFunction: PotatnoDocumentFunction<TProject>): Array<PotatnoNodeDefinition<TProject>> {
        const lDefinitions: Array<PotatnoNodeDefinition<TProject>> = [];
        const lAddedIds: Set<string> = new Set<string>();

        const addDefinition = (pDefinition: PotatnoNodeDefinition<TProject>): void => {
            if (lAddedIds.has(pDefinition.id)) {
                return;
            }

            lAddedIds.add(pDefinition.id);
            lDefinitions.push(pDefinition);
        };

        for (const lDefinition of pFunction.project.nodeDefinitions) {
            addDefinition(lDefinition);
        }

        for (const lDefinition of pFunction.nodeDefinitions) {
            addDefinition(lDefinition);
        }

        const lEnabledImports: Set<string> = new Set<string>(pFunction.imports);
        for (const lImport of pFunction.project.imports) {
            if (!lEnabledImports.has(lImport.label)) {
                continue;
            }

            for (const lDefinition of lImport.nodes) {
                addDefinition(lDefinition);
            }
        }

        return lDefinitions;
    }

    /**
     * Create the system entry function for a new empty document.
     *
     * @param pFile - Document receiving the entry function.
     * @param pProject - Project that owns the entry point definition.
     */
    private initializeMainFunctions(pFile: PotatnoDocument<TProject>, pProject: TProject): void {
        const lEntryPoint = pProject.entryPoint;
        if (!lEntryPoint) {
            return;
        }

        const lFunction: PotatnoDocumentFunction<TProject> = new PotatnoDocumentFunction(pProject, pFile, {
            definitionId: lEntryPoint.id,
            id: crypto.randomUUID(),
            isSystem: true,
            label: 'Main'
        });

        const lFunctionNodes: PotatnoFunctionDefinitionNodes<TProject> = lEntryPoint.getNodeDefinitions(lFunction);

        // Create entry nodes. Stack them vertically staring at 0,0 position with with 20 height units between them. 
        lFunctionNodes.entry.forEach((pStaticDefinition, pIndex) => {
            lFunction.newNode(pStaticDefinition, { height: 4, width: 10, x: 0, y: pIndex * 20 }, true);
        });

        // Create exit nodes. Stack them vertically starting at 40,0 position with with 20 height units between them.
        lFunctionNodes.exit.forEach((pStaticDefinition, pIndex) => {
            lFunction.newNode(pStaticDefinition, { height: 4, width: 10, x: 40, y: pIndex * 20 }, true);
        });

        if ((lEntryPoint.statics & PotatnoFunctionDefinitionStatics.imports) !== 0) {
            for (const lImport of pProject.imports) {
                lFunction.addImport(lImport.label);
            }
        }

        pFile.addFunction(lFunction);
    }

    /**
     * Push the current document snapshot into history.
     */
    private pushHistorySnapshot(): void {
        const lFile: PotatnoDocument<TProject> | undefined = this.mFile;
        if (!lFile) {
            return;
        }

        const lSerializer: PotatnoSerializer<TProject> = new PotatnoSerializer<TProject>();
        this.mHistory.push(lSerializer.serialize(lFile));
    }

    /**
     * Rebuild cached panel and preview data from the current project and document.
     */
    private rebuildCachedData(): void {
        const lProject: TProject | undefined = this.mProject;
        const lFile: PotatnoDocument<TProject> | undefined = this.mFile;
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.activeFunction;
        const lCached: CachedViewData<TProject> = this.createEmptyCachedData();

        lCached.activeFunctionId = this.mActiveFunctionId;
        // Preview panel is shown when the project's preview registry has at least one entry
        // bound to the entry-point function. Doesn't depend on the document content.
        lCached.hasPreview = this.computeHasPreview();

        if (lFile) {
            const lErrorNodes: Set<PotatnoDocumentNode<TProject>> = new Set<PotatnoDocumentNode<TProject>>();
            const lErrorPorts: Set<PotatnoDocumentPort<TProject>> = new Set<PotatnoDocumentPort<TProject>>();

            for (const lError of lFile.validate()) {
                if (lError.item instanceof PotatnoDocumentPort) {
                    lCached.errors.push({ location: `Node "${lError.item.node.label}"`, message: lError.message });
                    lErrorPorts.add(lError.item);
                    lErrorNodes.add(lError.item.node);
                } else if (lError.item instanceof PotatnoDocumentNode) {
                    lErrorNodes.add(lError.item);
                }
            }

            lCached.graphErrorNodes = lErrorNodes;
            lCached.graphErrorPorts = lErrorPorts;

            for (const lFunction of lFile.functions) {
                lCached.functionList.push({
                    id: lFunction.id,
                    label: lFunction.label,
                    name: lFunction.label,
                    system: lFunction.isSystem
                });
            }
        }

        lCached.availableImports = lProject?.imports.map((pImport) => pImport.label) ?? [];

        if (lProject) {
            const lTypeSet: Set<string> = new Set<string>();
            for (const [lTypeName] of lProject.types.types) {
                lTypeSet.add(lTypeName);
            }
            lCached.availableTypes = [...lTypeSet].sort();
        }

        if (lActiveFunction) {
            lCached.activeFunctionEditableByUser = !lActiveFunction.isSystem;
            lCached.activeFunctionImports = [...lActiveFunction.imports];
            lCached.activeFunctionInputs = lActiveFunction.inputs.map((pPort) => ({ name: pPort.label, type: pPort.dataType }));
            lCached.activeFunctionIsSystem = lActiveFunction.isSystem;
            lCached.activeFunctionName = lActiveFunction.label;
            lCached.activeFunctionOutputs = lActiveFunction.outputs.map((pPort) => ({ name: pPort.label, type: pPort.dataType }));
        }

        this.mCachedData = lCached;
    }

    /**
     * Increment the graph refresh token.
     */
    private refreshGraph(): void {
        this.mGraphRefreshVersion++;
    }

    /**
     * Increment the node library refresh token.
     */
    private refreshNodeLibrary(): void {
        this.mNodeLibraryRefreshVersion++;
    }

    /**
     * Restore a serialized snapshot into the editor.
     *
     * @param pSnapshot - Snapshot to deserialize and display.
     */
    private restoreSnapshot(pSnapshot: PotatnoCodeFileSerializationResult): void {
        const lProject: TProject | undefined = this.mProject;
        if (!lProject) {
            return;
        }

        const lDeserializer: PotatnoDeserializer<TProject> = new PotatnoDeserializer(lProject);
        this.mFile = lDeserializer.deserialize(pSnapshot);

        if (![...this.mFile.functions].some((pFunction) => pFunction.id === this.mActiveFunctionId)) {
            this.mActiveFunctionId = [...this.mFile.functions][0]?.id ?? '';
        }

        this.rebuildCachedData();
        this.refreshGraph();
        this.refreshNodeLibrary();
        this.schedulePreviewUpdate();
    }

    /**
     * Schedule a debounced history snapshot.
     */
    private scheduleHistorySnapshot(): void {
        if (this.mHistoryDebounceTimer !== null) {
            clearTimeout(this.mHistoryDebounceTimer);
        }

        this.mHistoryDebounceTimer = setTimeout(() => {
            this.mHistoryDebounceTimer = null;
            this.pushHistorySnapshot();
        }, 500);
    }

    /**
     * Schedule a debounced preview driver rebuild. Collapsing rapid graph mutations into a
     * single rebuild keeps code-gen pressure down while staying responsive enough for the
     * user to see fresh previews within ~one frame after they stop editing.
     */
    private schedulePreviewUpdate(): void {
        if (this.mPreviewDebounceTimer !== null) {
            clearTimeout(this.mPreviewDebounceTimer);
        }

        this.mPreviewDebounceTimer = setTimeout(() => {
            this.mPreviewDebounceTimer = null;
            this.rebuildPreviewDrivers();
        }, 300);
    }

    /**
     * Start panel resizing for one side.
     *
     * @param pPanel - Panel side being resized.
     * @param pEvent - Pointer event that started resizing.
     */
    private startPanelResize(pPanel: 'left' | 'right', pEvent: PointerEvent): void {
        const lPanelElement: HTMLElement = pPanel === 'left' ? this.panelLeft : this.panelRight;
        this.mResizeState = { panel: pPanel, startWidth: lPanelElement.offsetWidth, startX: pEvent.clientX };

        const lMoveHandler = (pMoveEvent: PointerEvent): void => {
            if (!this.mResizeState) {
                return;
            }

            const lDelta: number = pPanel === 'left'
                ? pMoveEvent.clientX - this.mResizeState.startX
                : this.mResizeState.startX - pMoveEvent.clientX;
            lPanelElement.style.width = `${Math.max(200, Math.min(500, this.mResizeState.startWidth + lDelta))}px`;
        };

        const lUpHandler = (): void => {
            document.removeEventListener('pointermove', lMoveHandler);
            document.removeEventListener('pointerup', lUpHandler);
            this.mResizeMoveHandler = null;
            this.mResizeState = null;
            this.mResizeUpHandler = null;
        };

        this.stopPanelResize();
        this.mResizeMoveHandler = lMoveHandler;
        this.mResizeUpHandler = lUpHandler;
        document.addEventListener('pointermove', lMoveHandler);
        document.addEventListener('pointerup', lUpHandler);
    }

    /**
     * Stop panel resizing if it is active.
     */
    private stopPanelResize(): void {
        if (this.mResizeMoveHandler) {
            document.removeEventListener('pointermove', this.mResizeMoveHandler);
            this.mResizeMoveHandler = null;
        }

        if (this.mResizeUpHandler) {
            document.removeEventListener('pointerup', this.mResizeUpHandler);
            this.mResizeUpHandler = null;
        }

        this.mResizeState = null;
    }

}

interface CachedViewData<TProject extends PotatnoUiProject> {
    activeFunctionEditableByUser: boolean;
    activeFunctionId: string;
    activeFunctionImports: Array<string>;
    activeFunctionInputs: Array<{ name: string; type: string; }>;
    activeFunctionIsSystem: boolean;
    activeFunctionName: string;
    activeFunctionOutputs: Array<{ name: string; type: string; }>;
    availableImports: Array<string>;
    availableTypes: Array<string>;
    errors: Array<{ message: string; location: string; }>;
    functionList: Array<{ id: string; name: string; label: string; system: boolean; }>;
    graphErrorNodes: ReadonlySet<PotatnoDocumentNode<TProject>>;
    graphErrorPorts: ReadonlySet<PotatnoDocumentPort<TProject>>;
    hasPreview: boolean;
}

type PropertiesChangeData = {
    imports?: Array<string>;
    inputs?: Array<{ name: string; type: string; }>;
    name?: string;
    outputs?: Array<{ name: string; type: string; }>;
};
