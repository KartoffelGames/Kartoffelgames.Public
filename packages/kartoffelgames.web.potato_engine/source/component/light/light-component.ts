import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { Exception } from '../../../../kartoffelgames.core/source/exception/exception.ts';
import type { GameComponentConstructor } from '../../core/component/game-component.ts';
import { GameComponent } from '../../core/component/game-component.ts';
import { EditorProperty } from '../../editor_property/editor-property.ts';
import { TransformationComponent } from '../transformation-component.ts';
import { DirectionalLight } from './type/directional-light.ts';
import type { ILightComponentItem } from './type/i-light-component-item.interface.ts';
import { PointLight } from './type/point-light.ts';
import { SpotLight } from './type/spot-light.ts';
import { AreaLight } from './type/area-light.ts';
import { LightComponentItemType } from './type/light-component-item-type.enum.ts';

/**
 * Component that holds a light source.
 * The light type and properties are determined by the assigned {@link ILightComponentItem} implementation.
 * Requires a TransformationComponent for positioning in the scene.
 */
@FileSystem.fileClass('f47ac10b-58cc-4372-a567-0e02b2c3d479', FileSystemReferenceType.Instanced)
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
    @EditorProperty.objectControl()
    @FileSystem.fileProperty()
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
    @EditorProperty.enumControl(LightComponentItemType)
    public get lightType(): LightComponentItemType {
        switch (true) {
            case this.light instanceof DirectionalLight: return LightComponentItemType.Directional;
            case this.light instanceof PointLight: return LightComponentItemType.Point;
            case this.light instanceof SpotLight: return LightComponentItemType.Spot;
            case this.light instanceof AreaLight: return LightComponentItemType.Area;
        }

        throw new Exception('Unknown light type.', this);
    } set lightType(pValue: LightComponentItemType) {
        switch (pValue) {
            case LightComponentItemType.Directional: {
                this.light = new DirectionalLight();
                break;
            }
            case LightComponentItemType.Point: {
                this.light = new PointLight();
                break;
            }
            case LightComponentItemType.Spot: {
                this.light = new SpotLight();
                break;
            }
            case LightComponentItemType.Area: {
                this.light = new AreaLight();
                break;
            }
            default: {
                throw new Exception('Unknown light type.', this);
            }
        }
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Light');

        this.mLight = PointLight.SYSTEM_INSTANCE;
    }
}

