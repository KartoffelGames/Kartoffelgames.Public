import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from "../expression/base-pgsl-expression.ts";
import { PgslFileMetaInformation } from "../pgsl-file-meta-information.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslBuildInTypeName } from "./enum/pgsl-build-in-type-name.enum.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";
import { PgslVectorTypeName } from "./enum/pgsl-vector-type-name.enum.ts";
import { PgslArrayTypeDefinition } from './pgsl-array-type-definition.ts';
import { PgslBooleanTypeDefinition } from './pgsl-boolean-type-definition.ts';
import { PgslInvalidTypeDefinition } from "./pgsl-invalid-type-definition.ts";
import { PgslNumericTypeDefinition } from './pgsl-numeric-type-definition.ts';
import { PgslVectorTypeDefinition } from './pgsl-vector-type-definition.ts';

/**
 * Build in type definition that aliases a plain type.
 */
export class PgslBuildInTypeDefinition extends BasePgslTypeDefinition {
    private readonly mBuildInType: PgslBuildInTypeName;
    private readonly mTemplate!: BuildInTypeTemplate;
    private readonly mUnderlyingType: BasePgslTypeDefinition;

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
    public override equals(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Check inner type of aliased type for equality.
        return this.mUnderlyingType.equals(pValidationTrace, pTarget);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Check if aliased type is explicit castable into target type.
        return this.mUnderlyingType.isExplicitCastableInto(pValidationTrace, pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    public override isImplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Check if aliased type is explicit castable into target type.
        return this.mUnderlyingType.isImplicitCastableInto(pValidationTrace, pTarget);
    }

    /**
     * Transpile current type definition into a string.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        // TODO: Add buildin attributes based on type.

        return this.mUnderlyingType.transpile(pTrace);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Validate underlying type.
        this.mUnderlyingType.validate(pValidationTrace);

        // Read attachment from underlying type.
        const lUnderlyingTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mUnderlyingType);

        // Only clip distance needs validation.
        (() => {
            if (this.mBuildInType === PgslBuildInTypeName.ClipDistances) {
                // Template must be a expression.
                if (!(this.mTemplate instanceof BasePgslExpression)) {
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
                if (!PgslNumericTypeDefinition.IsCastable(pValidationTrace, "implicit", lTemplateAttachment.resolveType, PgslNumericTypeName.UnsignedInteger)) {
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
    private determinateAliasedType(pBuildInType: PgslBuildInTypeName): BasePgslTypeDefinition {
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
                const lFloatType = PgslNumericTypeDefinition.type(PgslNumericTypeName.Float, this.meta);
                return PgslVectorTypeDefinition.type(PgslVectorTypeName.Vector4, lFloatType, this.meta);
            }
            case PgslBuildInTypeName.LocalInvocationId: {
                return PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.GlobalInvocationId: {
                const lUnsignedIntType = PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
                return PgslVectorTypeDefinition.type(PgslVectorTypeName.Vector3, lUnsignedIntType, this.meta);
            }
            case PgslBuildInTypeName.WorkgroupId: {
                const lUnsignedIntType = PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
                return PgslVectorTypeDefinition.type(PgslVectorTypeName.Vector3, lUnsignedIntType, this.meta);
            }
            case PgslBuildInTypeName.NumWorkgroups: {
                const lUnsignedIntType = PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
                return PgslVectorTypeDefinition.type(PgslVectorTypeName.Vector3, lUnsignedIntType, this.meta);
            }
            case PgslBuildInTypeName.VertexIndex: {
                return PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.InstanceIndex: {
                return PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.FragDepth: {
                return PgslNumericTypeDefinition.type(PgslNumericTypeName.Float, this.meta);
            }
            case PgslBuildInTypeName.SampleIndex: {
                return PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.SampleMask: {
                return PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.LocalInvocationIndex: {
                return PgslNumericTypeDefinition.type(PgslNumericTypeName.UnsignedInteger, this.meta);
            }
            case PgslBuildInTypeName.FrontFacing: {
                return PgslBooleanTypeDefinition.type(this.meta);
            }
            case PgslBuildInTypeName.ClipDistances: {
                // When the template is a expression, we can use it, when not, we have to ignore it and let the validation handle the error.
                const lTemplateExpression = this.mTemplate instanceof BasePgslExpression ? this.mTemplate : null;

                // Create a new float number type.
                const lFloatType = PgslNumericTypeDefinition.type(PgslNumericTypeName.Float);

                return new PgslArrayTypeDefinition(lMetaInformation, lFloatType, lTemplateExpression);
            }
            default: {
                // Invalid buildin type.
                return PgslInvalidTypeDefinition.type(this.meta);
            }
        }
    }
}

type BuildInTypeTemplate = BasePgslTypeDefinition | BasePgslExpression | null;