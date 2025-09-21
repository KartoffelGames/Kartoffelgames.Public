import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from "../expression/base-pgsl-expression-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBuildInTypeName } from "./enum/pgsl-build-in-type-name.enum.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";
import { PgslVectorTypeName } from "./enum/pgsl-vector-type-name.enum.ts";
import { PgslArrayTypeDefinitionSyntaxTree } from './pgsl-array-type-definition-syntax-tree.ts';
import { PgslBooleanTypeDefinitionSyntaxTree } from './pgsl-boolean-type-definition-syntax-tree.ts';
import { PgslInvalidTypeDefinitionSyntaxTree } from "./pgsl-invalid-type-definition-syntax-tree.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from './pgsl-vector-type-definition-syntax-tree.ts';

/**
 * Build in type definition that aliases a plain type.
 */
export class PgslBuildInTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mBuildInType: PgslBuildInTypeName;
    private readonly mTemplate!: BuildInTypeTemplate;
    private readonly mUnderlyingType: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pType: PgslBuildInTypeName, pTemplate: BuildInTypeTemplate) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mBuildInType = pType;
        this.mTemplate = pTemplate;

        // Determine aliased type.
        this.mUnderlyingType = this.determinateAliasedType(this.mBuildInType);

        // Append aliased type to child list.
        this.appendChild(this.mUnderlyingType);

        // Append template to child list when it is not null.
        if (this.mTemplate) {
            this.appendChild(this.mTemplate);
        }
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same comparison type.
     */
    protected override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Check inner type of aliased type for equality.
        return PgslBuildInTypeDefinitionSyntaxTree.equals(pValidationTrace, this.mUnderlyingType, pTarget);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Check if aliased type is explicit castable into target type.
        return PgslBuildInTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, this.mUnderlyingType, pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Check if aliased type is explicit castable into target type.
        return PgslBuildInTypeDefinitionSyntaxTree.implicitCastable(pValidationTrace, this.mUnderlyingType, pTarget);
    }

    /**
     * Transpile current type definition into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // TODO: Add buildin attributes based on type.

        return this.mUnderlyingType.transpile();
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Validate underlying type.
        this.mUnderlyingType.validate(pValidationTrace);

        // Read attachment from underlying type.
        const lUnderlyingTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mUnderlyingType);

        // Only clip distance needs validation.
        (() => {
            if (this.mBuildInType === PgslBuildInTypeName.ClipDistances) {
                // Template must be a expression.
                if (!(this.mTemplate instanceof BasePgslExpressionSyntaxTree)) {
                    pValidationTrace.pushError(`Clip distance buildin template value musst have a value expression.`, this.meta, this);
                    return;
                }

                // Read attachment from template expression.
                const lTemplateAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mTemplate);

                // Template needs to be a constant.
                if (lTemplateAttachment.fixedState < PgslValueFixedState.Constant) {
                    pValidationTrace.pushError(`Clip distance buildin template value musst be a constant.`, this.meta, this);
                }

                // Template needs to be a unsigned integer.
                if (!PgslNumericTypeDefinitionSyntaxTree.IsCastable(pValidationTrace, "implicit", lTemplateAttachment.resolveType, PgslNumericTypeName.UnsignedInteger)) {
                    pValidationTrace.pushError(`Clip distance buildin template value musst be a unassigned integer.`, this.meta, this);
                }
            }
        })();

        // Simply copy anything from aliased type attachment.
        return lUnderlyingTypeAttachment;
    }

    /**
     * Determinate if declaration is a composite type.
     */
    private determinateAliasedType(pBuildInType: PgslBuildInTypeName): BasePgslTypeDefinitionSyntaxTree {
        const lMetaInformation: BasePgslSyntaxTreeMeta = {
            range: [
                this.meta.position.start.line,
                this.meta.position.start.column,
                this.meta.position.end.line,
                this.meta.position.end.column
            ]
        };

        // Big ass switch case.
        switch (pBuildInType) {
            case PgslBuildInTypeName.Position: {
                const lFloatType = PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.Float, this.meta);
                return PgslVectorTypeDefinitionSyntaxTree.type(PgslVectorTypeName.Vector4, lFloatType, this.meta);
            }
            case PgslBuildInTypeName.LocalInvocationId: {
                return PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.GlobalInvocationId: {
                const lUnsignedIntType = PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
                return PgslVectorTypeDefinitionSyntaxTree.type(PgslVectorTypeName.Vector3, lUnsignedIntType, this.meta);
            }
            case PgslBuildInTypeName.WorkgroupId: {
                const lUnsignedIntType = PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
                return PgslVectorTypeDefinitionSyntaxTree.type(PgslVectorTypeName.Vector3, lUnsignedIntType, this.meta);
            }
            case PgslBuildInTypeName.NumWorkgroups: {
                const lUnsignedIntType = PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
                return PgslVectorTypeDefinitionSyntaxTree.type(PgslVectorTypeName.Vector3, lUnsignedIntType, this.meta);
            }
            case PgslBuildInTypeName.VertexIndex: {
                return PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.InstanceIndex: {
                return PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.FragDepth: {
                return PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.Float, this.meta);
            }
            case PgslBuildInTypeName.SampleIndex: {
                return PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.SampleMask: {
                return PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.LocalInvocationIndex: {
                return PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.FrontFacing: {
                return PgslBooleanTypeDefinitionSyntaxTree.type(this.meta);
            }
            case PgslBuildInTypeName.ClipDistances: {
                // When the template is a expression, we can use it, when not, we have to ignore it and let the validation handle the error.
                const lTemplateExpression = this.mTemplate instanceof BasePgslExpressionSyntaxTree ? this.mTemplate : null;

                // Create a new float number type.
                const lFloatType = PgslNumericTypeDefinitionSyntaxTree.type(PgslNumericTypeName.Float);

                return new PgslArrayTypeDefinitionSyntaxTree(lMetaInformation, lFloatType, lTemplateExpression);
            }
            default: {
                // Invalid buildin type.
                return PgslInvalidTypeDefinitionSyntaxTree.type(this.meta);
            }
        }
    }
}

type BuildInTypeTemplate = BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree | null;