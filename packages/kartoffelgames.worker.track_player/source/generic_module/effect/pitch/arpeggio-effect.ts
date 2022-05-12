import { Pitch } from '../../../enum/Pitch';
import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Devision arpeggio effect.
 */
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