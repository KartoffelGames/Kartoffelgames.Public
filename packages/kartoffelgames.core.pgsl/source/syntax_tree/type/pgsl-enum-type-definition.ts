import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslEnumDeclaration, PgslEnumDeclarationSyntaxTreeValidationAttachment } from "../declaration/pgsl-enum-declaration.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslInvalidTypeDefinition } from "./pgsl-invalid-type-definition.ts";

/**
 * Enum type definition that aliases a plain type.
 */
export class PgslEnumTypeDefinition extends BasePgslTypeDefinition {
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
    public override equals(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read enum type.
        const lThisEnumSyntaxTree = pValidationTrace.getScopedValue(this.mEnumName);

        // This enum name is not an enum so it can not be casted.
        if (!(lThisEnumSyntaxTree instanceof PgslEnumDeclaration)) {
            return false;
        }

        // Read the enum attachment.
        const lThisEnumDeclarationAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lThisEnumSyntaxTree);
        
        return lThisEnumDeclarationAttachment.type.equals(pValidationTrace, pTarget);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    public override isExplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read enum type.
        const lThisEnumSyntaxTree = pValidationTrace.getScopedValue(this.mEnumName);

        // This enum name is not an enum so it can not be casted.
        if (!(lThisEnumSyntaxTree instanceof PgslEnumDeclaration)) {
            return false;
        }

        // Read the enum attachment.
        const lThisEnumDeclarationAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lThisEnumSyntaxTree);

        // Compare enum inner type with target type.
        return lThisEnumDeclarationAttachment.type.isExplicitCastableInto(pValidationTrace, pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    public override isImplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read enum type.
        const lThisEnumSyntaxTree = pValidationTrace.getScopedValue(this.mEnumName);

        // This enum name is not an enum so it can not be casted.
        if (!(lThisEnumSyntaxTree instanceof PgslEnumDeclaration)) {
            return false;
        }

        // Read the enum attachment.
        const lThisEnumDeclarationAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lThisEnumSyntaxTree);

        // Compare enum inner type with target type.
        return lThisEnumDeclarationAttachment.type.isImplicitCastableInto(pValidationTrace, pTarget);
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
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Read enum type.
        const lEnumSyntaxTree = pValidationTrace.getScopedValue(this.mEnumName);

        // Read attachment from enum type.
        if (!(lEnumSyntaxTree instanceof PgslEnumDeclaration)) {
            // Create, validate and return attachment for an invalid type.
            return pValidationTrace.getAttachment(PgslInvalidTypeDefinition.type(this.meta).validate(pValidationTrace));
        }

        // Read the enum attachment.
        const lEnumDeclarationAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lEnumSyntaxTree);

        // Read and return underlying enum type attachment.
        return pValidationTrace.getAttachment(lEnumDeclarationAttachment.type);
    }
}