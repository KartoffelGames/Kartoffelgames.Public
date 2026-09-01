import { ComponentState, PwbComponent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-list-item-component.css' with { type: 'text' };
import template from './kg-list-item-component.html' with { type: 'text' };

/**
 * List item component. Shared layout for the potatno-style lists: a full height
 * colored bar, an icon and slotted content. All internal spacing scales with the
 * components font-size, so it fits both rem and pixel environments.
 *
 * Configurable attributes:
 *  - "icon": Icon glyph shown between the bar and the content.
 *  - "barcolor": Color of the left bar. Falls back to the "--list-item-bar-color" variable when not set.
 *  - "selectable": Marks the item as selectable (highlight, radius, pointer). "true"/"false".
 *
 * State classes (set from the outside):
 *  - "selected": Shows the selectable highlight permanently.
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
     * Icon glyph shown between the bar and the content.
     */
    @PwbExport()
    @ComponentState.state()
    public accessor icon: string;

    /**
     * Color of the left bar. Falls back to "--list-item-bar-color" when empty.
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
     * Reading returns the current state, writing overrides it.
     */
    @PwbExport()
    public get selectable(): boolean {
        return this.mSelectable;
    } set selectable(pSelectable: unknown) {
        this.mSelectable = this.parseBoolean(pSelectable);
    }

    /**
     * Create the list item with its default configuration.
     */
    public constructor() {
        this.icon = '';
        this.barcolor = '';
        this.mSelectable = false;
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
