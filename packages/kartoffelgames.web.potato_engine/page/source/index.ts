import { GlbConverter } from '../../source/component_item/mesh/glb-converter.ts';
import type { Mesh } from '../../source/component_item/mesh/mesh.ts';
import { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { CullSystem } from '../../source/system/cull-system.ts';
import { LightSystem } from '../../source/system/light-system.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import { CameraController } from './camera-controller.ts';
import { SceneSetup } from './scene-setup.ts';
import { ShitSystem } from './shit-system.ts';
import { DebugPanel } from './ui/debug-panel.ts';
import { FrameGraph } from './ui/frame-graph.ts';
import { HierarchyPanel } from './ui/hierarchy-panel.ts';
import { ResizableLayout } from './ui/resizable-layout.ts';

// ── Load assets ──────────────────────────────────────────────
const lGlbData: ArrayBuffer = await fetch('/mesh.glb').then(async (pResponse) => {
    return pResponse.arrayBuffer();
});
const lMeshes: Array<Mesh> = GlbConverter.convert(lGlbData);
const lBlockMesh: Mesh = lMeshes[0];

// ── Environment setup ────────────────────────────────────────
const lEnvironment = new GameEnvironment({
    debugSystemTime: true
});

// Register systems.
lEnvironment.registerSystem(TransformationSystem);
lEnvironment.registerSystem(LightSystem);
lEnvironment.registerSystem(CullSystem);

const lShitSystem: ShitSystem = lEnvironment.registerSystem(ShitSystem);

// Canvas setup.
const lCanvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
lShitSystem.canvas = lCanvas;

// Handle canvas resize from its wrapper.
const lCanvasWrapper: HTMLElement | null = document.querySelector('.canvas-wrapper');
if (lCanvasWrapper) {
    new ResizeObserver(() => {
        lCanvas.width = Math.max(lCanvasWrapper.clientWidth, 0);
        lCanvas.height = Math.max(lCanvasWrapper.clientHeight, 0);
    }).observe(lCanvasWrapper);
}

// ── Scene setup ──────────────────────────────────────────────
const lSceneSetup = new SceneSetup(lBlockMesh);
lEnvironment.loadScene(lSceneSetup.scene);

// ── Camera controller ────────────────────────────────────────
const lCameraController = new CameraController(lCanvas, [...lSceneSetup.cameras]);
lCameraController.start();

// Animate objects on the same interval as camera input.
globalThis.setInterval(() => {
    lSceneSetup.animateObjects();
}, 16);

// ── UI setup ─────────────────────────────────────────────────
ResizableLayout.initialize();

const lFrameGraph = new FrameGraph(
    document.getElementById('frame-graph-bar')!,
    lEnvironment
);

const lDebugPanel = new DebugPanel(
    document.getElementById('debug-content')!,
    lEnvironment
);

// Hierarchy panel builds itself on construction and updates via sniffer callback.
new HierarchyPanel(
    document.getElementById('hierarchy-content')!,
    lEnvironment
);

// UI update intervals.
globalThis.setInterval(() => {
    lFrameGraph.update();
    lDebugPanel.update();
}, 100);

// ── Start engine ─────────────────────────────────────────────
// eslint-disable-next-line no-console
console.log('Starting environment...');
lEnvironment.start().then(() => {
    // eslint-disable-next-line no-console
    console.log('Environment closed.');
});
