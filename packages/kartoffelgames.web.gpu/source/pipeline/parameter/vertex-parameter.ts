import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { VertexBufferItemFormat } from '../../constant/vertex-buffer-item-format.enum';
import { VertexParameterStepMode } from '../../constant/vertex-parameter-step-mode.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/object/gpu-object';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { VertexParameterLayout, VertexParameterLayoutBuffer } from './vertex-parameter-layout';
import { GpuBufferView } from '../../buffer/gpu-buffer-view';

export class VertexParameter extends GpuObject<null, VertexParameterInvalidationType> {
    private readonly mData: Dictionary<string, GpuBuffer>;
    private readonly mIndexBufferView: GpuBufferView<Uint16Array | Uint32Array> | null;
    private readonly mIndices: Array<number>;
    private readonly mLayout: VertexParameterLayout;

    /**
     * Get index buffer.
     */
    public get indexBuffer(): GpuBufferView<Uint16Array | Uint32Array> | null {
        return this.mIndexBufferView;
    }

    /**
     * Get parameter layout.
     */
    public get layout(): VertexParameterLayout {
        return this.mLayout;
    }

    /**
     * Vertex count.
     */
    public get vertexCount(): number {
        return this.mIndices.length;
    }

    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pVertexParameterLayout - Parameter layout.
     * @param pIndices - Index buffer data.
     */
    public constructor(pDevice: GpuDevice, pVertexParameterLayout: VertexParameterLayout, pIndices: Array<number>) {
        super(pDevice);

        // Set vertex parameter layout.
        this.mLayout = pVertexParameterLayout;
        this.mData = new Dictionary<string, GpuBuffer>();

        // Invalidate on layout change.
        this.mLayout.addInvalidationListener(() => {
            this.invalidate(VertexParameterInvalidationType.Data);
        });

        // Create index layout.
        const lIndexLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(this.device, {
            primitiveFormat: BufferItemFormat.Uint32,
            primitiveMultiplier: BufferItemMultiplier.Single,
        });

        // Create index buffer layout.
        const lIndexBufferLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(this.device, {
            arraySize: pIndices.length,
            innerType: lIndexLayout
        });

        // Save index information.
        this.mIndices = pIndices;

        // Create index buffer.
        this.mIndexBufferView = null;
        if (this.mLayout.indexable) {
            // Decide wich format to use.
            if (pIndices.length < Math.pow(2, 16)) {
                // Create index buffer.
                const lIndexBuffer: GpuBuffer = new GpuBuffer(pDevice, pIndices.length * 2);
                lIndexBuffer.extendUsage(BufferUsage.Index);
                lIndexBuffer.initialData(() => {
                    return new Uint16Array(pIndices);
                });

                // Create view of buffer.
                this.mIndexBufferView = lIndexBuffer.view(lIndexBufferLayout, Uint16Array);
            } else {
                // Create index buffer.
                const lIndexBuffer: GpuBuffer = new GpuBuffer(pDevice, pIndices.length * 4);
                lIndexBuffer.extendUsage(BufferUsage.Index);
                lIndexBuffer.initialData(() => {
                    return new Uint32Array(pIndices);
                });

                // Create view of buffer.
                this.mIndexBufferView = lIndexBuffer.view(lIndexBufferLayout, Uint32Array);
            }
        }
    }

    /**
     * Get parameter buffer.
     * @param pName - Parameter name.
     */
    public get(pName: string): GpuBuffer {
        // Validate.
        if (!this.mData.has(pName)) {
            throw new Exception(`Vertex parameter buffer for "${pName}" not set.`, this);
        }

        return this.mData.get(pName)!;
    }

    /**
     * Set parameter data.
     * @param pName - parameter buffer name.
     * @param pData - Parameter data.
     */
    public set(pBufferName: string, pData: Array<number>): GpuBuffer {
        const lParameterLayout: VertexParameterLayoutBuffer = this.mLayout.parameterBuffer(pBufferName);

        // When parameter is indexed but vertex parameter are not indexed, extend data. Based on index data.
        let lData: Array<number> = pData;
        if (!this.mLayout.indexable && lParameterLayout.stepMode === VertexParameterStepMode.Index) {
            // Calculate how many items represent one parameter.
            const lStepCount: number = lParameterLayout.layout.variableSize / lParameterLayout.layout.formatByteCount;

            // Dublicate dependent on index information.
            lData = new Array<number>();
            for (const lIndex of this.mIndices) {
                const lDataStart: number = lIndex * lStepCount;
                const lDataEnd: number = lDataStart + lStepCount;

                // Copy vertex parameter data.
                lData.push(...pData.slice(lDataStart, lDataEnd));
            }
        }

        // Calculate vertex parameter count.
        const lVertexParameterItemCount: number = (lData.length * lParameterLayout.layout.formatByteCount) / (lParameterLayout.layout.variableSize);

        // Load typed array from layout format.
        const lParameterBuffer: GpuBuffer = (() => {
            const lInitialData: TypedArray = (() => {
                switch (lParameterLayout.format) {
                    case VertexBufferItemFormat.Float32: return new Float32Array(lData);
                    case VertexBufferItemFormat.Uint32: return new Uint32Array(lData);
                    case VertexBufferItemFormat.Sint32: return new Int32Array(lData);
                    case VertexBufferItemFormat.Uint8: return new Uint8Array(lData);
                    case VertexBufferItemFormat.Sint8: return new Int8Array(lData);
                    case VertexBufferItemFormat.Uint16: return new Uint16Array(lData);
                    case VertexBufferItemFormat.Sint16: return new Int16Array(lData);

                    // Unsupported
                    case VertexBufferItemFormat.Float16:
                    case VertexBufferItemFormat.Unorm16:
                    case VertexBufferItemFormat.Snorm16:
                    case VertexBufferItemFormat.Unorm8:
                    case VertexBufferItemFormat.Snorm8:
                    default: {
                        throw new Exception(`Currently "${lParameterLayout.format}" is not supported.`, this);
                    }
                }
            })();

            return new GpuBuffer(this.device, lParameterLayout.layout.variableSize * lVertexParameterItemCount).initialData(() => {
                return lInitialData;
            });
        })();

        // Extend buffer to be a vertex buffer.
        lParameterBuffer.extendUsage(BufferUsage.Vertex);

        // Save gpu buffer in correct index.
        this.mData.set(pBufferName, lParameterBuffer);

        // Invalidate on data set.
        this.invalidate(VertexParameterInvalidationType.Data);

        return lParameterBuffer;
    }

    // TODO: Add own buffer. Rename current set() to createBuffer or something.
}

export enum VertexParameterInvalidationType {
    Data = 'DataChange',
    Layout = 'LayoutChange'
}