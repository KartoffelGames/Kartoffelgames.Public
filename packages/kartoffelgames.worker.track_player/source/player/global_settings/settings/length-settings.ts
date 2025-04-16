import { GenericModule } from '../../../generic_module/generic-module';
import { Division } from '../../../generic_module/pattern/division';
import { Pattern } from '../../../generic_module/pattern/pattern';
import { SpeedSettings } from './speed-settings';

export class LengthSettings {
    private readonly mGenericModule: GenericModule;
    private readonly mSpeedHandler: SpeedSettings;
    private mTicksPerDivision: number;

    /**
     * Get channel count.
     */
    public get channels(): number {
        // TODO: Is there now a better way to find the current needed channels?
        // Cursor as "Optional" handler. Assigned via property??? Best solution!!

        // For performance. Get channel count for first division.
        const lFirstPattern: Pattern = this.mGenericModule.pattern.getPattern(0);
        const lFirstDivision: Division = lFirstPattern.getDivision(0);

        return lFirstDivision.channelCount; 
    }

    /**
     * Get count of divisions per pattern.
     */
    public get divisions(): number {
        // Get all pattern lengths.
        const lPatternLengthList: Array<number> = new Array<number>();
        for (let lPatternIndex: number = 0; lPatternIndex < this.mGenericModule.pattern.patternCount; lPatternIndex++) {
            const lPattern: Pattern = this.mGenericModule.pattern.getPattern(lPatternIndex);
            lPatternLengthList.push(lPattern.divisionCount);
        }

        // Return max patten length.
        return Math.max(...lPatternLengthList);
    }

    /**
     * Get count of samples per tick.
     */
    public get samples(): number {
        return ((this.mSpeedHandler.sampleRate * 60) / (this.mSpeedHandler.beatsPerMinute * this.mSpeedHandler.speedUp)) / 24;
    }

    /**
     * Get count of song positions.
     */
    public get songPositions(): number {
        return this.mGenericModule.pattern.songPositions.length;
    }

    /**
     * Get count of ticks per division.
     */
    public get ticks(): number {
        return this.mTicksPerDivision;
    }

    /**
     * Constructor.
     * @param pModule - Playing module.
     * @param pSpeedHandler - Speed handler.
     */
    public constructor(pModule: GenericModule, pSpeedHandler: SpeedSettings) {
        this.mGenericModule = pModule;
        this.mSpeedHandler = pSpeedHandler;
        this.mTicksPerDivision = 0;

        // Set default tick rate.
        this.setTickRate(6);
    }

    /**
     * Set tick rate for next playing divisions.
     * @param pTicksPerDivision - Ticks per division.
     */
    public setTickRate(pTicksPerDivision: number): void {
        this.mTicksPerDivision = pTicksPerDivision;
    }
}