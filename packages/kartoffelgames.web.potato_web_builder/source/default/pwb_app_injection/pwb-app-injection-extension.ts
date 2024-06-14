import { InteractionZone } from '@kartoffelgames/web.change-detection';
import { PwbExtensionModule } from '../../decorator/pwb-extension-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionType } from '../../enum/extension-type.enum';
import { ComponentReference } from '../../injection/references/component/component-reference';
import { ModuleReference } from '../../injection/references/module/module-reference';
import { PwbApp } from '../../pwb-app/pwb-app';

@PwbExtensionModule({
    type: ExtensionType.Module,
    access: AccessMode.Write
})
export class PwbAppModuleInjectionExtension {
    /**
     * Constructor.
     * Sets current {@link PwbApp} as injection target.
     * 
     * @param pModule - Module.
     */
    public constructor(pModule: ModuleReference) {
        const lPwbApp: PwbApp | undefined = PwbApp.getAppOfZone(InteractionZone.save());
        if (lPwbApp) {
            pModule.setProcessorAttributes(PwbApp, lPwbApp);
        }
    }
}

@PwbExtensionModule({
    type: ExtensionType.Component,
    access: AccessMode.Write
})
export class PwbAppComponentInjectionExtension {
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
