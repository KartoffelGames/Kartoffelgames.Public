import { Exception } from '@kartoffelgames/core.data';
import { LayerValues } from '../../component/values/layer-values';

/**
 * Component Layer value reference.
 * Acts as injection reference but the actual Layer value should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentLayerValuesReference extends LayerValues {
    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    public constructor() {
        super(null as any);

        throw new Exception('Reference should not be instanced.', this);
    }
}