import { PwbComponent } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-popup-component.css' with { type: 'text' };
import template from './kg-popup-component.html' with { type: 'text' };

/**
 * User resizeable panel.
 * 
 * Configurable attributes:
 *  - "animate" with values "top", "right", "bottom" or "left".
 *  - "selectable"
 * 
 * CSS variables:
 *  - "--button-accent-color"
 *  - "--button-border-color"
 *  - "--button-background-color"
 */
@PwbComponent({
    selector: 'kg-button',
    template: template,
    style: styles
})
export class KgPopupComponent { }
