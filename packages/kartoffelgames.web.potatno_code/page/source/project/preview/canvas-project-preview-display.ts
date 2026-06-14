import { PotatnoPreviewDisplay, type PotatnoPreviewDisplayExecutorCallable } from '../../../../source/preview/potatno-preview-display.ts';
import { PotatnoPreviewFunctionExecutor, type PotatnoPreviewResultType } from '../../../../source/preview/potatno-preview-function-executor.ts';
import type { CanvasProjectTypesDefinition } from '../canvas-project-types-definition.ts';

export class CanvasProjectPreviewDisplay<TExecutorResultType extends PotatnoPreviewResultType<CanvasProjectTypesDefinition>> extends PotatnoPreviewDisplay<CanvasProjectTypesDefinition, HTMLCanvasElement, CanvasProjectPreViewDisplayParameter, TExecutorResultType, CanvasProjectPreViewDisplayResultTypes, CanvasProjectPreViewDisplayResult> {
    private static readonly PREVIEW_HEIGHT: number = 48;
    private static readonly PREVIEW_WIDTH: number = 48;

    /**
     * Construtor.
     * 
     * @param pExecutor - Executor for this display.
     */
    public constructor(pExecutor: PotatnoPreviewFunctionExecutor<CanvasProjectTypesDefinition, CanvasProjectPreViewDisplayParameter, TExecutorResultType>) {
        super(pExecutor, {
            id: '2dCanvas',
            name: 'Canvas 2D',
            generate: (): HTMLCanvasElement => {
                const lCanvas: HTMLCanvasElement = document.createElement('canvas');
                lCanvas.width = CanvasProjectPreviewDisplay.PREVIEW_WIDTH;
                lCanvas.height = CanvasProjectPreviewDisplay.PREVIEW_HEIGHT;
                lCanvas.style.width = '100%';
                lCanvas.style.height = '100%';
                lCanvas.style.imageRendering = 'pixelated';
                return lCanvas;
            },
            typeAdapter: {
                [PotatnoPreviewFunctionExecutor.MAIN]: (pInputValue: [number, number, number]) => {
                    return pInputValue;
                },
                'number': (pInputValue: number): [number, number, number] => {
                    return [pInputValue, pInputValue, pInputValue];
                },
                'boolean': (pInputValue: boolean): [number, number, number] => {
                    const lValue: number = pInputValue ? 1 : 0;
                    return [lValue, lValue, lValue];
                }
            },
            update: async (pElement, pExecutor) => {
                await this.updateCanvasPreview(pElement, pExecutor);
            }
        });
    }

    /**
     * Paint a canvas preview by executing the preview callback for every pixel.
     *
     * @param pElement - Canvas element to paint.
     * @param pExecutor - Preview executor callable.
     */
    private async updateCanvasPreview(pElement: HTMLCanvasElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<CanvasProjectPreViewDisplayParameter, CanvasProjectPreViewDisplayResult>): Promise<void> {
        const lContext: CanvasRenderingContext2D | null = pElement.getContext('2d');
        if (!lContext) {
            return;
        }

        const lWidth: number = pElement.width;
        const lHeight: number = pElement.height;
        const lImageData: ImageData = lContext.createImageData(lWidth, lHeight);
        const lPixels: Uint8ClampedArray = lImageData.data;

        for (let lY = 0; lY < lHeight; lY++) {
            for (let lX = 0; lX < lWidth; lX++) {
                const lNormalizedX: number = lX / lWidth;
                const lNormalizedY: number = lY / lHeight;
                const lRgb: [number, number, number] = await Promise.resolve(pExecutor({ x: lNormalizedX, y: lNormalizedY }));

                const lOffset: number = (lY * lWidth + lX) * 4;
                lPixels[lOffset] = Math.floor(Math.max(0, Math.min(1, lRgb[0] || 0)) * 255);
                lPixels[lOffset + 1] = Math.floor(Math.max(0, Math.min(1, lRgb[1] || 0)) * 255);
                lPixels[lOffset + 2] = Math.floor(Math.max(0, Math.min(1, lRgb[2] || 0)) * 255);
                lPixels[lOffset + 3] = 255;
            }
        }

        lContext.putImageData(lImageData, 0, 0);
    }
}

type CanvasProjectPreViewDisplayParameter = {
    x: number;
    y: number;
};

type CanvasProjectPreViewDisplayResult = [number, number, number];

type CanvasProjectPreViewDisplayResultTypes = 'MAIN' | 'number' | 'boolean';
