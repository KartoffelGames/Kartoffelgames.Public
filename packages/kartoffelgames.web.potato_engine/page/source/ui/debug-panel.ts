import type { IVoidParameterConstructor } from '@kartoffelgames/core';
import { Color } from '../../../source/component_item/color.ts';
import type { GameEnvironment, GameEnvironmentTimingEntry, GameEnvironmentTimingSnapshot } from '../../../source/core/environment/game-environment.ts';
import type { GameSystem } from '../../../source/core/game-system.ts';
import { EditorPropertyNumberType, type EditorPropertyDescriptor, type EditorPropertyRegister } from '../../../source/editor_property/editor-property-register.ts';
import { EditorProperty } from '../../../source/editor_property/editor-property.ts';

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
 * Shows all registered systems with their current timing data, sparkline graphs,
 * enable/disable checkboxes, and dynamic editor property controls.
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
                const lSystem: GameSystem | undefined = this.mEnvironment.systems.find((pSystem) => pSystem.label === lName);
                if (lSystem) {
                    this.addSystemEntry(lSystem);
                }
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

            // Compute average total time from all history entries.
            let lTotalSum: number = 0;
            let lCount: number = 0;
            for (const lSnapshot of lHistory) {
                const lHistEntry: GameEnvironmentTimingEntry | undefined = lSnapshot.systems.get(lName);
                if (lHistEntry) {
                    lTotalSum += lHistEntry.update + lHistEntry.frame + lHistEntry.tick;
                    lCount++;
                }
            }
            const lAvgTotal: number = lCount > 0 ? lTotalSum / lCount : 0;
            lElements.avgValue.textContent = lAvgTotal.toFixed(3) + ' ms';

            // Grey out disabled systems.
            lElements.entryContainer.classList.toggle('debug-system-disabled', !lElements.system.enabled);

            // Sync checkbox state (in case enabled was changed programmatically).
            const lCheckbox: HTMLInputElement | null = lElements.entryContainer.querySelector<HTMLInputElement>('.debug-system-checkbox');
            if (lCheckbox) {
                lCheckbox.checked = lElements.system.enabled;
            }

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
            this.addSystemEntry(lSystem);
        }
    }

    /**
     * Add a system entry to the panel.
     */
    private addSystemEntry(pSystem: GameSystem): void {
        const lName: string = pSystem.label;
        if (this.mSystemElements.has(lName)) {
            return;
        }

        const lSection: HTMLElement = this.mContainer.querySelector('.debug-section')!;

        const lEntry: HTMLDivElement = document.createElement('div');
        lEntry.className = 'debug-system-entry';

        // System name row with checkbox.
        const lNameRow: HTMLDivElement = document.createElement('div');
        lNameRow.className = 'debug-system-name-row';

        const lCheckbox: HTMLInputElement = document.createElement('input');
        lCheckbox.type = 'checkbox';
        lCheckbox.checked = pSystem.enabled;
        lCheckbox.className = 'debug-system-checkbox';
        lCheckbox.addEventListener('change', () => {
            pSystem.enabled = lCheckbox.checked;
        });

        const lNameEl: HTMLSpanElement = document.createElement('span');
        lNameEl.className = 'debug-system-name';
        lNameEl.textContent = lName;

        lNameRow.appendChild(lCheckbox);
        lNameRow.appendChild(lNameEl);
        lEntry.appendChild(lNameRow);

        // Timing values row.
        const lTimings: HTMLDivElement = document.createElement('div');
        lTimings.className = 'debug-system-timings';

        const lUpdateValue: HTMLSpanElement = this.createTimingPair(lTimings, 'Update');
        const lFrameValue: HTMLSpanElement = this.createTimingPair(lTimings, 'Frame');
        const lTickValue: HTMLSpanElement = this.createTimingPair(lTimings, 'Tick');
        const lTotalValue: HTMLSpanElement = this.createTimingPair(lTimings, 'Total');
        const lAvgValue: HTMLSpanElement = this.createTimingPair(lTimings, 'avg');

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

        // Editor properties.
        const lPropertyRegister: EditorPropertyRegister | null = EditorProperty.of(pSystem.constructor as IVoidParameterConstructor<object>);
        if (lPropertyRegister) {
            const lPropsContainer: HTMLDivElement = document.createElement('div');
            lPropsContainer.className = 'debug-system-properties';

            for (const lPropName of lPropertyRegister.propertyNames) {
                const lDescriptor: EditorPropertyDescriptor = lPropertyRegister.getDescriptor(lPropName);
                const lRow: HTMLElement = this.createPropertyControl(pSystem, lPropName, lDescriptor);
                lPropsContainer.appendChild(lRow);
            }

            lEntry.appendChild(lPropsContainer);
        }

        lSection.appendChild(lEntry);

        this.mSystemElements.set(lName, {
            system: pSystem,
            entryContainer: lEntry,
            updateValue: lUpdateValue,
            frameValue: lFrameValue,
            tickValue: lTickValue,
            totalValue: lTotalValue,
            avgValue: lAvgValue,
            canvas: lCanvas
        });
    }

    /**
     * Create a DOM control for an editor property descriptor.
     */
    private createPropertyControl(pTarget: object, pName: string, pDescriptor: EditorPropertyDescriptor): HTMLElement {
        const lRow: HTMLDivElement = document.createElement('div');
        lRow.className = 'debug-prop-row';

        const lLabel: HTMLLabelElement = document.createElement('label');
        lLabel.className = 'debug-prop-label';
        lLabel.textContent = pName;
        lRow.appendChild(lLabel);

        const lControlWrap: HTMLDivElement = document.createElement('div');
        lControlWrap.className = 'debug-prop-control';

        switch (pDescriptor.type) {
            case 'boolean': {
                this.createBooleanControl(lControlWrap, pTarget, pName);
                break;
            }
            case 'enum': {
                this.createEnumControl(lControlWrap, pTarget, pName, pDescriptor.enumType);
                break;
            }
            case 'number': {
                this.createNumberControl(lControlWrap, pTarget, pName, pDescriptor.min, pDescriptor.max, pDescriptor.numberType);
                break;
            }
            case 'range': {
                this.createRangeControl(lControlWrap, pTarget, pName, pDescriptor.min, pDescriptor.max, pDescriptor.numberType);
                break;
            }
            case 'text': {
                this.createTextControl(lControlWrap, pTarget, pName);
                break;
            }
            case 'object': {
                this.createObjectControl(lControlWrap, pTarget, pName);
                break;
            }
            case 'objectLink': {
                // Ignored for now.
                break;
            }
        }

        lRow.appendChild(lControlWrap);
        return lRow;
    }

    /**
     * Create a checkbox control for a boolean property.
     */
    private createBooleanControl(pContainer: HTMLElement, pTarget: object, pName: string): void {
        const lCheckbox: HTMLInputElement = document.createElement('input');
        lCheckbox.type = 'checkbox';
        lCheckbox.className = 'debug-prop-checkbox';
        lCheckbox.checked = (pTarget as Record<string, boolean>)[pName];
        lCheckbox.addEventListener('change', () => {
            (pTarget as Record<string, boolean>)[pName] = lCheckbox.checked;
        });
        pContainer.appendChild(lCheckbox);
    }

    /**
     * Create a combobox control for an enum property.
     */
    private createEnumControl(pContainer: HTMLElement, pTarget: object, pName: string, pEnumType: object): void {
        const lSelect: HTMLSelectElement = document.createElement('select');
        lSelect.className = 'debug-prop-select';

        const lEntries: Array<[string, string | number]> = [];
        for (const [lKey, lValue] of Object.entries(pEnumType)) {
            if (typeof lValue === 'number' || typeof lValue === 'string') {
                // Skip reverse numeric mapping entries.
                if (!isNaN(Number(lKey))) {
                    continue;
                }
                lEntries.push([lKey, lValue]);
            }
        }

        const lCurrentValue: unknown = (pTarget as Record<string, unknown>)[pName];
        for (const [lKey, lValue] of lEntries) {
            const lOption: HTMLOptionElement = document.createElement('option');
            lOption.value = String(lValue);
            lOption.textContent = lKey;
            if (lValue === lCurrentValue) {
                lOption.selected = true;
            }
            lSelect.appendChild(lOption);
        }

        lSelect.addEventListener('change', () => {
            const lParsed: number = Number(lSelect.value);
            (pTarget as Record<string, unknown>)[pName] = isNaN(lParsed) ? lSelect.value : lParsed;
        });

        pContainer.appendChild(lSelect);
    }

    /**
     * Create a number input control.
     */
    private createNumberControl(pContainer: HTMLElement, pTarget: object, pName: string, pMin: number, pMax: number, pNumberType: EditorPropertyNumberType): void {
        const lInput: HTMLInputElement = document.createElement('input');
        lInput.type = 'number';
        lInput.className = 'debug-prop-number';
        lInput.min = String(pMin);
        lInput.max = String(pMax);
        lInput.step = pNumberType === EditorPropertyNumberType.Integer ? '1' : '0.01';
        lInput.value = String((pTarget as Record<string, number>)[pName]);

        lInput.addEventListener('input', () => {
            let lValue: number = Number(lInput.value);
            if (pNumberType === EditorPropertyNumberType.Integer) {
                lValue = Math.round(lValue);
            }
            lValue = Math.max(pMin, Math.min(pMax, lValue));
            (pTarget as Record<string, number>)[pName] = lValue;
        });

        pContainer.appendChild(lInput);
    }

    /**
     * Create a range slider control.
     */
    private createRangeControl(pContainer: HTMLElement, pTarget: object, pName: string, pMin: number, pMax: number, pNumberType: EditorPropertyNumberType): void {
        const lSlider: HTMLInputElement = document.createElement('input');
        lSlider.type = 'range';
        lSlider.className = 'debug-prop-range';
        lSlider.min = String(pMin);
        lSlider.max = String(pMax);
        lSlider.step = pNumberType === EditorPropertyNumberType.Integer ? '1' : '0.01';
        lSlider.value = String((pTarget as Record<string, number>)[pName]);

        const lValueDisplay: HTMLSpanElement = document.createElement('span');
        lValueDisplay.className = 'debug-prop-range-value';
        lValueDisplay.textContent = Number((pTarget as Record<string, number>)[pName]).toFixed(2);

        lSlider.addEventListener('input', () => {
            let lValue: number = Number(lSlider.value);
            if (pNumberType === EditorPropertyNumberType.Integer) {
                lValue = Math.round(lValue);
            }
            (pTarget as Record<string, number>)[pName] = lValue;
            lValueDisplay.textContent = lValue.toFixed(2);
        });

        pContainer.appendChild(lSlider);
        pContainer.appendChild(lValueDisplay);
    }

    /**
     * Create a text input control.
     */
    private createTextControl(pContainer: HTMLElement, pTarget: object, pName: string): void {
        const lInput: HTMLInputElement = document.createElement('input');
        lInput.type = 'text';
        lInput.className = 'debug-prop-text';
        lInput.value = String((pTarget as Record<string, unknown>)[pName] ?? '');

        lInput.addEventListener('input', () => {
            (pTarget as Record<string, string>)[pName] = lInput.value;
        });

        pContainer.appendChild(lInput);
    }

    /**
     * Create a control for an object property. Dispatches to specialized controls based on type.
     */
    private createObjectControl(pContainer: HTMLElement, pTarget: object, pName: string): void {
        // Read the current object value. Accessing the getter triggers copy-on-write for system instances.
        const lObject: unknown = (pTarget as Record<string, unknown>)[pName];

        if (lObject instanceof Color) {
            this.createColorControl(pContainer, pTarget, pName);
        } else if (lObject !== null && lObject !== undefined && typeof lObject === 'object') {
            this.createGenericObjectControl(pContainer, lObject);
        }
    }

    /**
     * Create a color control with a native color picker and individual RGBA channel sliders.
     */
    private createColorControl(pContainer: HTMLElement, pTarget: object, pName: string): void {
        const lColorGroup: HTMLDivElement = document.createElement('div');
        lColorGroup.className = 'debug-prop-color-group';

        // Color preview + native color picker.
        const lPreviewRow: HTMLDivElement = document.createElement('div');
        lPreviewRow.className = 'debug-prop-color-preview-row';

        const lColorSwatch: HTMLDivElement = document.createElement('div');
        lColorSwatch.className = 'debug-prop-color-swatch';

        const lColorInput: HTMLInputElement = document.createElement('input');
        lColorInput.type = 'color';
        lColorInput.className = 'debug-prop-color-picker';

        // Helper: read the Color object fresh (may be copy-on-write).
        const getColor = (): Color => (pTarget as Record<string, Color>)[pName];

        // Helper: Convert color to hex and update swatch + picker.
        const syncPickerFromColor = (): void => {
            const lColor: Color = getColor();
            const lHex: string = '#' +
                Math.round(lColor.r * 255).toString(16).padStart(2, '0') +
                Math.round(lColor.g * 255).toString(16).padStart(2, '0') +
                Math.round(lColor.b * 255).toString(16).padStart(2, '0');
            lColorInput.value = lHex;
            lColorSwatch.style.backgroundColor = `rgba(${Math.round(lColor.r * 255)}, ${Math.round(lColor.g * 255)}, ${Math.round(lColor.b * 255)}, ${lColor.a})`;
        };

        syncPickerFromColor();

        lPreviewRow.appendChild(lColorSwatch);
        lPreviewRow.appendChild(lColorInput);
        lColorGroup.appendChild(lPreviewRow);

        // Individual channel sliders: R, G, B, A.
        const lChannels: Array<{ name: string; key: 'r' | 'g' | 'b' | 'a'; }> = [
            { name: 'R', key: 'r' },
            { name: 'G', key: 'g' },
            { name: 'B', key: 'b' },
            { name: 'A', key: 'a' },
        ];

        const lSliders: Map<string, { slider: HTMLInputElement; value: HTMLSpanElement; }> = new Map();

        for (const lChannel of lChannels) {
            const lChannelRow: HTMLDivElement = document.createElement('div');
            lChannelRow.className = 'debug-prop-color-channel';

            const lChannelLabel: HTMLSpanElement = document.createElement('span');
            lChannelLabel.className = 'debug-prop-color-channel-label';
            lChannelLabel.textContent = lChannel.name;

            const lSlider: HTMLInputElement = document.createElement('input');
            lSlider.type = 'range';
            lSlider.className = 'debug-prop-range';
            lSlider.min = '0';
            lSlider.max = '1';
            lSlider.step = '0.01';
            lSlider.value = String(getColor()[lChannel.key]);

            const lValueDisplay: HTMLSpanElement = document.createElement('span');
            lValueDisplay.className = 'debug-prop-range-value';
            lValueDisplay.textContent = getColor()[lChannel.key].toFixed(2);

            lSliders.set(lChannel.key, { slider: lSlider, value: lValueDisplay });

            lSlider.addEventListener('input', () => {
                const lColor: Color = getColor();
                lColor[lChannel.key] = Number(lSlider.value);
                lValueDisplay.textContent = Number(lSlider.value).toFixed(2);
                syncPickerFromColor();
            });

            lChannelRow.appendChild(lChannelLabel);
            lChannelRow.appendChild(lSlider);
            lChannelRow.appendChild(lValueDisplay);
            lColorGroup.appendChild(lChannelRow);
        }

        // When native color picker changes, update the Color object channels.
        lColorInput.addEventListener('input', () => {
            const lHex: string = lColorInput.value;
            const lColor: Color = getColor();
            lColor.r = parseInt(lHex.substring(1, 3), 16) / 255;
            lColor.g = parseInt(lHex.substring(3, 5), 16) / 255;
            lColor.b = parseInt(lHex.substring(5, 7), 16) / 255;

            // Sync sliders.
            for (const lChannelKey of ['r', 'g', 'b'] as const) {
                const lSliderData = lSliders.get(lChannelKey)!;
                lSliderData.slider.value = String(lColor[lChannelKey]);
                lSliderData.value.textContent = lColor[lChannelKey].toFixed(2);
            }

            syncPickerFromColor();
        });

        pContainer.appendChild(lColorGroup);
    }

    /**
     * Create controls for a generic object by recursively reading its EditorProperty annotations.
     */
    private createGenericObjectControl(pContainer: HTMLElement, pObject: object): void {
        const lRegister: EditorPropertyRegister | null = EditorProperty.of(pObject.constructor as IVoidParameterConstructor<object>);
        if (!lRegister) {
            return;
        }

        const lSubGroup: HTMLDivElement = document.createElement('div');
        lSubGroup.className = 'debug-prop-object-group';

        for (const lPropName of lRegister.propertyNames) {
            const lDescriptor: EditorPropertyDescriptor = lRegister.getDescriptor(lPropName);
            const lRow: HTMLElement = this.createPropertyControl(pObject, lPropName, lDescriptor);
            lSubGroup.appendChild(lRow);
        }

        pContainer.appendChild(lSubGroup);
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
    system: GameSystem;
    entryContainer: HTMLDivElement;
    updateValue: HTMLSpanElement;
    frameValue: HTMLSpanElement;
    tickValue: HTMLSpanElement;
    totalValue: HTMLSpanElement;
    avgValue: HTMLSpanElement;
    canvas: HTMLCanvasElement;
};
