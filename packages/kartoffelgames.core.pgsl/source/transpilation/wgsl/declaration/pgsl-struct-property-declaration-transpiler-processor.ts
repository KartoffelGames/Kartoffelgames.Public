import { StructPropertyDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
import { PgslInterpolateSamplingEnum } from "../../../buildin/pgsl-interpolate-sampling-enum.ts";
import { PgslInterpolateTypeEnum } from "../../../buildin/pgsl-interpolate-type-enum.ts";
import { PgslBuildInType } from '../../../type/pgsl-build-in-type.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-pgsl-transpiler-processor.interface.ts';
import { PgslTranspilationMeta } from "../../pgsl-transpilation-meta.ts";

export class PgslStructPropertyDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<StructPropertyDeclarationAst> {
    /**
     * Returns the target type for this processor.
     */
    public get target(): typeof StructPropertyDeclarationAst {
        return StructPropertyDeclarationAst;
    }

    /**
     * Transpile current struct declaration property into a string.
     * 
     * @param pInstance - Instance to process.
     * @param pTrace - Trace information.
     * @param pSendResult - Function to send the result.
     * @param pTranspile - Function to transpile child nodes.
     */
    public process(pInstance: StructPropertyDeclarationAst, pTranspile: PgslTranspilerProcessorTranspile, pTranspilationMeta: PgslTranspilationMeta): string {
        // Transpile property type.
        const lTypeTranspilation: string = pTranspile(pInstance.data.typeDeclaration);

        // Create result array.
        const lResultParts: Array<string> = new Array<string>();

        // Builtin types handling. Adding required attribute metadata.
        if (pInstance.data.typeDeclaration.data.type instanceof PgslBuildInType) {
            switch (pInstance.data.typeDeclaration.data.type.buildInType) {
                case PgslBuildInType.typeName.vertexIndex: lResultParts.push(`@builtin(vertex_index)`); break;
                case PgslBuildInType.typeName.instanceIndex: lResultParts.push(`@builtin(instance_index)`); break;
                case PgslBuildInType.typeName.position: lResultParts.push(`@builtin(position)`); break;
                case PgslBuildInType.typeName.frontFacing: lResultParts.push(`@builtin(front_facing)`); break;
                case PgslBuildInType.typeName.fragDepth: lResultParts.push(`@builtin(frag_depth)`); break;
                case PgslBuildInType.typeName.sampleIndex: lResultParts.push(`@builtin(sample_index)`); break;
                case PgslBuildInType.typeName.sampleMask: lResultParts.push(`@builtin(sample_mask)`); break;
                case PgslBuildInType.typeName.localInvocationId: lResultParts.push(`@builtin(local_invocation_id)`); break;
                case PgslBuildInType.typeName.localInvocationIndex: lResultParts.push(`@builtin(local_invocation_index)`); break;
                case PgslBuildInType.typeName.globalInvocationId: lResultParts.push(`@builtin(global_invocation_id)`); break;
                case PgslBuildInType.typeName.workgroupId: lResultParts.push(`@builtin(workgroup_id)`); break;
                case PgslBuildInType.typeName.numWorkgroups: lResultParts.push(`@builtin(num_workgroups)`); break;
                case PgslBuildInType.typeName.clipDistances: lResultParts.push(`@builtin(clip_distances)`); break;
            }
        }

        // Transpile attribute list based on set meta data.
        if (typeof pInstance.data.meta.alignment !== 'undefined') {
            lResultParts.push(`@align(${pInstance.data.meta.alignment})`);
        }
        if (typeof pInstance.data.meta.blendSrc !== 'undefined') {
            lResultParts.push(`@blend_src(${pInstance.data.meta.blendSrc})`);
        }
        if (pInstance.data.meta.locationName) {
            // Create new location index for this property.
            const lLocationIndex: number = pTranspilationMeta.createLocationFor(pInstance.struct, pInstance);
            lResultParts.push(`@location(${lLocationIndex})`);
        }
        if (typeof pInstance.data.meta.size !== 'undefined') {
            lResultParts.push(`@size(${pInstance.data.meta.size})`);
        }
        if (typeof pInstance.data.meta.interpolation !== 'undefined') {
            // Convert interpolation type to string.
            const lInterpolationTypeString: string = (() => {
                switch (pInstance.data.meta.interpolation.type) {
                    case PgslInterpolateTypeEnum.values.Linear: return 'linear';
                    case PgslInterpolateTypeEnum.values.Flat: return 'flat';
                    case PgslInterpolateTypeEnum.values.Perspective: return 'perspective';
                }
            })();

            // Convert sampling type to string.
            const lSamplingTypeString: string = (() => {
                switch (pInstance.data.meta.interpolation.sampling) {
                    case PgslInterpolateSamplingEnum.values.Center: return 'center';
                    case PgslInterpolateSamplingEnum.values.Centroid: return 'centroid';
                    case PgslInterpolateSamplingEnum.values.Either: return 'either';
                    case PgslInterpolateSamplingEnum.values.First: return 'first';
                    case PgslInterpolateSamplingEnum.values.Sample: return 'sample';
                }
            })();

            lResultParts.push(`@interpolate(${lInterpolationTypeString}, ${lSamplingTypeString})`);
        }

        lResultParts.push(`${pInstance.data.name}:${lTypeTranspilation}`);

        return lResultParts.join('');
    }
}