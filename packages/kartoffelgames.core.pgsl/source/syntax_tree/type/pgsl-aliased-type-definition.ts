import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslAliasDeclaration } from "../declaration/pgsl-alias-declaration.ts";
import { PgslFileMetaInformation } from "../pgsl-file-meta-information.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Aliased type definition that aliases a plain type.
 */
export class PgslAliasedTypeDefinition extends BasePgslTypeDefinition {
    private readonly mAliasName: string;

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     * @param pAliasName - Alias name.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pAliasName: string) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mAliasName = pAliasName;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same comparison type.
     */
    public override equals(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Resolve alias declaration.
        const lThisAliasedDefinition: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mAliasName);
        if (!(lThisAliasedDefinition instanceof PgslAliasDeclaration)) {
            return false;
        }

        // Check inner type of aliased type for equality.
        return lThisAliasedDefinition.type.equals(pValidationTrace, pTarget);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Resolve alias declaration.
        const lThisAliasedDefinition: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mAliasName);
        if (!(lThisAliasedDefinition instanceof PgslAliasDeclaration)) {
            return false;
        }

        // Check if aliased type is explicit castable into target type.
        return lThisAliasedDefinition.type.isExplicitCastableInto(pValidationTrace, pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    public override isImplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Resolve alias declaration.
        const lThisAliasedDefinition: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mAliasName);
        if (!(lThisAliasedDefinition instanceof PgslAliasDeclaration)) {
            return false;
        }

        // Check if aliased type is explicit castable into target type.
        return lThisAliasedDefinition.type.isImplicitCastableInto(pValidationTrace, pTarget);
    }

    /**
     * Transpile current type definition into a string.
     * 
     * @param _pTrace - Transpilation scope.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(_pTrace: PgslFileMetaInformation): string {
        return `${this.mAliasName}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Resolve alias declaration.
        const lAliasedDefinition: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mAliasName);
        if (!(lAliasedDefinition instanceof PgslAliasDeclaration)) {
            pValidationTrace.pushError(`Name '${this.mAliasName}' is does not resolve to an alias declaration.`, this.meta, this);

            return {
                baseType: PgslBaseTypeName.Invalid,
                storable: false,
                hostShareable: false,
                composite: false,
                constructible: false,
                fixedFootprint: false,
                indexable: false,
                concrete: false,
                scalar: false,
                plain: false
            };
        }

        // Simply copy anything from aliased type attachment.
        return pValidationTrace.getAttachment(lAliasedDefinition.type);
    }
}