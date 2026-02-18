import { Serializer } from '@kartoffelgames/core-serializer';
import { Exception } from "../../../../kartoffelgames.core/source/exception/exception.ts";
import type { GameComponentConstructor } from '../../core/component/game-component.ts';
import { GameComponent } from '../../core/component/game-component.ts';
import { EditorProperty } from "../../editor_property/editor-property.ts";
import { TransformationComponent } from '../transformation-component.ts';
import { DirectionalLight } from "./type/directional-light.ts";
import type { ILightComponentItem } from './type/i-light-component-item.interface.ts';
import { PointLight } from './type/point-light.ts';
import { SpotLight } from "./type/spot-light.ts";

/**
 * Component that holds a light source.
 * The light type and properties are determined by the assigned {@link ILightComponentItem} implementation.
 * Requires a TransformationComponent for positioning in the scene.
 */
@Serializer.serializeableClass('f47ac10b-58cc-4372-a567-0e02b2c3d479')
export class LightComponent extends GameComponent {
    private mLight: ILightComponentItem;

    /**
     * Gets the component types that this component depends on.
     */
    public override get dependencies(): Array<GameComponentConstructor> {
        return [TransformationComponent];
    }

    /**
     * Light implementation defining the type and properties of this light source.
     */
    @EditorProperty.object()
    @Serializer.property()
    public get light(): ILightComponentItem {
        return this.mLight;
    } set light(pValue: ILightComponentItem) {
        // Unlink previous light item.
        this.mLight.unlinkParent(this);

        // Save and link new light item.
        this.mLight = pValue;
        this.mLight.linkParent(this);

        this.update();
    }

    /**
     * Camera projection type. Setting this will create a new projection of the given type.
     */
    @EditorProperty.enum(LightComponentLightType)
    public get lightType(): LightComponentLightType {
        switch (true) {
            case this.light instanceof DirectionalLight: return LightComponentLightType.Directional;
            case this.light instanceof PointLight: return LightComponentLightType.Point;
            case this.light instanceof SpotLight: return LightComponentLightType.Spot;
        }

        throw new Exception('Unknown light type.', this);
    } set lightType(pValue: LightComponentLightType) {
        switch (pValue) {
            case LightComponentLightType.Directional: {
                this.light = new DirectionalLight();
                break;
            }
            case LightComponentLightType.Point: {
                this.light = new PointLight();
                break;
            }
            case LightComponentLightType.Spot: {
                this.light = new SpotLight();
                break;
            }
        }

        throw new Exception('Unknown light type.', this);
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Light');

        this.mLight = PointLight.systemInstance;
    }
}

/**
 * Light component light type enum.
 */
const LightComponentLightType = {
    Directional: 'Directional',
    Point: 'Point',
    Spot: 'Spot'
} as const;
export type LightComponentLightType = typeof LightComponentLightType[keyof typeof LightComponentLightType];