import { Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';

export class PgslPointerTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslPointerTypeDefinitionSyntaxTreeStructureData> {
    private readonly mReferencedType!: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Referenced type of pointer.
     */
    public get referencedType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mReferencedType;
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
    public constructor(pData: PgslPointerTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        const lIdentifier: string = `ID:POINTER->${pData.referencedType.identifier}`;

        // Return cached when available.
        if (BasePgslTypeDefinitionSyntaxTree.mTypeCache.has(lIdentifier)) {
            return BasePgslTypeDefinitionSyntaxTree.mTypeCache.get(lIdentifier)! as PgslPointerTypeDefinitionSyntaxTree;
        }

        // Create. 
        super(PgslTypeName.Pointer, lIdentifier, pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set cache.
        BasePgslTypeDefinitionSyntaxTree.mTypeCache.set(lIdentifier, this);

        // Set data.
        this.mReferencedType = pData.referencedType;
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
        return false;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected override determinateIsFixed(): boolean {
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
        return true;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Only storable types.
        if (!this.mReferencedType.isStorable) {
            throw new Exception(`Referenced types of pointers need to be storable`, this);
        }

        // TODO: Not on handle/texture or None address space.
    }
}

export type PgslPointerTypeDefinitionSyntaxTreeStructureData = {
    referencedType: BasePgslTypeDefinitionSyntaxTree;
};