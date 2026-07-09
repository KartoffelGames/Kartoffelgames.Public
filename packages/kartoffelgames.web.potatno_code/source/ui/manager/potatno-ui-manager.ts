import { Injection } from '@kartoffelgames/core-dependency-injection';
import type { IPotatnoDocumentItem } from '../../document/i-potatno-document-item.interface.ts';
import { PotatnoDocumentFunction } from '../../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../document/potatno-document-port.ts';
import type { PotatnoDocument } from '../../document/potatno-document.ts';
import { type PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../../project/potatno-project.ts';
import { PotatnoUiManagerClipboard } from './manager_component/potatno-ui-manager-clipboard.ts';
import { PotatnoUiManagerConnections } from './manager_component/potatno-ui-manager-connections.ts';
import { PotatnoUiManagerGraph } from './manager_component/potatno-ui-manager-graph.ts';
import { PotatnoUiManagerGrid } from './manager_component/potatno-ui-manager-grid.ts';
import { PotatnoUiManagerHistory } from './manager_component/potatno-ui-manager-history.ts';
import { PotatnoUiManagerIntegrity } from './manager_component/potatno-ui-manager-integrity.ts';
import { PotatnoUiManagerPreview } from './manager_component/potatno-ui-manager-preview.ts';

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
    private mActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null;
    private mActiveFunctionId: string;
    private readonly mClipboard: PotatnoUiManagerClipboard;
    private readonly mConnections: PotatnoUiManagerConnections;
    private readonly mEventBuffer: Map<PotatnoUiManagerChangeEventTarget | null, PotatnoCodeUiManagerChangeType>;
    private mEventBufferDispatchRequest: number;
    private readonly mGraph: PotatnoUiManagerGraph;
    private readonly mGrid: PotatnoUiManagerGrid;
    private readonly mHistory: PotatnoUiManagerHistory;
    private readonly mIntegrity: PotatnoUiManagerIntegrity;
    private readonly mPreview: PotatnoUiManagerPreview;
    private mProject: PotatnoProject<PotatnoProjectTypesDefinition> | null;

    /**
     * The currently active document function, or `null` when none is resolvable.
     */
    public get activeFunction(): PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null {
        // When the current found and cached active function is still correct, return it.
        if (this.mActiveFunction && this.mActiveFunction.id === this.mActiveFunctionId) {
            return this.mActiveFunction;
        }

        // A document must be set.
        const lDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null = this.mGraph.document;
        if (!lDocument) {
            return null;
        }

        // Search for the active function.
        const lActiveFunction = lDocument.functions.find((pFunction) => {
            return pFunction.id === this.mActiveFunctionId;
        });

        // Active function could not be found.
        if(!lActiveFunction){
            return null;
        }

        // Set active function buffer.
        this.mActiveFunction = lActiveFunction;

        return lActiveFunction;
    }

    /**
     * Id of the active function.
     */
    public get activeFunctionId(): string {
        return this.mActiveFunctionId;
    }

    /**
     * UI manager clipboard component.
     */
    public get clipboard(): PotatnoUiManagerClipboard {
        return this.mClipboard;
    }

    /**
     * UI manager connections component.
     */
    public get connections(): PotatnoUiManagerConnections {
        return this.mConnections;
    }

    /**
     * UI manager document component.
     */
    public get graph(): PotatnoUiManagerGraph {
        return this.mGraph;
    }

    /**
     * UI manager grid component.
     */
    public get grid(): PotatnoUiManagerGrid {
        return this.mGrid;
    }

    /**
     * UI manager history component.
     */
    public get history(): PotatnoUiManagerHistory {
        return this.mHistory;
    }

    /**
     * UI manager integrity component.
     */
    public get integrity(): PotatnoUiManagerIntegrity {
        return this.mIntegrity;
    }

    /**
     * The preview component, owning every live preview driver. Components request node and
     * main-panel drivers from it and read its available display/output options.
     */
    public get preview(): PotatnoUiManagerPreview {
        return this.mPreview;
    }

    /**
     * The current project, or `null` before initialization.
     */
    public get project(): PotatnoProject<PotatnoProjectTypesDefinition> | null {
        return this.mProject;
    }

    /**
     * Create a new, uninitialized manager. Call {@link initialize} before use.
     */
    public constructor() {
        super();

        // Create manager components.
        this.mClipboard = new PotatnoUiManagerClipboard(this);
        this.mIntegrity = new PotatnoUiManagerIntegrity(this);
        this.mConnections = new PotatnoUiManagerConnections(this);
        this.mGraph = new PotatnoUiManagerGraph(this);
        this.mHistory = new PotatnoUiManagerHistory(this);
        this.mPreview = new PotatnoUiManagerPreview(this);
        this.mGrid = new PotatnoUiManagerGrid();

        this.mActiveFunctionId = '';
        this.mActiveFunction = null;
        this.mProject = null;

        // Setup event buffer.
        this.mEventBuffer = new Map<PotatnoUiManagerChangeEventTarget | null, PotatnoCodeUiManagerChangeType>();
        this.mEventBufferDispatchRequest = -1;
    }

    /**
     * Dispatch a manager event with an optional detail payload.
     *
     * @param pType - Change type to dispatch.
     * @param pItem - The document item the change refers to, or `null` when no single item applies.
     */
    public dispatch(pType: PotatnoCodeUiManagerChangeType, pItem: PotatnoUiManagerChangeEventTarget | null): void {
        // Add or merge the current type of the item.
        const lType: PotatnoCodeUiManagerChangeType = this.mEventBuffer.get(pItem) ?? 0;
        this.mEventBuffer.set(pItem, lType | pType);

        // Cancel the last dispatch request.
        if (this.mEventBufferDispatchRequest !== -1) {
            globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest);
        }

        // Wait for the next frame before dispatching all collected event.
        this.mEventBufferDispatchRequest = requestAnimationFrame(() => {
            // Reset current request.
            this.mEventBufferDispatchRequest = -1;

            for (const [lItem, lType] of this.mEventBuffer) {
                // Create and dispatch custom change event.
                this.dispatchEvent(new PotatnoUiManagerChangeEvent(lType, lItem));
            }

            // And clear all events.
            this.mEventBuffer.clear();
        });
    }

    /**
     * Generate a deterministic HSL color from a type string.
     *
     * @param pType - Type identifier to derive a colour from.
     *
     * @returns A CSS HSL color string.
     */
    public generateStringColor(pType: string): string {
        // Convert the type name into a hash.
        const lTypeHash: number = (() => {
            let lHash: number = 0;
            for (let lIndex: number = 0; lIndex < pType.length; lIndex++) {
                lHash = pType.charCodeAt(lIndex) + ((lHash << 5) - lHash);
            }

            return lHash;
        })();

        // Dont ask, just take it.
        const lHue: number = (Math.abs(lTypeHash) * 137.508) % 360;
        return `hsl(${lHue}, 70%, 60%)`;
    }

    /**
     * Bind the manager to a project. Resets document and history.
     *
     * @param pProject - The project configuration backing the editor.
     */
    public initialize(pProject: PotatnoProject<PotatnoProjectTypesDefinition>, pDocument: PotatnoDocument<PotatnoProjectTypesDefinition>): void {
        this.mProject = pProject;

        // Adopt the document. The manager's own document event notifies listeners and the preview
        // component drops its stale drivers.
        this.mGraph.setDocument(pDocument);
    }

    /**
     * Activate a function by id.
     *
     * @param pFunctionId - Id of the function to activate.
     */
    public setActiveFunction(pFunctionId: string): void {
        // Only switch when a document is setup and the function is not already selected.
        const lDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null = this.mGraph.document;
        if (!lDocument || this.mActiveFunctionId === pFunctionId) {
            return;
        }

        // Search for the active function.
        const lActiveFunction = lDocument.functions.find((pFunction) => {
            return pFunction.id === pFunctionId;
        });

        // Skip if function could not be found.
        if (!lActiveFunction) {
            return;
        }

        // set active function and dispatch change event.
        this.mActiveFunctionId = pFunctionId;
        this.dispatch(PotatnoCodeUiManagerChangeType.SpecialActiveFunction, lActiveFunction);
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
    public subscribe(pTypes: PotatnoCodeUiManagerChangeType | number, pTargets: Set<PotatnoUiManagerChangeEventTarget> | null, pListener: (pEvent: PotatnoUiManagerChangeEvent) => void): () => void {
        const lTargetMatched = (pItem: PotatnoUiManagerChangeEventTarget | null): boolean => {
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

                // Cascade down from port -> node -> function -> document to check all levels for targets.
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
                    default: {
                        lItem = null;
                    }
                }
            }

            return false;
        };

        // Custom wrapper for scoping the actual event listener.
        const lEventHandler = (pEvent: PotatnoUiManagerChangeEvent): void => {
            // Skip event when handler is not "any" and the change type is not part of the subscribed bitmask.
            if (pTypes !== PotatnoCodeUiManagerChangeType.Any && (pEvent.changeType & pTypes) === 0) {
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
     * Apply right-panel property changes to the active function.
     *
     * @param pData - The changed function properties.
     */
    public updateFunctionProperties(pData: PotatnoCodeUiManagerPropertiesChange): void {
        // TODO: all of this shit to graph ui component.
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        const lFunctionDefinition: PotatnoFunctionDefinition<PotatnoProjectTypesDefinition> | undefined = lActiveFunction.project.getFunction(lActiveFunction.definitionId);
        const lStatics: number = lFunctionDefinition?.statics ?? (PotatnoFunctionDefinitionStatics.imports | PotatnoFunctionDefinitionStatics.inputs | PotatnoFunctionDefinitionStatics.outputs);

        if (pData.name !== undefined) {
            lActiveFunction.label = pData.name;
        }

        if (pData.inputs !== undefined && (lStatics & PotatnoFunctionDefinitionStatics.inputs) === 0) {
            // Rebuild the input list from the panel's desired state so renames and type changes
            // apply, not just additions and removals. Entry/exit node ports resync during validation.
            for (const lPort of [...lActiveFunction.inputs]) {
                lActiveFunction.removeInput(lPort);
            }
            for (const lPortData of pData.inputs) {
                lActiveFunction.addInput({ dataType: lPortData.type, label: lPortData.name });
            }
        }

        if (pData.outputs !== undefined && (lStatics & PotatnoFunctionDefinitionStatics.outputs) === 0) {
            for (const lPort of [...lActiveFunction.outputs]) {
                lActiveFunction.removeOutput(lPort);
            }
            for (const lPortData of pData.outputs) {
                lActiveFunction.addOutput({ dataType: lPortData.type, label: lPortData.name });
            }
        }

        if (pData.imports !== undefined && (lStatics & PotatnoFunctionDefinitionStatics.imports) === 0) {
            const lExistingImportIds: Set<string> = new Set<string>(lActiveFunction.imports);
            const lNewImportIds: Set<string> = new Set<string>(pData.imports);
            for (const lImportId of [...lActiveFunction.imports]) {
                if (!lNewImportIds.has(lImportId)) {
                    lActiveFunction.removeImport(lImportId);
                }
            }
            for (const lImportId of pData.imports) {
                if (!lExistingImportIds.has(lImportId)) {
                    lActiveFunction.addImport(lImportId);
                }
            }
        }

        this.dispatch(PotatnoCodeUiManagerChangeType.FunctionUpdate, lActiveFunction);
    }
}

/**
 * Event types fired by {@link PotatnoUiManager}.
 */
export const PotatnoCodeUiManagerChangeType = {
    Any: 0xFFFFFF,

    // Connections #F
    Connection: 0xF,
    ConnectionAdd: 0x1,
    ConnectionUpdate: 0x2,
    ConnectionDelete: 0x4,

    // Document #F0
    Document: 0xF0,

    // Function #F00
    Function: 0xF00,
    FunctionAdd: 0x100,
    FunctionUpdate: 0x200,
    FunctionDelete: 0x400,

    // Node #F000
    Node: 0xF000,
    NodeAdd: 0x1000,
    NodeUpdate: 0x2000,
    NodeDelete: 0x4000,
    NodeTransform: 0x8000,

    // Port: #F0000
    Port: 0xF0000,
    PortAdd: 0x10000,
    PortUpdate: 0x20000,
    PortDelete: 0x40000,

    // Specials #F00000
    Special: 0xF00000,
    SpecialActiveFunction: 0x100000,
} as const;
export type PotatnoCodeUiManagerChangeType = typeof PotatnoCodeUiManagerChangeType[keyof typeof PotatnoCodeUiManagerChangeType] | number;

/**
 * Custom change event dispatched by the {@link PotatnoUiManager}
 */
export class PotatnoUiManagerChangeEvent extends Event {
    public static readonly EVENT_TYPE: string = 'PotatnoUiManagerChangeEvent';

    private readonly mChangeType: PotatnoCodeUiManagerChangeType;
    private readonly mEventItem: PotatnoUiManagerChangeEventTarget | null;

    /**
     * The event type that produced this event.
     */
    public get changeType(): PotatnoCodeUiManagerChangeType {
        return this.mChangeType;
    }

    /**
     * The potatno document item the event refers to, or `null` when no single item applies.
     */
    public get item(): PotatnoUiManagerChangeEventTarget | null {
        return this.mEventItem;
    }

    public constructor(pChangeType: PotatnoCodeUiManagerChangeType, pEventItem: PotatnoUiManagerChangeEventTarget | null) {
        super(PotatnoUiManagerChangeEvent.EVENT_TYPE);

        this.mChangeType = pChangeType;
        this.mEventItem = pEventItem;
    }
}

export type PotatnoUiManagerChangeEventTarget = IPotatnoDocumentItem<PotatnoProjectTypesDefinition> | PotatnoDocument<PotatnoProjectTypesDefinition>;

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
    /**
     * Import ids used by the function.
     */
    imports?: Array<string>;
    inputs?: Array<PotatnoCodeUiManagerPortView>;
    name?: string;
    outputs?: Array<PotatnoCodeUiManagerPortView>;
};
