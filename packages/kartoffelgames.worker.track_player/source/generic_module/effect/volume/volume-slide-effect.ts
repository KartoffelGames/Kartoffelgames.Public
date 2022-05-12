import { Direction } from '../../../enum/direction.enum';
import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Sample volume slide effect.
 */
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