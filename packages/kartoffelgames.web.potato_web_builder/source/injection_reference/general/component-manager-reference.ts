import { Exception } from '@kartoffelgames/core.data';
import { ComponentManager } from '../../component/component-manager';
import { UpdateScope } from '../../enum/update-scope.enum';
import { IPwbExpressionModuleProcessorConstructor } from '../../interface/module.interface';
import { UserClass } from '../../interface/user-class.interface';

/**
 * // TODO: This should not exists. Really try to remove it and pass single handlers of it instead. 
 * 
 * ComponentManager reference.
 * Acts as injection reference but the actual ComponentManager should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentManagerReference extends ComponentManager { 
    /**
     * Constructor. Allways throws exception.
     * 
     * @param pUserClass - User class constructor.
     * @param pTemplateString - Template as xml string.
     * @param pExpressionModule - Expression module constructor.
     * @param pHtmlComponent - HTMLElement of component.
     * @param pUpdateScope - Update scope of component.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    constructor(pUserClass: UserClass, pTemplateString: string | null, pExpressionModule: IPwbExpressionModuleProcessorConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope) {
        super(pUserClass, pTemplateString, pExpressionModule, pHtmlComponent, pUpdateScope);

        throw new Exception('Reference should not be instanced.', this);
    }
}