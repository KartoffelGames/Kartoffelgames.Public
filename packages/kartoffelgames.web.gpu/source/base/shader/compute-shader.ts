import { Exception } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { BaseShader } from './base-shader';
import { ShaderFunction } from './interpreter/base-shader-interpreter';

export class ComputeShader extends BaseShader<'computeShader'> {
    private readonly mComputeEntry: string;
    private readonly mWorkGroupSizes: [number, number, number];

    /**
     * Compute entry point name.
     */
    public get computeEntry(): string {
        return this.mComputeEntry;
    }

    /**
     * Compute parameter work group sizes..
     */
    public get workGroupSizes(): WorkGroups {
        return { x: this.mWorkGroupSizes[0], y: this.mWorkGroupSizes[1], z: this.mWorkGroupSizes[2] };
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice, pSource: string, pComputeEntry: string) {
        super(pDevice, pSource);

        // Set entry points.
        this.mComputeEntry = pComputeEntry;

        // Validate compute entry point.
        const lComputeEntryFunction: ShaderFunction | null = this.information.getFunction(this.mComputeEntry);
        if (!lComputeEntryFunction) {
            throw new Exception(`Compute entry "${this.mComputeEntry}" not defined.`, this);
        } else if ((lComputeEntryFunction.entryPoints & ComputeStage.Compute) !== ComputeStage.Compute) {
            throw new Exception(`Compute entry "${this.mComputeEntry}" not an defined vertex entry.`, this);
        }

        const lWorkGroupSizeList: Array<string> | undefined = lComputeEntryFunction.attachments['workgroup_size'];
        if (!lWorkGroupSizeList) {
            throw new Exception(`Compute entry "${this.mComputeEntry}" does not define any work group sizes.`, this);
        }

        // Try to parse work group sizes.
        const lWorkgroupSizeX: number = lWorkGroupSizeList[0] ? parseInt(lWorkGroupSizeList[0]) : 1;
        const lWorkgroupSizeY: number = lWorkGroupSizeList[1] ? parseInt(lWorkGroupSizeList[1]) : 1;
        const lWorkgroupSizeZ: number = lWorkGroupSizeList[2] ? parseInt(lWorkGroupSizeList[2]) : 1;

        // Validate work group format and size.
        if (isNaN(lWorkgroupSizeX) || isNaN(lWorkgroupSizeY) || isNaN(lWorkgroupSizeZ)) {
            throw new Exception(`Compute entry "${this.mComputeEntry}" malformed work group sizes. Cant be converted to integer.`, this);
        }
        if (lWorkgroupSizeX < 1 || lWorkgroupSizeY < 1 || lWorkgroupSizeZ < 1) {
            throw new Exception(`Compute entry "${this.mComputeEntry}" work group sizes must be higher than zero.`, this);
        }

        // Save work group sizes.
        this.mWorkGroupSizes = [lWorkgroupSizeX, lWorkgroupSizeY, lWorkgroupSizeZ];
    }
}

type WorkGroups = { x: number; y: number; z: number; };