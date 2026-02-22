import type { GameEnvironment, GameEnvironmentTimingSnapshot } from '../../../source/core/environment/game-environment.ts';

/**
 * Renders a framerate and frame-time graph into the top bar above the canvas.
 * Draws a rolling FPS area chart with semi-transparent frame time bars overlaid on top.
 */
export class FrameGraph {
    private readonly mCanvas: HTMLCanvasElement;
    private readonly mCanvasWrap: HTMLDivElement;
    private readonly mCtx: CanvasRenderingContext2D;
    private readonly mFpsLabel: HTMLSpanElement;
    private readonly mFrameTimeLabel: HTMLSpanElement;
    private readonly mEnvironment: GameEnvironment;

    /**
     * Constructor.
     *
     * @param pContainer - The DOM element to render into (frame-graph-bar).
     * @param pEnvironment - The game environment to read timing data from.
     */
    public constructor(pContainer: HTMLElement, pEnvironment: GameEnvironment) {
        this.mEnvironment = pEnvironment;

        // Build DOM structure.
        const lWrapper: HTMLDivElement = document.createElement('div');
        lWrapper.className = 'frame-graph-container';

        // Stats row.
        const lStatsRow: HTMLDivElement = document.createElement('div');
        lStatsRow.className = 'frame-graph-stats';

        this.mFpsLabel = document.createElement('span');
        this.mFpsLabel.innerHTML = 'FPS: <span class="stat-value">--</span>';

        this.mFrameTimeLabel = document.createElement('span');
        this.mFrameTimeLabel.innerHTML = 'Frame: <span class="stat-value">-- ms</span>';

        lStatsRow.appendChild(this.mFpsLabel);
        lStatsRow.appendChild(this.mFrameTimeLabel);
        lWrapper.appendChild(lStatsRow);

        // Canvas for the graph.
        this.mCanvasWrap = document.createElement('div');
        this.mCanvasWrap.className = 'frame-graph-canvas-wrap';

        this.mCanvas = document.createElement('canvas');
        this.mCanvasWrap.appendChild(this.mCanvas);
        lWrapper.appendChild(this.mCanvasWrap);

        pContainer.appendChild(lWrapper);

        this.mCtx = this.mCanvas.getContext('2d')!;
    }

    /**
     * Update the graph. Should be called on a regular interval (e.g. every 100ms).
     */
    public update(): void {
        const lHistory: ReadonlyArray<GameEnvironmentTimingSnapshot> = this.mEnvironment.debugData.timingHistory;
        if (lHistory.length < 2) {
            return;
        }

        // Calculate FPS from timestamps of the last few snapshots.
        const lRecentCount: number = Math.min(lHistory.length, 30);
        const lNewest: GameEnvironmentTimingSnapshot = lHistory[lHistory.length - 1];
        const lOldest: GameEnvironmentTimingSnapshot = lHistory[lHistory.length - lRecentCount];
        const lElapsed: number = lNewest.timestamp - lOldest.timestamp;
        const lFps: number = lElapsed > 0 ? ((lRecentCount - 1) / lElapsed) * 1000 : 0;

        // Current frame time.
        const lFrameTime: number = lNewest.totalFrameTime;

        // Update labels.
        this.mFpsLabel.innerHTML = `FPS: <span class="stat-value">${lFps.toFixed(1)}</span>`;
        this.mFrameTimeLabel.innerHTML = `Frame: <span class="stat-value">${lFrameTime.toFixed(3)} ms</span>`;

        // Draw combined graph.
        this.drawGraph(lHistory);
    }

