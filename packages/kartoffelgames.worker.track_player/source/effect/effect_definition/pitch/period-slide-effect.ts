import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { Direction } from '../../../enum/direction.enum.ts';
import { Pitch } from '../../../enum/pitch.enum.ts';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Devision period slide effect.
 */
@StatefullSerializeable('c73b8272-d6db-432d-a2af-2a364cff187e')
export class PeriodSlideEffect implements IGenericEffect {
    private mDirection: Direction;
    private mGlissandoSensitive: boolean;
    private mNoteBoundary: Pitch;
    private mPeriodSlidePerTick: number;

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
     * Get if slide is glissando sensitive.
     */
    public get glissandoSensitive(): boolean {
        return this.mGlissandoSensitive;
    }

    /**
     * Set if slide is glissando sensitive.
     */
    public set glissandoSensitive(pSensitive: boolean) {
        this.mGlissandoSensitive = pSensitive;
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
     * Get period slide.
     */
    public get periodSlidePerTick(): number {
        return this.mPeriodSlidePerTick;
    }

    /**
     * Set period slide.
     */
    public set periodSlidePerTick(pChangeperTick: number) {
        this.mPeriodSlidePerTick = pChangeperTick;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mPeriodSlidePerTick = 0;
        this.mDirection = Direction.Down;
        this.mNoteBoundary = Pitch.Empty;
        this.mGlissandoSensitive = false;
    }
}