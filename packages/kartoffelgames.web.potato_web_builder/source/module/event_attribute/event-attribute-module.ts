import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Processor } from '../../core/core_entity/processor.ts';
import type { LevelProcedure } from '../../core/data/level-procedure.ts';
import { ModuleDataLevel } from '../../core/data/module-data-level.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import type { IAttributeOnDeconstruct } from '../../core/module/attribute_module/attribute-module.ts';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator.ts';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute.ts';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node.ts';

@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^\([[\w\-$]+\)$/,
    trigger: UpdateTrigger.Any
})
export class EventAttributeModule extends Processor implements IAttributeOnDeconstruct {
    private readonly mEventName: string;
    private readonly mListener: (this: null, pEvent: any) => void;
    private readonly mTarget: Node;

    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pModuleData - Module data.
     * @param pModuleAttribute - Attribute of module.
     */
    public constructor(pTargetNode = Injection.use(ModuleTargetNode), pModuleData = Injection.use(ModuleDataLevel), pModuleAttribute = Injection.use(ModuleAttribute)) {
        super();

        this.mTarget = pTargetNode;
        this.mEventName = pModuleAttribute.name.substring(1, pModuleAttribute.name.length - 1);

        const lProcedure: LevelProcedure<void> = pModuleData.createExpressionProcedure(pModuleAttribute.value, ['$event']);

        // Define listener.
        this.mListener = (pEvent: any): void => {
            // Add event to external values.
            lProcedure.setTemporaryValue('$event', pEvent);

            // Execute procedure with set external event value.
            lProcedure.execute();
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
