import type { IPotatnoDocumentItem } from '../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from '../../document/potatno-document-function.ts';
import type { PotatnoDocument } from '../../document/potatno-document.ts';
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
 */
export class PotatnoUiManager extends EventTarget {
    private mActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition>;
    private readonly mClipboard: PotatnoUiManagerClipboard;
    private readonly mConnections: PotatnoUiManagerConnections;
    private readonly mEventBuffer: Map<PotatnoUiManagerChangeEventTarget | null, PotatnoCodeUiManagerChangeType>;
    private mEventBufferDispatchRequest: number;
    private readonly mGraph: PotatnoUiManagerGraph;
    private readonly mGrid: PotatnoUiManagerGrid;
    private readonly mHistory: PotatnoUiManagerHistory;
    private readonly mIntegrity: PotatnoUiManagerIntegrity;
    private readonly mPreview: PotatnoUiManagerPreview;
    private readonly mProject: PotatnoProject<PotatnoProjectTypesDefinition>;

    /**
     * The currently active document function, or `null` when none is resolvable.
     */
    public get activeFunction(): PotatnoDocumentFunction<PotatnoProjectTypesDefinition> {
        return this.mActiveFunction;
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
     * The current project.
     */
    public get project(): PotatnoProject<PotatnoProjectTypesDefinition> {
        return this.mProject;
    }

    /**
     * Create a new, uninitialized manager. Call {@link initialize} before use.
     */
    public constructor(pProject: PotatnoProject<PotatnoProjectTypesDefinition>) {
        super();

        // Set project.
        this.mProject = pProject;

        // Setup event buffer.
        this.mEventBuffer = new Map<PotatnoUiManagerChangeEventTarget | null, PotatnoCodeUiManagerChangeType>();
        this.mEventBufferDispatchRequest = -1;

        // Create manager components.
        this.mIntegrity = new PotatnoUiManagerIntegrity(this);
        this.mConnections = new PotatnoUiManagerConnections(this);
        this.mHistory = new PotatnoUiManagerHistory(this);
        this.mPreview = new PotatnoUiManagerPreview(this);
        this.mGrid = new PotatnoUiManagerGrid(this);
        this.mClipboard = new PotatnoUiManagerClipboard(this);
        this.mGraph = new PotatnoUiManagerGraph(this);

        // Defaultactive function to first.
        this.mActiveFunction = this.mGraph.document.functions.at(0)!;
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
     * Activate a function by id.
     *
     * @param pFunctionId - Id of the function to activate.
     */
    public setActiveFunction(pFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition>): void {
        // Search for the active function.
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | undefined = this.mGraph.document.functions.find((pDocumentFunction) => {
            return pDocumentFunction === pFunction;
        });

        // Skip if function could not be found.
        if (!lActiveFunction) {
            return;
        }

        // set active function and dispatch change event.
        this.mActiveFunction = pFunction;
        this.dispatch(PotatnoCodeUiManagerChangeType.SpecialActiveFunction, pFunction);
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
    public subscribe(pTypes: PotatnoCodeUiManagerChangeType | number, pListener: (pEvent: PotatnoUiManagerChangeEvent) => void): PotatnoCodeUiManagerUnsubscribe {
        // Custom wrapper for scoping the actual event listener.
        const lEventHandler = (pEvent: PotatnoUiManagerChangeEvent): void => {
            // Skip event when handler is not "any" and the change type is not part of the subscribed bitmask.
            if (pTypes !== PotatnoCodeUiManagerChangeType.Any && (pEvent.changeType & pTypes) === 0) {
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
    SpecialGrid: 0x200000,
    SpecialValidation: 0x400000,
    SpecialSelectNode: 0x800000
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


export type PotatnoCodeUiManagerUnsubscribe = () => void;