import { Exception } from "@kartoffelgames/core";
import { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-pgsl-transpiler-processor.interface.ts';

export class PgslFunctionDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<FunctionDeclarationAst> {
    /**
     * Gets the target class this processor can handle.
     *
     * @returns The constructor of the target class.
     */
    public get target(): typeof FunctionDeclarationAst {
        return FunctionDeclarationAst;
    }

    /**
     * Transpile current function declaration into a string.
     * 
     * @param pInstance - Instance to process.
     * @param pTrace - Transpilation trace.
     * @param pSendResult - Callback to send transpiled WGSL code.
     * @param pTranspile - Callback to transpile nested expressions.
     * 
     * @returns Transpiled string.
     */
    public process(pInstance: FunctionDeclarationAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        if (pInstance.data.declarations.length !== 1) {
            throw new Exception(`Unable to transpile function "${pInstance.data.name}" with ${pInstance.data.declarations.length} heads.`, this);
        }

        // Use first declaration only for transpilation.
        const lSoleHeader: FunctionDeclarationAstDataDeclaration = pInstance.data.declarations[0];
        if (typeof lSoleHeader.returnType === 'number') {
            throw new Exception(`Unable to transpile function "${pInstance.data.name}" with generic return type.`, this);
        }

        // Transpile return type.
        const lReturnType: string = pTranspile(lSoleHeader.returnType);

        // Transpile function parameter list.
        const lParameterList: string = lSoleHeader.parameter.map((pParameter) => {
            if (typeof pParameter.type === 'number') {
                throw new Exception(`Unable to transpile function "${pInstance.data.name}" with generic parameter type.`, this);
            }

            return ` ${pParameter.name}: ${pTranspile(pParameter.type)}`;
        }).join(', ');

        // Transpile attribute list.
        let lResult: string = pTranspile(pInstance.data.attributes);

        // Create function declaration head without return type.
        lResult += `fn ${pInstance.data.name}(${lParameterList})`;

        // Add return type when it is not void/empty.
        if (lReturnType !== '') {
            lResult += ` -> ${lReturnType}`;
        }

        // Add function block.
        lResult += pTranspile(lSoleHeader.block);

        return lResult;
    }
}