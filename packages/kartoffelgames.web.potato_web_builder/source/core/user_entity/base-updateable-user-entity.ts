import { BaseUserEntity, IUserProcessor } from './base-user-entity';

export abstract class BaseUpdateableUserEntity<TProcessor extends IUserProcessor = IUserProcessor> extends BaseUserEntity<TProcessor> {
    /**
     * Update user entity.
     */
    public update(): boolean {
        return this.onUpdate();
    }

    /**
     * Update user entity.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    protected abstract onUpdate(): boolean;
}