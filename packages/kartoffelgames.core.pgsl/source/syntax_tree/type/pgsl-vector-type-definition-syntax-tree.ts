import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta, SyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslVectorTypeName } from "./enum/pgsl-vector-type-name.enum.ts";

/**
 * Vector type definition.
 */
export class PgslVectorTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
    /**
     * Create a vector type definition syntax tree.
     * 
     * @param pVectorType - Concreate vector dimension.
     * @param pInnerType - Inner type of vector.
     * @param pMeta - Optional existing meta data.
     * 
     * @returns Vector type definition syntax tree. 
     */
    public static type(pVectorType: PgslVectorTypeName, pInnerType: BasePgslTypeDefinitionSyntaxTree, pMeta?: SyntaxTreeMeta): PgslVectorTypeDefinitionSyntaxTree {
        // Create or convert existing metadata.
        let lTreeMetaData: BasePgslSyntaxTreeMeta = BasePgslSyntaxTree.emptyMeta();
        if (pMeta) {
            lTreeMetaData = {
                range: [pMeta.position.start.line, pMeta.position.start.column, pMeta.position.end.line, pMeta.position.end.column],
                buildIn: false
            };
        }

        return new PgslVectorTypeDefinitionSyntaxTree(pVectorType, pInnerType, lTreeMetaData);
    }

    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mVectorType: PgslVectorTypeName;

    /**
     * Inner type of vector.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
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
    public constructor(pVectorType: PgslVectorTypeName, pInnerType: BasePgslTypeDefinitionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
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
    public override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
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
    public override isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
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
    public override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
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
     * @returns Transpiled wgsl code.
     */
    protected override onTranspile(): string {
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
        return `${lVectorDimensionName}<${this.mInnerType.transpile()}>`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
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
    innerType: BasePgslTypeDefinitionSyntaxTree;
    dimension: PgslVectorTypeName;
};