import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslEnumDeclarationSyntaxTree, PgslEnumDeclarationSyntaxTreeValidationAttachment } from "../declaration/pgsl-enum-declaration-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslInvalidTypeDefinitionSyntaxTree } from "./pgsl-invalid-type-definition-syntax-tree.ts";

/**
 * Enum type definition that aliases a plain type.
 */
export class PgslEnumTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mEnumName: string;

    /**
     * Enum name.
     */
    public get enumName(): string {
        return this.mEnumName;
    }

    /**
     * Constructor.
     * 
     * @param pEnumName - Enum name.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pEnumName: string, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mEnumName = pEnumName;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same name.
     */
    protected override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Read enum type.
        const lEnumSyntaxTree = pValidationTrace.getScopedValue(this.mEnumName);

        // This enum name is not an enum so it can not be casted.
        if (!(lEnumSyntaxTree instanceof PgslEnumDeclarationSyntaxTree)) {
            return false;
        }

        // Read the enum attachment.
        const lEnumDeclarationAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lEnumSyntaxTree);
        
        return BasePgslTypeDefinitionSyntaxTree.equals(pValidationTrace, lEnumDeclarationAttachment.type, pTarget);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Read enum type.
        const lEnumSyntaxTree = pValidationTrace.getScopedValue(this.mEnumName);

        // This enum name is not an enum so it can not be casted.
        if (!(lEnumSyntaxTree instanceof PgslEnumDeclarationSyntaxTree)) {
            return false;
        }

        // Read the enum attachment.
        const lEnumDeclarationAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lEnumSyntaxTree);

        // Compare enum inner type with target type.
        return PgslEnumTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, lEnumDeclarationAttachment.type, pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Read enum type.
        const lEnumSyntaxTree = pValidationTrace.getScopedValue(this.mEnumName);

        // This enum name is not an enum so it can not be casted.
        if (!(lEnumSyntaxTree instanceof PgslEnumDeclarationSyntaxTree)) {
            return false;
        }

        // Read the enum attachment.
        const lEnumDeclarationAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lEnumSyntaxTree);

        // Compare enum inner type with target type.
        return PgslEnumTypeDefinitionSyntaxTree.implicitCastable(pValidationTrace,  lEnumDeclarationAttachment.type, pTarget);
    }

    /**
     * Transpile current type definition into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // A transpiled enum is allways a u32 type.
        // String values can not be used to be transpiled.
        return `u32`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace to use.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Read enum type.
        const lEnumSyntaxTree = pValidationTrace.getScopedValue(this.mEnumName);

        // Read attachment from enum type.
        if (!(lEnumSyntaxTree instanceof PgslEnumDeclarationSyntaxTree)) {
            // Create, validate and return attachment for an invalid type.
            return pValidationTrace.getAttachment(PgslInvalidTypeDefinitionSyntaxTree.type(this.meta).validate(pValidationTrace));
        }

        // Read the enum attachment.
        const lEnumDeclarationAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lEnumSyntaxTree);

        // Read and return underlying enum type attachment.
        return pValidationTrace.getAttachment(lEnumDeclarationAttachment.type);
    }
}