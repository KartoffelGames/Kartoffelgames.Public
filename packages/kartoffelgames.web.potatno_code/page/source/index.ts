import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import { PotatnoPreviewFunctionExecutor } from '../../source/preview/potatno-preview-function-executor.ts';
import { CanvasProject } from './project/canvas-project.ts';
import { CanvasProjectMathImportDefinition } from './project/import/canvas-project-math-import-definition.ts';
import { CanvasProjectTimeImportDefinition } from './project/import/canvas-project-time-import-definition.ts';
import { CanvasProjectPreviewDisplay } from './project/preview/canvas-project-preview-display.ts';

const lProject = new CanvasProject();

lProject.addImport(new CanvasProjectMathImportDefinition());
lProject.addImport(new CanvasProjectTimeImportDefinition());

/*
 * Define function executors for previews.
 */

const lEntryFunctionExecutor = new PotatnoPreviewFunctionExecutor(lProject.entryPoint, {
    defaultParameters: { x: 0, y: 0 },
    types: [PotatnoPreviewFunctionExecutor.MAIN, 'number', 'string', 'boolean'],
    build: (pExecutor, pGeneratorResult, pPortTarget) => {
        const lFunctionCode: string = pGeneratorResult.code;
        const lFunctionName: string = pExecutor.function.id;

        // Compile the whole function preview when no port is targeted.
        if (!pPortTarget) {
            type PixelCallable = (pX: number, pY: number) => [number, number, number];
            const lCompiled: PixelCallable = new Function(`${lFunctionCode}\nreturn ${lFunctionName};`)() as PixelCallable;
            return {
                type: PotatnoPreviewFunctionExecutor.MAIN,
                execute: (pParameters: { x: number; y: number; }): [number, number, number] => lCompiled(pParameters.x, pParameters.y)
            };
        }

        // Replace the targeted node hook with an early return for per-node previews.
        const lInstrumented: string = lFunctionCode.replace(pPortTarget.nodeHook, `; return ${pPortTarget.value};`);
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
        const lInstrumented: string = pGeneratorResult.code.replace(pPortTarget.nodeHook, `return ${pPortTarget.value};`);

        const lCompiled: (...pArgs: Array<unknown>) => unknown = new Function(`${lInstrumented}\nreturn ${lFunctionName};`)() as (...pArgs: Array<unknown>) => unknown;
        return {
            type: pPortTarget.documentPort.resolvedDataType,
            execute: (): unknown => {
                return lCompiled(...lDefaultArguments);
            }
        };
    }
});

lProject.preview.addDisplay(new CanvasProjectPreviewDisplay(lEntryFunctionExecutor));
lProject.preview.addDisplay(new CanvasProjectPreviewDisplay(lUserFunctionExecutor));

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
