import { Dictionary } from '@kartoffelgames/core.data';
import { ComponentLayerValuesReference } from '../../injection_reference/component/component-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection_reference/module/module-target-node-reference';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { IPwbModuleOnDeconstruct } from '../../interface/module.interface';
import { ModuleValueReference } from '../../injection_reference/module/module-value-reference';
import { ModuleKeyReference } from '../../injection_reference/module/module-key-reference';

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
     * @param pTargetNode - Target element.
     * @param pLayerValue - Values of component.
     * @param pAttributeKey - Attribute key of module.
     * @param pAttributeValue - Attribute value of module.
     */
    public constructor(pTargetNode: ModuleTargetNodeReference, pLayerValue: ComponentLayerValuesReference, pAttributeKey: ModuleKeyReference, pAttributeValue: ModuleValueReference) {
        this.mTarget = pTargetNode;
        this.mEventName = pAttributeKey.substring(1, pAttributeKey.length - 2);

        // Define listener.
        this.mListener = (pEvent: any): void => {
            // Add event to external values.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$event', pEvent);

            // Execute string with external event value.
            ComponentScopeExecutor.execute(pAttributeValue.toString(), pLayerValue, lExternalValues);
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
