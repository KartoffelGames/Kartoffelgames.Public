import { AccessMode } from '../../constant/access-mode.enum';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { BaseMemoryLayout } from '../memory_layout/base-memory-layout';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';

/**
 * Shader layout description.
 */
export type ShaderLayout = {
    // TODO: Add limitations that should be checked. (GroupCount, BindCount, Float16)

    // Memory binding.
    groups: {
        [groupName: string]: {
            index: number;
            bindings: {
                [bindingName: string]: {
                    index: number,
                    layout: BaseMemoryLayout;
                    visibility: ComputeStage;
                    accessMode: AccessMode;
                    usage: BufferUsage;
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
            workgroupSize: {
                x: number;
                y: number;
                z: number;
            };
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
            attachments: {
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