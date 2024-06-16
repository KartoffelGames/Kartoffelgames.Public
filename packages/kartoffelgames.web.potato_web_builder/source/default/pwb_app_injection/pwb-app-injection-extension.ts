import { InteractionZone } from '@kartoffelgames/web.change-detection';
import { Component } from '../../component/component';
import { PwbExtensionModule } from '../../decorator/pwb-extension-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { ComponentReference } from '../../injection/references/component/component-reference';
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
        const lPwbApp: PwbApp | undefined = PwbApp.getAppOfZone(InteractionZone.save());
        if (lPwbApp) {
            pComponent.setProcessorAttributes(PwbApp, lPwbApp);
        }
    }
}
