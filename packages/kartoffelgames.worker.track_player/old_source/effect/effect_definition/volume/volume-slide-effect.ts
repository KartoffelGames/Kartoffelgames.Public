import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { Direction } from '../../../enum/direction.enum.ts';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Sample volume slide effect.
 */
@StatefullSerializeable('9c97f93e-a223-4f7b-a036-a2cd01c4ff0a')
export class VolumeSlideEffect implements IGenericEffect {
    private mDirection: Direction;
    private mVolumeChangePerTick: number;

    /**
     * Get volume change direction.
     */
    public get direction(): Direction {
        return this.mDirection;
    }

    /**
     * Set volume change direction.
     */
    public set direction(pDirection: Direction) {
        this.mDirection = pDirection;
    }

    /**
     * Get volume change per tick.
     */
    public get volumeChangePerTick(): number {
        return this.mVolumeChangePerTick;
    }

    /**
     * Set volume change per tick.
     */
    public set volumeChangePerTick(pVolumeChangePerTick: number) {
        this.mVolumeChangePerTick = pVolumeChangePerTick;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mVolumeChangePerTick = 0;
        this.mDirection = Direction.Down;
    }
}