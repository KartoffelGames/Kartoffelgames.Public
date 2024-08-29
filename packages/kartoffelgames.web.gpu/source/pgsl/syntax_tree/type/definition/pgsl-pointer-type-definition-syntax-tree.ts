import { Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslPointerTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslPointerTypeDefinitionSyntaxTreeStructureData> {
    private readonly mReferencedType: BasePgslTypeDefinitionSyntaxTree;

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
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

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
     * On equal check of type definitions.
     * 
     * @param pTarget - Target type definition.
     */
    protected override onEqual(pTarget: this): boolean {
        // TODO: Define usage type. Storage/Function/Private/Handle/Workgroup

        return this.mReferencedType.equals(pTarget.referencedType);
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