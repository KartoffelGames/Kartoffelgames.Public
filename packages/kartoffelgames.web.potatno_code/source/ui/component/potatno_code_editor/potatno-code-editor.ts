import { ComponentState, PwbChild, PwbComponent, PwbExport, type ComponentEvent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoDocument } from '../../../document/potatno-document.ts';
import { PotatnoCodeGenerator } from '../../../parser/potatno-code-generator.ts';
import { PotatnoFunctionDefinitionNodes, PotatnoFunctionDefinitionStatics } from '../../../project/potatno-function-definition.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoDeserializer } from '../../../serialization/potatno-deserializer.ts';
import type { PotatnoCodeFileSerializationResult } from '../../../serialization/potatno-serialization.type.ts';
import { PotatnoSerializer } from '../../../serialization/potatno-serializer.ts';
import { PotatnoHistory } from '../../potatno-history.ts';
import type { PotatnoUiProject } from '../../potatno-node-definition-list.ts';
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
import { PotatnoCodeGeneratorFunctionResult } from "../../../parser/result/potatno-code-generator-function-result.ts";

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
    private mPreviewDirty: boolean;
    private mProject: TProject | undefined;
    private mResizeMoveHandler: ((pEvent: PointerEvent) => void) | null;
    private mResizeState: { panel: 'left' | 'right'; startX: number; startWidth: number; } | null;
    private mResizeUpHandler: (() => void) | null;

    /**
     * Cached data for panels and preview chrome.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mCachedData: CachedViewData;

    /**
     * Entry-point preview element passed into the preview panel.
     */
    @ComponentState.state()
    private accessor mEntryPointPreviewElement: Element | null = null;

    /**
     * Latest generated preview function result passed to the node graph.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mGraphPreviewResult: PotatnoCodeGeneratorFunctionResult<TProject> | null = null;

    /**
     * Latest generated document code string used to drive preview evaluation.
     */
    @ComponentState.state()
    private accessor mGraphPreviewCode: string = '';

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
     * Explicit preview visual refresh token.
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
    public get graphErrorNodes(): ReadonlySet<PotatnoDocumentNode<any>> {
        return this.mCachedData.graphErrorNodes;
    }

    /**
     * Port error set derived from document validation, passed to the graph for highlighting.
     */
    public get graphErrorPorts(): ReadonlySet<PotatnoDocumentPort<any>> {
        return this.mCachedData.graphErrorPorts;
    }

    /**
     * Entry preview element rendered by the preview panel.
     */
    public get entryPreviewElement(): Element | null {
        return this.mEntryPointPreviewElement;
    }

    /**
     * Function entries shown in the left panel.
     */
    public get functionList(): Array<{ id: string; name: string; label: string; system: boolean; }> {
        return this.mCachedData.functionList;
    }

    /**
     * Current graph preview result passed into the graph component.
     */
    public get graphPreviewResult(): PotatnoCodeGeneratorFunctionResult<TProject> | null {
        return this.mGraphPreviewResult;
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
        this.mPreviewDirty = true;
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
        this.mGraphPreviewResult = null;
        this.mEntryPointPreviewElement = null;
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
        this.mGraphPreviewResult = null;
        this.mEntryPointPreviewElement = null;
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
     * Refresh preview visuals from cached generated code.
     */
    @PwbExport
    public triggerPreviewUpdate(): void {
        this.updatePreviewsFromCache();
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
    private createEmptyCachedData(): CachedViewData {
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
            graphErrorNodes: new Set<PotatnoDocumentNode<any>>(),
            graphErrorPorts: new Set<PotatnoDocumentPort<any>>(),
            hasPreview: false
        };
    }

    /**
     * Generate preview code when the preview is marked dirty.
     */
    private evaluatePreview(): void {
        const lProject: TProject | undefined = this.mProject;
        const lFile: PotatnoDocument<TProject> | undefined = this.mFile;
        if (!lProject || !lFile || !this.mPreviewDirty) {
            return;
        }

        this.mPreviewDirty = false;

        let lEntryFunction: PotatnoDocumentFunction<TProject> | undefined;
        for (const lFunction of lFile.functions) {
            if (lFunction.isSystem) {
                lEntryFunction = lFunction;
                break;
            }
        }

        if (!lEntryFunction) {
            return;
        }

        const lEntryPreview = lProject.entryPoint.preview;
        if (lEntryPreview && !this.mEntryPointPreviewElement) {
            this.mEntryPointPreviewElement = lEntryPreview.generate();
        }

        try {
            const lGenerator: PotatnoCodeGenerator<TProject> = new PotatnoCodeGenerator<TProject>(lProject);
            this.mGraphPreviewResult = lGenerator.generateFunction(lEntryFunction);
            this.mGraphPreviewCode = lGenerator.generateDocument(lFile);
            this.updatePreviewsFromCache();
        } catch (pError) {
            console.error('[Editor] Preview code generation failed:', pError);
        }
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
        const lCached: CachedViewData = this.createEmptyCachedData();

        lCached.activeFunctionId = this.mActiveFunctionId;
        lCached.hasPreview = lProject?.entryPoint.preview !== null && lProject?.entryPoint.preview !== undefined;

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

        this.mGraphPreviewResult = null;
        this.mEntryPointPreviewElement = null;
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
     * Schedule a debounced preview regeneration.
     */
    private schedulePreviewUpdate(): void {
        this.mPreviewDirty = true;
        if (this.mPreviewDebounceTimer !== null) {
            clearTimeout(this.mPreviewDebounceTimer);
        }

        this.mPreviewDebounceTimer = setTimeout(() => {
            this.mPreviewDebounceTimer = null;
            this.evaluatePreview();
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

    /**
     * Update preview elements from cached generated code.
     */
    private updatePreviewsFromCache(): void {
        const lProject: TProject | undefined = this.mProject;
        const lFunctionResult: PotatnoCodeGeneratorFunctionResult<TProject> | null = this.mGraphPreviewResult;
        if (!lProject || !lFunctionResult) {
            return;
        }

        const lEntryPreview = lProject.entryPoint.preview;
        if (lEntryPreview && this.mEntryPointPreviewElement) {
            try {
                lEntryPreview.update(
                    this.mEntryPointPreviewElement,
                    lFunctionResult,
                    {},
                    this.mGraphPreviewCode
                );
            } catch (pError) {
                console.error('[Editor] Entry preview update failed:', pError);
            }
        }

        this.mPreviewUpdateVersion++;
    }
}

interface CachedViewData {
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
    graphErrorNodes: ReadonlySet<PotatnoDocumentNode<any>>;
    graphErrorPorts: ReadonlySet<PotatnoDocumentPort<any>>;
    hasPreview: boolean;
}

type PropertiesChangeData = {
    imports?: Array<string>;
    inputs?: Array<{ name: string; type: string; }>;
    name?: string;
    outputs?: Array<{ name: string; type: string; }>;
};
