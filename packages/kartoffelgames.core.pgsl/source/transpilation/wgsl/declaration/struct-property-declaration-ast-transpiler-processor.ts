import { StructPropertyDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
import { PgslBuildInType } from '../../../abstract_syntax_tree/type/pgsl-build-in-type.ts';
import { PgslInterpolateSamplingEnum } from '../../../buildin/enum/pgsl-interpolate-sampling-enum.ts';
import { PgslInterpolateTypeEnum } from '../../../buildin/enum/pgsl-interpolate-type-enum.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-transpiler-processor.interface.ts';
import type { TranspilationMeta } from '../../transpilation-meta.ts';

export class StructPropertyDeclarationAstTranspilerProcessor implements ITranspilerProcessor<StructPropertyDeclarationAst> {
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
    public process(pInstance: StructPropertyDeclarationAst, pTranspile: PgslTranspilerProcessorTranspile, pTranspilationMeta: TranspilationMeta): string {
        // Transpile property type.
        const lTypeTranspilation: string = pTranspile(pInstance.data.typeDeclaration);

        // Create result array.
        const lResultParts: Array<string> = new Array<string>();

        // Builtin types handling. Adding required attribute metadata.
        if (pInstance.data.typeDeclaration.data.type.shadowedType instanceof PgslBuildInType) {
            switch (pInstance.data.typeDeclaration.data.type.shadowedType.buildInType) {
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
                    case PgslInterpolateTypeEnum.VALUES.Linear: return 'linear';
                    case PgslInterpolateTypeEnum.VALUES.Flat: return 'flat';
                    case PgslInterpolateTypeEnum.VALUES.Perspective: return 'perspective';
                }
            })();

            // Convert sampling type to string.
            const lSamplingTypeString: string = (() => {
                switch (pInstance.data.meta.interpolation.sampling) {
                    case PgslInterpolateSamplingEnum.VALUES.Center: return 'center';
                    case PgslInterpolateSamplingEnum.VALUES.Centroid: return 'centroid';
                    case PgslInterpolateSamplingEnum.VALUES.Either: return 'either';
                    case PgslInterpolateSamplingEnum.VALUES.First: return 'first';
                    case PgslInterpolateSamplingEnum.VALUES.Sample: return 'sample';
                }
            })();

            lResultParts.push(`@interpolate(${lInterpolationTypeString}, ${lSamplingTypeString})`);
        }

        lResultParts.push(`${pInstance.data.name}:${lTypeTranspilation}`);

        return lResultParts.join('');
    }
}