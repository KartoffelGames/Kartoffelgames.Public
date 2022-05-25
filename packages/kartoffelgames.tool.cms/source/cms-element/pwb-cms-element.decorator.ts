import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { PwbComponent } from '@kartoffelgames/web.potato-web-builder';
import { IPwbMultiplicatorModuleClass, IPwbStaticModuleClass } from '@kartoffelgames/web.potato-web-builder/library/source/module/interface/module';
import { CmsEditToolsComponent } from '../component/cms-edit-tools/cms-edit-tools-component';
import { CmsElement } from './cms-element';
import { CmsElements } from './cms-elements';


/**
 * AtScript. CMS element.
 * @param pParameter - Parameter defaults on creation.
 */
export function PwbCmsElement(pParameter: CmsComponentParameter): any {

    // Needs constructor without argument.
    return (pUserClassConstructor: typeof CmsElement) => {

        // Validate correct cconstructor inheritance. TODO: validate with metdata.
        // if(pUserClassConstructor.prototype instanceof CmsElement){
        //     throw new Exception('Cms element must inherit CmsElement', PwbCmsElement);
        // }

        // Infuse setting formular template.
        const lTemplate: string = `<cms-edit-tools>${pParameter.formularTemplate}</cms-edit-tools>${pParameter.componentTemplate ?? ''}`;

        PwbComponent({
            selector: pParameter.selector,
            template: lTemplate,
            style: pParameter.style ?? '',
            components: [CmsEditToolsComponent]
        })(pUserClassConstructor);

        CmsElements.addElement(pUserClassConstructor);
    };
}

/**
 * Cms element parameter.
 */
type CmsComponentParameter = {
    style?: string,
    selector: string;
    componentTemplate: string;
    formularTemplate: string;
    // Placeholder for listing modules that should be imported.
    modules?: Array<IPwbMultiplicatorModuleClass | IPwbStaticModuleClass | any>;
    // Placeholder for listing components that should be imported.
    components?: Array<InjectionConstructor>;
};
