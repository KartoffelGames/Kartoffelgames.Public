import { ComponentState, PwbComponent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-list-item-component.css' with { type: 'text' };
import template from './kg-list-item-component.html' with { type: 'text' };

/**
 * List item component.
 * Selectable item with small hightlight, icon and user content.
 *
 * Configurable attributes:
 *  - "icon": Icon glyph shown between the bar and the content.
 *  - "barcolor": Color of the left bar. Falls back to the "--list-item-bar-color" variable when not set.
 *  - "selectable": Marks the item as selectable (highlight, radius, pointer). "true"/"false".
 *  - "selected": Shows the selectable highlight permanently. "true"/"false".
 *
 * Slots:
 *  - default: The item content, laid out in a row after the icon.
 *
 * CSS variables:
 *  - "--list-item-bar-default-color"
 *  - "--list-item-icon-color"
 *  - "--list-item-background-color"
 *  - "--list-item-border-radius"
 */
@PwbComponent({
    selector: 'kg-list-item',
    template: template,
    style: styles
})
export class KgListItemComponent {
    /**
     * Icon shown between the bar and the content.
     */
    @PwbExport()
    @ComponentState.state()
    public accessor icon: string;

    /**
     * Color of the left bar.
     */
    @PwbExport()
    @ComponentState.state()
    public accessor barcolor: string;

    /**
     * Selectable state of the item.
     */
    @ComponentState.state()
    private accessor mSelectable: boolean;

    /**
     * Whether the item is selectable.
     */
    @PwbExport()
    public get selectable(): boolean {
        return this.mSelectable;
    } set selectable(pSelectable: unknown) {
        this.mSelectable = this.parseBoolean(pSelectable);
    }

    /**
     * Selected state of the item.
     */
    @ComponentState.state()
    private accessor mSelected: boolean;

    /**
     * Whether the item is rendered as selected.
     * Requires "selectable" also to be true.
     */
    @PwbExport()
    public get selected(): boolean {
        return this.mSelected;
    } set selected(pSelected: unknown) {
        this.mSelected = this.parseBoolean(pSelected);
    }

    /**
     * Create the list item with its default configuration.
     */
    public constructor() {
        this.icon = '';
        this.barcolor = '';
        this.mSelectable = false;
        this.mSelected = false;
    }

    /**
     * Parse an unknown (possibly string attribute) value into a boolean.
     *
     * @param pValue - Value to parse.
     *
     * @returns a boolean.
     */
    private parseBoolean(pValue: unknown): boolean {
        // A string attribute might be the literal "true" or "false".
        if (typeof pValue === 'string') {
            // Empty strings are considered as true also. Because setting a empty attribute also is "true".
            if (pValue === '') {
                return true;
            }

            // Check for a string with the literal true or false string.
            const lValue: string = pValue.toLowerCase();
            if (lValue === 'true' || lValue === 'false') {
                return lValue === 'true';
            }
        }

        return Boolean(pValue);
    }
}
