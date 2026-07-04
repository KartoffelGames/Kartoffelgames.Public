import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import { PotatnoPreviewFunctionExecutor } from '../../source/preview/potatno-preview-function-executor.ts';
import { CanvasProject } from './project/canvas-project.ts';
import { CanvasProjectMathImportDefinition } from './project/import/canvas-project-math-import-definition.ts';
import { CanvasProjectTimeImportDefinition } from './project/import/canvas-project-time-import-definition.ts';
import { CanvasProjectMatrixPreviewDisplay } from './project/preview/canvas-project-matrix-preview-display.ts';
import { CanvasProjectPreviewDisplay } from './project/preview/canvas-project-preview-display.ts';

const gProject = new CanvasProject();
gProject.addImport(new CanvasProjectMathImportDefinition());
gProject.addImport(new CanvasProjectTimeImportDefinition());

/*
 * Define function executors for previews.
 */

const gEntryFunctionExecutor = new PotatnoPreviewFunctionExecutor(gProject.entryPoint, {
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
const gUserFunctionExecutor = new PotatnoPreviewFunctionExecutor(gProject.userFunction, {
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

gProject.preview.addDisplay(new CanvasProjectPreviewDisplay(gEntryFunctionExecutor));
gProject.preview.addDisplay(new CanvasProjectPreviewDisplay(gUserFunctionExecutor));
gProject.preview.addDisplay(new CanvasProjectMatrixPreviewDisplay(gEntryFunctionExecutor));
gProject.preview.addDisplay(new CanvasProjectMatrixPreviewDisplay(gUserFunctionExecutor));

// Create application and open an empty file.
const gApplicationRoot: HTMLElement = document.getElementById('application-root')!;


const gApp = new PotatnoCodeApplication(gProject);
gApp.appendTo(gApplicationRoot);
gApp.document = new PotatnoDocument(gProject);

void gRenderFrame();

/**
 * Render all node previews on every animation frame.
 */
async function gRenderFrame(): Promise<void> {
    try {
        await gApp.update();
    } catch (lError) {
        void lError;
    }

    requestAnimationFrame(gRenderFrame);
}

document.getElementById('load-button')!.addEventListener('click', () => void gLoadDocument());
document.getElementById('save-button')!.addEventListener('click', () => void gSaveDocument());

// Declare missing JS-API function.
declare global {
    function showOpenFilePicker(): Promise<Array<FileSystemFileHandle>>
    function showSaveFilePicker(): Promise<FileSystemFileHandle>;
}

/**
 * Load a document from a selected file.
 */
async function gLoadDocument(): Promise<void> {
    try {
        // Pick and load document file.
        const [lFileHandle]: Array<FileSystemFileHandle> = await globalThis.showOpenFilePicker();
        const lDocumentFile: File = await lFileHandle.getFile();

        // Load document into application.
        gApp.load(await lDocumentFile.text());
    } catch (lError: unknown) {
        // Ignore picker cancelation.
        if (lError instanceof DOMException && lError.name === 'AbortError') {
            return;
        }

        // eslint-disable-next-line no-console
        console.error(lError)
        window.alert('Could not load document.');
    }
}

/**
 * Save current document into a selected file.
 */
async function gSaveDocument(): Promise<void> {
    try {
        // Pick document file target.
        const lFileHandle: FileSystemFileHandle = await globalThis.showSaveFilePicker();

        // Store document content.
        const lWritableFile: FileSystemWritableFileStream = await lFileHandle.createWritable();
        await lWritableFile.write(gApp.save());
        await lWritableFile.close();

    } catch (lError: unknown) {
        // Ignore picker cancelation.
        if (lError instanceof DOMException && lError.name === 'AbortError') {
            return;
        }

        // eslint-disable-next-line no-console
        console.error(lError)
        window.alert('Could not save document.');
    }
}

