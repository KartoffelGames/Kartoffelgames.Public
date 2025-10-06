import { PgslFunctionDeclaration } from "../../../syntax_tree/declaration/pgsl-function-declaration.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorSendResult, PgslTranspilerProcessorTranspile } from "../../i-pgsl-transpiler-processor.interface.ts";

export class PgslFunctionDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<PgslFunctionDeclaration> {
    /**
     * Gets the target class this processor can handle.
     *
     * @returns The constructor of the target class.
     */
    public get target(): typeof PgslFunctionDeclaration {
        return PgslFunctionDeclaration;
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
    public process(pInstance: PgslFunctionDeclaration, _pTrace: PgslTrace, pSendResult: PgslTranspilerProcessorSendResult, pTranspile: PgslTranspilerProcessorTranspile): void {
        // Transpile return type.
        const lReturnType: string = pTranspile(pInstance.returnType);

        // Transpile function parameter list.
        const lParameterList: string = pInstance.parameter.map((pParameter) => {
            return ` ${pParameter.name}: ${pTranspile(pParameter.type)}`;
        }).join(', ');

        // Transpile attribute list.
        let lResult: string = pTranspile(pInstance.attributes);

        // Create function declaration head without return type.
        lResult += `fn ${pInstance.name}(${lParameterList})`;

        // Add return type when it is not void/empty.
        if (lReturnType !== '') {
            lResult += ` -> ${lReturnType}`;
        }

        // Add function block.
        lResult += pTranspile(pInstance.block);

        pSendResult(lResult);
    }
}