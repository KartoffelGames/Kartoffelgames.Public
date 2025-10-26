import { PgslValueFixedState } from '../enum/pgsl-value-fixed-state.ts';
import { PgslExpression } from '../syntax_tree/expression/pgsl-expression.ts';
import type { PgslExpressionTrace } from '../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../trace/pgsl-trace.ts';
import { PgslArrayType } from './pgsl-array-type.ts';
import { PgslBooleanType } from './pgsl-boolean-type.ts';
import { PgslInvalidType } from './pgsl-invalid-type.ts';
import { PgslNumericType } from './pgsl-numeric-type.ts';
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';
import { PgslVectorType } from './pgsl-vector-type.ts';

/**
 * Built-in type definition that represents PGSL built-in types.
 * These are predefined types that map to specific underlying types and are used
 * for shader built-in values like vertex indices, positions, workgroup IDs, etc.
 */
export class PgslBuildInType extends PgslType {
    /**
     * Type names for all available built-in types.
     * Maps built-in type names to their string representations.
     */
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
    private readonly mUnderlyingType: PgslType;
    private readonly mTemplate: PgslExpression | null;

    /**
     * Gets the built-in type variant name.
     * 
     * @returns The built-in type name.
     */
    public get buildInType(): PgslBuildInTypeName {
        return this.mBuildInType;
    }

    /**
     * Gets the underlying type that this built-in type maps to.
     * 
     * @returns The underlying PGSL type.
     */
    public get underlyingType(): PgslType {
        return this.mUnderlyingType;
    }

    /**
     * Gets the template expression for parameterized built-in types.
     * 
     * @returns The template expression or null if not applicable.
     */
    public get template(): PgslExpression | null {
        return this.mTemplate;
    }

    /**
     * Constructor for built-in type.
     * 
     * @param pTrace - The trace context for validation and error reporting.
     * @param pType - The specific built-in type variant.
     * @param pTemplate - Optional template expression for parameterized types.
     */
    public constructor(pTrace: PgslTrace, pType: PgslBuildInTypeName, pTemplate: PgslExpression | null) {
        super(pTrace);

        // Set data.
        this.mBuildInType = pType;
        this.mTemplate = pTemplate;

        // Determine the underlying type based on the built-in type.
        this.mUnderlyingType = this.determinateAliasedType(pTrace, this.mBuildInType, pTemplate);
    }

    /**
     * Compare this built-in type with a target type for equality.
     * Built-in types are equal if their underlying types are equal.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same underlying type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Check if target is also a built-in type with the same variant.
        if (pTarget instanceof PgslBuildInType) {
            return this.mBuildInType === pTarget.mBuildInType && this.mUnderlyingType.equals(pTarget.mUnderlyingType);
        }

        // Check if the underlying type equals the target type.
        return this.mUnderlyingType.equals(pTarget);
    }

    /**
     * Check if this built-in type is explicitly castable into the target type.
     * Delegates to the underlying type's castability.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when the underlying type is explicitly castable to the target.
     */
    public override isExplicitCastableInto(pTarget: PgslType): boolean {
        // Check if aliased type is explicit castable into target type.
        return this.mUnderlyingType.isExplicitCastableInto(pTarget);
    }

    /**
     * Check if this built-in type is implicitly castable into the target type.
     * Delegates to the underlying type's castability.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when the underlying type is implicitly castable to the target.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // Check if aliased type is implicit castable into target type.
        return this.mUnderlyingType.isImplicitCastableInto(pTarget);
    }

    /**
     * Collect type properties for built-in types.
     * Validates template parameters and copies properties from the underlying type.
     * 
     * @param pTrace - Trace context for validation and error reporting.
     * 
     * @returns Type properties copied from the underlying type.
     */
    protected override onTypePropertyCollection(pTrace: PgslTrace): PgslTypeProperties {
        // Only clip distance needs validation.
        if (this.mBuildInType === PgslBuildInType.typeName.clipDistances) {
            this.validateClipDistancesTemplate(pTrace);
        }

        // Underlying type.
        const lUnderlyingType: PgslType = this.mUnderlyingType;

        // Copy all properties from the underlying type.
        return {
            storable: lUnderlyingType.storable,
            hostShareable: lUnderlyingType.hostShareable,
            composite: lUnderlyingType.composite,
            constructible: lUnderlyingType.constructible,
            fixedFootprint: lUnderlyingType.fixedFootprint,
            indexable: lUnderlyingType.indexable,
            concrete: lUnderlyingType.concrete,
            scalar: lUnderlyingType.scalar,
            plain: lUnderlyingType.plain,
        };
    }

