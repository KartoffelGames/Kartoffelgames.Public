import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslBaseType } from '../enum/pgsl-base-type.enum';
import { PgslBuildInTypeName } from '../enum/pgsl-build-in-type-name.enum';
import { PgslNumericTypeName } from '../enum/pgsl-numeric-type-name.enum';
import { PgslVectorTypeName } from '../enum/pgsl-vector-type-name.enum';
import { PgslTypeDeclarationSyntaxTree } from '../pgsl-type-declaration-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree';
import { PgslArrayTypeDefinitionSyntaxTree } from './pgsl-array-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from './pgsl-boolean-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from './pgsl-vector-type-definition-syntax-tree';

/**
 * Build in type definition that aliases a plain type.
 */
export class PgslBuildInTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mBuildInType: PgslBuildInTypeName;
    private readonly mTemplate!: BuildInTypeTemplate;

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pType: PgslBuildInTypeName, pTemplate: BuildInTypeTemplate, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mBuildInType = pType;
        this.mTemplate = pTemplate;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isExplicitCastable(pTarget: this): boolean {
        // A build in mirrows aliased.
        return this.aliasedType.explicitCastable(pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isImplicitCastable(pTarget: this): boolean {
        // A build in mirrows aliased.
        return this.aliasedType.implicitCastable(pTarget);
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        // Read aliased type.
        const lAliasedType: BasePgslTypeDefinitionSyntaxTree = this.determinateAliasedType();
        this.appendChild(lAliasedType);

        return {
            aliased: lAliasedType,
            baseType: PgslBaseType.BuildIn,
            setupData: null,
            typeAttributes: {
                composite: lAliasedType.isComposite,
                constructable: lAliasedType.isConstructable,
                fixed: lAliasedType.isFixed,
                indexable: lAliasedType.isIndexable,
                plain: lAliasedType.isPlainType,
                hostSharable: lAliasedType.isHostShareable,
                storable: lAliasedType.isStorable
            }
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Only clip distance needs validation.
        if (this.mBuildInType === PgslBuildInTypeName.ClipDistances) {
            // Template must be a expression.
            if (!(this.mTemplate instanceof BasePgslExpressionSyntaxTree)) {
                throw new Exception(`Clip distance buildin template value musst be a value expression.`, this);
            }

            // Template needs to be a constant.
            if (!this.mTemplate.isConstant) {
                throw new Exception(`Clip distance buildin template value musst be a constant.`, this);
            }

            // Template needs to be a number expression.
            if (!(this.mTemplate.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
                throw new Exception(`Clip distance buildin template value musst be a unssigned integer.`, this);
            }

            // Template needs to be a unsigned integer.
            if (this.mTemplate.resolveType.numericType !== PgslNumericTypeName.UnsignedInteger) { // TODO: Or needs to be implicit castable.
                throw new Exception(`Clip distance buildin template value musst be a unssigned integer.`, this);
            }
        }
    }

    /**
     * Determinate if declaration is a composite type.
     */
    private determinateAliasedType(): BasePgslTypeDefinitionSyntaxTree {
        const lMetaInformation: BasePgslSyntaxTreeMeta = {
            buildIn: this.buildIn,
            range: [
                this.meta.position.start.line,
                this.meta.position.start.column,
                this.meta.position.end.line,
                this.meta.position.end.column
            ]
        };

        // Big ass switch case.
        switch (this.mBuildInType) {
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

                return new PgslArrayTypeDefinitionSyntaxTree(new PgslNumericTypeDefinitionSyntaxTree(PgslNumericTypeName.Float, lMetaInformation), this.mTemplate, lMetaInformation);
            }
            default: {
                throw new Exception(`Build in type "${this.mBuildInType}" not defined.`, this);
            }
        }
    }
}

type BuildInTypeTemplate = BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree | null;

export type PgslBuildInTypeDefinitionSyntaxTreeStructureData = {
    type: PgslBuildInTypeName;
    template?: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree;
};