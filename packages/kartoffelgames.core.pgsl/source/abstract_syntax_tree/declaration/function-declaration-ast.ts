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
import type { IType } from '../type/i-type.interface.ts';
import { PgslInvalidType } from '../type/pgsl-invalid-type.ts';
import { PgslStructType } from '../type/pgsl-struct-type.ts';
import type { DeclarationAstData, IDeclarationAst } from './i-declaration-ast.interface.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class FunctionDeclarationAst extends AbstractSyntaxTree<FunctionDeclarationCst, FunctionDeclarationAstData> implements IDeclarationAst {
    /**
     * Register function without registering its content.
     * 
     * @param pContext - Processing context.
     */
    public register(pContext: AbstractSyntaxTreeContext): this {
        // Check if function is already defined in current scope.
        if (pContext.getFunction(this.cst.name)) {
            pContext.pushIncident(`Function "${this.cst.name}" is already defined.`, this);
        }

        // Register function in current scope.
        pContext.registerFunction(this.cst.name, this);

        return this;
    }

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

        // Build return data.
        const lResultData = {
            isConstant: this.cst.isConstant,
            name: this.cst.name,
            declarations: new Array<FunctionDeclarationAstDataDeclaration>(),
            implicitGenerics: this.cst.implicitGenerics,

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

            // Create generic mapping for this declaration.
            const lGenericMapping: Map<string, Array<string> | null> = new Map<string, Array<string> | null>();
            for (const lGeneric of lDeclaration.generics) {
                // Check for duplicate generic names.
                if (lGenericMapping.has(lGeneric.name)) {
                    pContext.pushIncident(`Generic type name "${lGeneric.name}" is already defined for this function header.`, this);
                }

                lGenericMapping.set(lGeneric.name, lGeneric.restrictions);
            }

            pContext.pushScope('function', () => {
                // Create parameter list.
                const lParameterList: Array<FunctionDeclarationAstDataParameter> = new Array<FunctionDeclarationAstDataParameter>();
                for (const lParameter of lDeclaration.parameters) {
                    let lParameterData: FunctionDeclarationAstDataParameter;

                    // Check for generic parameter.
                    if (typeof lParameter.typeDeclaration === 'string') {
                        // Validate generic parameter index.
                        const lGenericName: string = lParameter.typeDeclaration;
                        if (!lGenericMapping.has(lGenericName)) {
                            pContext.pushIncident(`Generic parameter name "${lGenericName}" is not defined for this function header.`, this);
                        }

                        lParameterData = {
                            name: lParameter.name,
                            type: lGenericName
                        };
                    } else {
                        lParameterData = {
                            name: lParameter.name,
                            type: new TypeDeclarationAst(lParameter.typeDeclaration).process(pContext)
                        };
                    }

                    lParameterList.push(lParameterData);

                    const lParameterType: IType = (() => {
                        if (typeof lParameterData.type === 'string') {
                            // Generic type, cannot be resolved yet.
                            return new PgslInvalidType().process(pContext);
                        }

                        return lParameterData.type.data.type;
                    })();

                    // Register parameter in current scope.
                    pContext.registerValue(lParameter.name, {
                        data: {
                            fixedState: PgslValueFixedState.ScopeFixed,
                            declarationType: PgslDeclarationType.Const,
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
                const lReturnTypeDeclaration: TypeDeclarationAst | string = (() => {
                    // Check for generic return type. Generic types arent validated for the block return type.
                    if (typeof lDeclaration.returnType === 'string') {
                        // Validate generic return type index.
                        const lGenericName: string = lDeclaration.returnType;
                        if (!lGenericMapping.has(lGenericName)) {
                            pContext.pushIncident(`Generic return type name "${lGenericName}" is not defined for this function header.`, this);
                        }
                        return lGenericName;
                    }

                    const lReturnType: TypeDeclarationAst = new TypeDeclarationAst(lDeclaration.returnType).process(pContext);

                    // If function is not built-in check for correct return type in function block.
                    if (!lDeclaration.buildIn) {
                        // Read block return type.
                        const lBlockReturnType: IType = lBlock.data.returnType;

                        // Check for correct return type in function block.
                        if (!lBlockReturnType.isImplicitCastableInto(lReturnType.data.type)) {
                            pContext.pushIncident(`Function block return type does not match the declared return type.`, lBlock);
                        }
                    }

                    return lReturnType;
                })();

                // Convert all generics to types. O(n²) fuck it.
                const lGenericList: Array<FunctionDeclarationAstDataDeclarationGeneric> = lDeclaration.generics.map((pGenericType) => {
                    return {
                        name: pGenericType.name,
                        restrictions: pGenericType.restrictions
                    };
                });

                const lDeclarationResult: FunctionDeclarationAstDataDeclaration = {
                    parameter: lParameterList,
                    returnType: lReturnTypeDeclaration,
                    block: lBlock,
                    generics: lGenericList
                };

                // Find entry point.
                const lEntryPoint: FunctionDeclarationAstDataEntryPoint | null = this.readEntryPoint(lAttributes, lDeclarationResult, pContext);
                if (lEntryPoint) {
                    lDeclarationResult.entryPoint = lEntryPoint;
                }

                // Add declaration data.
                lResultData.declarations.push(lDeclarationResult);
            }, this);
        }

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
    private readEntryPoint(pAttributes: AttributeListAst, pDeclaration: FunctionDeclarationAstDataDeclaration, pContext: AbstractSyntaxTreeContext): FunctionDeclarationAstDataEntryPoint | null {
        // Entry points must not have generic parameters.
        if (pDeclaration.generics.length > 0) {
            pContext.pushIncident(`Entry points must not have generic parameters.`, this);
        }

        switch (true) {
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.vertex): {
                // Vertex entry point must have a struct type parameter.
                if (pDeclaration.parameter.length !== 1) {
                    pContext.pushIncident(`Vertex entry points must have exactly one parameter defining the vertex input structure.`, this);

                    if (pDeclaration.parameter.length === 0) {
                        return null;
                    }
                }

                // Read first parameter type and check if it is a struct type.
                const lParameterType: string | TypeDeclarationAst = pDeclaration.parameter[0].type;
                if (typeof lParameterType === 'string') {
                    pContext.pushIncident(`Vertex entry point parameter cannot be a generic type.`, this);
                    return null;
                }
                if (!(lParameterType.data.type instanceof PgslStructType)) {
                    pContext.pushIncident(`Vertex entry point parameter must be a struct type defining the vertex input structure.`, this);
                    return null;
                }

                // Check return type.
                const lReturnType: string | TypeDeclarationAst = pDeclaration.returnType;
                if (typeof lReturnType === 'string') {
                    pContext.pushIncident(`Vertex entry point return type cannot be a generic type.`, this);
                    return null;
                }
                if (!(lReturnType.data.type instanceof PgslStructType)) {
                    pContext.pushIncident(`Vertex entry point return type must be a struct type defining the vertex output structure.`, this);
                    return null;
                }

                return {
                    stage: 'vertex',
                    parameter: lParameterType.data.type,
                    returnType: lReturnType.data.type
                };
            }
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.fragment): {
                // Fragment entry point must have a struct type parameter.
                if (pDeclaration.parameter.length !== 1) {
                    pContext.pushIncident(`Fragment entry points must have exactly one parameter defining the fragment input structure.`, this);

                    if (pDeclaration.parameter.length === 0) {
                        return null;
                    }
                }

                // Read first parameter type and check if it is a struct type.
                const lParameterType: string | TypeDeclarationAst = pDeclaration.parameter[0].type;
                if (typeof lParameterType === 'string') {
                    pContext.pushIncident(`Fragment entry point parameter cannot be a generic type.`, this);
                    return null;
                }
                if (!(lParameterType.data.type instanceof PgslStructType)) {
                    pContext.pushIncident(`Fragment entry point parameter must be a struct type defining the fragment input structure.`, this);
                    return null;
                }

                // Check return type.
                const lReturnType: string | TypeDeclarationAst = pDeclaration.returnType;
                if (typeof lReturnType === 'string') {
                    pContext.pushIncident(`Fragment entry point return type cannot be a generic type.`, this);
                    return null;
                }
                if (!(lReturnType.data.type instanceof PgslStructType)) {
                    pContext.pushIncident(`Fragment entry point return type must be a struct type defining the fragment output structure.`, this);
                    return null;
                }

                return {
                    stage: 'fragment',
                    parameter: lParameterType.data.type,
                    returnType: lReturnType.data.type
                };
            }
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.compute): {
                const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.compute);

                // Check parameter count.
                if (lAttributeParameter.length !== 3) {
                    pContext.pushIncident(`Compute attribute needs exactly three constant parameters for work group size declaration.`, pAttributes);
                    return null;
                }

                // Compute entry point must not have parameters or a return type.
                if (pDeclaration.parameter.length > 0) {
                    pContext.pushIncident(`Compute entry points must not have parameters.`, this);
                }
                if (typeof pDeclaration.returnType !== 'string' && !(pDeclaration.returnType.data.type instanceof PgslInvalidType)) {
                    pContext.pushIncident(`Compute entry points must not have a return type.`, this);
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
    readonly type: TypeDeclarationAst | string;

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
    generics: Array<FunctionDeclarationAstDataDeclarationGeneric>;

    /**
     * Function parameter list.
     */
    parameter: Array<FunctionDeclarationAstDataParameter>;

    /**
     * Function result type.
     * When a number, the function uses the defined generic type as result type.
     */
    returnType: TypeDeclarationAst | string;

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
 * Function declaration generic type.
 */
export type FunctionDeclarationAstDataDeclarationGeneric = {
    /**
     * Generic name.
     */
    name: string;

    /**
     * Restrictions for the generic type.
     */
    restrictions: null | Array<string>;
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
    stage: 'compute';
    workgroupSize: FunctionDeclarationAstDataEntryPointWorkgroupSize;
} | {
    stage: 'vertex' | 'fragment';
    parameter: PgslStructType;
    returnType: PgslStructType;
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
     * Whether generic types are implicitly defined.
     */
    implicitGenerics: boolean;

    /**
     * Function parameter list.
     */
    declarations: ReadonlyArray<FunctionDeclarationAstDataDeclaration>;
} & DeclarationAstData;