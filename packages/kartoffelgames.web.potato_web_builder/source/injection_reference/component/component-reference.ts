import { Exception } from '@kartoffelgames/core.data';
import { Component } from '../../component/component';

/**
 * Component reference.
 * Acts as injection reference but the actual component should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentReference extends Component {
    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    public constructor() {
        super(null as any, null as any, null as any, null as any, null as any);

        throw new Exception('Reference should not be instanced.', this);
    }
}
