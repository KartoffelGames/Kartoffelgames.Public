import { Dictionary } from '@kartoffelgames/core.data';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { IPwbModuleOnDeconstruct } from '../../interface/module.interface';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { ModuleTargetNodeReference } from '../../injection/references/module/module-target-node-reference';
import { ModuleLayerValuesReference } from '../../injection/references/module/module-layer-values-reference';
import { ModuleKeyReference } from '../../injection/references/module/module-key-reference';
import { ModuleValueReference } from '../../injection/references/module/module-value-reference';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^\([[\w\-$]+\)$/,
    trigger: UpdateTrigger.Default
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
    public constructor(pTargetNode: ModuleTargetNodeReference, pLayerValue: ModuleLayerValuesReference, pAttributeKey: ModuleKeyReference, pAttributeValue: ModuleValueReference) {
        this.mTarget = pTargetNode;
        this.mEventName = pAttributeKey.substring(1, pAttributeKey.length - 1);

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
