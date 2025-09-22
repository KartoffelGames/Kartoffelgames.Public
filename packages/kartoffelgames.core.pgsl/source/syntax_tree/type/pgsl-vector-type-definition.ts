import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta, SyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslTranspilationTrace } from "../pgsl-tranpilation-trace.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslVectorTypeName } from "./enum/pgsl-vector-type-name.enum.ts";

/**
 * Vector type definition.
 */
export class PgslVectorTypeDefinition extends BasePgslTypeDefinition<PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
    /**
     * Create a vector type definition syntax tree.
     * 
     * @param pVectorType - Concreate vector dimension.
     * @param pInnerType - Inner type of vector.
     * @param pMeta - Optional existing meta data.
     * 
     * @returns Vector type definition syntax tree. 
     */
    public static type(pVectorType: PgslVectorTypeName, pInnerType: BasePgslTypeDefinition, pMeta?: SyntaxTreeMeta): PgslVectorTypeDefinition {
        // Create or convert existing metadata.
        let lTreeMetaData: BasePgslSyntaxTreeMeta = BasePgslSyntaxTree.emptyMeta();
        if (pMeta) {
            lTreeMetaData = {
                range: [pMeta.position.start.line, pMeta.position.start.column, pMeta.position.end.line, pMeta.position.end.column],
                buildIn: false
            };
        }

        return new PgslVectorTypeDefinition(pVectorType, pInnerType, lTreeMetaData);
    }

    private readonly mInnerType: BasePgslTypeDefinition;
    private readonly mVectorType: PgslVectorTypeName;

    /**
     * Inner type of vector.
     */
    public get innerType(): BasePgslTypeDefinition {
        return this.mInnerType;
    }

    /**
     * Vector dimension.
     */
    public get vectorDimension(): PgslVectorTypeName {
        return this.mVectorType;
    }

    /**
     * Constructor.
     * 
     * @param pVectorType - Concreate vector dimension.
     * @param pInnerType - Inner type of vector.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pVectorType: PgslVectorTypeName, pInnerType: BasePgslTypeDefinition, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mInnerType = pInnerType;
        this.mVectorType = pVectorType;

        // Append inner type to child list.
        this.appendChild(this.mInnerType);
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
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Must both be a vector.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Vector) {
            return false;
        }

        // Cast to vector attachment as we now know it is one.
        const lVectorTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // Inner type must be equal.
        if (!this.mInnerType.equals(pValidationTrace, lVectorTargetAttachment.innerType)) {
            return false;
        }

        // Vector dimensions must be equal.
        return this.mVectorType === lVectorTargetAttachment.dimension;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public override isExplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Must both be a vector.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Vector) {
            return false;
        }

        // Cast to vector attachment as we now know it is one.
        const lVectorTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // If vector dimensions are not equal, it is not castable.
        if (this.mVectorType !== lVectorTargetAttachment.dimension) {
            return false;
        }

        // It is when inner types are explicit castable.
        return  this.mInnerType.isExplicitCastableInto(pValidationTrace, lVectorTargetAttachment.innerType);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    public override isImplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Must both be a vector.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Vector) {
            return false;
        }

        // Cast to vector attachment as we now know it is one.
        const lVectorTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // If vector dimensions are not equal, it is not castable.
        if (this.mVectorType !== lVectorTargetAttachment.dimension) {
            return false;
        }

        // It is when inner types are implicit castable.
        return this.mInnerType.isImplicitCastableInto(pValidationTrace, lVectorTargetAttachment.innerType);
    }

    /**
     * Transpile the syntax tree into wgsl.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled wgsl code.
     */
    protected override onTranspile(pTrace: PgslTranspilationTrace): string {
        // Transpile vector type dimenstion.
        const lVectorDimensionName: string = (() => {
            switch (this.mVectorType) {
                case PgslVectorTypeName.Vector2:
                    return 'vec2';
                case PgslVectorTypeName.Vector3:
                    return 'vec3';
                case PgslVectorTypeName.Vector4:
                    return 'vec4';
            }
        })();

        // Insert inner type as template parameter.
        return `${lVectorDimensionName}<${this.mInnerType.transpile(pTrace)}>`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
        // Validate inner type.
        this.mInnerType.validate(pValidationTrace);

        // Read attachments from inner type.
        const lInnerTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mInnerType);

        // Must be scalar.
        if (!lInnerTypeAttachment.scalar) {
            pValidationTrace.pushError('Vector type must be a scalar value', this.meta, this);
        }

        return {
            baseType: PgslBaseTypeName.Vector,

            // Always accessible as composite (swizzle) or index.
            composite: true,
            indexable: true,
            scalar: false,
            plain: true,
            concrete: true,

            // Copy of inner type attachment.
            storable: lInnerTypeAttachment.storable,
            hostShareable: lInnerTypeAttachment.hostShareable,
            constructible: lInnerTypeAttachment.constructible,
            fixedFootprint: lInnerTypeAttachment.fixedFootprint,

            // Additional vector data.
            innerType: this.mInnerType,
            dimension: this.mVectorType
        };
    }
}

export type PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData = {
    innerType: BasePgslTypeDefinition;
    dimension: PgslVectorTypeName;
};