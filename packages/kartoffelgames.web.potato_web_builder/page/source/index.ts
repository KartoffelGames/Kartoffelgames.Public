import { PwbApplication, PwbComponent } from "@kartoffelgames/web-potato-web-builder";
import { ComponentState } from "../../source/core/core_entity/component_state/component-state.ts";

@PwbComponent({
    selector: 'test-component',
    template: `
        $for(item of this.list) {
            <input [(value)]="this.userValue"/>
        }
    `
})
class TestComponent {
    public list: Array<string> = ['One', 'Two', 'Three'];
    private mUserValue: ComponentState<string>;

    public get userValue(): string {
        return this.mUserValue.get();
    } set userValue(pValue: string) {
        this.mUserValue.set(pValue);
    }

    public constructor() {
        this.mUserValue = new ComponentState<string>('Initial value');
    }
}

PwbApplication.new((pApplication)=>{
    pApplication.addContent(<any>TestComponent);
}, document.body)