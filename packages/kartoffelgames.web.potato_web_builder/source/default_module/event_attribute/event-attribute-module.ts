import { Dictionary } from '@kartoffelgames/core.data';
import { IAttributeOnDeconstruct } from '../../core/module/attribute_module/attribute-module';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';
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
     * @param pModuleAttribute - Attribute of module.
     */
    public constructor(pTargetNode: ModuleTargetNode, pModuleValues: ModuleValues, pModuleAttribute: ModuleAttribute) {
        this.mTarget = pTargetNode;
        this.mEventName = pModuleAttribute.name.substring(1, pModuleAttribute.name.length - 1);

        // Define listener.
        this.mListener = (pEvent: any): void => {
            // Add event to external values.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$event', pEvent);

            // Execute string with external event value.
            pModuleValues.executeExpression(pModuleAttribute.value, lExternalValues);
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
