import { Dictionary } from '@kartoffelgames/core.data';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ComponentLayerValuesReference } from '../../injection_reference/component/component-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection_reference/module/module-target-node-reference';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { IPwbModuleOnDeconstruct } from '../../interface/module.interface';

@PwbAttributeModule({
    selector: /^\([[\w\-$]+\)$/,
    access: AccessMode.Write
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
    public constructor(pTargetReference: ModuleTargetNodeReference, pValueReference: ComponentLayerValuesReference, pAttributeReference: ModuleAttributeReference) {
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
