import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { BaseExtendableUserEntity } from './base-extendable-user-entity';
import { BaseUserEntity, IUserProcessor } from './base-user-entity';
import { InteractionZoneStack } from '@kartoffelgames/web.change-detection/library/source/change_detection/interaction-zone';
import { UpdateHandler } from '../component/handler/update-handler';
import { ComponentUpdateHandlerReference } from '../injection-reference/component/component-update-handler-reference';

export abstract class BaseTrackedUserEntity<TProcessor extends IUserProcessor = IUserProcessor> extends BaseExtendableUserEntity<TProcessor> {
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Update handler of component entity.
     */
    protected get updateHandler(): UpdateHandler {
        return this.mUpdateHandler;
    }

    /**
     * Constructor.
     * Takes over parent injections.
     * 
     * @param pProcessorConstructor - Processor constructor of user entity.
     * @param pParent - Parent of user entity.
     */
    public constructor(pProcessorConstructor: InjectionConstructor, pParent: BaseUserEntity<any> | null, pAutoUpdate: boolean, pIsolatedInteraction: boolean) {
        super(pProcessorConstructor, pParent);

        // Try to read interaction stack from parent.
        let lCurrentInteractionStack: InteractionZoneStack | undefined = undefined;
        if (pParent instanceof BaseTrackedUserEntity) {
            lCurrentInteractionStack = pParent?.updateHandler.interactionStack;
        }

        // Create new updater for every component entity.
        this.mUpdateHandler = new UpdateHandler(pIsolatedInteraction, lCurrentInteractionStack);

        // Add update handler reference as injectable object.
        this.setProcessorAttributes(ComponentUpdateHandlerReference, this.updateHandler);

        // Attach automatic update listener to handler when this entity is not set to be manual.
        if (pAutoUpdate) {
            this.mUpdateHandler.addUpdateListener(() => {
                this.update();
            });
        }
    }

    /**
     * Deconstruct module.
     */
    public override deconstruct(): void {
        // Remove change listener from app.
        this.mUpdateHandler.deconstruct();

        super.deconstruct();
    }

    /**
     * Replace untracked with tracked user processor.
     * 
     * @param pProcessor - User processor.
     * 
     * @returns tracked user processor.
     */
    protected override onCreation(pProcessor: TProcessor): TProcessor {
        return this.mUpdateHandler.registerObject(pProcessor);
    }
}