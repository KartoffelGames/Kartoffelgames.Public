import { PwbComponent } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-information-component.css' with { type: 'text' };
import template from './kg-information-component.html' with { type: 'text' };

/**
 * Hoverable round "i" icon that reveals slotted information on hover.
 *
 * CSS variables:
 *  - "--information-background-color"
 *  - "--information-icon-color"
 */
@PwbComponent({
    selector: 'kg-information',
    template: template,
    style: styles
})
export class KgInformationComponent { }
