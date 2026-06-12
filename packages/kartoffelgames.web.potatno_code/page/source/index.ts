import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import { PotatnoPreviewDisplay, type PotatnoPreviewDisplayExecutorCallable } from '../../source/preview/potatno-preview-display.ts';
import { PotatnoPreviewFunctionExecutor } from '../../source/preview/potatno-preview-function-executor.ts';
import { CanvasProjectMathImportDefinition } from "./project/canvas-project-math-import-definition.ts";
import { CanvasProjectTimeImportDefinition } from "./project/canvas-project-time-import-definition.ts";
import { CanvasProjectTypesDefinition } from "./project/canvas-project-types-definition.ts";
import { CanvasProject } from './project/canvas-project.ts';

const lProject = new CanvasProject();

lProject.addImport(new CanvasProjectMathImportDefinition());
lProject.addImport(new CanvasProjectTimeImportDefinition());

/*
 * Define function executors for previews.
 */

// Resolution of the canvas preview surface. Iteration cost scales with width * height.
const gPreviewWidth: number = 48;
const gPreviewHeight: number = 48;

/**
 * Shape of the compiled function-level callable.
 */
type PixelCallable = (pX: number, pY: number) => [number, number, number];
type CanvasProjectType = 'number' | 'string' | 'boolean';

const lEntryFunctionExecutor = new PotatnoPreviewFunctionExecutor(lProject.entryPoint, {
    defaultParameters: { x: 0, y: 0 },
    types: [PotatnoPreviewFunctionExecutor.MAIN, 'number', 'string', 'boolean'],
    build: (pExecutor, pGeneratorResult, pPortTarget) => {
        const lFunctionCode: string = pGeneratorResult.code;
        const lFunctionName: string = pExecutor.function.id;

        // Compile the whole function preview when no port is targeted.
        if (!pPortTarget) {
            const lCompiled: PixelCallable = new Function(`${lFunctionCode}\nreturn ${lFunctionName};`)() as PixelCallable;
            return {
                type: PotatnoPreviewFunctionExecutor.MAIN,
                execute: (pParameters: { x: number; y: number; }): [number, number, number] => lCompiled(pParameters.x, pParameters.y)
            };
        }

        // Replace the targeted value hook with an early return for per-node previews.
        const lHookMarker: string = `/*[${pPortTarget.value}]*/`;
        const lInstrumented: string = lFunctionCode.includes(lHookMarker)
            ? lFunctionCode.replace(lHookMarker, `; return ${pPortTarget.value};`)
            : lFunctionCode;
        const lNodeFn: (pX: number, pY: number) => unknown = new Function(`${lInstrumented}\nreturn ${lFunctionName};`)() as (pX: number, pY: number) => unknown;
        return {
            type: pPortTarget.documentPort.resolvedDataType,
            execute: (pParameters: { x: number; y: number; }): unknown => lNodeFn(pParameters.x, pParameters.y)
        };
    }
});

/**
 * Executor for previewing a user function output.
 */
const lUserFunctionExecutor = new PotatnoPreviewFunctionExecutor(lProject.userFunction, {
    defaultParameters: { x: 0, y: 0 },
    types: ['number', 'string', 'boolean'],
    build: (pExecutor, pGeneratorResult, pPortTarget) => {
        if (!pPortTarget) {
            return { type: 'number' as const, execute: (): number => 0 };
        }

        const lFunction = pGeneratorResult.entryPoint.function;
        const lFunctionName: string = `__fn_${lFunction.id.replaceAll('-', '_')}`;
        const lDefaultArguments: Array<unknown> = lFunction.inputs.map((pInput) => pExecutor.projectTypes.getDefaultValue(pInput.dataType));
        const lOutputKey: string = pPortTarget.value;

        const lCompiled: (...pArgs: Array<unknown>) => Record<string, unknown> = new Function(`${pGeneratorResult.code}\nreturn ${lFunctionName};`)() as (...pArgs: Array<unknown>) => Record<string, unknown>;
        return {
            type: pPortTarget.documentPort.resolvedDataType,
            execute: (): unknown => {
                const lResult: Record<string, unknown> = lCompiled(...lDefaultArguments);
                return lResult ? lResult[lOutputKey] : undefined;
            }
        };
    }
});

/*
 * Define preview displays.
 */

const lEntryCanvas2dPreviewDisplay = new PotatnoPreviewDisplay(lEntryFunctionExecutor, {
    id: '2dCanvas',
    generate: (): HTMLCanvasElement => {
        const lCanvas: HTMLCanvasElement = document.createElement('canvas');
        lCanvas.width = gPreviewWidth;
        lCanvas.height = gPreviewHeight;
        lCanvas.style.width = '100%';
        lCanvas.style.height = '100%';
        lCanvas.style.imageRendering = 'pixelated';
        return lCanvas;
    },
    typeAdapter: {
        'MAIN': (pInputValue: [number, number, number]) => {
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
    update: async (pElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<{ x: number; y: number; }, [number, number, number]>) => {
        await updateCanvasPreview(pElement, pExecutor);
    }
});

const lUserCanvas2dPreviewDisplay = new PotatnoPreviewDisplay(lUserFunctionExecutor, {
    id: '2dCanvas',
    generate: (): HTMLCanvasElement => {
        const lCanvas: HTMLCanvasElement = document.createElement('canvas');
        lCanvas.width = gPreviewWidth;
        lCanvas.height = gPreviewHeight;
        lCanvas.style.width = '100%';
        lCanvas.style.height = '100%';
        lCanvas.style.imageRendering = 'pixelated';
        return lCanvas;
    },
    typeAdapter: {
        'number': (pInputValue: number): [number, number, number] => {
            return [pInputValue, pInputValue, pInputValue];
        },
        'boolean': (pInputValue: boolean): [number, number, number] => {
            const lValue: number = pInputValue ? 1 : 0;
            return [lValue, lValue, lValue];
        }
    },
    update: async (pElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<{ x: number; y: number; }, [number, number, number]>) => {
        await updateCanvasPreview(pElement, pExecutor);
    }
});

lProject.preview.addDisplay(lEntryCanvas2dPreviewDisplay);
lProject.preview.addDisplay(lUserCanvas2dPreviewDisplay);

// Create application and open an empty file.
const lApp = new PotatnoCodeApplication(lProject);
lApp.appendTo(document.body);
lApp.document = new PotatnoDocument(lProject);

void renderFrame();

/**
 * Render all node previews on every animation frame.
 */
async function renderFrame(): Promise<void> {
    try {
        await lApp.update();
    } catch (lError) {
        console.error('[Page] Preview render pass failed:', lError);
    }

    requestAnimationFrame(renderFrame);
}

/**
 * Paint a canvas preview by executing the preview callback for every pixel.
 *
 * @param pElement - Canvas element to paint.
 * @param pExecutor - Preview executor callable.
 */
async function updateCanvasPreview(pElement: HTMLCanvasElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<{ x: number; y: number; }, [number, number, number]>): Promise<void> {
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