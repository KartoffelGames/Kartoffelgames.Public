import { BufferUsage } from '../../constant/buffer-usage.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { BaseMemoryLayout } from '../memory_layout/base-memory-layout';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';

/**
 * Shader layout description.
 */
export type ShaderLayout = {
    // Memory binding.
    groups: {
        [groupName: string]: {
            index: number;
            bindings: {
                [bindingName: string]: {
                    index: number;
                    visibility: ComputeStage;
                    layout: BaseMemoryLayout;
                    bindingType: BufferUsage; // TODO: Type is wrong.
                };
            };
        };
    };

    // Parameter.
    parameter: {
        [parameterName: string]: PrimitiveBufferFormat;
    };

    // Compute entry points.
    computeEntryPoints: {
        [functionName: string]: {
            x: number;
            y: number;
            z: number;
        };
    };

    // Vertex entry point.
    vertexEntryPoints: {
        [functionName: string]: {
            parameter: {
                [parameterName: string]: {
                    location: number;
                    primitive: {
                        format: PrimitiveBufferFormat;
                        multiplier: PrimitiveBufferMultiplier;
                    };
                };
            };
        };
    };

    // Fragment entry point.
    fragmentEntryPoints: {
        [functionName: string]: {
            attachment: {
                [attachmentName: string]: {
                    location: number;
                    primitive: {
                        format: PrimitiveBufferFormat;
                        multiplier: PrimitiveBufferMultiplier;
                    };
                };
            };
        };
    };
};