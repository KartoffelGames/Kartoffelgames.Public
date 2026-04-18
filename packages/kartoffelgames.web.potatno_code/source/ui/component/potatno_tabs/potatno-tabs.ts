import { PwbComponent, PwbExport, PwbComponentEvent, ComponentEventEmitter, ComponentState } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-tabs.css' with { type: 'text' };
import tabsTemplate from './potatno-tabs.html' with { type: 'text' };

/**
 * Tabs component for the potatno-code visual editor.
 * Renders horizontal tab buttons and emits change events on selection.
 */
@PwbComponent({
    selector: 'potatno-tabs',
    template: tabsTemplate,
    style: templateCss,
})
export class PotatnoTabs {
    /**
     * Array of tab label strings.
     */
    @PwbExport
    @ComponentState.state()
    public accessor tabs: Array<string> = [];

    /**
     * Index of the currently active tab.
     */
    @PwbExport
    @ComponentState.state()
    public accessor activeIndex: number = 0;

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
