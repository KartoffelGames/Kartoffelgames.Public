import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { PwbExtension } from '../../decorator/pwb-extension.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionType } from '../../enum/extension-type.enum';
import { PwbApp } from '../../pwb-app';
import { ModuleReference } from '../../injection_reference/module/module-reference';
import { ComponentReference } from '../../injection_reference/component/component-reference';

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
        pModule.setProcessorAttributes(PwbApp, PwbApp.getChangeDetectionApp(ChangeDetection.current));
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
        pComponent.setProcessorAttributes(PwbApp, PwbApp.getChangeDetectionApp(ChangeDetection.current));
    }
}
