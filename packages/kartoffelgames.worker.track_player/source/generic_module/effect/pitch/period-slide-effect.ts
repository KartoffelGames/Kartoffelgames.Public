import { Direction } from '../../../enum/direction.enum';
import { Pitch } from '../../../enum/Pitch';
import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Devision period slide effect.
 */
export class PeriodSlideEffect implements IGenericEffect {
    private mDirection: Direction;
    private mNoteBoundary: Pitch;
    private mPeriodSlide: number;

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
     * Get Set note bound for the slide.
     */
    public get noteBoundary(): Pitch {
        return this.mNoteBoundary;
    }

    /**
     * Set note bound for the slide.
     */
    public set noteBoundary(pDirection: Pitch) {
        this.mNoteBoundary = pDirection;
    }

    /**
     * Get period slide up.
     */
    public get periodSlide(): number {
        return this.mPeriodSlide;
    }

    /**
     * Set period slide up.
     */
    public set periodSlide(pChangeperTick: number) {
        this.mPeriodSlide = pChangeperTick;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mPeriodSlide = 0;
        this.mDirection = Direction.Down;
        this.mNoteBoundary = Pitch.Empty;
    }
}