    /**
     * Validates the template parameter for ClipDistances built-in type.
     * The template must be a constant unsigned integer expression.
     * 
     * @param pTrace - Trace context for error reporting.
     */
    private validateClipDistancesTemplate(pTrace: PgslTrace): void {
        // Template must be provided for ClipDistances.
        if (!this.mTemplate) {
            pTrace.pushIncident(`Clip distance built-in template value must have a value expression.`);
            return;
        }

        // Read trace from template expression.
        const lLengthExpressionTrace: PgslExpressionTrace | undefined = pTrace.getExpression(this.mTemplate);
        if (!lLengthExpressionTrace) {
            pTrace.pushIncident(`Template expression of clip distance built-in type is not traced.`);
            return;
        }

        // Template needs to be a constant.
        if (lLengthExpressionTrace.fixedState < PgslValueFixedState.Constant) {
            pTrace.pushIncident(`Clip distance built-in template value must be a constant.`);
        }

        // Template needs to be a unsigned integer.
        if (!this.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger))) {
            pTrace.pushIncident(`Clip distance built-in template value must be an unsigned integer.`);
        }
    }

    /**
     * Determines the underlying type for a given built-in type.
     * Maps each built-in type to its corresponding PGSL type representation.
     * 
     * @param pTrace - Trace context for creating type instances.
     * @param pBuildInType - The built-in type to map.
     * @param pTemplate - Template expression for parameterized types.
     * 
     * @returns The underlying PGSL type that represents this built-in type.
     */
    private determinateAliasedType(pTrace: PgslTrace, pBuildInType: PgslBuildInTypeName, pTemplate: PgslExpression | null): PgslType {
        // Big ass switch case.
        switch (pBuildInType) {
            case PgslBuildInType.typeName.position: {
                const lFloatType = new PgslNumericType(pTrace, PgslNumericType.typeName.float32);
                return new PgslVectorType(pTrace, 4, lFloatType);
            }
            case PgslBuildInType.typeName.localInvocationId: {
                return new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.globalInvocationId: {
                const lUnsignedIntType = new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
                return new PgslVectorType(pTrace, 3, lUnsignedIntType);
            }
            case PgslBuildInType.typeName.workgroupId: {
                const lUnsignedIntType = new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
                return new PgslVectorType(pTrace, 3, lUnsignedIntType);
            }
            case PgslBuildInType.typeName.numWorkgroups: {
                const lUnsignedIntType = new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
                return new PgslVectorType(pTrace, 3, lUnsignedIntType);
            }
            case PgslBuildInType.typeName.vertexIndex: {
                return new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.instanceIndex: {
                return new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.fragDepth: {
                return new PgslNumericType(pTrace, PgslNumericType.typeName.float32);
            }
            case PgslBuildInType.typeName.sampleIndex: {
                return new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.sampleMask: {
                return new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.localInvocationIndex: {
                return new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.frontFacing: {
                return new PgslBooleanType(pTrace);
            }
            case PgslBuildInType.typeName.clipDistances: {
                // ClipDistances is an array<f32, N> where N is determined by the template
                const lLengthExpression = pTemplate instanceof PgslExpression ? pTemplate : null;

                // Create a new float number type.
                const lFloatType = new PgslNumericType(pTrace, PgslNumericType.typeName.float32);

                return new PgslArrayType(pTrace, lFloatType, lLengthExpression);
            }
            default: {
                // Unknown built-in type
                pTrace.pushIncident(`Unknown built-in type: ${pBuildInType}`);
                return new PgslInvalidType(pTrace);
            }
        }
    }
}

/**
 * Type representing all available built-in type names.
 * Derived from the static typeName getter for type safety.
 */
type PgslBuildInTypeName = (typeof PgslBuildInType.typeName)[keyof typeof PgslBuildInType.typeName];