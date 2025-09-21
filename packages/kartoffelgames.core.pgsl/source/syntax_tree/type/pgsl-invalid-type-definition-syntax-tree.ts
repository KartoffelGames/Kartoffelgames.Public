import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta, SyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Invalid type definition.
 */
export class PgslInvalidTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    /**
     * Create a new instance of the invalid type definition syntax tree.
     * 
     * @param pMeta - Optional existing meta data.
     * 
     * @returns A new instance of the invalid type definition syntax tree.
     */
    public static type(pMeta?: SyntaxTreeMeta): PgslInvalidTypeDefinitionSyntaxTree {
        // Create or convert existing metadata.
        let lTreeMetaData: BasePgslSyntaxTreeMeta = BasePgslSyntaxTree.emptyMeta();
        if (pMeta) {
            lTreeMetaData = {
                range: [pMeta.position.start.line, pMeta.position.start.column, pMeta.position.end.line, pMeta.position.end.column],
                buildIn: false
            };
        }

        return new PgslInvalidTypeDefinitionSyntaxTree(lTreeMetaData);
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns always false.
     */
    public override equals(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        return false;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns always false.
     */
    public override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns always false.
     */
    public override isImplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        return false;
    }

    /**
     * Transpile type definition.
     * 
     * @returns transpiled code.
     */
    protected override onTranspile(): string {
        return '##invalid##';
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
}