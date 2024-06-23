import { Dictionary } from '@kartoffelgames/core.data';
import { ModuleKeyReference } from '../../core/injection-reference/module/module-key-reference';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { IAttributeOnDeconstruct } from '../../core/module/attribute_module/attribute-module';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { ModuleValues } from '../../core/module/module-values';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^\([[\w\-$]+\)$/,
    trigger: UpdateTrigger.Default
})
export class EventAttributeModule implements IAttributeOnDeconstruct {
    private readonly mEventName: string;
    private readonly mListener: (this: null, pEvent: any) => void;
    private readonly mTarget: Node;

    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pModuleValues - Values of module scoped.
     * @param pAttributeKey - Attribute key of module.
     * @param pAttributeValue - Attribute value of module.
     */
    public constructor(pTargetNode: ModuleTargetNode, pModuleValues: ModuleValues, pAttributeKey: ModuleKeyReference, pAttributeValue: ModuleValueReference) {
        this.mTarget = pTargetNode;
        this.mEventName = pAttributeKey.substring(1, pAttributeKey.length - 1);

        // Define listener.
        this.mListener = (pEvent: any): void => {
            // Add event to external values.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$event', pEvent);

            // Execute string with external event value.
            pModuleValues.executeExpression(pAttributeValue.toString(), lExternalValues);
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
