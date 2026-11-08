import type { FunctionOverloadDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import type { IValueStoreAst } from '../i-value-store-ast.interface.ts';
import { BlockStatementAst } from '../statement/execution/block-statement-ast.ts';
import type { BasePgslType } from '../type/definition/base-pgsl-type.ts';
import { PgslGenericType } from '../type/definition/pgsl-generic-type.ts';
import { PgslStructType } from '../type/definition/pgsl-struct-type.ts';
import { BaseDeclarationAst, type DeclarationAstData } from './base-declaration-ast.ts';

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
     * @param pTreeData - Function overload cst or already processed overload data.
     */
    public constructor(pFunctionName: string, pTreeData: FunctionOverloadDeclarationCst | FunctionOverloadDeclarationAstData) {
        super(pTreeData);
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
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: FunctionOverloadDeclarationCst): FunctionOverloadDeclarationAstData {
        // Create attribute list for this declaration.
        const lAttributes: AttributeListAst = new AttributeListAst(pCst.attributeList, this).process(pContext);

        // Create every generic type of this declaration.
        const lGenericList: Array<PgslGenericType> = pCst.generics.map((pGenericCst) => {
            // Create generic restrictions as type definition and get the raw type.
            const lGenericRestrictions: Array<BasePgslType> = pGenericCst.restrictions.map((pRestrictionTypeDeclarationCst) => {
                return new TypeDeclarationAst(pRestrictionTypeDeclarationCst).process(pContext).data.type;
            });

            return new PgslGenericType(pGenericCst.name, lGenericRestrictions);
        });

        return pContext.pushScope('function', () => {
            // Create parameter list.
            const lParameterList: Array<FunctionOverloadDeclarationAstDataParameter> = new Array<FunctionOverloadDeclarationAstDataParameter>();
            for (const lParameter of pCst.parameters) {
                // Create or read the parameter type declaration.
                const lParameterTypeDeclaration: TypeDeclarationAst = (() => {
                    // Check if parameter is generic.
                    if (typeof lParameter.typeDeclaration !== 'string') {
                        return new TypeDeclarationAst(lParameter.typeDeclaration).process(pContext);
                    }

                    const lGenericName: string = lParameter.typeDeclaration;

                    // Find the used generic type by name.
                    const lGenericType: PgslGenericType | undefined = lGenericList.find((pGeneric) => {
                        return pGeneric.name === lGenericName;
                    });

                    return new TypeDeclarationAst({
                        type: lGenericType ?? pContext.types.create(PgslGenericType, lGenericName, [])
                    });
                })();

                // Add found type with set name.
                lParameterList.push({
                    name: lParameter.name,
                    type: lParameterTypeDeclaration
                });

                // Register parameter in current scope.
                pContext.registerValue(lParameter.name, {
                    data: {
                        fixedState: PgslValueFixedState.ScopeFixed,
                        declarationType: PgslDeclarationType.Const,
                        addressSpace: PgslValueAddressSpace.Function,
                        type: lParameterTypeDeclaration.data.type,
                        name: lParameter.name,
                        constantValue: null,
                        accessMode: 'read'
                    }
                } satisfies IValueStoreAst);
            }

            // Create block for each header.
            const lBlock: BlockStatementAst = new BlockStatementAst(pCst.block).process(pContext);

            // Build return type.
            const lReturnTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(pCst.returnType).process(pContext);

            const lDeclarationResult: FunctionOverloadDeclarationAstData = {
                attributes: lAttributes,
                name: this.mFunctionName,
                parameter: lParameterList,
                returnType: lReturnTypeDeclaration,
                block: lBlock,
                generics: lGenericList
            };

            // Find entry point.
            const lEntryPoint: FunctionOverloadDeclarationAstDataEntryPoint | null = this.readEntryPoint(lAttributes, lDeclarationResult);
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
     * @param pDeclaration - Function overload data.
     *
     * @returns Entry point data or null if function is not an entry point.
     */
    private readEntryPoint(pAttributes: AttributeListAst, pDeclaration: FunctionOverloadDeclarationAstData): FunctionOverloadDeclarationAstDataEntryPoint | null {
        // Read the struct type of a type declaration or not if its not a enum at all.
        const lStructTypeOf = (pTypeDeclaration: TypeDeclarationAst | undefined): PgslStructType | null => {
            if (pTypeDeclaration?.data.type instanceof PgslStructType) {
                return pTypeDeclaration.data.type;
            }

            return null;
        };

        switch (true) {
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.vertex): {
                return {
                    stage: 'vertex',
                    parameter: lStructTypeOf(pDeclaration.parameter[0]?.type),
                    returnType: lStructTypeOf(pDeclaration.returnType)
                };
            }
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.fragment): {
                return {
                    stage: 'fragment',
                    parameter: lStructTypeOf(pDeclaration.parameter[0]?.type),
                    returnType: lStructTypeOf(pDeclaration.returnType)
                };
            }
            case pAttributes.hasAttribute(AttributeListAst.attributeNames.compute): {
                // Read the workgroup size from the compute attribute parameters.
                const lWorkgroupSize: FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize | null = (() => {
                    // Workgroup size needs to be three parameters.
                    const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.compute);
                    if (lAttributeParameter.length !== 3) {
                        return null;
                    }

                    // Every parameter needs a constant integer value.
                    for (const lParameter of lAttributeParameter) {
                        if (lParameter.data.fixedState !== PgslValueFixedState.Constant || !Number.isInteger(lParameter.data.constantValue)) {
                            return null;
                        }
                    }

                    return {
                        x: lAttributeParameter[0].data.constantValue as number,
                        y: lAttributeParameter[1].data.constantValue as number,
                        z: lAttributeParameter[2].data.constantValue as number
                    };
                })();

                return {
                    stage: 'compute',
                    workgroupSize: lWorkgroupSize
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
    generics: Array<PgslGenericType>;

    /**
     * Function parameter list.
     */
    parameter: Array<FunctionOverloadDeclarationAstDataParameter>;

    /**
     * Function result type.
     */
    returnType: TypeDeclarationAst;

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
 * Function declaration parameter containing type and name.
 */
export type FunctionOverloadDeclarationAstDataParameter = {
    /**
     * Function parameter type.
     */
    readonly type: TypeDeclarationAst;

    /**
     * Function parameter name.
     */
    readonly name: string;
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

    /**
     * Workgroup size.
     */
    workgroupSize: FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize | null;
} | {
    stage: 'vertex' | 'fragment';

    /**
     * Input parameters as struct.
     */
    parameter: PgslStructType | null;

    /**
     * Output values as struct.
     */
    returnType: PgslStructType | null;
};