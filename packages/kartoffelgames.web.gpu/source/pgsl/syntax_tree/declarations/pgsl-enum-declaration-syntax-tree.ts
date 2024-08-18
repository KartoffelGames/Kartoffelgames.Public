import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';

export class PgslEnumDeclarationSyntaxTree extends BasePgslSyntaxTree<PgslEnumDeclarationSyntaxTreeStructureData['meta']['type'], PgslEnumDeclarationSyntaxTreeStructureData['data']> {
    private mName: string;
    private readonly mValues: Dictionary<string, string | number>;


    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    } set name(pVariableName: string) {
        this.mName = pVariableName;
    }

    /**
     * Constructor.
     * 
     * @param pBuildIn - When enum is build in.
     */
    public constructor(pBuildIn: boolean = false) {
        super('Declaration-Enum', pBuildIn);

        this.mValues = new Dictionary<string, string | number>();
        this.mName = '';
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
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslEnumDeclarationSyntaxTreeStructureData['data']): void {
        // Set enum name.
        this.mName = pData.name;

        // Add each item to enum.
        for (const lItem of pData.items) {
            // Validate dublicates.
            if (this.mValues.has(lItem.name)) {
                throw new Exception(`Value "${lItem.name}" was already added to enum "${this.mName}"`, this);
            }

            this.mValues.set(lItem.name, lItem.value ?? this.mValues.size);
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslEnumDeclarationSyntaxTreeStructureData['data'] {
        // Build struct data structure.
        const lData: PgslEnumDeclarationSyntaxTreeStructureData['data'] = {
            name: this.mName,
            items: new Array<{ name: string, value?: string | number; }>()
        };

        // Add each value to data structure.
        for (const [lName, lValue] of this.mValues) {
            lData.items.push({
                name: lName, value: lValue
            });
        }

        return lData;
    }
}

export type PgslEnumDeclarationSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Declaration-Enum', {
    name: string;
    items: Array<{
        name: string;
        value?: string | number;
    }>;
}>;