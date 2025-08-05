import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

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
     * @param _pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same name.
     */
    protected override equals(_pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        return this.mEnumName === pTarget.enumName;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // Read enum type.
        const lEnumTypeDefinition = pValidationTrace.getScopedValue(this.mEnumName);

        // Read attachment from enum type.
        if (!(lEnumTypeDefinition instanceof BasePgslTypeDefinitionSyntaxTree)) {
            return false;
        }

        // Compare enum inner type with target type.
        return PgslEnumTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, lEnumTypeDefinition, pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // Read enum type.
        const lEnumTypeDefinition = pValidationTrace.getScopedValue(this.mEnumName);

        // Read attachment from enum type.
        if (!(lEnumTypeDefinition instanceof BasePgslTypeDefinitionSyntaxTree)) {
            return false;
        }

        // Compare enum inner type with target type.
        return PgslEnumTypeDefinitionSyntaxTree.implicitCastable(pValidationTrace, lEnumTypeDefinition, pTarget);
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
        const lEnumTypeDefinition = pValidationTrace.getScopedValue(this.mEnumName);

        // Read attachment from enum type.
        if (!(lEnumTypeDefinition instanceof BasePgslTypeDefinitionSyntaxTree)) {
            return {
                additional: undefined,
                baseType: PgslBaseTypeName.Enum,
                composite: false,
                indexable: false,
                storable: false,
                hostSharable: false,
                constructible: false,
                fixedFootprint: false,
            };
        }

        // Read enum type attachment.
        const lAliasType: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lEnumTypeDefinition);

        return {
            additional: undefined,
            baseType: PgslBaseTypeName.Sampler,

            // Copy of alias type attributes.
            composite: lAliasType.composite,
            indexable: lAliasType.indexable,
            storable: lAliasType.storable,
            hostSharable: lAliasType.hostSharable,
            constructible: lAliasType.constructible,
            fixedFootprint: lAliasType.fixedFootprint
        };
    }
}