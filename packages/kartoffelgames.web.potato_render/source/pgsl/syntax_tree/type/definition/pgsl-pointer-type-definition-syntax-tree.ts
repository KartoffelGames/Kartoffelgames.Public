import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslBaseTypeName } from '../enum/pgsl-base-type-name.enum.ts';
import { BasePgslTypeDefinitionSyntaxTree, type PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree.ts';

/**
 * Pointer type definition.
 */
export class PgslPointerTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
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
     * @param pReferenceType - References type of pointer.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pReferenceType: BasePgslTypeDefinitionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mReferencedType = pReferenceType;

        // Append inner type to child list.
        this.appendChild(pReferenceType);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastable(_pTarget: this): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isImplicitCastable(_pTarget: this): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        return {
            aliased: false,
            baseType: PgslBaseTypeName.Pointer,
            data: null,
            typeAttributes: {
                composite: false,
                constructable: false,
                fixed: false,
                indexable: false,
                plain: false,
                hostSharable: false,
                storable: true
            }
        };
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