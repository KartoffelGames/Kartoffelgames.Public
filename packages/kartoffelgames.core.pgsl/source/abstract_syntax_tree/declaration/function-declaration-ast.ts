import { FunctionDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import { PgslType } from "../../type/pgsl-type.ts";
import { PgslVoidType } from "../../type/pgsl-void-type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from "../abstract-syntax-tree.ts";
import { IExpressionAst } from "../expression/i-expression-ast.interface.ts";
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import { BlockStatementAst } from '../statement/execution/block-statement-ast.ts';
import { DeclarationAstData, IDeclarationAst } from "./i-declaration-ast.interface.ts";

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
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this).process(pContext);

        // Build return data.
        const lResultData = {
            attributes: lAttributes,
            isConstant: this.cst.isConstant,
            isGeneric: this.cst.isGeneric,
            name: this.cst.name,
            declarations: new Array<FunctionDeclarationAstDataDeclaration>()
        } satisfies FunctionDeclarationAstData;

        // Each header must be validated in a separate scope.
        for (const lHeader of this.cst.headers) {
            pContext.pushScope('function', () => {
                // Create parameter list.
                const lParameter: Array<FunctionDeclarationAstDataParameter> = lHeader.parameters.map((pParameterCst) => {
                    return {
                        name: pParameterCst.name,
                        type: new TypeDeclarationAst(pParameterCst.typeDeclaration).process(pContext)
                    };
                });

                // Create block for each header.
                const lBlock: BlockStatementAst = new BlockStatementAst(this.cst.block).process(pContext);

                // Build return type.
                let lReturnTypeDeclaration: TypeDeclarationAst | null = null;
                if (lHeader.returnType) {
                    lReturnTypeDeclaration = new TypeDeclarationAst(lHeader.returnType).process(pContext);

                    // Read block return type.
                    const lBlockReturnType: PgslType = lBlock.data.returnType ?? new PgslVoidType().process(pContext);

                    // Check for correct return type in function block.
                    if (lBlockReturnType.isImplicitCastableInto(lReturnTypeDeclaration.data.type)) {
                        pContext.pushIncident(`Function block return type does not match the declared return type.`, lBlock);
                    }
                }

                // Add declaration data.
                lResultData.declarations.push({
                    parameter: lParameter,
                    returnType: lReturnTypeDeclaration,
                    block: lBlock
                });
            }, this);
        }

        // Find entry point.
        const lEntryPoint: FunctionDeclarationAstDataEntryPoint | null = this.readEntryPoint(lAttributes, pContext);
        if (lEntryPoint) {
            (<FunctionDeclarationAstData>lResultData).entryPoint = lEntryPoint;
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
                if (lWorkGroupSizeTraceX.data.fixedState === PgslValueFixedState.Constant && lWorkGroupSizeTraceY.data.fixedState === PgslValueFixedState.Constant && lWorkGroupSizeTraceZ.data.fixedState === PgslValueFixedState.Constant) {
                    pContext.pushIncident(`All compute attribute parameters need to be constant expressions.`, pAttributes);
                    return null;
                }

                // Get constant values.
                const lWorkGroupSizeX: string | number | null = lWorkGroupSizeTraceX.data.constantValue;
                const lWorkGroupSizeY: string | number | null = lWorkGroupSizeTraceY.data.constantValue;
                const lWorkGroupSizeZ: string | number | null = lWorkGroupSizeTraceZ.data.constantValue;

                // Check if all parameters are numbers.
                if (typeof lWorkGroupSizeX !== 'number' || typeof lWorkGroupSizeY !== 'number' || typeof lWorkGroupSizeZ !== 'number') {
                    pContext.pushIncident(`All compute attribute parameters need to be constant number expressions.`, pAttributes);
                    return null;
                }

                return {
                    stage: 'compute',
                    workgroupSize: {
                        x: lWorkGroupSizeX,
                        y: lWorkGroupSizeY,
                        z: lWorkGroupSizeZ
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
     * When null, the function uses the defined generic type as parameter type.
     */
    readonly type: TypeDeclarationAst | null;

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
     * Function parameter list.
     */
    parameter: Array<FunctionDeclarationAstDataParameter>;

    /**
     * Function result type.
     * When null, the function uses the defined generic type as result type.
     */
    returnType: TypeDeclarationAst | null;

    /**
     * Function block.
     */
    block: BlockStatementAst;
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

    /**
     * Function generic.
     */
    isGeneric: boolean;

    /**
     * Function entry point information.
     */
    entryPoint?: FunctionDeclarationAstDataEntryPoint;
} & DeclarationAstData;