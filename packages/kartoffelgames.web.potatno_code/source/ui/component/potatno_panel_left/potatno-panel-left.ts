import { PwbComponent } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-panel-left.css' with { type: 'text' };
import panelLeftTemplate from './potatno-panel-left.html' with { type: 'text' };

// Import child components to ensure they are registered.
import '../potatno_function_list/potatno-function-list.ts';

/**
 * Left panel layout container for the potatno-code visual editor.
 *
 * Pure layout: it hosts the function list, which reads and mutates its state through the shared
 * {@link PotatnoCodeUiManager} on its own, so this component carries no data or event plumbing.
 */
@PwbComponent({
    selector: 'potatno-panel-left',
    template: panelLeftTemplate,
    style: templateCss,
})
export class PotatnoPanelLeft {
}
