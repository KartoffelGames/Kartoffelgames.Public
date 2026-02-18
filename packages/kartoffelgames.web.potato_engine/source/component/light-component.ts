import { Serializer } from '@kartoffelgames/core-serializer';
import { GameComponent } from '../core/component/game-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { ILightComponentItem } from '../component_item/light/i-light-component-item.interface.ts';
import { PointLight } from '../component_item/light/point-light.ts';
import { TransformationComponent } from './transformation-component.ts';

/**
 * Component that holds a light source.
 * The light type and properties are determined by the assigned {@link ILightComponentItem} implementation.
 * Requires a TransformationComponent for positioning in the scene.
 */
@Serializer.serializeableClass('f47ac10b-58cc-4372-a567-0e02b2c3d479')
export class LightComponent extends GameComponent {
    private mLight: ILightComponentItem | null;

    /**
     * Gets the component types that this component depends on.
     */
    public override get dependencies(): Array<GameComponentConstructor> {
        return [TransformationComponent];
    }

    /**
     * Light implementation defining the type and properties of this light source.
     */
    @Serializer.property()
    public get light(): ILightComponentItem {
        if (!this.mLight) {
            this.mLight = this.initLight();
        }

        return this.mLight;
    } set light(pValue: ILightComponentItem) {
        // Unlink previous light item.
        if (this.mLight) {
            this.mLight.unlinkParent(this);
        }

        // Save and link new light item.
        this.mLight = pValue;
        this.mLight.linkParent(this);

        this.update();
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Light');

        this.mLight = null;
    }

    /**
     * Creates the default light implementation.
     */
    private initLight(): ILightComponentItem {
        const lLight: PointLight = new PointLight();
        lLight.linkParent(this);

        return lLight;
    }
}
