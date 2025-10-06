import { PgslDeclarationType } from "../../../enum/pgsl-declaration-type.enum.ts";
import { PgslAccessMode } from "../../../syntax_tree/buildin/pgsl-access-mode.enum.ts";
import { PgslVariableDeclaration } from "../../../syntax_tree/declaration/pgsl-variable-declaration.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { PgslValueTrace } from "../../../trace/pgsl-value-trace.ts";
import { PgslSamplerType } from "../../../type/pgsl-sampler-type.ts";
import { PgslTextureType } from "../../../type/pgsl-texture-type.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorSendResult, PgslTranspilerProcessorTranspile } from "../../i-pgsl-transpiler-processor.interface.ts";

export class PgslVariableDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<PgslVariableDeclaration> {
    /**
     * Gets the target class this processor can handle.
     * 
     * @returns The constructor of the target class.
     */
    public get target(): typeof PgslVariableDeclaration {
        return PgslVariableDeclaration;
    }

    /**
     * Process a variable declaration instance and transpile it to WGSL.
     * 
     * @param pInstance - The variable declaration instance to process.
     * @param pTrace - The trace information for the current transpilation context.
     * @param pSendResult - The function to send the transpiled result.
     * @param pTranspile - The function to transpile expressions.
     */
    public process(pInstance: PgslVariableDeclaration, pTrace: PgslTrace, pSendResult: PgslTranspilerProcessorSendResult, pTranspile: PgslTranspilerProcessorTranspile): void {
        // Read trace of declaration.
        const lValueTrace: PgslValueTrace | undefined = pTrace.getModuleValue(pInstance.name);
        if (!lValueTrace) {
            throw new Error(`Variable declaration "${pInstance.name}" is missing trace information.`);
        }

        // Get type, resolving any aliases.
        const lDeclarationTypeString = ((): string => {
            // When the type is a texture or sampler, we ignore the declaration type and use var without address space.
            if (lValueTrace.type instanceof PgslTextureType || lValueTrace.type instanceof PgslSamplerType) {
                return `var`;
            }

            switch (lValueTrace.declarationType) {
                case PgslDeclarationType.Const:
                    return 'const';
                case PgslDeclarationType.Storage: {
                    // Dependent on the access mode, set correct binding type.
                    // Cast back to string, as lAccessMode can be outside of enum values.
                    switch (lValueTrace.accessMode) {
                        case PgslAccessMode.Read:
                            return `var<storage, read>`;
                        case PgslAccessMode.Write:
                            return `var<storage, write>`;
                        case PgslAccessMode.ReadWrite:
                            return `var<storage, read_write>`;
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
            if(!lValueTrace.bindingInformation) {
                return '';
            }

            return `@group(${lValueTrace.bindingInformation.bindGroupIndex}) @binding(${lValueTrace.bindingInformation.bindLocationIndex})`;
        })();

        // Transpile declaration parts to fit spaces correctly.
        const lTypeDeclaration: string = pTranspile(pInstance.typeDeclaration);
        const lAttributeString: string = lBindingAttribute.length > 0 ? `${lBindingAttribute} ` : '';

        // If no expression is given, return declaration without expression.
        if (!pInstance.expression) {
            pSendResult(`${lAttributeString}${lDeclarationTypeString} ${pInstance.name}: ${lTypeDeclaration};`);
        } else {
            pSendResult(`${lAttributeString}${lDeclarationTypeString} ${pInstance.name}: ${lTypeDeclaration} = ${pTranspile(pInstance.expression)};`);
        }
    }
} 