import { Exception } from '@kartoffelgames/core';
import { FunctionDeclarationAst, type FunctionDeclarationAstDataDeclaration } from '../../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { IType } from '../../../abstract_syntax_tree/type/i-type.interface.ts';
import { PgslVoidType } from '../../../abstract_syntax_tree/type/pgsl-void-type.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-transpiler-processor.interface.ts';

export class FunctionDeclarationAstTranspilerProcessor implements ITranspilerProcessor<FunctionDeclarationAst> {
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
        if (typeof lSoleHeader.returnType === 'string') {
            throw new Exception(`Unable to transpile function "${pInstance.data.name}" with generic return type.`, this);
        }

        // Transpile return type. use empty string for void type.
        const lReturnType: IType = lSoleHeader.returnType.data.type;
        const lReturnTypeName: string | null = lReturnType instanceof PgslVoidType ? null : pTranspile(lSoleHeader.returnType);

        // Transpile function parameter list.
        const lParameterList: string = lSoleHeader.parameter.map((pParameter) => {
            if (typeof pParameter.type === 'string') {
                throw new Exception(`Unable to transpile function "${pInstance.data.name}" with generic parameter type.`, this);
            }

            return `${pParameter.name}:${pTranspile(pParameter.type)}`;
        }).join(',');

        // Transpile attributes.
        const lAttributes: string = (() => {
            if (!lSoleHeader.entryPoint) {
                return '';
            }

            switch (lSoleHeader.entryPoint.stage) {
                case 'vertex': {
                    return `@vertex `;
                }
                case 'fragment': {
                    return `@fragment `;
                }
                case 'compute': {
                    if (!lSoleHeader.entryPoint.workgroupSize) {
                        throw new Exception(`Compute entry point for function "${pInstance.data.name}" is missing workgroup size definition.`, this);
                    }

                    return `@compute @workgroup_size(${lSoleHeader.entryPoint.workgroupSize.x},${lSoleHeader.entryPoint.workgroupSize.y},${lSoleHeader.entryPoint.workgroupSize.z}) `;
                }
            }
        })();

        // Create function declaration head without return type. Attributes contains trailing space.
        let lResult: string = `${lAttributes}fn ${pInstance.data.name}(${lParameterList})`;

        // Add return type when it is not void/empty.
        if (lReturnTypeName !== null) {
            lResult += `->${lReturnTypeName}`;
        }

        // Add function block.
        lResult += pTranspile(lSoleHeader.block);

        return lResult;
    }
}