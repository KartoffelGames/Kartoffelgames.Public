import { VariableDeclarationAst } from '../../../abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import { PgslSamplerType } from '../../../abstract_syntax_tree/type/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../../abstract_syntax_tree/type/pgsl-texture-type.ts';
import { PgslAccessModeEnum } from '../../../buildin/enum/pgsl-access-mode-enum.ts';
import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-transpiler-processor.interface.ts';
import type { TranspilationMeta, TranspilationMetaBinding } from '../../transpilation-meta.ts';

export class VariableDeclarationAstTranspilerProcessor implements ITranspilerProcessor<VariableDeclarationAst> {
    /**
     * Gets the target class this processor can handle.
     * 
     * @returns The constructor of the target class.
     */
    public get target(): typeof VariableDeclarationAst {
        return VariableDeclarationAst;
    }

    /**
     * Process a variable declaration instance and transpile it to WGSL.
     * 
     * @param pInstance - The variable declaration instance to process.
     * @param pTrace - The trace information for the current transpilation context.
     * @param pSendResult - The function to send the transpiled result.
     * @param pTranspile - The function to transpile expressions.
     */
    public process(pInstance: VariableDeclarationAst, pTranspile: PgslTranspilerProcessorTranspile, pTranspilationMeta: TranspilationMeta): string {
        // Get type, resolving any aliases.
        const lDeclarationTypeString = ((): string => {
            // When the type is a texture or sampler, we ignore the declaration type and use var without address space.
            if (pInstance.data.type instanceof PgslTextureType || pInstance.data.type instanceof PgslSamplerType) {
                return `var`;
            }

            switch (pInstance.data.declarationType) {
                case PgslDeclarationType.Const:
                    return 'const';
                case PgslDeclarationType.Storage: {
                    // Dependent on the access mode, set correct binding type.
                    // Cast back to string, as lAccessMode can be outside of enum values.
                    switch (pInstance.data.accessMode) {
                        case PgslAccessModeEnum.VALUES.Read:
                            return `var<storage,read>`;
                        case PgslAccessModeEnum.VALUES.Write:
                            return `var<storage,write>`;
                        case PgslAccessModeEnum.VALUES.ReadWrite:
                            return `var<storage,read_write>`;
                    }
                }
                case PgslDeclarationType.Workgroup:
                    return 'var<workgroup>';
                case PgslDeclarationType.Private:
                    return 'var<private>';
                case PgslDeclarationType.Param:
                    return 'override';
                case PgslDeclarationType.Uniform: {
                    return 'var<uniform>';
                }
            }

            return 'var<private>';
        })();

        // Transpile binding attribute.
        const lBindingAttribute: string = (() => {
            if (!pInstance.data.bindingInformation) {
                return '';
            }

            // Create binding information for this variable declaration.
            const lValueTrace: TranspilationMetaBinding = pTranspilationMeta.createBindingFor(pInstance);

            return `@group(${lValueTrace.bindGroupIndex})@binding(${lValueTrace.bindingIndex})`;
        })();

        // Transpile declaration parts to fit spaces correctly.
        const lTypeDeclaration: string = pTranspile(pInstance.data.typeDeclaration);

        // If no expression is given, return declaration without expression.
        if (!pInstance.data.expression) {
            return `${lBindingAttribute}${lDeclarationTypeString} ${pInstance.data.name}:${lTypeDeclaration};`;
        } else {
            return `${lBindingAttribute}${lDeclarationTypeString} ${pInstance.data.name}:${lTypeDeclaration}=${pTranspile(pInstance.data.expression)};`;
        }
    }
} 