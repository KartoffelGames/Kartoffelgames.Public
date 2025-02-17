import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { ChangeState, HistoryItem, MyersDiff } from '../../source/algorithm/myers-diff.ts';

describe('MyersDiff', () => {
    describe('Method: differencesOf', () => {
        it('-- Full compare', () => {
            // Setup. Initialize DifferentSearch.
            const lDifferentReference: MyersDiff<string, string> = new MyersDiff((pValueOne: string, pValueTwo: string) => {
                return pValueOne === pValueTwo;
            });

            // Setup. Values.
            const lValueOne: string = 'abcdef';
            const lValueTwo: string = 'axcefx';

            // Process.
            const lChanges: Array<HistoryItem<string, string>> = lDifferentReference.differencesOf(lValueOne.split(''), lValueTwo.split(''));

            // Evaluation.
            expect(lChanges).toMatchObject([
                { changeState: ChangeState.Keep, item: 'a' },
                { changeState: ChangeState.Remove, item: 'b' },
                { changeState: ChangeState.Insert, item: 'x' },
                { changeState: ChangeState.Keep, item: 'c' },
                { changeState: ChangeState.Remove, item: 'd' },
                { changeState: ChangeState.Keep, item: 'e' },
                { changeState: ChangeState.Keep, item: 'f' },
                { changeState: ChangeState.Insert, item: 'x' }
            ]);
        });

        it('-- Empty compare', () => {
            // Setup. Initialize DifferentSearch.
            const lDifferentReference: MyersDiff<string, string> = new MyersDiff((pValueOne: string, pValueTwo: string) => {
                return pValueOne === pValueTwo;
            });

            // Process.
            const lChanges: Array<HistoryItem<string, string>> = lDifferentReference.differencesOf([], []);

            // Evaluation.
            expect(lChanges).toMatchObject([]);
        });
    });
});