    /**
     * Draw the combined FPS area chart and frame time bars on the canvas.
     */
    private drawGraph(pHistory: ReadonlyArray<GameEnvironmentTimingSnapshot>): void {
        // Sync canvas pixel buffer to its display size every draw call.
        const lDisplayWidth: number = this.mCanvasWrap.clientWidth;

        if (lDisplayWidth === 0 || pHistory.length < 2) {
            return;
        }

        if (this.mCanvas.width !== lDisplayWidth) {
            this.mCanvas.width = lDisplayWidth;
            this.mCanvas.height = 55; // Some magical css number.
        }

        const lWidth: number = this.mCanvas.width;
        const lHeight: number = this.mCanvas.height;
        const lCtx: CanvasRenderingContext2D = this.mCtx;

        lCtx.clearRect(0, 0, lWidth, lHeight);

        // Determine how many bars fit in the canvas.
        const lBarWidth: number = Math.max(2, Math.floor(lWidth / pHistory.length));
        const lGap: number = 1;
        const lMaxBars: number = Math.floor(lWidth / (lBarWidth + lGap));
        const lStartIndex: number = Math.max(0, pHistory.length - lMaxBars);
        const lBarCount: number = pHistory.length - lStartIndex;

        // Right-align bars so newest data is on the right edge.
        const lOffsetX: number = lWidth - lBarCount * (lBarWidth + lGap);

        // Collect FPS and frame time values for the visible range.
        const lFpsValues: Array<number> = new Array<number>(lBarCount);
        const lFrameTimeValues: Array<number> = new Array<number>(lBarCount);

        let lMaxFps: number = 1;
        let lMaxFrameTime: number = 0.1;

        for (let lI: number = 0; lI < lBarCount; lI++) {
            const lSnapshot: GameEnvironmentTimingSnapshot = pHistory[lStartIndex + lI];
            const lFps: number = lSnapshot.totalFrameTime > 0 ? 1000 / lSnapshot.totalFrameTime : 0;
            lFpsValues[lI] = lFps;
            lFrameTimeValues[lI] = lSnapshot.totalFrameTime;

            if (lFps > lMaxFps) {
                lMaxFps = lFps;
            }
            if (lSnapshot.totalFrameTime > lMaxFrameTime) {
                lMaxFrameTime = lSnapshot.totalFrameTime;
            }
        }

        lMaxFps *= 1.2;
        lMaxFrameTime *= 1.2;

        // Minimum visible pixel height so bars/graph are never invisible.
        const lMinHeight: number = 2;

        // ── 1. Draw FPS area chart (background layer) ──
        lCtx.beginPath();

        // Start at bottom-left of the first bar center.
        const lFirstX: number = lOffsetX + lBarWidth / 2;
        lCtx.moveTo(lFirstX, lHeight);

        for (let lI: number = 0; lI < lBarCount; lI++) {
            const lX: number = lOffsetX + lI * (lBarWidth + lGap) + lBarWidth / 2;
            const lScaled: number = (lFpsValues[lI] / lMaxFps) * lHeight;
            const lH: number = Math.max(lMinHeight, lScaled);
            lCtx.lineTo(lX, lHeight - lH);
        }

        // Close the area at bottom-right.
        const lLastX: number = lOffsetX + (lBarCount - 1) * (lBarWidth + lGap) + lBarWidth / 2;
        lCtx.lineTo(lLastX, lHeight);
        lCtx.closePath();

        lCtx.fillStyle = 'rgba(137, 180, 250, 0.15)';
        lCtx.fill();

        // Draw FPS line on top of the area.
        lCtx.beginPath();
        for (let lI: number = 0; lI < lBarCount; lI++) {
            const lX: number = lOffsetX + lI * (lBarWidth + lGap) + lBarWidth / 2;
            const lScaled: number = (lFpsValues[lI] / lMaxFps) * lHeight;
            const lH: number = Math.max(lMinHeight, lScaled);
            if (lI === 0) {
                lCtx.moveTo(lX, lHeight - lH);
            } else {
                lCtx.lineTo(lX, lHeight - lH);
            }
        }
        lCtx.strokeStyle = '#89b4fa';
        lCtx.lineWidth = 1.5;
        lCtx.stroke();

        // ── 2. Draw frame time bars on top (semi-transparent) ──
        for (let lI: number = 0; lI < lBarCount; lI++) {
            const lX: number = lOffsetX + lI * (lBarWidth + lGap);
            const lScaled: number = (lFrameTimeValues[lI] / lMaxFrameTime) * lHeight;
            const lBarH: number = Math.max(lMinHeight, lScaled);

            // Color based on frame time: green < 16ms, yellow < 33ms, red >= 33ms.
            if (lFrameTimeValues[lI] < 16.67) {
                lCtx.fillStyle = 'rgba(166, 227, 161, 0.3)';
            } else if (lFrameTimeValues[lI] < 33.33) {
                lCtx.fillStyle = 'rgba(249, 226, 175, 0.3)';
            } else {
                lCtx.fillStyle = 'rgba(243, 139, 168, 0.3)';
            }

            lCtx.fillRect(lX, lHeight - lBarH, lBarWidth, lBarH);
        }
    }
}
