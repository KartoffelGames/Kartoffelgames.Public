import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

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
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pReferenceType: BasePgslTypeDefinitionSyntaxTree) {
        super(pMeta);

        // Set data.
        this.mReferencedType = pReferenceType;

        // Append inner type to child list.
        this.appendChild(pReferenceType);
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same comparison type.
     */
    protected override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        return PgslPointerTypeDefinitionSyntaxTree.equals(pValidationTrace, this.referencedType, pTarget.referencedType);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    protected override isImplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Transpile current type definition into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // Transpile pointer type. // TODO: This must be autoed or give the user a way to specify it (private, read_write, etc.).
        return `ptr<private, ${this.mReferencedType.transpile()}, read_write>`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Read type attachment.
        const lTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mReferencedType);

        // Only storable types.
        if (!lTypeAttachment.storable) {
            throw new Exception(`Referenced types of pointers need to be storable`, this);
        }

        // TODO: Not on handle/texture or None address space.

        return {
            additional: undefined,
            baseType: PgslBaseTypeName.Pointer,
            composite: false,
            indexable: false,
            storable: true,
            hostSharable: false,
            constructible: false,
            fixedFootprint: false,
        };
    }
}

export type PgslPointerTypeDefinitionSyntaxTreeStructureData = {
    referencedType: BasePgslTypeDefinitionSyntaxTree;
};