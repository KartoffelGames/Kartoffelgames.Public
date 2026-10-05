import { Exception } from '@kartoffelgames/core';
import { FunctionDeclarationAst } from '../../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { BasePgslType } from '../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslVoidType } from '../../../abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import { TranspilerProcessor } from '../../transpiler-processor.ts';
import type { FunctionOverloadDeclarationAst } from '../../../abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';

export class FunctionDeclarationAstTranspilerProcessor extends TranspilerProcessor<FunctionDeclarationAst> {
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
     * 
     * @returns Transpiled string.
     */
    protected override onProcess(pInstance: FunctionDeclarationAst): string {
        if (pInstance.data.declarations.length !== 1) {
            throw new Exception(`Unable to transpile function "${pInstance.data.name}" with ${pInstance.data.declarations.length} heads.`, this);
        }

        // Use first declaration only for transpilation.
        const lSoleHeader: FunctionOverloadDeclarationAst = pInstance.data.declarations[0];
        if (typeof lSoleHeader.data.returnType === 'string') {
            throw new Exception(`Unable to transpile function "${pInstance.data.name}" with generic return type.`, this);
        }

        // Transpile return type. use empty string for void type.
        const lReturnType: BasePgslType = lSoleHeader.data.returnType.data.type;
        const lReturnTypeName: string | null = lReturnType instanceof PgslVoidType ? null : this.transpileAst(lSoleHeader.data.returnType);

        // Transpile function parameter list.
        const lParameterList: string = lSoleHeader.data.parameter.map((pParameter) => {
            if (typeof pParameter.type === 'string') {
                throw new Exception(`Unable to transpile function "${pInstance.data.name}" with generic parameter type.`, this);
            }

            return `${pParameter.name}:${this.transpileAst(pParameter.type)}`;
        }).join(',');

        // Transpile attributes.
        const lAttributes: string = (() => {
            if (!lSoleHeader.data.entryPoint) {
                return '';
            }

            switch (lSoleHeader.data.entryPoint.stage) {
                case 'vertex': {
                    return `@vertex `;
                }
                case 'fragment': {
                    return `@fragment `;
                }
                case 'compute': {
                    if (!lSoleHeader.data.entryPoint.workgroupSize) {
                        throw new Exception(`Compute entry point for function "${pInstance.data.name}" is missing workgroup size definition.`, this);
                    }

                    return `@compute @workgroup_size(${lSoleHeader.data.entryPoint.workgroupSize.x},${lSoleHeader.data.entryPoint.workgroupSize.y},${lSoleHeader.data.entryPoint.workgroupSize.z}) `;
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
        lResult += this.transpileAst(lSoleHeader.data.block);

        return lResult;
    }
}