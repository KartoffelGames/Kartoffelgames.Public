import { Exception } from '@kartoffelgames/core.data';
import { UpdateHandler } from '../../component/handler/update-handler';
import { UpdateScope } from '../../enum/update-scope.enum';

/**
 * ComponentManager reference.
 * Acts as injection reference but the actual ComponentManager should be injected instead.
 * 
 * Should never be initialized.
 */
export class UpdateHandlerReference extends UpdateHandler { 
    /**
     * Constructor. Allways throws exception.
     * 
     * @param pUpdateScope - Update scope of component.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    constructor(pUpdateScope: UpdateScope) {
        super(pUpdateScope);

        throw new Exception('Reference should not be instanced.', this);
    }
}