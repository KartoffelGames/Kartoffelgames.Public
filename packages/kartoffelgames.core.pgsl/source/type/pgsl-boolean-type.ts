import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta, SyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslFileMetaInformation } from "../pgsl-file-meta-information.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Boolean type definition.
 */
export class PgslBooleanType extends BasePgslTypeDefinition {
    /**
     * Create a boolean type definition syntax tree.
     * 
     * @param pMeta - Optional existing meta data.
     * 
     * @returns Boolean type definition syntax tree. 
     */
    public static type(pMeta?: SyntaxTreeMeta): PgslBooleanType {
        // Create or convert existing metadata.
        let lTreeMetaData: BasePgslSyntaxTreeMeta = BasePgslSyntaxTree.emptyMeta();
        if (pMeta) {
            lTreeMetaData = {
                range: [pMeta.position.start.line, pMeta.position.start.column, pMeta.position.end.line, pMeta.position.end.column],
                buildIn: false
            };
        }

        return new PgslBooleanType(lTreeMetaData);
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pValidationTrace - Validation trace to use.
     * @param pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
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
    public override isExplicitCastableInto(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
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
    public override isImplicitCastableInto(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
        // A boolean is never explicit nor implicit castable.
        return false;
    }

    /**
     * Transpile type definition.
     * 
     * @param _pTrace - Transpilation scope.
     * 
     * @returns transpiled code.
     */
    protected override onTranspile(_pTrace: PgslFileMetaInformation): string {
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
    protected override onValidateIntegrity(_pValidationTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
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