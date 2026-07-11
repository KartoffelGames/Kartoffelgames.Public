import { PotatnoPreviewDisplay, type PotatnoPreviewDisplayExecutorCallable } from '../../../../source/preview/potatno-preview-display.ts';
import { PotatnoPreviewFunctionExecutor, type PotatnoPreviewResultType } from '../../../../source/preview/potatno-preview-function-executor.ts';
import type { CanvasProjectTypesDefinition } from '../canvas-project-types-definition.ts';

/**
 * Text preview that samples the executor in a 3x3 matrix.
 */
export class CanvasProjectMatrixPreviewDisplay<TExecutorResultType extends PotatnoPreviewResultType<CanvasProjectTypesDefinition>> extends PotatnoPreviewDisplay<CanvasProjectTypesDefinition, HTMLDivElement, CanvasProjectMatrixPreviewDisplayParameter, TExecutorResultType, CanvasProjectMatrixPreviewDisplayResultTypes, CanvasProjectMatrixPreviewDisplayResult> {
    private static readonly MATRIX_SIZE: number = 3;
    private static readonly VALUE_LENGTH: number = 5;

    /**
     * Constructor.
     *
     * @param pExecutor - Executor for this display.
     */
    public constructor(pExecutor: PotatnoPreviewFunctionExecutor<CanvasProjectTypesDefinition, CanvasProjectMatrixPreviewDisplayParameter, TExecutorResultType>) {
        super(pExecutor, {
            id: 'matrix',
            name: 'Matrix 3x3',
            generate: (): HTMLDivElement => {
                const lElement: HTMLDivElement = document.createElement('div');
                lElement.style.boxSizing = 'border-box';
                lElement.style.display = 'grid';
                lElement.style.gap = '2px';
                lElement.style.gridTemplateColumns = `repeat(${CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE}, minmax(0, 1fr))`;
                lElement.style.height = '100%';
                lElement.style.width = '100%';
                lElement.style.fontFamily = 'var(--potatno-font-family)';
                lElement.style.fontSize = 'var(--potatno-font-size-small)';
                return lElement;
            },
            typeAdapter: {
                [PotatnoPreviewFunctionExecutor.MAIN]: (pInputValue: [number, number, number]): Array<string> => {
                    return pInputValue.map((pValue) => this.formatPreviewValue(pValue));
                },
                'number': (pInputValue: number): Array<string> => {
                    return [this.formatPreviewValue(pInputValue)];
                },
                'string': (pInputValue: string): Array<string> => {
                    return [this.formatPreviewValue(pInputValue)];
                },
                'boolean': (pInputValue: boolean): Array<string> => {
                    return [this.formatPreviewValue(pInputValue)];
                }
            },
            update: async (pElement, pExecutor) => {
                await this.updateMatrixPreview(pElement, pExecutor);
            }
        });
    }

    /**
     * Format a preview value to fit into a compact matrix cell.
     *
     * @param pValue - Value to format.
     *
     * @returns Formatted preview value.
     */
    private formatPreviewValue(pValue: unknown): string {
        // Format numeric values compactly before applying the final length cap.
        if (typeof pValue === 'number') {
            if (!Number.isFinite(pValue)) {
                return pValue.toString().slice(0, CanvasProjectMatrixPreviewDisplay.VALUE_LENGTH);
            }

            const lIntegralLength: number = Math.trunc(Math.abs(pValue)).toString().length;
            const lFractionLength: number = Math.max(0, CanvasProjectMatrixPreviewDisplay.VALUE_LENGTH - lIntegralLength - (pValue < 0 ? 1 : 0) - 1);
            const lFormattedValue: string = pValue.toFixed(lFractionLength);
            return lFormattedValue.slice(0, CanvasProjectMatrixPreviewDisplay.VALUE_LENGTH);
        }

        // Convert non-numeric values and cap their rendered size.
        return String(pValue).slice(0, CanvasProjectMatrixPreviewDisplay.VALUE_LENGTH);
    }

    /**
     * Update the matrix by sampling the preview callback in a 3x3 grid.
     *
     * @param pElement - Matrix container element.
     * @param pExecutor - Preview executor callable.
     */
    private async updateMatrixPreview(pElement: HTMLDivElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<CanvasProjectMatrixPreviewDisplayParameter, CanvasProjectMatrixPreviewDisplayResult>): Promise<void> {
        // Create cells once and reuse them for every preview update.
        while (pElement.children.length < CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE * CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE) {
            const lCellElement: HTMLDivElement = document.createElement('div');
            lCellElement.style.alignItems = 'center';
            lCellElement.style.background = 'var(--potatno-color-background-dark)';
            lCellElement.style.border = '1px solid var(--potatno-color-border)';
            lCellElement.style.boxSizing = 'border-box';
            lCellElement.style.color = 'var(--pn-text-primary)';
            lCellElement.style.display = 'flex';
            lCellElement.style.justifyContent = 'center';
            lCellElement.style.minWidth = '0';
            lCellElement.style.overflow = 'hidden';
            lCellElement.style.padding = '2px';
            lCellElement.style.textOverflow = 'clip';
            lCellElement.style.whiteSpace = 'pre-line';
            pElement.append(lCellElement);
        }

        // Sample each matrix position.
        for (let lY = 0; lY < CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE; lY++) {
            for (let lX = 0; lX < CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE; lX++) {
                const lIndex: number = lY * CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE + lX;
                const lNormalizedX: number = CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE === 1 ? 0 : lX / (CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE - 1);
                const lNormalizedY: number = CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE === 1 ? 0 : lY / (CanvasProjectMatrixPreviewDisplay.MATRIX_SIZE - 1);
                const lResult: Array<string> = await Promise.resolve(pExecutor({ x: lNormalizedX, y: lNormalizedY }));

                pElement.children[lIndex].textContent = lResult.join('\n');
            }
        }
    }
}

type CanvasProjectMatrixPreviewDisplayParameter = {
    x: number;
    y: number;
};

type CanvasProjectMatrixPreviewDisplayResult = Array<string>;

type CanvasProjectMatrixPreviewDisplayResultTypes = 'MAIN' | 'number' | 'string' | 'boolean';
