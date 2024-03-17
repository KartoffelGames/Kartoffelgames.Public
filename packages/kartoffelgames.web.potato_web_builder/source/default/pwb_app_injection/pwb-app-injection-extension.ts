import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { PwbExtension } from '../../decorator/pwb-extension.decorator';
import { ExtensionMode } from '../../enum/extension-mode';
import { ExtensionType } from '../../enum/extension-type';
import { IPwbExtensionOnCollectInjections } from '../../interface/extension';
import { PwbApp } from '../../pwb-app';

@PwbExtension({
    type: ExtensionType.Component | ExtensionType.Module,
    mode: ExtensionMode.Inject
})
export class PwbAppInjectionExtension implements IPwbExtensionOnCollectInjections {
    /**
     * Collect all injectables.
     */
    public onCollectInjections(): Array<object | null> {
        const lInjectionList: Array<object | null> = new Array<object | null>();
        lInjectionList.push(PwbApp.getChangeDetectionApp(ChangeDetection.current) ?? null);
        return lInjectionList;
    }
}

