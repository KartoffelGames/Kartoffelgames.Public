import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../../base-pgsl-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from '../../declarations/pgsl-enum-declaration-syntax-tree';

/**
 * PGSL structure holding single variable name.
 */
export class PgslEnumValueExpressionSyntaxTree extends BasePgslSyntaxTree<PgslEnumValueExpressionSyntaxTreeStructureData['meta']['type'], PgslEnumValueExpressionSyntaxTreeStructureData['data']> {
    private mName: string;
    private mProperty: string;

    /**
     * Enum name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Enum property name.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Expression-EnumValue');

        this.mName = '';
        this.mProperty = '';
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslEnumValueExpressionSyntaxTreeStructureData['data']): void {
        const lReferencedEnum: PgslEnumDeclarationSyntaxTree | null = this.document.resolveEnum(pData.name);

        // Catch undefined enum names.
        if (!lReferencedEnum) {
            throw new Exception(`Enum "${pData.name}" not defined.`, this);
        }

        // Catch undefined enum properties.
        if (lReferencedEnum.property(pData.property) === null) {
            throw new Exception(`Enum property"${pData.name}.${pData.property}" not defined.`, this);
        }

        this.mName = pData.name;
        this.mProperty = pData.property;
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslEnumValueExpressionSyntaxTreeStructureData['data'] {
        return {
            name: this.mName,
            property: this.mProperty
        };
    }
}

export type PgslEnumValueExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-EnumValue', {
    name: string;
    property: string;
}>;