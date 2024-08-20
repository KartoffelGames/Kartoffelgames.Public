import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree } from '../base-pgsl-syntax-tree';

/**
 * PGSL syntax tree of a enum declaration.
 */
export class PgslEnumDeclarationSyntaxTree extends BasePgslSyntaxTree<PgslEnumDeclarationSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mValues: Dictionary<string, string | number>;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    } 

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslEnumDeclarationSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

        // Set data.
        this.mName = pData.name;
        
        // Add each item to enum.
        this.mValues = new Dictionary<string, string | number>();
        for (const lItem of pData.items) {
            // Validate dublicates.
            if (this.mValues.has(lItem.name)) {
                throw new Exception(`Value "${lItem.name}" was already added to enum "${this.mName}"`, this);
            }

            this.mValues.set(lItem.name, lItem.value ?? this.mValues.size);
        }
    }

    /**
     * Get value of property. Return null when the property is not defined.
     * 
     * @param pName - Property name.
     * 
     * @returns Value of property or null when the property is not defined.
     */
    public property(pName: string): string | number | null{
        return this.mValues.get(pName) ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Not really something to validate.
    }
}

export type PgslEnumDeclarationSyntaxTreeStructureData = {
    name: string;
    items: Array<{
        name: string;
        value?: string;
    }>;
};