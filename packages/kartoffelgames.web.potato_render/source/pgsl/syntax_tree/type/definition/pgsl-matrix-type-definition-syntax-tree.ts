import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslBaseType } from '../enum/pgsl-base-type.enum';
import { PgslMatrixTypeName } from '../enum/pgsl-matrix-type-name.enum';
import { PgslVectorTypeName } from '../enum/pgsl-vector-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from './pgsl-vector-type-definition-syntax-tree';

/**
 * Matrix type definition.
 */
export class PgslMatrixTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    /**
     * Matrix type to underlying vector type mapping.
     */
    private static readonly mVectorTypeMapping: Dictionary<PgslMatrixTypeName, PgslVectorTypeName> = (() => {
        // Create mapping for matrix type to vector type.
        const lMatrixToVectorMapping: Dictionary<PgslMatrixTypeName, PgslVectorTypeName> = new Dictionary<PgslMatrixTypeName, PgslVectorTypeName>();
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix22, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix23, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix24, PgslVectorTypeName.Vector4);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix32, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix33, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix34, PgslVectorTypeName.Vector4);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix42, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix43, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix44, PgslVectorTypeName.Vector4);

        return lMatrixToVectorMapping;
    })();

    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mMatrixType: PgslMatrixTypeName;
    private readonly mVectorTypeDefinition: PgslVectorTypeDefinitionSyntaxTree;

    /**
     * Inner type of matrix.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Inner vector type.
     */
    public get vectorType(): PgslVectorTypeDefinitionSyntaxTree {
        return this.mVectorTypeDefinition;
    }

    /**
     * Constructor.
     * 
     * @param pMatixType - Matrix dimension type.
     * @param pInnerType - Inner type of matrix.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMatixType: PgslMatrixTypeName, pInnerType: BasePgslTypeDefinitionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mInnerType = pInnerType;
        this.mMatrixType = pMatixType;

        // Append inner type to child list.
        this.appendChild(this.mInnerType);

        // Create underlying vector type.
        this.mVectorTypeDefinition = new PgslVectorTypeDefinitionSyntaxTree(PgslMatrixTypeDefinitionSyntaxTree.mVectorTypeMapping.get(this.mMatrixType)!, this.mInnerType, pMeta);

        // Set vector type as child syntax.
        this.appendChild(this.mVectorTypeDefinition);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isExplicitCastable(pTarget: this): boolean {
        // It is when inner types are.
        return this.mInnerType.explicitCastable(pTarget.mInnerType);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isImplicitCastable(pTarget: this): boolean {
        // It is when inner types are.
        return this.mInnerType.implicitCastable(pTarget.mInnerType);
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        return {
            aliased: false,
            baseType: PgslBaseType.Matrix,
            setupData: null,
            typeAttributes: {
                composite: true,
                constructable: this.mInnerType.isConstructable,
                fixed: this.mInnerType.isFixed,
                indexable: true,
                plain: this.mInnerType.isPlainType,
                hostSharable: this.mInnerType.isHostShareable,
                storable: this.mInnerType.isStorable
            }
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be scalar.
        if (!(this.mInnerType.baseType !== PgslBaseType.Numberic)) {
            throw new Exception('Matrix type must be a numeric value', this);
        }
    }
}