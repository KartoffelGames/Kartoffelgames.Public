import { PwbComponent } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-popup-component.css' with { type: 'text' };
import template from './kg-popup-component.html' with { type: 'text' };

/**
 * User resizeable panel.
 * 
 * Configurable attributes:
 *  - "animate" with values "top", "right", "bottom" or "left".
 * 
 * CSS variables:
 *  - "--popup-border-color"
 *  - "--popup-shadow-color"
 *  - "--popup-background-color"
 */
@PwbComponent({
    selector: 'kg-popup',
    template: template,
    style: styles
})
export class KgPopupComponent { }
