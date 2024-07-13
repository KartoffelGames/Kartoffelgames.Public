import { InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { Component } from '../../core/component/component';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator';
import { AccessMode } from '../../core/enum/access-mode.enum';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { PwbApp } from '../../pwb-app/pwb-app';
import { Processor } from '../../core/core_entity/processor';

@PwbExtensionModule({
    access: AccessMode.Write,
    trigger: UpdateTrigger.None,
    targetRestrictions: [Component]
})
export class PwbAppInjectionExtension extends Processor{
    /**
     * Constructor.
     * Sets current {@link PwbApp} as injection target.
     * 
     * @param pModule - Module.
     */
    public constructor(pComponent: Component) {
        super();
        
        const lPwbApp: PwbApp | undefined = PwbApp.getAppOfZone(InteractionZone.current);
        if (lPwbApp) {
            pComponent.setProcessorAttributes(PwbApp, lPwbApp);
        }
    }
}
