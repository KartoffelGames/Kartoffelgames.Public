import { Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { PgslArrayType } from './pgsl-array-type.ts';
import { PgslBooleanType } from './pgsl-boolean-type.ts';
import { PgslInvalidType } from './pgsl-invalid-type.ts';
import { PgslNumericType } from './pgsl-numeric-type.ts';
import type { IType, TypeProperties } from './i-type.interface.ts';
import { PgslVectorType } from './pgsl-vector-type.ts';
import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * Built-in type definition that represents PGSL built-in types.
 * These are predefined types that map to specific underlying types and are used
 * for shader built-in values like vertex indices, positions, workgroup IDs, etc.
 */
export class PgslBuildInType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
    /**
     * Type names for all available built-in types.
     * Maps built-in type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            vertexIndex: 'VertexIndex',
            instanceIndex: 'InstanceIndex',
            position: 'Position',
            frontFacing: 'FrontFacing',
            fragDepth: 'FragDepth',
            sampleIndex: 'SampleIndex',
            sampleMask: 'SampleMask',
            localInvocationId: 'LocalInvocationId',
            localInvocationIndex: 'LocalInvocationIndex',
            globalInvocationId: 'GlobalInvocationId',
            workgroupId: 'WorkgroupId',
            numWorkgroups: 'NumWorkgroups',
            clipDistances: 'ClipDistances'
        } as const;
    }

    private readonly mBuildInType: PgslBuildInTypeName;
    private readonly mShadowedType: IType | null;
    private readonly mTemplate: IExpressionAst | null;
    private mUnderlyingType: IType | null;

    /**
     * Gets the built-in type variant name.
     * 
     * @returns The built-in type name.
     */
    public get buildInType(): PgslBuildInTypeName {
        return this.mBuildInType;
    }

    /**
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     */
    public get shadowedType(): IType {
        return this.mShadowedType ?? this;
    }

    /**
     * Gets the template expression for parameterized built-in types.
     * 
     * @returns The template expression or null if not applicable.
     */
    public get template(): IExpressionAst | null {
        return this.mTemplate;
    }

    /**
     * Gets the underlying type that this built-in type maps to.
     * 
     * @returns The underlying PGSL type.
     */
    public get underlyingType(): IType {
        if (!this.mUnderlyingType) {
            throw new Exception('Underlying type has not been initialized.', this);
        }

        return this.mUnderlyingType;
    }

    /**
     * Constructor for built-in type.
     * 
     * @param pType - The specific built-in type variant.
     * @param pTemplate - Optional template expression for parameterized types.
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pType: PgslBuildInTypeName, pTemplate: IExpressionAst | null, pShadowedType?: IType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        // Set data.
        this.mShadowedType = pShadowedType ?? null;
        this.mBuildInType = pType;
        this.mTemplate = pTemplate;

        // Set underlying type as uninitialized.
        this.mUnderlyingType = null;
    }

    /**
     * Compare this built-in type with a target type for equality.
     * Built-in types are equal if their underlying types are equal.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same underlying type.
     */
    public equals(pTarget: IType): boolean {
        // Check if target is also a built-in type with the same variant.
        if (pTarget instanceof PgslBuildInType) {
            return this.mBuildInType === pTarget.mBuildInType && this.underlyingType.equals(pTarget.underlyingType);
        }

        // Check if the underlying type equals the target type.
        return this.underlyingType.equals(pTarget);
    }

    /**
     * Check if this built-in type is explicitly castable into the target type.
     * Delegates to the underlying type's castability.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when the underlying type is explicitly castable to the target.
     */
    public isExplicitCastableInto(pTarget: IType): boolean {
        // Check if aliased type is explicit castable into target type.
        return this.underlyingType.isExplicitCastableInto(pTarget);
    }

    /**
     * Check if this built-in type is implicitly castable into the target type.
     * Delegates to the underlying type's castability.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when the underlying type is implicitly castable to the target.
     */
    public isImplicitCastableInto(pTarget: IType): boolean {
        // Check if aliased type is implicit castable into target type.
        return this.underlyingType.isImplicitCastableInto(pTarget);
    }

    /**
     * Collect type properties for built-in types.
     * Validates template parameters and copies properties from the underlying type.
     * 
     * @param pContext - Context for validation and error reporting.
     * 
     * @returns Type properties copied from the underlying type.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): TypeProperties {
        // Only clip distance needs validation.
        if (this.mBuildInType === PgslBuildInType.typeName.clipDistances) {
            this.validateClipDistancesTemplate(pContext);
        }

        // Determine the underlying type based on the built-in type.
        this.mUnderlyingType = this.determinateAliasedType(pContext, this.mBuildInType, this.mTemplate);

        // Copy all properties from the underlying type.
        return {
            metaTypes: this.mUnderlyingType.data.metaTypes,
            storable: this.mUnderlyingType.data.storable,
            hostShareable: this.mUnderlyingType.data.hostShareable,
            composite: this.mUnderlyingType.data.composite,
            constructible: this.mUnderlyingType.data.constructible,
            fixedFootprint: this.mUnderlyingType.data.fixedFootprint,
            indexable: this.mUnderlyingType.data.indexable,
            concrete: this.mUnderlyingType.data.concrete,
            scalar: this.mUnderlyingType.data.scalar,
            plain: this.mUnderlyingType.data.plain,
        };
    }

    /**
     * Determines the underlying type for a given built-in type.
     * Maps each built-in type to its corresponding PGSL type representation.
     * 
     * @param pContext - Context for creating type instances.
     * @param pBuildInType - The built-in type to map.
     * @param pTemplate - Template expression for parameterized types.
     * 
     * @returns The underlying PGSL type that represents this built-in type.
     */
    private determinateAliasedType(pContext: AbstractSyntaxTreeContext, pBuildInType: PgslBuildInTypeName, pTemplate: IExpressionAst | null): IType {
        // Big ass switch case.
        switch (pBuildInType) {
            case PgslBuildInType.typeName.position: {
                const lFloatType = new PgslNumericType(PgslNumericType.typeName.float32).process(pContext);
                return new PgslVectorType(4, lFloatType, this).process(pContext);
            }
            case PgslBuildInType.typeName.localInvocationId: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger, this).process(pContext);
            }
            case PgslBuildInType.typeName.globalInvocationId: {
                const lUnsignedIntType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger).process(pContext);
                return new PgslVectorType(3, lUnsignedIntType, this).process(pContext);
            }
            case PgslBuildInType.typeName.workgroupId: {
                const lUnsignedIntType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger).process(pContext);
                return new PgslVectorType(3, lUnsignedIntType, this).process(pContext);
            }
            case PgslBuildInType.typeName.numWorkgroups: {
                const lUnsignedIntType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger).process(pContext);
                return new PgslVectorType(3, lUnsignedIntType, this).process(pContext);
            }
            case PgslBuildInType.typeName.vertexIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger, this).process(pContext);
            }
            case PgslBuildInType.typeName.instanceIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger, this).process(pContext);
            }
            case PgslBuildInType.typeName.fragDepth: {
                return new PgslNumericType(PgslNumericType.typeName.float32, this).process(pContext);
            }
            case PgslBuildInType.typeName.sampleIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger, this).process(pContext);
            }
            case PgslBuildInType.typeName.sampleMask: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger, this).process(pContext);
            }
            case PgslBuildInType.typeName.localInvocationIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger, this).process(pContext);
            }
            case PgslBuildInType.typeName.frontFacing: {
                return new PgslBooleanType(this).process(pContext);
            }
            case PgslBuildInType.typeName.clipDistances: {
                // ClipDistances is an array<f32, N> where N is determined by the template

                // Create a new float number type.
                const lFloatType = new PgslNumericType(PgslNumericType.typeName.float32).process(pContext);

                return new PgslArrayType(lFloatType, pTemplate, this).process(pContext);
            }
            default: {
                // Unknown built-in type
                pContext.pushIncident(`Unknown built-in type: ${pBuildInType}`);
                return new PgslInvalidType(this).process(pContext);
            }
        }
    }

    /**
     * Validates the template parameter for ClipDistances built-in type.
     * The template must be a constant unsigned integer expression.
     * 
     * @param pContext - Trace context for error reporting.
     */
    private validateClipDistancesTemplate(pContext: AbstractSyntaxTreeContext): void {
        // Template must be provided for ClipDistances.
        if (!this.mTemplate) {
            pContext.pushIncident(`Clip distance built-in template value must have a value expression.`);
            return;
        }

        // Template needs to be a constant.
        if (this.mTemplate.data.fixedState < PgslValueFixedState.Constant) {
            pContext.pushIncident(`Clip distance built-in template value must be a constant.`);
        }

        // Template needs to be a unsigned integer.
        if (!this.mTemplate.data.resolveType.isImplicitCastableInto(new PgslNumericType(PgslNumericType.typeName.unsignedInteger).process(pContext))) {
            pContext.pushIncident(`Clip distance built-in template value must be an unsigned integer.`);
        }
    }
}

/**
 * Type representing all available built-in type names.
 * Derived from the static typeName getter for type safety.
 */
type PgslBuildInTypeName = (typeof PgslBuildInType.typeName)[keyof typeof PgslBuildInType.typeName];