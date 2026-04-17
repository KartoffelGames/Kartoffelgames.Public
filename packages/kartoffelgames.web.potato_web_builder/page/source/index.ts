import { PwbApplication, PwbComponent } from "@kartoffelgames/web-potato-web-builder";
import { ComponentState } from "../../source/core/core_entity/component_state/component-state.ts";

@PwbComponent({
    selector: 'test-component',
    template: `
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
            $for(item of this.list) {
                <input [(value)]="this.userValue"/>
            }
        </div>
        
        <button (click)="this.userValue = 'Clicked!'">Click me</button>
        <button (click)="this.list.push('New item')">Add list item</button>
        <button (click)="this.list.pop()">Remove list</button>
    `
})
class TestComponent {
    @ComponentState.state({ proxy: true })
    public accessor list: Array<string>;

    @ComponentState.state()
    public accessor userValue: string;

    public constructor() {
        this.userValue = 'Initial value';
        this.list = new Array<string>(80000).fill('123');
    }
}

PwbApplication.new((pApplication) => {
    pApplication.addContent(<any>TestComponent);
}, document.body);