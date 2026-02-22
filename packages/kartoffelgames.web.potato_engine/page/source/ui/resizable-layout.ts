/**
 * Sets up resizable panel dividers for the editor layout.
 * Each resize handle allows dragging to resize the adjacent panel.
 */
export class ResizableLayout {
    /**
     * Initialize resize handles for the editor layout.
     * Must be called after DOM is ready.
     */
    public static initialize(): void {
        const lLeftPanel: HTMLElement = document.getElementById('panel-left')!;
        const lRightPanel: HTMLElement = document.getElementById('panel-right')!;
        const lLeftHandle: HTMLElement = document.getElementById('resize-left')!;
        const lRightHandle: HTMLElement = document.getElementById('resize-right')!;

        ResizableLayout.setupHandle(lLeftHandle, lLeftPanel, 'left');
        ResizableLayout.setupHandle(lRightHandle, lRightPanel, 'right');
    }

    /**
     * Set up a single resize handle.
     */
    private static setupHandle(pHandle: HTMLElement, pPanel: HTMLElement, pSide: 'left' | 'right'): void {
        let lDragging: boolean = false;
        let lStartX: number = 0;
        let lStartWidth: number = 0;

        pHandle.addEventListener('mousedown', (pEvent: MouseEvent) => {
            lDragging = true;
            lStartX = pEvent.clientX;
            lStartWidth = pPanel.getBoundingClientRect().width;
            pHandle.classList.add('active');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            pEvent.preventDefault();
        });

        document.addEventListener('mousemove', (pEvent: MouseEvent) => {
            if (!lDragging) {
                return;
            }

            const lDelta: number = pEvent.clientX - lStartX;
            let lNewWidth: number;

            if (pSide === 'left') {
                lNewWidth = lStartWidth + lDelta;
            } else {
                lNewWidth = lStartWidth - lDelta;
            }

            // Enforce min/max.
            lNewWidth = Math.max(200, Math.min(lNewWidth, 600));
            pPanel.style.width = `${lNewWidth}px`;
        });

        document.addEventListener('mouseup', () => {
            if (lDragging) {
                lDragging = false;
                pHandle.classList.remove('active');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }
}
