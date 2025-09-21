import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta, SyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Boolean type definition.
 */
export class PgslBooleanTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    /**
     * Create a boolean type definition syntax tree.
     * 
     * @param pMeta - Optional existing meta data.
     * 
     * @returns Boolean type definition syntax tree. 
     */
    public static type(pMeta?: SyntaxTreeMeta): PgslBooleanTypeDefinitionSyntaxTree {
        // Create or convert existing metadata.
        let lTreeMetaData: BasePgslSyntaxTreeMeta = BasePgslSyntaxTree.emptyMeta();
        if (pMeta) {
            lTreeMetaData = {
                range: [pMeta.position.start.line, pMeta.position.start.column, pMeta.position.end.line, pMeta.position.end.column],
                buildIn: false
            };
        }

        return new PgslBooleanTypeDefinitionSyntaxTree(lTreeMetaData);
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pValidationTrace - Validation trace to use.
     * @param pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Read attachments from target type and check if it is a boolean type.
        const lTargetAttachments: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);
        if (lTargetAttachments.baseType !== PgslBaseTypeName.Boolean) {
            return false;
        }

        // Boolean type is always equal to itself.
        return true;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // A boolean is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    public override isImplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // A boolean is never explicit nor implicit castable.
        return false;
    }

    /**
     * Transpile type definition.
     * 
     * @returns transpiled code.
     */
    protected override onTranspile(): string {
        // Boolean type is not transpiled.
        return 'bool';
    }

    /**
     * Validate syntax tree integrity.
     * 
     * @param _pValidationTrace - Validation scope.
     * 
     * @returns validation attachment.
     */
    protected override onValidateIntegrity(_pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        return {
            baseType: PgslBaseTypeName.Boolean,
            storable: true,
            hostShareable: false,
            composite: false,
            constructible: true,
            fixedFootprint: true,
            indexable: false,

            concrete: true,
            scalar: true,
            plain: true
        };
    }
}