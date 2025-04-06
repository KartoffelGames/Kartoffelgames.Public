import { Injection } from "@kartoffelgames/core-dependency-injection";
import { InteractionZone } from '@kartoffelgames/web-interaction-zone';
import { Component } from '../../core/component/component.ts';
import { Processor } from '../../core/core_entity/processor.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator.ts';
import { PwbApp } from '../../pwb-app/pwb-app.ts';

@PwbExtensionModule({
    access: AccessMode.Write,
    trigger: UpdateTrigger.None,
    targetRestrictions: [Component]
})
export class PwbAppInjectionExtension extends Processor {
    /**
     * Constructor.
     * Sets current {@link PwbApp} as injection target.
     * 
     * @param pModule - Module.
     */
    public constructor(pComponent = Injection.use(Component)) {
        super();

        const lPwbApp: PwbApp | undefined = PwbApp.getAppOfZone(InteractionZone.current);
        if (lPwbApp) {
            pComponent.setProcessorAttributes(PwbApp, lPwbApp);
        }
    }
}
