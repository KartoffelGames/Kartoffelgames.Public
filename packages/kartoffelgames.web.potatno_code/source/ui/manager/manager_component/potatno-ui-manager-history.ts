import { PotatnoDocumentFunction } from "../../../document/potatno-document-function.ts";
import { PotatnoDocument } from "../../../document/potatno-document.ts";
import { PotatnoDeserializer } from "../../../serialization/potatno-deserializer.ts";
import { PotatnoCodeFileSerializationResult } from "../../../serialization/potatno-serialization.type.ts";
import { PotatnoSerializer } from "../../../serialization/potatno-serializer.ts";
import { PotatnoUiProject } from "../../potatno-ui-project.ts";
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from "../potatno-ui-manager.ts";

export class PotatnoUiManagerHistory {
    private static readonly MAX_HISTORY_ITEMS: number = 100;

    private readonly mManager: PotatnoUiManager;
    private readonly mSnapshots: Array<string>;
    private mSnapshotIndex: number;

    /**
     * Whether there are any snapshots available to redo.
     */
    public get canRedo(): boolean {
        return this.mSnapshotIndex < this.mSnapshots.length - 1;
    }

    /**
     * Whether there are any snapshots available to undo.
     */
    public get canUndo(): boolean {
        return this.mSnapshotIndex > 0;
    }

    /**
     * Constructor.
     * 
     * @param pManager - Parents ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;

        // Init snapshots.
        this.mSnapshotIndex = -1;
        this.mSnapshots = new Array<string>();

        // Register "all"-Listener that saves a debounced history item.
        let lDebounce: number = 0;
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Any, null, () => {
            // Debounce: Clear and set a new timeout before pushing new history.
            globalThis.clearTimeout(lDebounce);
            lDebounce = globalThis.setTimeout(() => {
                this.pushHistory();
            }, 1000) as unknown as number;
        });
    }

    /**
     * Step back one snapshot and restore the document.
     */
    public undo(): void {
        // Skip if not possible.
        if (!this.canUndo) {
            return;
        }

        // Update snapshot index and read the snapshot string.
        const lSnapshotString: string = this.mSnapshots[--this.mSnapshotIndex];

        // Parse snapshot serialisation and restore.
        const lSnapshotSerializationResult: PotatnoCodeFileSerializationResult = JSON.parse(lSnapshotString);
        this.restoreHistory(lSnapshotSerializationResult);
    }

    /**
     * Step forward one snapshot and restore the document.
     */
    public redo(): void {
        // Skip if not possible.
        if (!this.canRedo) {
            return;
        }

        // Update snapshot index and read the snapshot string.
        const lSnapshotString: string = this.mSnapshots[++this.mSnapshotIndex];

        // Parse snapshot serialisation and restore.
        const lSnapshotSerializationResult: PotatnoCodeFileSerializationResult = JSON.parse(lSnapshotString);
        this.restoreHistory(lSnapshotSerializationResult);
    }

    /**
     * Clear all history.
     */
    public clear(): void {
        this.mSnapshots.length = 0;
        this.mSnapshotIndex = -1;
    }

    /**
     * Push the current document snapshot into history.
     */
    private pushHistory(): void {
        const lDocument: PotatnoDocument<PotatnoUiProject> | null = this.mManager.graph.document;
        if (!lDocument) {
            return;
        }

        // Slice current snapshot to current index. Removing old redo items.
        this.mSnapshots.splice(this.mSnapshotIndex + 1);

        // Serialize result and convert to string.
        const lSerializerResult: PotatnoCodeFileSerializationResult = new PotatnoSerializer<PotatnoUiProject>().serialize(lDocument);
        const lSerializerResultString: string = JSON.stringify(lSerializerResult);

        // Read last item, if it has one, and compare the items.
        if (this.mSnapshots.length > 0) {
            // Skip history push if the current snapshot item is the same as the new.
            const lLastItem: string = this.mSnapshots.at(-1)!;
            if (lLastItem === lSerializerResultString) {
                return;
            }
        }

        // Add new hostory item and update index.
        this.mSnapshotIndex = this.mSnapshots.push(lSerializerResultString) - 1;

        // Trim snapshots if it exeedes max item count.
        if (this.mSnapshots.length > PotatnoUiManagerHistory.MAX_HISTORY_ITEMS) {
            this.mSnapshots.shift();
            this.mSnapshotIndex--;
        }
    }

    /**
     * Restore a serialized snapshot into the editor without clearing history.
     *
     * @param pSnapshot - Snapshot to deserialize and display.
     */
    private restoreHistory(pSnapshot: PotatnoCodeFileSerializationResult): void {
        const lProject: PotatnoUiProject | null = this.mManager.project;
        if (!lProject) {
            return;
        }

        //  Deserialize snapshot into a new document and update document.
        this.mManager.graph.setDocument(new PotatnoDeserializer<PotatnoUiProject>(lProject).deserialize(pSnapshot));
    }
}