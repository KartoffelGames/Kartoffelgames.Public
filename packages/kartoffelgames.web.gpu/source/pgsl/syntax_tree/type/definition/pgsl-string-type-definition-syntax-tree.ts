import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslStringTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslStringTypeDefinitionSyntaxTreeStructureData> {
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
    public constructor(pData: PgslStringTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        const lIdentifier: string = 'ID:STRING->STRING';

        // Return cached when available.
        if (BasePgslTypeDefinitionSyntaxTree.mTypeCache.has(lIdentifier)) {
            return BasePgslTypeDefinitionSyntaxTree.mTypeCache.get(lIdentifier)! as PgslStringTypeDefinitionSyntaxTree;
        }

        // Create.
        super(PgslTypeName.String, lIdentifier, pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set cache.
        BasePgslTypeDefinitionSyntaxTree.mTypeCache.set(lIdentifier, this);
    }

    /**
     * Determinate if declaration is a composite type.
     */
    protected override determinateIsComposite(): boolean {
        return false;
    }

    /**
     * Determinate if declaration is a constructable.
     */
    protected determinateIsConstructable(): boolean {
        return false;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected determinateIsFixed(): boolean {
        return false;
    }

    /**
     * Determinate if composite value with properties that can be access by index.
     */
    protected override determinateIsIndexable(): boolean {
        return false;
    }

    /**
     * Determinate if declaration is a plain type.
     */
    protected override determinateIsPlain(): boolean {
        return false;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        return false;
    }

    /**
     * Determinate if value is storable in a variable.
     */
    protected override determinateIsStorable(): boolean {
        return false;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate.
    }
}

export type PgslStringTypeDefinitionSyntaxTreeStructureData = {
};