import { Exception } from '@kartoffelgames/core';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslBuildInTypeName } from '../enum/pgsl-build-in-type-name.enum';
import { PgslNumericTypeName } from '../enum/pgsl-numeric-type-name.enum';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { PgslVectorTypeName } from '../enum/pgsl-vector-type-name.enum';
import { PgslTypeDeclarationSyntaxTree } from '../pgsl-type-declaration-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';
import { PgslArrayTypeDefinitionSyntaxTree } from './pgsl-array-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from './pgsl-boolean-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from './pgsl-vector-type-definition-syntax-tree';

export class PgslBuildInTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslBuildInTypeDefinitionSyntaxTreeStructureData> {
    private mRealType!: BasePgslTypeDefinitionSyntaxTree | null;
    private readonly mTemplate!: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree | null;

    /**
     * Get real type of build in.
     */
    public get realType(): BasePgslTypeDefinitionSyntaxTree {
        this.ensureValidity();

        // Init value.
        if (this.mRealType === null) {
            this.mRealType = this.determinateRealType();
        }

        return this.mRealType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslBuildInTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        // Create identifier. Template does not matter.
        const lIdentifier: string = `ID:BUILDIN->${pData.type.toUpperCase()}`;

        // Return cached when available.
        if (BasePgslTypeDefinitionSyntaxTree.mTypeCache.has(lIdentifier)) {
            return BasePgslTypeDefinitionSyntaxTree.mTypeCache.get(lIdentifier)! as PgslBuildInTypeDefinitionSyntaxTree;
        }

        // Create. Texture typename is convertable to general typename. 
        super(pData.type as unknown as PgslTypeName, lIdentifier, pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set cache.
        BasePgslTypeDefinitionSyntaxTree.mTypeCache.set(lIdentifier, this);

        // Set data.
        this.mTemplate = pData.template ?? null;
        this.mRealType = null;
    }

    /**
     * Determinate if declaration is a composite type.
     */
    protected override determinateIsComposite(): boolean {
        return false;
    }

    /**
     * Determinate if declaration is a constructable.
     */
    protected override determinateIsConstructable(): boolean {
        return true;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected override determinateIsFixed(): boolean {
        return true;
    }

    /**
     * Determinate if composite value with properties that can be access by index.
     */
    protected override determinateIsIndexable(): boolean {
        // TODO: Dependent on indexable.
        return false;
    }

    /**
     * Determinate if declaration is a plain type.
     */
    protected override determinateIsPlain(): boolean {
        return true;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        // Build ins are never sharable.
        return false;
    }

    /**
     * Determinate if value is storable in a variable.
     */
    protected override determinateIsStorable(): boolean {
        return true;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Only clip distance needs validation.
        if (this.typeName === PgslTypeName.ClipDistances) {
            // Must have a template.
            if (!this.mTemplate) {
                throw new Exception(`Clip distance buildin must have a template value.`, this);
            }

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
            if (this.mTemplate.resolveType.typeName !== PgslTypeName.UnsignedInteger) {
                throw new Exception(`Clip distance buildin template value musst be a unssigned integer.`, this);
            }
        }
    }

    /**
     * Determinate if declaration is a composite type.
     */
    private determinateRealType(): BasePgslTypeDefinitionSyntaxTree {
        // Big ass switch case.
        switch (this.typeName) {
            case PgslTypeName.Position: {
                return new PgslVectorTypeDefinitionSyntaxTree({
                    typeName: PgslVectorTypeName.Vector4,
                    innerType: new PgslNumericTypeDefinitionSyntaxTree({
                        typeName: PgslNumericTypeName.Float
                    }, 0, 0, 0, 0).setParent(this).validateIntegrity()
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.LocalInvocationId: {
                return new PgslNumericTypeDefinitionSyntaxTree({
                    typeName: PgslNumericTypeName.UnsignedInteger
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.GlobalInvocationId: {
                return new PgslVectorTypeDefinitionSyntaxTree({
                    typeName: PgslVectorTypeName.Vector3,
                    innerType: new PgslNumericTypeDefinitionSyntaxTree({
                        typeName: PgslNumericTypeName.UnsignedInteger
                    }, 0, 0, 0, 0).setParent(this).validateIntegrity()
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.WorkgroupId: {
                return new PgslVectorTypeDefinitionSyntaxTree({
                    typeName: PgslVectorTypeName.Vector3,
                    innerType: new PgslNumericTypeDefinitionSyntaxTree({
                        typeName: PgslNumericTypeName.UnsignedInteger
                    }, 0, 0, 0, 0).setParent(this).validateIntegrity()
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.NumWorkgroups: {
                return new PgslVectorTypeDefinitionSyntaxTree({
                    typeName: PgslVectorTypeName.Vector3,
                    innerType: new PgslNumericTypeDefinitionSyntaxTree({
                        typeName: PgslNumericTypeName.UnsignedInteger
                    }, 0, 0, 0, 0).setParent(this).validateIntegrity()
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.VertexIndex: {
                return new PgslNumericTypeDefinitionSyntaxTree({
                    typeName: PgslNumericTypeName.UnsignedInteger
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.InstanceIndex: {
                return new PgslNumericTypeDefinitionSyntaxTree({
                    typeName: PgslNumericTypeName.UnsignedInteger
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.FragDepth: {
                return new PgslNumericTypeDefinitionSyntaxTree({
                    typeName: PgslNumericTypeName.Float
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.SampleIndex: {
                return new PgslNumericTypeDefinitionSyntaxTree({
                    typeName: PgslNumericTypeName.UnsignedInteger
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.SampleMask: {
                return new PgslNumericTypeDefinitionSyntaxTree({
                    typeName: PgslNumericTypeName.UnsignedInteger
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.LocalInvocationIndex: {
                return new PgslNumericTypeDefinitionSyntaxTree({
                    typeName: PgslNumericTypeName.UnsignedInteger
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.FrontFacing: {
                return new PgslBooleanTypeDefinitionSyntaxTree({}, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
            case PgslTypeName.ClipDistances: {
                return new PgslArrayTypeDefinitionSyntaxTree({
                    type: new PgslNumericTypeDefinitionSyntaxTree({
                        typeName: PgslNumericTypeName.Float
                    }, 0, 0, 0, 0).setParent(this).validateIntegrity(),
                    lengthExpression: this.mTemplate as BasePgslExpressionSyntaxTree
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
        }

        throw new Exception(`Build in type "${this.typeName}" not defined.`, this);
    }
}

export type PgslBuildInTypeDefinitionSyntaxTreeStructureData = {
    type: PgslBuildInTypeName;
    template?: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree;
};