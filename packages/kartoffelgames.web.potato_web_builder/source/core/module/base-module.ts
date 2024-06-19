import { IDeconstructable } from '@kartoffelgames/core.data';
import { ModuleConstructorReference } from '../injection-reference/module/module-constructor-reference';
import { ModuleReference } from '../injection-reference/module/module-reference';
import { BaseUpdateableUserEntity } from '../user_entity/base-updateable-user-entity';
import { BaseUserEntity } from '../user_entity/base-user-entity';

export abstract class BaseModule<TModuleProcessor extends IPwbModuleProcessor> extends BaseUpdateableUserEntity<TModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pConstructor: IPwbModuleProcessorConstructor<IPwbModuleProcessor>, pParent: BaseUserEntity) {
        super(pConstructor, pParent);

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleConstructorReference, pConstructor);
        this.setProcessorAttributes(ModuleReference, this);
    }

    /**
     * Deconstruct module.
     */
    public override deconstruct(): void {
        // Deconstruct extensions.
        super.deconstruct();

        // Deconstruct modules.
        if ('onDeconstruct' in this.processor && typeof this.processor.onDeconstruct === 'function') {
            this.processor.onDeconstruct();
        }
    }
}


// Base.
export interface IPwbModuleProcessor { }
export interface IPwbModuleProcessorConstructor<T extends IPwbModuleProcessor> {
    new(...args: Array<any>): T;
}

export interface IPwbModuleOnUpdate<TUpdateResult> {
    /**
     * Called on update.
     */
    onUpdate(): TUpdateResult;
}

export interface IPwbModuleOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}
