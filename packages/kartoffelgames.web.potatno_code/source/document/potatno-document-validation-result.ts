import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.interface.ts';

/**
 * Validation result of a potatno document item.
 */
export class PotatnoDocumentValidationResult<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mErrors: Array<PotatnoDocumentPortValidationError<TProjectTypes>>;
    private readonly mAffectedItems: Set<IPotatnoDocumentItem<TProjectTypes>>;

    /**
     * Items that got changed, deleted or added during validation.
     */
    public get affectedItems(): ReadonlySet<IPotatnoDocumentItem<TProjectTypes>> {
        return this.mAffectedItems;
    }

    /**
     * Validation errors.
     */
    public get errors(): ReadonlyArray<PotatnoDocumentPortValidationError<TProjectTypes>> {
        return this.mErrors;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mErrors = new Array<PotatnoDocumentPortValidationError<TProjectTypes>>();
        this.mAffectedItems = new Set<IPotatnoDocumentItem<TProjectTypes>>();
    }

    /**
     * Push a new validation error.
     * 
     * @param pError - Error.
     */
    public pushError(...pError: Array<PotatnoDocumentPortValidationError<TProjectTypes>>): void {
        this.mErrors.push(...pError);
    }

    /**
     * Add a new affected item.
     * Affected items are document items that got changed, deleted or added during validation.
     * 
     * @param pItem 
     */
    public addAffectedItem(pItem: IPotatnoDocumentItem<TProjectTypes>): void {
        this.mAffectedItems.add(pItem);
    }

    /**
     * Merge the source result into this. 
     * 
     * @param pSource - Source data.
     * 
     * @returns this. 
     */
    public merge(pSource: PotatnoDocumentValidationResult<TProjectTypes>): PotatnoDocumentValidationResult<TProjectTypes> {
        // Append errors.
        this.mErrors.push(...pSource.mErrors);

        // Merge affected items.
        for (const lAffectedItem of pSource.mAffectedItems) {
            this.mAffectedItems.add(lAffectedItem);
        }

        return this;
    }
}

/**
 * A validation error for a document port.
 */
export class PotatnoDocumentPortValidationError<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mItem: IPotatnoDocumentItem<TProjectTypes>;
    private readonly mMessage: string;

    /**
     * Get the item that caused the validation error.
     */
    public get item(): IPotatnoDocumentItem<TProjectTypes> {
        return this.mItem;
    }

    /**
     * Get the error message describing the validation error.
     */
    public get message(): string {
        return this.mMessage;
    }

    /**
     * Create a new validation error for a document item.
     * 
     * @param pMessage - The error message describing the validation error.
     * @param pItem - The item that caused the validation error.
     */
    public constructor(pMessage: string, pItem: IPotatnoDocumentItem<TProjectTypes>) {
        this.mMessage = pMessage;
        this.mItem = pItem;
    }
}
