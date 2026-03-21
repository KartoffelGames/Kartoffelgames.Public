import { MemoryFileSystem } from '@kartoffelgames/web-file-system';
import type { Material } from '../../source/component_item/material.ts';
import type { Mesh } from '../../source/component_item/mesh.ts';
import { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { CullSystem } from '../../source/system/cull-system.ts';
import { LightSystem } from '../../source/system/light-system.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import { CameraController } from './camera-controller.ts';
import { GlbConverter, type GlbConvertResult } from './glb-converter.ts';
import { SceneSetup } from './scene-setup.ts';
import { ShitSystem } from './shit-system.ts';
import { DebugPanel } from './ui/debug-panel.ts';
import { FrameGraph } from './ui/frame-graph.ts';
import { HierarchyPanel } from './ui/hierarchy-panel.ts';
import { ResizableLayout } from './ui/resizable-layout.ts';
import type { GameObject } from '../../source/core/hierarchy/game-object.ts';
import { RenderTargetSystem } from "../../source/system/render-target-system.ts";

// ── Load assets ──────────────────────────────────────────────
const gGlbData: ArrayBuffer = await fetch('/mesh.glb').then(async (pResponse) => {
    return pResponse.arrayBuffer();
});
const gGlbResult: GlbConvertResult = GlbConverter.convert(gGlbData);
const gBlockMesh: Mesh = gGlbResult.meshes[0];
const gBlockMeshMaterials: Array<Material> = gGlbResult.materials[0] ?? [];

// ── Environment setup ────────────────────────────────────────
const gEnvironment = new GameEnvironment(new MemoryFileSystem());
gEnvironment.enableDebugOption('debugStateChanges');
gEnvironment.enableDebugOption('debugSystemTime');

// Register systems.
gEnvironment.registerSystem(TransformationSystem);
gEnvironment.registerSystem(LightSystem);
gEnvironment.registerSystem(CullSystem);
gEnvironment.registerSystem(ShitSystem);

const gRenderTargetSystem: RenderTargetSystem = gEnvironment.registerSystem(RenderTargetSystem); 

// Canvas setup.
const gCanvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
gRenderTargetSystem.canvas = gCanvas;

// Handle canvas resize from its wrapper.
const gCanvasWrapper: HTMLElement | null = document.querySelector('.canvas-wrapper');
if (gCanvasWrapper) {
    new ResizeObserver(() => {
        gCanvas.width = Math.max(gCanvasWrapper.clientWidth, 0);
        gCanvas.height = Math.max(gCanvasWrapper.clientHeight, 0);
    }).observe(gCanvasWrapper);
}

// ── Scene setup ──────────────────────────────────────────────
const gSceneSetup = new SceneSetup(gBlockMesh, gBlockMeshMaterials);

// Always load the camera scene.
gEnvironment.addObject(gSceneSetup.cameraScene);

// Track which numbered scenes are currently loaded.
const gLoadedScenes: Set<number> = new Set<number>();

/**
 * Toggle a numbered scene on or off.
 */
function gToggleScene(pSceneNumber: number): void {
    const lScene: GameObject | undefined = gSceneSetup.scenes.get(pSceneNumber);
    if (!lScene) {
        return;
    }

    if (gLoadedScenes.has(pSceneNumber)) {
        gEnvironment.removeObject(lScene);
        gLoadedScenes.delete(pSceneNumber);
    } else {
        gEnvironment.addObject(lScene);
        gLoadedScenes.add(pSceneNumber);
    }
}

// Load scene 1 by default.
gToggleScene(1);

// Listen for number keys 0-9 to toggle scenes.
document.addEventListener('keydown', (pEvent: KeyboardEvent) => {
    const lKey: string = pEvent.key;
    if (lKey >= '0' && lKey <= '9') {
        gToggleScene(parseInt(lKey, 10));
    }
});

// ── Camera controller ────────────────────────────────────────
const gCameraController = new CameraController(gCanvas, gSceneSetup.cameraEntity);
gCameraController.start();

// Animate objects on the same interval as camera input.
const gAnimationFrame = () => {
    gSceneSetup.animateObjects();
    globalThis.requestAnimationFrame(gAnimationFrame);
};
globalThis.requestAnimationFrame(gAnimationFrame);

// ── UI setup ─────────────────────────────────────────────────
ResizableLayout.initialize();

const gFrameGraph = new FrameGraph(
    document.getElementById('frame-graph-bar')!,
    gEnvironment
);

const gDebugPanel = new DebugPanel(
    document.getElementById('debug-content')!,
    gEnvironment
);

// Hierarchy panel builds itself on construction and updates via sniffer callback.
new HierarchyPanel(
    document.getElementById('hierarchy-content')!,
    gEnvironment
);

// UI update intervals.
globalThis.setInterval(() => {
    gFrameGraph.update();
    gDebugPanel.update();
}, 100);

// ── Start engine ─────────────────────────────────────────────
// eslint-disable-next-line no-console
console.log('Starting environment...');
gEnvironment.start().then(() => {
    // eslint-disable-next-line no-console
    console.log('Environment closed.');
});
