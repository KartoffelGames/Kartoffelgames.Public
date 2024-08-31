import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslBooleanTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslBooleanTypeDefinitionSyntaxTreeStructureData> {
    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslBooleanTypeDefinitionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, PgslTypeName.Boolean, pMeta, pBuildIn);
        if (this.loadedFromCache) {
            return this;
        }
    }

    /**
     * Determinate structures identifier.
     */
    protected determinateIdentifier(this: null, _pData: PgslBooleanTypeDefinitionSyntaxTreeStructureData): string {
        return 'ID:TYPE-DEF_BOOLEAN->BOOLEAN';
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
    protected override determinateIsConstructable(): boolean {
        return true;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected override determinateIsFixed(): boolean {
        return true;
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
        return true;
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
        return true;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate.
    }
}

export type PgslBooleanTypeDefinitionSyntaxTreeStructureData = {
};