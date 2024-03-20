import { Exception } from '@kartoffelgames/core.data';
import { LayerValues } from '../../component/values/layer-values';
import { ComponentManager } from '../../component/component-manager';

/**
 * Layer value reference.
 * Acts as injection reference but the actual Layer value should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentLayerValuesReference extends LayerValues {
    /**
     * Constructor. Allways throws exception.
     * @param pParentLayer - Parent layer. ComponentManager on root layer.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    public constructor(pParentLayer: LayerValues | ComponentManager) {
        super(pParentLayer);

        throw new Exception('Reference should not be instanced.', this);
    }
}