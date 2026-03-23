import { PwbComponent, Processor, PwbExport, PwbComponentEvent, ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-tabs.css';
import tabsTemplate from './potatno-tabs.html';

/**
 * Tabs component for the potatno-code visual editor.
 * Renders horizontal tab buttons and emits change events on selection.
 */
@PwbComponent({
    selector: 'potatno-tabs',
    template: tabsTemplate,
    style: templateCss,
})
export class PotatnoTabs extends Processor {
    /**
     * Array of tab label strings.
     */
    @PwbExport
    public tabs: Array<string> = [];

    /**
     * Index of the currently active tab.
     */
    @PwbExport
    public activeIndex: number = 0;

    @PwbComponentEvent('tab-change')
    private accessor mTabChange!: ComponentEventEmitter<number>;

    /**
     * Get the CSS class string for a tab button at the given index.
     *
     * @param pIndex - Tab index.
     * @returns CSS class string.
     */
    public getTabClass(pIndex: number): string {
        return pIndex === this.activeIndex ? 'tab-button active' : 'tab-button';
    }

    /**
     * Handle tab click. Updates the active index and dispatches a tab-change event.
     *
     * @param pIndex - Clicked tab index.
     */
    public onTabClick(pIndex: number): void {
        this.activeIndex = pIndex;
        this.mTabChange.dispatchEvent(pIndex);
    }
}
