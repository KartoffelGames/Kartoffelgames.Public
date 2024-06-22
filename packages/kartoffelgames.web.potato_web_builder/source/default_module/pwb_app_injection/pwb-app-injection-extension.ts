import { InteractionZone } from '@kartoffelgames/web.change-detection';
import { Component } from '../../core/component/component';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { ComponentReference } from '../../core/injection-reference/component/component-reference';
import { PwbApp } from '../../pwb-app/pwb-app';

@PwbExtensionModule({
    access: AccessMode.Write,
    trigger: UpdateTrigger.None,
    targetRestrictions: [Component]
})
export class PwbAppInjectionExtension {
    /**
     * Constructor.
     * Sets current {@link PwbApp} as injection target.
     * 
     * @param pModule - Module.
     */
    public constructor(pComponent: ComponentReference) {
        const lPwbApp: PwbApp | undefined = PwbApp.getAppOfZone(InteractionZone.current);
        if (lPwbApp) {
            pComponent.setProcessorAttributes(PwbApp, lPwbApp);
        }
    }
}
