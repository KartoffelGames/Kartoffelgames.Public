import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { PatternList } from './pattern/pattern-list.ts';
import { SampleList } from './sample/sample-list.ts';

@StatefullSerializeable('5fab5714-ec6e-4057-82df-1749054035c6')
export class GenericModule {
    private readonly mPattern: PatternList;
    private readonly mSamples: SampleList;
    private mSongName: string;

    /**
     * Get module pattern list.
     */
    public get pattern(): PatternList {
        return this.mPattern;
    }

    /**
     * Get samples.
     */
    public get samples(): SampleList {
        return this.mSamples;
    }

    /**
     * Get module song name.
     */
    public get songName(): string {
        return this.mSongName;
    }

    /**
     * set module song name.
     */
    public set songName(pName: string) {
        this.mSongName = pName;
    }

    /**
     * Constructor.
     * Initialize
     */
    public constructor() {
        this.mSongName = '';
        this.mPattern = new PatternList();
        this.mSamples = new SampleList();
    }
}