import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import { PgslFunctionTrace, type PgslFunctionTraceEntryPoint } from '../../trace/pgsl-function-trace.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslExpression } from '../expression/pgsl-expression.ts';
import { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import type { PgslTypeDeclaration } from '../general/pgsl-type-declaration.ts';
import type { PgslBlockStatement } from '../statement/execution/pgsl-block-statement.ts';
import { PgslDeclaration } from './pgsl-declaration.ts';

// TODO: Add support for multiple parameter sets and their return type.
// TODO: Add support for generics.
// TODO: Somehow there must be a disconnect between the pgsl function name and the wgsl function name without specifying it in the definition. 
//       For now this is only used for built in functions.

// TODO: Split into simple CST Tree that are simply ts-types
// TODO: Any ast takes the right dst type as constructor parameter and validates/traces itself.
// TODO: The parser-trace is obsolete as it is merged into the ask tree now.
// TODO: The parser result still converts the ast into distinct/own types.

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslFunctionDeclaration extends PgslDeclaration {
    private readonly mBlock: PgslBlockStatement;
    private readonly mConstant: boolean;
    private readonly mName: string;
    private readonly mHeader: Array<PgslFunctionDeclarationHeader>;
    private readonly mGenericType: PgslTypeDeclaration | null;

    /**
     * Function block.
     */
    public get block(): PgslBlockStatement {
        return this.mBlock;
    }

    /**
     * Function declaration can be used to create constant expressions.
     */
    public get isConstant(): boolean {
        return this.mConstant;
    }

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter list.
     */
    public get headers(): ReadonlyArray<PgslFunctionDeclarationHeader> {
        return this.mHeader;
    }

    /**
     * Function generic type.
     */
    public get genericType(): PgslTypeDeclaration | null {
        return this.mGenericType;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Construction parameter.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslFunctionDeclarationSyntaxTreeConstructorParameter, pAttributes: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mConstant = pParameter.constant;
        this.mBlock = pParameter.block;
        this.mName = pParameter.name;
        this.mHeader = pParameter.header;
        this.mGenericType = pParameter.genericType;

        // Add function child trees.
        this.appendChild(pParameter.block);
        this.appendChild(pParameter.returnType);

        // Add each parameter type as child tree.
        for (const lParameter of pParameter.parameter) {
            this.appendChild(lParameter.type);
        }
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Trace attributes.
        this.attributes.trace(pTrace);

        // Trace return type.
        this.mReturnType.trace(pTrace);

        // Create a new scope to combine all parameters with the function block.
        pTrace.newScope('function', () => {
            // Validate each parameters and add them to the validation scope.
            for (const lParameter of this.mParameter) {
                // Validate.
                lParameter.type.trace(pTrace);
            }

            // Validate function block.
            this.mBlock.trace(pTrace);
        }, this);

        // Find entry point.
        const lEntryPoint: PgslFunctionTraceEntryPoint | null = (() => {
            switch (true) {
                case this.attributes.hasAttribute(PgslAttributeList.attributeNames.vertex): {
                    return { stage: 'vertex' };
                }
                case this.attributes.hasAttribute(PgslAttributeList.attributeNames.fragment): {
                    return { stage: 'fragment' };
                }
                case this.attributes.hasAttribute(PgslAttributeList.attributeNames.compute): {
                    const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.compute);

                    // Check parameter count.
                    if (lAttributeParameter.length !== 3) {
                        pTrace.pushIncident(`Compute attribute needs exactly three constant parameters for work group size declaration.`, this.attributes);
                        return null;
                    }

                    // Get expression traces.
                    const lWorkGroupSizeTraceX = pTrace.getExpression(lAttributeParameter[0]);
                    const lWorkGroupSizeTraceY = pTrace.getExpression(lAttributeParameter[1]);
                    const lWorkGroupSizeTraceZ = pTrace.getExpression(lAttributeParameter[2]);

                    // Check if all parameters are constants.
                    if (lWorkGroupSizeTraceX.fixedState === PgslValueFixedState.Constant && lWorkGroupSizeTraceY.fixedState === PgslValueFixedState.Constant && lWorkGroupSizeTraceZ.fixedState === PgslValueFixedState.Constant) {
                        pTrace.pushIncident(`All compute attribute parameters need to be constant expressions.`, this.attributes);
                        return null;
                    }

                    // Get constant values.
                    const lWorkGroupSizeX: string | number | null = lWorkGroupSizeTraceX.constantValue;
                    const lWorkGroupSizeY: string | number | null = lWorkGroupSizeTraceY.constantValue;
                    const lWorkGroupSizeZ: string | number | null = lWorkGroupSizeTraceZ.constantValue;

                    // Check if all parameters are numbers.
                    if (typeof lWorkGroupSizeX !== 'number' || typeof lWorkGroupSizeY !== 'number' || typeof lWorkGroupSizeZ !== 'number') {
                        pTrace.pushIncident(`All compute attribute parameters need to be constant number expressions.`, this.attributes);
                        return null;
                    }

                    return { stage: 'compute', workGroupSize: [lWorkGroupSizeX, lWorkGroupSizeY, lWorkGroupSizeZ] };
                }
                default: {
                    return null;
                }
            }
        })();

        // Check for return type.
        if (this.mBlock.returnType.isImplicitCastableInto(this.mReturnType.type)) {
            pTrace.pushIncident(`Function block return type does not match the declared return type.`, this.mBlock);
        }

        // Register function.
        pTrace.registerFunction(new PgslFunctionTrace({
            name: this.mName,
            returnType: this.mReturnType.type,
            parameters: this.mParameter.map((pParameter: PgslFunctionDeclarationParameter) => {
                return { name: pParameter.name, type: pParameter.type.type };
            }),
            entryPoint: lEntryPoint,
            constant: this.mConstant
        }));
    }
}

/**
 * Function declaration parameter containing type and name.
 */
export type PgslFunctionDeclarationParameter = {
    /**
     * Function parameter type.
     * When null, the function uses the defined generic type as parameter type.
     */
    readonly type: PgslTypeDeclaration | null;

    /**
     * Function parameter name.
     */
    readonly name: string;
};

/**
 * Function declaration header containing parameters and result type.
 */
export type PgslFunctionDeclarationHeader = {
    /**
     * Function parameter list.
     */
    parameter: Array<PgslFunctionDeclarationParameter>;

    /**
     * Function result type.
     * When null, the function uses the defined generic type as result type.
     */
    resultType: PgslTypeDeclaration | null;
};

export type PgslFunctionDeclarationSyntaxTreeConstructorParameter = {
    name: string;
    genericType: PgslTypeDeclaration | null;
    header: Array<PgslFunctionDeclarationHeader>;
    block: PgslBlockStatement;
    constant: boolean;
};