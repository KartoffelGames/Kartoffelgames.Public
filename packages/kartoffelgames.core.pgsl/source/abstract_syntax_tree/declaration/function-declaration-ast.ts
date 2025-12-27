import type { FunctionDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import type { IValueStoreAst } from '../i-value-store-ast.interface.ts';
import { BlockStatementAst } from '../statement/execution/block-statement-ast.ts';
import { PgslInvalidType } from '../type/pgsl-invalid-type.ts';
import type { PgslType } from '../type/pgsl-type.ts';
import type { DeclarationAstData, IDeclarationAst } from './i-declaration-ast.interface.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class FunctionDeclarationAst extends AbstractSyntaxTree<FunctionDeclarationCst, FunctionDeclarationAstData> implements IDeclarationAst {

    /**
     * Process and build data of current structure.
     * 
     * @param pContext - Build context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): FunctionDeclarationAstData {
        // If it is a function with multiple headers no attributelist is allowed.
        if (this.cst.declarations.length > 1) {
            for (const lDeclarations of this.cst.declarations) {
                if (lDeclarations.attributeList.attributes.length > 0) {
                    pContext.pushIncident(`Functions with multiple headers cannot have generic parameters.`, this);
                    break;
                }
            }
        }

        // Check if function is already defined in current scope.
        if (pContext.getFunction(this.cst.name)) {
            pContext.pushIncident(`Function "${this.cst.name}" is already defined.`, this);
        }

        // Build return data.
        const lResultData = {
            isConstant: this.cst.isConstant,
            name: this.cst.name,
            declarations: new Array<FunctionDeclarationAstDataDeclaration>(),

            // Create empty attributes list to satisfy type.
            attributes: new AttributeListAst({
                type: 'AttributeList',
                attributes: [],
                range: this.cst.range,
            }, this).process(pContext)
        } satisfies FunctionDeclarationAstData;

        // Each header must be validated in a separate scope.
        for (const lDeclaration of this.cst.declarations) {
            // Create attribute list for this declaration.
            const lAttributes: AttributeListAst = new AttributeListAst(lDeclaration.attributeList, this).process(pContext);

            pContext.pushScope('function', () => {
                // Create parameter list.
                const lParameterList: Array<FunctionDeclarationAstDataParameter> = new Array<FunctionDeclarationAstDataParameter>();
                for (const lParameter of lDeclaration.parameters) {
                    let lParameterData: FunctionDeclarationAstDataParameter;

                    // Check for generic parameter.
                    if (typeof lParameter.typeDeclaration === 'number') {
                        // Validate generic parameter index.
                        const lGenericIndex: number = lParameter.typeDeclaration;
                        if (lGenericIndex < 0 || lGenericIndex >= lDeclaration.generics.length) {
                            pContext.pushIncident(`Generic parameter index ${lGenericIndex} is out of bounds.`, this);
                        }

                        lParameterData = {
                            name: lParameter.name,
                            type: lGenericIndex
                        };
                    } else {
                        lParameterData = {
                            name: lParameter.name,
                            type: new TypeDeclarationAst(lParameter.typeDeclaration).process(pContext)
                        };
                    }

                    lParameterList.push(lParameterData);

                    const lParameterType: PgslType = (() => {
                        if (typeof lParameterData.type === 'number') {
                            // Generic type, cannot be resolved yet.
                            return new PgslInvalidType().process(pContext);
                        }

                        return lParameterData.type.data.type;
                    })();

                    // Register parameter in current scope.
                    pContext.addValue(lParameter.name, {
                        data: {
                            fixedState: PgslValueFixedState.Variable,
                            declarationType: PgslDeclarationType.Var,
                            addressSpace: PgslValueAddressSpace.Function,
                            type: lParameterType,
                            name: lParameter.name,
                            constantValue: null,
                            accessMode: 'read'
                        }
                    } satisfies IValueStoreAst);
                }

                // Create block for each header.
                const lBlock: BlockStatementAst = new BlockStatementAst(lDeclaration.block).process(pContext);

                // Build return type.
                const lReturnTypeDeclaration: TypeDeclarationAst | number = (() => {
                    // Check for generic return type. Generic types arent validated for the block return type.
                    if (typeof lDeclaration.returnType === 'number') {
                        // Validate generic return type index.
                        const lGenericIndex: number = lDeclaration.returnType;
                        if (lGenericIndex < 0 || lGenericIndex >= lDeclaration.generics.length) {
                            pContext.pushIncident(`Generic return type index ${lGenericIndex} is out of bounds.`, this);
                        }
                        return lGenericIndex;
                    }

                    const lReturnType: TypeDeclarationAst = new TypeDeclarationAst(lDeclaration.returnType).process(pContext);

                    // If function is not built-in check for correct return type in function block.
                    if (!lDeclaration.buildIn) {
                        // Read block return type.
                        const lBlockReturnType: PgslType = lBlock.data.returnType;

                        // Check for correct return type in function block.
                        if (!lBlockReturnType.isImplicitCastableInto(lReturnType.data.type)) {
                            pContext.pushIncident(`Function block return type does not match the declared return type.`, lBlock);
                        }
                    }

                    return lReturnType;
                })();

                // Convert all generics to types. O(n²) fuck it.
                const lGenericList: Array<Array<PgslType>> = lDeclaration.generics.map((pGenericTypeList) => {
                    return pGenericTypeList.map((pGenericTypeCst) => {
                        const lGenericType: TypeDeclarationAst = new TypeDeclarationAst(pGenericTypeCst).process(pContext);
                        return lGenericType.data.type;
                    });
                });

                const lDeclarationResult: FunctionDeclarationAstDataDeclaration = {
                    parameter: lParameterList,
                    returnType: lReturnTypeDeclaration,
                    block: lBlock,
                    generics: lGenericList
                };

                // Find entry point.
                const lEntryPoint: FunctionDeclarationAstDataEntryPoint | null = this.readEntryPoint(lAttributes, pContext);
                if (lEntryPoint) {
                    lDeclarationResult.entryPoint = lEntryPoint;
                }

                // Add declaration data.
                lResultData.declarations.push(lDeclarationResult);
            }, this);
        }

        // Register function in current scope.
        pContext.registerFunction(this.cst.name, this);

        return lResultData;
    }

    /**
     * Read entry point information from function attributes.
     * 
     * @param pAttributes - Function attributes.
     * @param pContext - Build context.
     * 
     * @returns Entry point data or null if function is not an entry point. 
     */
    private readEntryPoint(pAttributes: AttributeListAst, pContext: AbstractSyntaxTreeContext): FunctionDeclarationAstDataEntryPoint | null {
        switch (true) {
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.vertex): {
                return { stage: 'vertex' };
            }
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.fragment): {
                return { stage: 'fragment' };
            }
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.compute): {
                const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.compute);

                // Check parameter count.
                if (lAttributeParameter.length !== 3) {
                    pContext.pushIncident(`Compute attribute needs exactly three constant parameters for work group size declaration.`, pAttributes);
                    return null;
                }

                // Get expression traces.
                const lWorkGroupSizeTraceX: IExpressionAst = lAttributeParameter[0];
                const lWorkGroupSizeTraceY: IExpressionAst = lAttributeParameter[1];
                const lWorkGroupSizeTraceZ: IExpressionAst = lAttributeParameter[2];

                // Check if all parameters are constants.
                if (lWorkGroupSizeTraceX.data.fixedState !== PgslValueFixedState.Constant || lWorkGroupSizeTraceY.data.fixedState !== PgslValueFixedState.Constant || lWorkGroupSizeTraceZ.data.fixedState !== PgslValueFixedState.Constant) {
                    pContext.pushIncident(`All compute attribute parameters need to be constant expressions.`, pAttributes);
                    return null;
                }

                // Get constant values.
                const lWorkGroupSizeX: string | number | null = lWorkGroupSizeTraceX.data.constantValue;
                const lWorkGroupSizeY: string | number | null = lWorkGroupSizeTraceY.data.constantValue;
                const lWorkGroupSizeZ: string | number | null = lWorkGroupSizeTraceZ.data.constantValue;

                // Check if all parameters are numbers.
                if (!Number.isInteger(lWorkGroupSizeX) || !Number.isInteger(lWorkGroupSizeY) || !Number.isInteger(lWorkGroupSizeZ)) {
                    pContext.pushIncident(`All compute attribute parameters need to be constant integer expressions.`, pAttributes);
                    return null;
                }

                return {
                    stage: 'compute',
                    workgroupSize: {
                        x: lWorkGroupSizeX as number,
                        y: lWorkGroupSizeY as number,
                        z: lWorkGroupSizeZ as number
                    }
                };
            }
        }

        return null;
    }
}

