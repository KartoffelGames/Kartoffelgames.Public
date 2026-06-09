import { IDeconstructable } from "@kartoffelgames/core";
import { Injection } from '@kartoffelgames/core-dependency-injection';
import type { IPotatnoDocumentItem } from '../../document/i-potatno-document-item.interface.ts';
import { PotatnoDocumentFunction } from '../../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../document/potatno-document-port.ts';
import { PotatnoDocument } from '../../document/potatno-document.ts';
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

    private mProject: PotatnoUiProject | null;

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
    public get activeFunction(): PotatnoDocumentFunction<PotatnoUiProject> | null {
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mGraph.document;
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
    public get project(): PotatnoUiProject | null {
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
    public initialize(pProject: PotatnoUiProject, pDocument: PotatnoDocument<PotatnoUiProject>): void {
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
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mGraph.document;
        if (!lDocument || this.mActiveFunctionId === pFunctionId) {
            return;
        }

        for (const lFunction of lDocument.functions) {
            if (lFunction.id === pFunctionId) {
                this.mActiveFunctionId = pFunctionId;
                this.dispatch(PotatnoCodeUiManagerChangeType.ActiveFunction, lFunction);
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

        this.dispatch(PotatnoCodeUiManagerChangeType.Function, lActiveFunction);
    }

    /**
     * Dispatch a manager event with an optional detail payload.
     *
     * @param pType - Change type to dispatch.
     * @param pItem - The document item the change refers to, or `null` when no single item applies.
     */
    public dispatch(pType: PotatnoCodeUiManagerChangeType, pItem: PotatnoUiManagerChangeEventTarget | null): void {
        // Create and dispatch custom change event.
        this.dispatchEvent(new PotatnoUiManagerChangeEvent(pType, pItem));
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
    NodeTransform: 16,

    // Specials 
    // TODO: Mabe that can be changed?
    Preview: 32,
    ActiveFunction: 64
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

/**
 * Project shape accepted by UI components that read Potatno project metadata.
 *
 * A shared project-shape contract with no single owning class — every UI component that reads
 * project metadata widens the project to this alias, so it lives in its own file rather than
 * attached to one component.
 */
export type PotatnoUiProject = PotatnoProject<PotatnoProjectTypesDefinition<string>>;