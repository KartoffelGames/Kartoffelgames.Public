import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslAliasDeclarationSyntaxTree } from "../declaration/pgsl-alias-declaration-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Aliased type definition that aliases a plain type.
 */
export class PgslAliasedTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
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
    public override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Resolve alias declaration.
        const lThisAliasedDefinition: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mAliasName);
        if (!(lThisAliasedDefinition instanceof PgslAliasDeclarationSyntaxTree)) {
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
    public override isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Resolve alias declaration.
        const lThisAliasedDefinition: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mAliasName);
        if (!(lThisAliasedDefinition instanceof PgslAliasDeclarationSyntaxTree)) {
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
    public override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Resolve alias declaration.
        const lThisAliasedDefinition: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mAliasName);
        if (!(lThisAliasedDefinition instanceof PgslAliasDeclarationSyntaxTree)) {
            return false;
        }

        // Check if aliased type is explicit castable into target type.
        return lThisAliasedDefinition.type.isImplicitCastableInto(pValidationTrace, pTarget);
    }

    /**
     * Transpile current type definition into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        return `${this.mAliasName}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Resolve alias declaration.
        const lAliasedDefinition: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mAliasName);
        if (!(lAliasedDefinition instanceof PgslAliasDeclarationSyntaxTree)) {
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