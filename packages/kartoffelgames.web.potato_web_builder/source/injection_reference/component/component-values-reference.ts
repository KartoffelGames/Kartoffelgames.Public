import { Exception } from '@kartoffelgames/core.data';
import { LayerValues } from '../../component/values/layer-values';
import { Component } from '../../component/component';

/**
 * Component Layer value reference.
 * Acts as injection reference but the actual Layer value should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentValuesReference extends LayerValues {
    /**
     * Constructor. Allways throws exception.
     * @param pParentLayer - Parent layer. ComponentManager on root layer.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    public constructor(pParentLayer: LayerValues | Component) {
        super(pParentLayer);

        throw new Exception('Reference should not be instanced.', this);
    }
}