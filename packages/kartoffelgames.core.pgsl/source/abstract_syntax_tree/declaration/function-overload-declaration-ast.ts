import { FunctionOverloadDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { PgslDeclarationType } from "../../enum/pgsl-declaration-type.enum.ts";
import { PgslValueAddressSpace } from "../../enum/pgsl-value-address-space.enum.ts";
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { IExpressionAst } from "../expression/i-expression-ast.interface.ts";
import { AttributeListAst } from "../general/attribute-list-ast.ts";
import { TypeDeclarationAst } from "../general/type-declaration-ast.ts";
import { IValueStoreAst } from "../i-value-store-ast.interface.ts";
import { BlockStatementAst } from "../statement/execution/block-statement-ast.ts";
import { BasePgslType } from "../type/definition/base-pgsl-type.ts";
import { PgslInvalidType } from "../type/definition/pgsl-invalid-type.ts";
import { PgslStructType } from "../type/definition/pgsl-struct-type.ts";
import { PgslVoidType } from "../type/definition/pgsl-void-type.ts";
import { BaseDeclarationAst, DeclarationAstData } from "./base-declaration-ast.ts";
import { FunctionDeclarationAstDataParameter } from "./function-declaration-ast.ts";

export class FunctionOverloadDeclarationAst extends BaseDeclarationAst<FunctionOverloadDeclarationCst, FunctionOverloadDeclarationAstData> {
    private readonly mFunctionName: string;

    /**
     * Functions name.
     */
    public get name(): string {
        return this.mFunctionName;
    }

    /**
     * Constructor.
     * 
     * @param pFunctionName - Function name.
     * @param pConcreteSyntaxTree - Function overload cst.
     */
    public constructor(pFunctionName: string, pConcreteSyntaxTree: FunctionOverloadDeclarationCst) {
        super(pConcreteSyntaxTree);
        this.mFunctionName = pFunctionName;
    }

    /**
     * Register struct property without registering its content.
     * 
     * @param _pContext - Processing context.
     */
    public override register(_pContext: AbstractSyntaxTreeContext): this {
        return this;
    }

    /**
     * Process and build data of current structure.
     * 
     * @param pContext - Build context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): FunctionOverloadDeclarationAstData {
        // Create attribute list for this declaration.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this).process(pContext);

        // Create generic mapping for this declaration.
        const lGenericMapping: Map<string, Array<string> | null> = new Map<string, Array<string> | null>();
        for (const lGeneric of this.cst.generics) {
            // Check for duplicate generic names.
            if (lGenericMapping.has(lGeneric.name)) {
                pContext.pushIncident(`Generic type name "${lGeneric.name}" is already defined for this function header.`, this);
            }

            lGenericMapping.set(lGeneric.name, lGeneric.restrictions);
        }

        return pContext.pushScope('function', () => {
            // Create parameter list.
            const lParameterList: Array<FunctionDeclarationAstDataParameter> = new Array<FunctionDeclarationAstDataParameter>();
            for (const lParameter of this.cst.parameters) {
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

                const lParameterType: BasePgslType = (() => {
                    if (typeof lParameterData.type === 'string') {
                        // Generic type, cannot be resolved yet.
                        return new PgslInvalidType();
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
            const lBlock: BlockStatementAst = new BlockStatementAst(this.cst.block).process(pContext);

            // Build return type.
            const lReturnTypeDeclaration: TypeDeclarationAst | string = (() => {
                // Check for generic return type. Generic types arent validated for the block return type.
                if (typeof this.cst.returnType === 'string') {
                    // Validate generic return type index.
                    const lGenericName: string = this.cst.returnType;
                    if (!lGenericMapping.has(lGenericName)) {
                        pContext.pushIncident(`Generic return type name "${lGenericName}" is not defined for this function header.`, this);
                    }
                    return lGenericName;
                }

                const lReturnType: TypeDeclarationAst = new TypeDeclarationAst(this.cst.returnType).process(pContext);

                // If function is not built-in check for correct return type in function block.
                if (!this.cst.buildIn) {
                    // Read block return type.
                    const lBlockReturnType: BasePgslType = lBlock.data.returnType;

                    // Check for correct return type in function block.
                    if (lBlockReturnType.conversionRankTo(lReturnType.data.type) === Number.POSITIVE_INFINITY) {
                        pContext.pushIncident(`Function block return type does not match the declared return type.`, lBlock);
                    }
                }

                return lReturnType;
            })();

            // Convert all generics to types. O(n²) fuck it.
            const lGenericList: Array<FunctionOverloadDeclarationAstDataGeneric> = this.cst.generics.map((pGenericType) => {
                return {
                    name: pGenericType.name,
                    restrictions: pGenericType.restrictions
                };
            });

            const lDeclarationResult: FunctionOverloadDeclarationAstData = {
                attributes: lAttributes,
                name: this.mFunctionName,
                parameter: lParameterList,
                returnType: lReturnTypeDeclaration,
                block: lBlock,
                generics: lGenericList
            };

            // Find entry point.
            const lEntryPoint: FunctionOverloadDeclarationAstDataEntryPoint | null = this.readEntryPoint(lAttributes, lDeclarationResult, pContext);
            if (lEntryPoint) {
                lDeclarationResult.entryPoint = lEntryPoint;
            }

            // Add declaration data.
            return lDeclarationResult;
        }, this);
    }

    /**
     * Read entry point information from function attributes.
     * 
     * @param pAttributes - Function attributes.
     * @param pContext - Build context.
     * 
     * @returns Entry point data or null if function is not an entry point. 
     */
    private readEntryPoint(pAttributes: AttributeListAst, pDeclaration: FunctionOverloadDeclarationAstData, pContext: AbstractSyntaxTreeContext): FunctionOverloadDeclarationAstDataEntryPoint | null {
        const lValidateVertexFragmentParameterType = (pParameter: Array<FunctionDeclarationAstDataParameter>, pEntryPointName: string): PgslStructType | null => {
            // Vertex entry point must have a struct type parameter.
            if (pParameter.length !== 1) {
                pContext.pushIncident(`The ${pEntryPointName} entry points must have exactly one parameter defining the ${pEntryPointName} input structure.`, this);

                if (pParameter.length === 0) {
                    return null;
                }
            }

            // Read first parameter type and check if it is a struct type.
            const lParameterType: string | TypeDeclarationAst = pParameter[0].type;
            if (typeof lParameterType === 'string') {
                pContext.pushIncident(`The ${pEntryPointName} entry point parameter cannot be a generic type.`, this);
                return null;
            }
            if (!(lParameterType.data.type instanceof PgslStructType)) {
                pContext.pushIncident(`The ${pEntryPointName} entry point parameter must be a struct type defining the ${pEntryPointName} input structure.`, this);
                return null;
            }

            return lParameterType.data.type;
        };

        const lValidateVertexFragmentResultType = (pReturnType: string | TypeDeclarationAst, pEntryPointName: string): PgslStructType | null => {
            // Check return type.
            if (typeof pReturnType === 'string') {
                pContext.pushIncident(`The ${pEntryPointName} entry point return type cannot be a generic type.`, this);
                return null;
            }
            if (!(pReturnType.data.type instanceof PgslStructType)) {
                pContext.pushIncident(`The ${pEntryPointName} entry point return type must be a struct type defining the ${pEntryPointName} output structure.`, this);
                return null;
            }

            return pReturnType.data.type;
        };

        const lValidateEntryPointHeader = (pEntryPointName: string): void => {
            // Entry points must not have generic parameters.
            if (pDeclaration.generics.length > 0) {
                pContext.pushIncident(`The ${pEntryPointName} entry point must not have generic parameters.`, this);
            }
        };

        switch (true) {
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.vertex): {
                // Validate entry point header.
                lValidateEntryPointHeader('vertex');

                // Validate parameter and return type.
                const lParameterType: PgslStructType | null = lValidateVertexFragmentParameterType(pDeclaration.parameter, 'vertex');
                const lReturnType: PgslStructType | null = lValidateVertexFragmentResultType(pDeclaration.returnType, 'vertex');
                if (!lParameterType || !lReturnType) {
                    return null;
                }

                return {
                    stage: 'vertex',
                    parameter: lParameterType,
                    returnType: lReturnType
                };
            }
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.fragment): {
                // Validate entry point header.
                lValidateEntryPointHeader('fragment');

                // Validate parameter type and return type.
                const lParameterType: PgslStructType | null = lValidateVertexFragmentParameterType(pDeclaration.parameter, 'fragment');
                const lReturnType: PgslStructType | null = lValidateVertexFragmentResultType(pDeclaration.returnType, 'fragment');
                if (!lParameterType || !lReturnType) {
                    return null;
                }

                return {
                    stage: 'fragment',
                    parameter: lParameterType,
                    returnType: lReturnType
                };
            }
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.compute): {
                // Validate entry point header.
                lValidateEntryPointHeader('compute');

                // Read compute attribute parameters.
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
                if (typeof pDeclaration.returnType !== 'string' && !(pDeclaration.returnType.data.type instanceof PgslVoidType)) {
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
 * Function declaration header containing parameters and result type.
 */
export type FunctionOverloadDeclarationAstData = {
    /**
     * Function name.
     */
    name: string;

    /**
     * Function generic types.
     */
    generics: Array<FunctionOverloadDeclarationAstDataGeneric>;

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
    entryPoint?: FunctionOverloadDeclarationAstDataEntryPoint;
} & DeclarationAstData;

/**
 * Function declaration generic type.
 */
export type FunctionOverloadDeclarationAstDataGeneric = {
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
export type FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize = {
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
export type FunctionOverloadDeclarationAstDataEntryPoint = {
    stage: 'compute';
    workgroupSize: FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize;
} | {
    stage: 'vertex' | 'fragment';
    parameter: PgslStructType;
    returnType: PgslStructType;
};