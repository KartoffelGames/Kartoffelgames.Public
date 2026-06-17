import { IDeconstructable } from "@kartoffelgames/core";
import { Injection } from '@kartoffelgames/core-dependency-injection';
import type { IPotatnoDocumentItem } from '../../document/i-potatno-document-item.interface.ts';
import { PotatnoDocumentFunction } from '../../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../document/potatno-document-port.ts';
import { PotatnoDocument } from '../../document/potatno-document.ts';
import { type PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../project/potatno-function-definition.ts';
import { PotatnoProjectTypesDefinition } from "../../project/potatno-project-types-definition.ts";
import { PotatnoProject } from "../../project/potatno-project.ts";
import { PotatnoUiManagerGraph } from './manager_component/potatno-ui-manager-graph.ts';
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
export class PotatnoUiManager extends EventTarget implements IDeconstructable {
    private mActiveFunctionId: string;
    private mProject: PotatnoProject<PotatnoProjectTypesDefinition> | null;

    // Manager components.
    private readonly mGraph: PotatnoUiManagerGraph;
    private readonly mHistory: PotatnoUiManagerHistory;
    private readonly mIntegrity: PotatnoUiManagerIntegrity;
    private readonly mPreview: PotatnoUiManagerPreview;

    /**
     * UI manager document component.
     */
    public get graph(): PotatnoUiManagerGraph {
        return this.mGraph;
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
     * The currently active document function, or `null` when none is resolvable.
     */
    public get activeFunction(): PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null {
        const lDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null = this.mGraph.document;
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
     * The current project, or `null` before initialization.
     */
    public get project(): PotatnoProject<PotatnoProjectTypesDefinition> | null {
        return this.mProject;
    }

    /**
     * The preview component, owning every live preview driver. Components request node and
     * main-panel drivers from it and read its available display/output options.
     */
    public get preview(): PotatnoUiManagerPreview {
        return this.mPreview;
    }

    /**
     * Create a new, uninitialized manager. Call {@link initialize} before use.
     */
    public constructor() {
        super();

        // Create manager components.
        this.mIntegrity = new PotatnoUiManagerIntegrity(this);
        this.mGraph = new PotatnoUiManagerGraph(this);
        this.mHistory = new PotatnoUiManagerHistory(this);
        this.mPreview = new PotatnoUiManagerPreview(this);

        this.mActiveFunctionId = '';
        this.mProject = null;
    }

    /**
     * Tear-down hook. The manager's components subscribe for the editor's lifetime, so there is
     * nothing to release.
     */
    public deconstruct(): void {
        // Nothing to release.
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
     * Activate a function by id.
     *
     * @param pFunctionId - Id of the function to activate.
     */
    public setActiveFunction(pFunctionId: string): void {
        const lDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null = this.mGraph.document;
        if (!lDocument || this.mActiveFunctionId === pFunctionId) {
            return;
        }

        for (const lFunction of lDocument.functions) {
            if (lFunction.id === pFunctionId) {
                this.mActiveFunctionId = pFunctionId;
                this.dispatch(PotatnoCodeUiManagerChangeType.SpecialActiveFunction, lFunction);
                return;
            }
        }
    }

    /**
     * Apply right-panel property changes to the active function.
     *
     * @param pData - The changed function properties.
     */
    public updateFunctionProperties(pData: PotatnoCodeUiManagerPropertiesChange): void {
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

        this.dispatch(PotatnoCodeUiManagerChangeType.Function, lActiveFunction);
    }

    /**
     * Dispatch a manager event with an optional detail payload.
     *
     * @param pType - Change type to dispatch.
     * @param pItem - The document item the change refers to, or `null` when no single item applies.
     */
    public dispatch(pType: PotatnoCodeUiManagerChangeType, pItem: PotatnoUiManagerChangeEventTarget | null): void {
        // TODO: Catch all change types for a item and dispatch a single merged event flag for each unique item. 

        // Create and dispatch custom change event.
        this.dispatchEvent(new PotatnoUiManagerChangeEvent(pType, pItem));
    }
}

/**
 * Event types fired by {@link PotatnoUiManager}.
 */
export const PotatnoCodeUiManagerChangeType = {
    Any: 0xFFFFF,

    // Connections #F
    Connection: 0xF,

    // Document #0F
    Document: 0x0F,

    // Function #00F
    Function: 0x00F,
    FunctionAdd: 0x001,
    FunctionUpdate: 0x002,
    FunctionDelete: 0x004,

    // Node #000F
    Node: 0x000F,
    NodeAdd: 0x0001,
    NodeUpdate: 0x0002,
    NodeDelete: 0x0004,
    NodeTransform: 0x0008,

    // Specials #0000F
    Special: 0x0000F,
    SpecialActiveFunction: 0x00001,
} as const;
export type PotatnoCodeUiManagerChangeType = typeof PotatnoCodeUiManagerChangeType[keyof typeof PotatnoCodeUiManagerChangeType];

/**
 * Custom change event dispatched by the {@link PotatnoUiManager}
 */
class PotatnoUiManagerChangeEvent extends Event {
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
