import type { GameEnvironment, GameEnvironmentTimingEntry, GameEnvironmentTimingSnapshot } from '../../../source/core/environment/game-environment.ts';

// Graph colors cycled per system.
const SYSTEM_COLORS: Array<string> = [
    '#89b4fa', // blue
    '#a6e3a1', // green
    '#f9e2af', // yellow
    '#cba6f7', // mauve
    '#fab387', // peach
    '#f38ba8', // red
];

/**
 * Renders the debug panel in the right sidebar.
 * Shows all registered systems with their current timing data and small sparkline graphs.
 */
export class DebugPanel {
    private readonly mContainer: HTMLElement;
    private readonly mEnvironment: GameEnvironment;
    private readonly mSystemElements: Map<string, SystemDebugElements>;

    /**
     * Constructor.
     *
     * @param pContainer - The DOM element to render into (debug-content).
     * @param pEnvironment - The game environment to read timing and system data from.
     */
    public constructor(pContainer: HTMLElement, pEnvironment: GameEnvironment) {
        this.mContainer = pContainer;
        this.mEnvironment = pEnvironment;
        this.mSystemElements = new Map<string, SystemDebugElements>();

        this.buildInitialLayout();
    }

    /**
     * Update the debug panel with latest timing data. Call on interval.
     */
    public update(): void {
        const lHistory: ReadonlyArray<GameEnvironmentTimingSnapshot> = this.mEnvironment.debugData.timingHistory;
        if (lHistory.length === 0) {
            return;
        }

        const lLatest: GameEnvironmentTimingSnapshot = lHistory[lHistory.length - 1];

        // Ensure elements exist for each system.
        for (const [lName] of lLatest.systems) {
            if (!this.mSystemElements.has(lName)) {
                this.addSystemEntry(lName);
            }
        }

        // Update each system display.
        for (const [lName, lElements] of this.mSystemElements) {
            const lEntry: GameEnvironmentTimingEntry | undefined = lLatest.systems.get(lName);
            if (!lEntry) {
                continue;
            }

            const lTotal: number = lEntry.update + lEntry.frame + lEntry.tick;
            lElements.updateValue.textContent = lEntry.update.toFixed(3) + ' ms';
            lElements.frameValue.textContent = lEntry.frame.toFixed(3) + ' ms';
            lElements.tickValue.textContent = lEntry.tick.toFixed(3) + ' ms';
            lElements.totalValue.textContent = lTotal.toFixed(3) + ' ms';

            // Draw sparkline.
            this.drawSparkline(lElements.canvas, lName, lHistory);
        }
    }

    /**
     * Build initial section headers.
     */
    private buildInitialLayout(): void {
        const lSection: HTMLDivElement = document.createElement('div');
        lSection.className = 'debug-section';

        const lHeader: HTMLDivElement = document.createElement('div');
        lHeader.className = 'debug-section-header';
        lHeader.textContent = 'System Timings';

        lSection.appendChild(lHeader);
        this.mContainer.appendChild(lSection);

        // Create entries for already registered systems.
        for (const lSystem of this.mEnvironment.systems) {
            this.addSystemEntry(lSystem.label);
        }
    }

    /**
     * Add a system entry to the panel.
     */
    private addSystemEntry(pName: string): void {
        if (this.mSystemElements.has(pName)) {
            return;
        }

        const lSection: HTMLElement = this.mContainer.querySelector('.debug-section')!;

        const lEntry: HTMLDivElement = document.createElement('div');
        lEntry.className = 'debug-system-entry';

        // System name.
        const lNameEl: HTMLDivElement = document.createElement('div');
        lNameEl.className = 'debug-system-name';
        lNameEl.textContent = pName;
        lEntry.appendChild(lNameEl);

        // Timing values row.
        const lTimings: HTMLDivElement = document.createElement('div');
        lTimings.className = 'debug-system-timings';

        const lUpdateValue: HTMLSpanElement = this.createTimingPair(lTimings, 'Update');
        const lFrameValue: HTMLSpanElement = this.createTimingPair(lTimings, 'Frame');
        const lTickValue: HTMLSpanElement = this.createTimingPair(lTimings, 'Tick');
        const lTotalValue: HTMLSpanElement = this.createTimingPair(lTimings, 'Total');

        lEntry.appendChild(lTimings);

        // Sparkline canvas.
        const lGraphWrap: HTMLDivElement = document.createElement('div');
        lGraphWrap.className = 'debug-system-graph';

        const lCanvas: HTMLCanvasElement = document.createElement('canvas');
        lCanvas.style.width = '100%';
        lCanvas.style.height = '100%';
        lCanvas.style.display = 'block';

        const lResizeObserver = new ResizeObserver(() => {
            lCanvas.width = lGraphWrap.clientWidth;
            lCanvas.height = lGraphWrap.clientHeight;
        });
        lResizeObserver.observe(lGraphWrap);

        lGraphWrap.appendChild(lCanvas);
        lEntry.appendChild(lGraphWrap);

        lSection.appendChild(lEntry);

        this.mSystemElements.set(pName, {
            updateValue: lUpdateValue,
            frameValue: lFrameValue,
            tickValue: lTickValue,
            totalValue: lTotalValue,
            canvas: lCanvas
        });
    }

