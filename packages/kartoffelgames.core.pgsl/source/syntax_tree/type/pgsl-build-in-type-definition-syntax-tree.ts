import { Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslArrayTypeDefinitionSyntaxTree } from './pgsl-array-type-definition-syntax-tree.ts';
import { PgslBooleanTypeDefinitionSyntaxTree } from './pgsl-boolean-type-definition-syntax-tree.ts';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from './pgsl-vector-type-definition-syntax-tree.ts';
import { PgslBuildInTypeName } from "./enum/pgsl-build-in-type-name.enum.ts";
import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslVectorTypeName } from "./enum/pgsl-vector-type-name.enum.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from "../expression/base-pgsl-expression-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";

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
    protected override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // Check inner type of aliased type for equality.
        return PgslBuildInTypeDefinitionSyntaxTree.equals(pValidationTrace, this.mUnderlyingType, pTarget);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // Check if aliased type is explicit castable into target type.
        return PgslBuildInTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, this.mUnderlyingType, pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
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

        return this.mUnderlyingType.transpile()
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
                    pValidationTrace.pushError(`Clip distance buildin template value musst be a value expression.`, this.meta, this);
                    return;
                }

                // Read attachment from template expression.
                const lTemplateAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mTemplate);

                // Template needs to be a constant.
                if (lTemplateAttachment.fixedState < PgslValueFixedState.Constant) {
                    pValidationTrace.pushError(`Clip distance buildin template value musst be a constant.`, this.meta, this);
                }

                // Template needs to be a number expression.
                if (!(lTemplateAttachment.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
                    pValidationTrace.pushError(`Clip distance buildin template value musst be a unassigned integer.`, this.meta, this);
                    return;
                }

                // Template needs to be a unsigned integer.
                if (lTemplateAttachment.resolveType.numericType !== PgslNumericTypeName.UnsignedInteger) { // TODO: Or needs to be implicit castable.
                    pValidationTrace.pushError(`Clip distance buildin template value musst be a unassigned integer.`, this.meta, this);
                }
            }
        })();

        // Simply copy anything from aliased type attachment.
        return {
            additional: lUnderlyingTypeAttachment.additional,
            baseType: lUnderlyingTypeAttachment.baseType,
            storable: lUnderlyingTypeAttachment.storable,
            hostShareable: lUnderlyingTypeAttachment.hostShareable,
            composite: lUnderlyingTypeAttachment.composite,
            constructible: lUnderlyingTypeAttachment.constructible,
            fixedFootprint: lUnderlyingTypeAttachment.fixedFootprint,
            indexable: lUnderlyingTypeAttachment.indexable
        };
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
                return new PgslVectorTypeDefinitionSyntaxTree(PgslVectorTypeName.Vector4, new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.Float, lMetaInformation), lMetaInformation);
            }
            case PgslBuildInTypeName.LocalInvocationId: {
                return new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation);
            }
            case PgslBuildInTypeName.GlobalInvocationId: {
                return new PgslVectorTypeDefinitionSyntaxTree(PgslVectorTypeName.Vector3, new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation), lMetaInformation);
            }
            case PgslBuildInTypeName.WorkgroupId: {
                return new PgslVectorTypeDefinitionSyntaxTree(PgslVectorTypeName.Vector3, new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation), lMetaInformation);
            }
            case PgslBuildInTypeName.NumWorkgroups: {
                return new PgslVectorTypeDefinitionSyntaxTree(PgslVectorTypeName.Vector3, new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation), lMetaInformation);
            }
            case PgslBuildInTypeName.VertexIndex: {
                return new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation);
            }
            case PgslBuildInTypeName.InstanceIndex: {
                return new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation);
            }
            case PgslBuildInTypeName.FragDepth: {
                return new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.Float, lMetaInformation);
            }
            case PgslBuildInTypeName.SampleIndex: {
                return new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation);
            }
            case PgslBuildInTypeName.SampleMask: {
                return new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation);
            }
            case PgslBuildInTypeName.LocalInvocationIndex: {
                return new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.UnsignedInteger, lMetaInformation);
            }
            case PgslBuildInTypeName.FrontFacing: {
                return new PgslBooleanTypeDefinitionSyntaxTree(lMetaInformation);
            }
            case PgslBuildInTypeName.ClipDistances: {
                // Must have a template.
                if (!this.mTemplate) {
                    throw new Exception(`Clip distance buildin must have a template value.`, this);
                }

                // Template must be a expression.
                if (!(this.mTemplate instanceof BasePgslExpressionSyntaxTree)) {
                    throw new Exception(`Clip distance buildin template value musst be a value expression.`, this);
                }

                return new PgslArrayTypeDefinitionSyntaxTree(lMetaInformation, new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.Float, lMetaInformation), this.mTemplate);
            }
            default: {
                throw new Exception(`Build in type "${this.mBuildInType}" not defined.`, this);
            }
        }
    }
}

type BuildInTypeTemplate = BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree | null;