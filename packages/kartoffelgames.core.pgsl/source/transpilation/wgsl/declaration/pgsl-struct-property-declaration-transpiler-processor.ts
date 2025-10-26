import { PgslInterpolateSampling } from '../../../syntax_tree/buildin/pgsl-interpolate-sampling.enum.ts';
import { PgslInterpolateType } from '../../../syntax_tree/buildin/pgsl-interpolate-type.enum.ts';
import { PgslStructPropertyDeclaration } from '../../../syntax_tree/declaration/pgsl-struct-property-declaration.ts';
import type { PgslStructPropertyTrace } from '../../../trace/pgsl-struct-property-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslBuildInType } from '../../../type/pgsl-build-in-type.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-pgsl-transpiler-processor.interface.ts';

export class PgslStructPropertyDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<PgslStructPropertyDeclaration> {
    /**
     * Returns the target type for this processor.
     */
    public get target(): typeof PgslStructPropertyDeclaration {
        return PgslStructPropertyDeclaration;
    }

    /**
     * Transpile current struct declaration property into a string.
     * 
     * @param pInstance - Instance to process.
     * @param pTrace - Trace information.
     * @param pSendResult - Function to send the result.
     * @param pTranspile - Function to transpile child nodes.
     */
    public process(pInstance: PgslStructPropertyDeclaration, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Transpile property type.
        const lTypeTranspilation: string = pTranspile(pInstance.type);

        // Get the trace of the struct property.
        const lPropertyTrace: PgslStructPropertyTrace = pTrace.getStructProperty(pInstance);

        // Create result array.
        const lResultParts: Array<string> = new Array<string>();

        // Builtin types handling. Adding required attribute metadata.
        if (pInstance.type.type instanceof PgslBuildInType) {
            switch (pInstance.type.type.buildInType) {
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
        if (typeof lPropertyTrace.meta.alignment !== 'undefined') {
            lResultParts.push(`@align(${lPropertyTrace.meta.alignment})`);
        }
        if (typeof lPropertyTrace.meta.blendSrc !== 'undefined') {
            lResultParts.push(`@blend_src(${lPropertyTrace.meta.blendSrc})`);
        }
        if (typeof lPropertyTrace.meta.locationIndex !== 'undefined') {
            lResultParts.push(`@location(${lPropertyTrace.meta.locationIndex})`);
        }
        if (typeof lPropertyTrace.meta.size !== 'undefined') {
            lResultParts.push(`@size(${lPropertyTrace.meta.size})`);
        }
        if (typeof lPropertyTrace.meta.interpolation !== 'undefined') {
            // Convert interpolation type to string.
            const lInterpolationTypeString: string = (() => {
                switch (lPropertyTrace.meta.interpolation.type) {
                    case PgslInterpolateType.Linear: return 'linear';
                    case PgslInterpolateType.Flat: return 'flat';
                    case PgslInterpolateType.Perspective: return 'perspective';
                }
            })();

            // Convert sampling type to string.
            const lSamplingTypeString: string = (() => {
                switch (lPropertyTrace.meta.interpolation.sampling) {
                    case PgslInterpolateSampling.Center: return 'center';
                    case PgslInterpolateSampling.Centroid: return 'centroid';
                    case PgslInterpolateSampling.Either: return 'either';
                    case PgslInterpolateSampling.First: return 'first';
                    case PgslInterpolateSampling.Sample: return 'sample';
                }
            })();

            lResultParts.push(`@interpolate(${lInterpolationTypeString}, ${lSamplingTypeString})`);
        }

        lResultParts.push(`${pInstance.name}: ${lTypeTranspilation}`);

        return lResultParts.join(' ');
    }
}