    /**
     * Create a label + value pair in the timings row.
     */
    private createTimingPair(pParent: HTMLDivElement, pLabel: string): HTMLSpanElement {
        const lPair: HTMLSpanElement = document.createElement('span');

        const lLabelSpan: HTMLSpanElement = document.createElement('span');
        lLabelSpan.className = 'debug-timing-label';
        lLabelSpan.textContent = pLabel + ': ';

        const lValueSpan: HTMLSpanElement = document.createElement('span');
        lValueSpan.className = 'debug-timing-value';
        lValueSpan.textContent = '--';

        lPair.appendChild(lLabelSpan);
        lPair.appendChild(lValueSpan);
        pParent.appendChild(lPair);

        return lValueSpan;
    }

    /**
     * Draw a sparkline for a system showing the total time (update+frame+tick) over history.
     */
    private drawSparkline(pCanvas: HTMLCanvasElement, pSystemName: string, pHistory: ReadonlyArray<GameEnvironmentTimingSnapshot>): void {
        const lCtx: CanvasRenderingContext2D | null = pCanvas.getContext('2d');
        if (!lCtx) {
            return;
        }

        const lWidth: number = pCanvas.width;
        const lHeight: number = pCanvas.height;
        lCtx.clearRect(0, 0, lWidth, lHeight);

        if (lWidth === 0 || lHeight === 0 || pHistory.length < 2) {
            return;
        }

        // Collect total values.
        const lValues: Array<number> = new Array<number>();
        for (const lSnapshot of pHistory) {
            const lEntry: GameEnvironmentTimingEntry | undefined = lSnapshot.systems.get(pSystemName);
            if (lEntry) {
                lValues.push(lEntry.update + lEntry.frame + lEntry.tick);
            } else {
                lValues.push(0);
            }
        }

        // Find max for scaling (min 1ms).
        let lMax: number = 1;
        for (const lVal of lValues) {
            if (lVal > lMax) {
                lMax = lVal;
            }
        }
        lMax *= 1.2;

        // Get color for this system.
        const lSystemIndex: number = Array.from(this.mSystemElements.keys()).indexOf(pSystemName);
        const lColor: string = SYSTEM_COLORS[lSystemIndex % SYSTEM_COLORS.length];

        // Draw filled area chart.
        const lStepX: number = lWidth / (lValues.length - 1);

        lCtx.beginPath();
        lCtx.moveTo(0, lHeight);

        for (let lI = 0; lI < lValues.length; lI++) {
            const lX: number = lI * lStepX;
            const lY: number = lHeight - (lValues[lI] / lMax) * lHeight;
            lCtx.lineTo(lX, lY);
        }

        lCtx.lineTo(lWidth, lHeight);
        lCtx.closePath();

        // Fill with semi-transparent color.
        lCtx.fillStyle = lColor + '33'; // 20% opacity.
        lCtx.fill();

        // Draw line on top.
        lCtx.beginPath();
        for (let lI = 0; lI < lValues.length; lI++) {
            const lX: number = lI * lStepX;
            const lY: number = lHeight - (lValues[lI] / lMax) * lHeight;
            if (lI === 0) {
                lCtx.moveTo(lX, lY);
            } else {
                lCtx.lineTo(lX, lY);
            }
        }
        lCtx.strokeStyle = lColor;
        lCtx.lineWidth = 1.5;
        lCtx.stroke();
    }
}

type SystemDebugElements = {
    updateValue: HTMLSpanElement;
    frameValue: HTMLSpanElement;
    tickValue: HTMLSpanElement;
    totalValue: HTMLSpanElement;
    canvas: HTMLCanvasElement;
};
