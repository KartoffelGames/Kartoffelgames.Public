import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslStructDeclaration } from "../declaration/pgsl-struct-declaration.ts";
import { PgslAttributeList } from "../general/pgsl-attribute-list.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Struct type definition.
 */
export class PgslStructTypeDefinition extends BasePgslTypeDefinition<PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
    private readonly mStructName: string;

    /**
     * Struct name.
     */
    public get structName(): string {
        return this.mStructName;
    }

    /**
     * Constructor.
     * 
     * @param pStructName - name of struct.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pStructName: string, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mStructName = pStructName;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from this and target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Must both be a sampler.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Texture) {
            return false;
        }

        // Convert attachments to struct attachments as we now know both are structs.
        const lThisStructTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData> = pValidationTrace.getAttachment(this);
        const lTargetStructTypeAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        return lThisStructTypeAttachment.struct.name === lTargetStructTypeAttachment.struct.name;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
        // A struct is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isImplicitCastableInto(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
        // A struct is never explicit nor implicit castable.
        return false;
    }

    /**
     * Transpile current type definition into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        return `${this.mStructName}`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace to use.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
        // Read aliased type.
        const lStruct: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mStructName);

        if (!(lStruct instanceof PgslStructDeclaration)) {
            pValidationTrace.pushError(`Name '${this.mStructName}' is does not resolve to a struct declaration.`, this.meta, this);

            // Create empty meta.
            const lEmptyMeta: BasePgslSyntaxTreeMeta = BasePgslSyntaxTree.emptyMeta();

            // Create and validate empty struct.
            const lPlaceholderStruct: PgslStructDeclaration = new PgslStructDeclaration(this.mStructName, [], new PgslAttributeList(lEmptyMeta, []), lEmptyMeta);

            // Validate placeholder struct.
            lPlaceholderStruct.validate(pValidationTrace);

            return {
                // Default struct information.
                baseType: PgslBaseTypeName.Struct,
                composite: true,
                indexable: false,
                storable: true,
                scalar: false,
                concrete: true,
                plain: true,

                // Data normaly from struct properties.
                hostShareable: false,
                constructible: false,
                fixedFootprint: false,

                // Struct.
                struct: lPlaceholderStruct,
            };
        }

        // Check properties for constructable, host sharable, and fixed footprint characteristics
        const [lConstructable, lHostSharable, lFixedFootprint]: [boolean, boolean, boolean] = (() => {
            let lConstructable = true;
            let lHostSharable = true;
            let lFixedFootprint = true;

            // Check all properties except the last one for fixed footprint
            for (const lProperty of lStruct.properties) {
                const lPropertyTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lProperty.type);

                // Check if property is constructible
                lConstructable &&= lPropertyTypeAttachment.constructible;

                // Check if property is host sharable
                lHostSharable &&= lPropertyTypeAttachment.hostShareable;

                // For fixed footprint: all properties except the last must be fixed
                lFixedFootprint &&= lPropertyTypeAttachment.fixedFootprint;
            }

            return [lConstructable, lHostSharable, lFixedFootprint];
        })();

        return {
            // Default struct information.
            baseType: PgslBaseTypeName.Struct,
            composite: true,
            indexable: false,
            storable: true,
            scalar: false,
            concrete: true,
            plain: true,

            // Only takes affect when all members are sharing the same property.
            hostShareable: lHostSharable,
            constructible: lConstructable,
            fixedFootprint: lFixedFootprint,

            // Struct.
            struct: lStruct
        };
    }
}

export type PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData = {
    struct: PgslStructDeclaration;
};