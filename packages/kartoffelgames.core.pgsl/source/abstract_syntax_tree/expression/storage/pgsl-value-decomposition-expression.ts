import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { PgslEnumTrace } from '../../../trace/pgsl-enum-trace.ts';
import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslStructTrace } from '../../../trace/pgsl-struct-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslEnumType } from '../../../type/pgsl-enum-type.ts';
import { PgslInvalidType } from '../../../type/pgsl-invalid-type.ts';
import { PgslStructType } from '../../../type/pgsl-struct-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from '../../../type/pgsl-vector-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import type { StructPropertyDeclarationAst } from '../../declaration/struct-property-declaration-ast.ts';
import { ExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure holding a single value of a decomposited composite value.
 */
export class PgslValueDecompositionExpression extends ExpressionAst {
    private readonly mProperty: string;
    private readonly mValue: ExpressionAst;

    /**
     * Index expression of variable index expression.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Value reference.
     */
    public get value(): ExpressionAst {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pValue - Value part of decompostion.
     * @param pProperty - Property of decompostion.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pValue: ExpressionAst, pProperty: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mProperty = pProperty;
        this.mValue = pValue;

        // Add data as child tree.
        this.appendChild(this.mValue);
    }

    /**
     * Validate data of current structure.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate value.
        this.mValue.trace(pTrace);

        // Get trace of value.
        const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mValue);

        // Read attachment from resolve type.
        const lExpressionType: PgslType = lExpressionTrace.resolveType;

        // Must be compositeable.
        if (!lExpressionType.composite) {
            pTrace.pushIncident(`Type must be a compositeable type.`, this);
        }

        // Resolve property type.
        const lPropertyInformation = ((): ({ type: PgslType, fixedState: PgslValueFixedState, constValue: null | string | number, addressSpace: PgslValueAddressSpace; } | null) => {
            switch (true) {
                case lExpressionType instanceof PgslStructType: {
                    // Read struct trace.
                    const lStructTrace: PgslStructTrace | undefined = pTrace.getStruct(lExpressionType.structName);
                    if (!lStructTrace) {
                        pTrace.pushIncident(`Struct type for "${lExpressionType.structName}" not found.`, this);
                        return null;
                    }

                    // Find property by name in its struct.
                    const lProperty: StructPropertyDeclarationAst | undefined = lStructTrace.declaration.properties.find((pProperty) => { return pProperty.name === this.mProperty; });
                    if (!lProperty) {
                        pTrace.pushIncident(`Struct has no defined property "${this.mProperty}"`, this);
                        return null;
                    }

                    return {
                        type: pTrace.getStructProperty(lProperty).type,
                        fixedState: PgslValueFixedState.Variable,
                        constValue: null,
                        addressSpace: lExpressionTrace.storageAddressSpace
                    };
                }

                case lExpressionType instanceof PgslEnumType: {
                    const lEnumTrace: PgslEnumTrace | undefined = pTrace.getEnum(lExpressionType.enumName);
                    if (!lEnumTrace) {
                        pTrace.pushIncident(`Enum type for "${lExpressionType.enumName}" not found.`, this);
                        return null;
                    }

                    // Read enum value by property name.
                    const lEnumValue: ExpressionAst | undefined = lEnumTrace.values.get(this.mProperty);
                    if (!lEnumValue) {
                        pTrace.pushIncident(`Enum "${lEnumTrace.name}" does not contain a value for property "${this.mProperty}".`, this);
                        return null;
                    }

                    // Read enum value trace.
                    const lEnumValueTrace: PgslExpressionTrace = pTrace.getExpression(lEnumValue);

                    return {
                        type: lEnumValueTrace.resolveType,
                        fixedState: lEnumValueTrace.fixedState,
                        constValue: lEnumValueTrace.constantValue,
                        addressSpace: lEnumValueTrace.storageAddressSpace
                    };
                }

                case lExpressionType instanceof PgslVectorType: {
                    // Validate swizzle name.
                    if (!/[rgba]{1,4}|[xyzw]{1,4}/.test(this.mProperty)) {
                        pTrace.pushIncident(`Swizzle name "${this.mProperty}" can't be used to access vector.`, this);
                    }

                    // When swizzle is only one long return the inner type.
                    if (this.mProperty.length === 1) {
                        return {
                            type: lExpressionType.innerType,
                            fixedState: PgslValueFixedState.Variable,
                            constValue: null,
                            addressSpace: lExpressionTrace.storageAddressSpace
                        };
                    }

                    // Build vectorN type from vector type.
                    const lVectorType: PgslVectorType = new PgslVectorType(
                        pTrace,
                        this.mProperty.length,
                        lExpressionType.innerType
                    );

                    return {
                        type: lVectorType,
                        fixedState: PgslValueFixedState.Variable,
                        constValue: null,
                        addressSpace: lExpressionTrace.storageAddressSpace
                    };
                }
            }

            // No valid type found.
            pTrace.pushIncident(`Value is not a composite type property "${this.mProperty}".`, this);

            return null;
        })();

        // When property information could not be resolved, return invalid type.
        if (lPropertyInformation === null) {
            return new PgslExpressionTrace({
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(pTrace),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Function
            });
        }

        return new PgslExpressionTrace({
            fixedState: lPropertyInformation.fixedState,
            isStorage: lExpressionType instanceof PgslStructType,
            resolveType: lPropertyInformation.type,
            constantValue: lPropertyInformation.constValue,
            storageAddressSpace: lPropertyInformation.addressSpace
        });
    }
}
