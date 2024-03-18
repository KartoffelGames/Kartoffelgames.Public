import { Dictionary } from '@kartoffelgames/core.data';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module/module-layer-values-reference';
import { ModuleTargetReference } from '../../injection_reference/module-target-reference';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { ModuleAccessMode } from '../../enum/module-access-mode';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { IPwbModuleOnDeconstruct } from '../../interface/module';

@PwbAttributeModule({
    selector: /^\([[\w\-$]+\)$/,
    access: ModuleAccessMode.Write,
    forbiddenInManipulatorScopes: false
})
export class EventAttributeModule implements IPwbModuleOnDeconstruct {
    private readonly mEventName: string;
    private readonly mListener: (this: null, pEvent: any) => void;
    private readonly mTarget: Node;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetReference, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference) {
        this.mTarget = <Node>pTargetReference.value;
        this.mEventName = pAttributeReference.value.name.substr(1, pAttributeReference.value.name.length - 2);

        // Define listener.
        this.mListener = (pEvent: any): void => {
            // Add event to external values.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$event', pEvent);

            // Execute string with external event value.
            ComponentScopeExecutor.execute(pAttributeReference.value.asText, pValueReference.value, lExternalValues);
        };

        // Add native event listener.
        this.mTarget.addEventListener(this.mEventName, this.mListener);
    }

    /**
     * Cleanup event on deconstruction.
     */
    public onDeconstruct(): void {
        this.mTarget.removeEventListener(this.mEventName, this.mListener);
    }
}
