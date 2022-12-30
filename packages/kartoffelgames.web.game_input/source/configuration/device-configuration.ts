import { ICloneable } from '@kartoffelgames/core.data';

export class DeviceConfiguration implements ICloneable<DeviceConfiguration>{
    private mTriggerTolerance: number;

    /**
     * Tolerance on wich buttons and axis are marked as pressed.
     */
    public get triggerTolerance(): number {
        return this.mTriggerTolerance;
    } set triggerTolerance(pTolerance: number) {
        this.mTriggerTolerance = pTolerance;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTriggerTolerance = 0;
    }

    /**
     * Clone device configuration.
     */
    public clone(): DeviceConfiguration {
        const lClone: DeviceConfiguration = new DeviceConfiguration();

        // Trigger tolerance.
        lClone.triggerTolerance = this.triggerTolerance;

        return lClone;
    }
}