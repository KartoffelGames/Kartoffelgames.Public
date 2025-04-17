import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { Pitch } from '../../../enum/pitch.enum.ts';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Devision arpeggio effect.
 */
@StatefullSerializeable('af9665cc-4859-4d3e-ad0f-6f249dcfc60a')
export class ArpeggioEffect implements IGenericEffect {
    private readonly mNoteList: Array<Pitch>;

    /**
     * Get semitone down changes in division.
     */
    public get notes(): Array<Pitch> {
        return this.mNoteList;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mNoteList = new Array<Pitch>();
    }

    /**
     * Add note to arpeggio pattern.
     * @param pNote - Note.
     */
    public addNote(pNote: Pitch): void {
        this.mNoteList.push(pNote);
    }
}