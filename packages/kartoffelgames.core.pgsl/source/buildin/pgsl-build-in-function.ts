import { FunctionDeclarationCst, FunctionDeclarationHeaderCst } from "../concrete_syntax_tree/declaration.type.ts";
import { Cst, TypeDeclarationCst } from "../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../concrete_syntax_tree/statement.type.ts";

export class PgslBuildInFunction {
    public static bitReinterpretation(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // bitcast
        lFunctions.push(PgslBuildInFunction.create('bitcast', true, []));

        return lFunctions;
    }

    /**
     * Create a new cst function declaration.
     * 
     * @param pName - Function name.
     * @param pConstant - Function is constant.
     * @param pDeclarations - Function header declarations.
     * 
     * @returns cst function declaration.
     */
    private static create(pName: string, pConstant: boolean, pDeclarations: Array<FunctionDeclarationHeaderCst>): FunctionDeclarationCst {
        return {
            type: "FunctionDeclaration",
            isConstant: pConstant,
            buildIn: true,
            range: [0, 0, 0, 0],
            name: pName,
            declarations: pDeclarations
        };
    }

    private static header(pGenerics: Array<Array<TypeDeclarationCst>>, pParameter: TypeDeclarationCst, pReturnType: TypeDeclarationCst | number): FunctionDeclarationHeaderCst {
        const lEmptyBlock: BlockStatementCst = {
            type: "BlockStatement",
            statements: [],
            range: [0, 0, 0, 0],
        };

        return {
            type: "FunctionDeclarationHeader",
            buildIn: true,
            range: [0, 0, 0, 0],
            block: lEmptyBlock
        };
    }
}

