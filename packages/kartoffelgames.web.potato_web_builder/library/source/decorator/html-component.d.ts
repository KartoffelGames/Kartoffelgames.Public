import { PwbComponentConstructor } from '../interface/html-component';
import { PwbExpressionModuleConstructor } from '../interface/expression-module';
import { PwbManipulatorAttributeModuleConstructor } from '../interface/manipulator-attribute-module';
import { PwbStaticAttributeModuleConstructor } from '../interface/static-attribute-module';
import { UpdateMode } from '../enum/update-mode';
/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
export declare function HtmlComponent(pParameter: HtmlComponentParameter): any;
/**
 * Html component parameter.
 */
declare type HtmlComponentParameter = {
    expressionmodule?: PwbExpressionModuleConstructor | any;
    style?: string;
    selector: string;
    template?: string;
    modules?: Array<PwbManipulatorAttributeModuleConstructor | PwbStaticAttributeModuleConstructor | any>;
    components?: Array<PwbComponentConstructor | any>;
    updateMode?: UpdateMode;
};
export {};
//# sourceMappingURL=html-component.d.ts.map