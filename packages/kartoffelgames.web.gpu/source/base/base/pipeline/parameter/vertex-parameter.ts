import { AccessMode } from '../../../constant/access-mode.enum';
import { BufferBindType } from '../../../constant/buffer-bind-type.enum';
import { BufferPrimitiveFormat } from '../../../constant/buffer-primitive-format';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-object';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { LinearBufferMemoryLayout } from '../../memory_layout/buffer/linear-buffer-memory-layout';
import { VertexParameterLayout } from './vertex-parameter-layout';

export class VertexParameter extends GpuObject {
    private readonly mIndexBuffer: GpuBuffer<Uint16Array>;
    private readonly mLayout: VertexParameterLayout;
    
    public constructor(pDevice: GpuDevice, pVertexParameterLayout: VertexParameterLayout, pIndices: Array<number>) {
        super(pDevice);

        // Set vertex parameter layout.
        this.mLayout = pVertexParameterLayout;

        // Create index layout.
        const lIndexLayout: LinearBufferMemoryLayout = new LinearBufferMemoryLayout(pDevice, {
            primitiveFormat: BufferPrimitiveFormat.Int16,
            bindType: BufferBindType.Index,
            size: 2,
            alignment: 2,
            locationIndex: null,
            access: AccessMode.Read,
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Vertex
        });

        // Create index buffer layout.
        const lIndexBufferLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(pDevice, {
            innerType: lIndexLayout,
            arraySize: pIndices.length,
            bindType: BufferBindType.Index,
            access: AccessMode.Read,
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Vertex
        });

        // Create index buffer.
        this.mIndexBuffer = lIndexBufferLayout.create(new Uint16Array(pIndices));
    }

}