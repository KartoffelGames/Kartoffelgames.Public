import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { PwbExtension } from '../../decorator/pwb-extension.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionType } from '../../enum/extension-type.enum';
import { PwbApp } from '../../pwb-app';
import { ModuleReference } from '../../injection/references/module/module-reference';
import { ComponentReference } from '../../injection/references/component/component-reference';

@PwbExtension({
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
        const lPwbApp: PwbApp | undefined = PwbApp.getChangeDetectionApp(ChangeDetection.current);
        if (lPwbApp) {
            pModule.setProcessorAttributes(PwbApp, lPwbApp);
        }
    }
}

@PwbExtension({
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
        const lPwbApp: PwbApp | undefined = PwbApp.getChangeDetectionApp(ChangeDetection.current);
        if (lPwbApp) {
            pComponent.setProcessorAttributes(PwbApp, lPwbApp);
        }
    }
}