/**
 * Function declaration parameter containing type and name.
 */
export type FunctionDeclarationAstDataParameter = {
    /**
     * Function parameter type.
     * Number indicates generic parameter type of the header.
     */
    readonly type: TypeDeclarationAst | number;

    /**
     * Function parameter name.
     */
    readonly name: string;
};

/**
 * Function declaration header containing parameters and result type.
 */
export type FunctionDeclarationAstDataDeclaration = {
    /**
     * Function generic types.
     */
    generics: Array<Array<PgslType>>;

    /**
     * Function parameter list.
     */
    parameter: Array<FunctionDeclarationAstDataParameter>;

    /**
     * Function result type.
     * When a number, the function uses the defined generic type as result type.
     */
    returnType: TypeDeclarationAst | number;

    /**
     * Function block.
     */
    block: BlockStatementAst;

    /**
     * Function entry point information.
     */
    entryPoint?: FunctionDeclarationAstDataEntryPoint;
};

/**
 * Workgroup size specification for compute shaders.
 */
export type FunctionDeclarationAstDataEntryPointWorkgroupSize = {
    /**
     * X dimension of the workgroup
     */
    x: number;

    /**
     * Y dimension of the workgroup
     */
    y: number;

    /**
     * Z dimension of the workgroup
     */
    z: number;
};

/**
 * Supported shader entry point stages.
 */
export type FunctionDeclarationAstEntryPointStage = 'vertex' | 'fragment' | 'compute';

/**
 * Entry point information for shader functions.
 * Specifies the shader stage and related configuration.
 */
export type FunctionDeclarationAstDataEntryPoint = {
    /**
     * The type of entry point
     */
    stage: FunctionDeclarationAstEntryPointStage;

    /**
     * Workgroup size for compute shaders (x, y, z dimensions)
     * Only applicable for compute entry points
     */
    workgroupSize?: FunctionDeclarationAstDataEntryPointWorkgroupSize;
};

export type FunctionDeclarationAstData = {
    /**
     * Function declaration can be used to create constant expressions.
     */
    isConstant: boolean;

    /**
     * Function name.
     */
    name: string;

    /**
     * Function parameter list.
     */
    declarations: ReadonlyArray<FunctionDeclarationAstDataDeclaration>;
} & DeclarationAstData;