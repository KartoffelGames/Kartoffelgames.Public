(() => {
    const socket = new WebSocket('ws://127.0.0.1:8088');
    socket.addEventListener('open', () => {
        console.log('Refresh connection established');
    });
    socket.addEventListener('message', (event) => {
        console.log('Bundle finished. Start refresh');
        if (event.data === 'REFRESH') {
            window.location.reload();
        }
    });
})();import { PotatnoDocument } from '../../source/document/potatno-document.ts';
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
function gRenderFrame(): void {
    try {
        gApp.update();
    } catch (lError) {
        void lError;
    }

    requestAnimationFrame(gRenderFrame);
}

document.getElementById('load-button')!.addEventListener('click', gLoadDocument);
document.getElementById('save-button')!.addEventListener('click', gSaveDocument);

declare global {
    interface StorageManager {
        getDirectory(): Promise<FileSystemDirectoryHandle>;
    }
}

const gDocumentFileName: string = 'potatno-code-document.json';

/**
 * Load document from browser storage.
 */
async function gLoadDocument(): Promise<void> {
    const lUserAnswer: boolean = window.confirm('Load saved document?');
    if (!lUserAnswer) {
        return; 
    }

    try {
        // Load document file.
        const lDirectoryHandle: FileSystemDirectoryHandle = await navigator.storage.getDirectory();
        const lFileHandle: FileSystemFileHandle = await lDirectoryHandle.getFileHandle(gDocumentFileName);
        const lDocumentFile: File = await lFileHandle.getFile();

        // Load document into application.
        gApp.load(await lDocumentFile.text());
    } catch {
        window.alert('Could not load document.');
    }
}

/**
 * Save document into browser storage.
 */
async function gSaveDocument(): Promise<void> {
    const lUserAnswer: boolean = window.confirm('Override saved document?');
    if (!lUserAnswer) {
        return; 
    }

    try {
        // Create document file.
        const lDirectoryHandle: FileSystemDirectoryHandle = await navigator.storage.getDirectory();
        const lFileHandle: FileSystemFileHandle = await lDirectoryHandle.getFileHandle(gDocumentFileName, { create: true });
        const lWritableFile: FileSystemWritableFileStream = await lFileHandle.createWritable();

        // Store document content.
        await lWritableFile.write(gApp.save());
        await lWritableFile.close();
    } catch {
        window.alert('Could not save document.');
    }
}
