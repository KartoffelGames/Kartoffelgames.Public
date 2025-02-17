import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { Dictionary } from '../../source/data_container/dictionary.ts';
import { Exception } from '../../source/exception/exception.ts';

describe('Dictionary', () => {
    describe('Method: add', () => {
        it('-- Add item', () => {
            // Setup. Specify values. 
            const lKey: string = 'Key';
            const lValue: string = 'Value';

            // Setup. Create dictionary.
            const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();

            // Process.
            lDictionary.add(lKey, lValue);

            // Evaluation.
            expect(lDictionary.get(lKey)).toBe(lValue);
        });

        it('-- Throw double add error', () => {
            // Setup. Specify values. 
            const lKey: string = 'Key';

            // Setup. Create dictionary and add item.
            const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
            lDictionary.add(lKey, 'Value');

            // Process.
            const lIlligalInstruction = () => {
                lDictionary.add(lKey, 'Value');
            };

            // Evaluation.
            expect(lIlligalInstruction).toThrow(Exception);
        });
    });

    it('Method: set', () => {
        // Setup. Specify values. 
        const lKey: string = 'Key';
        const lNewValue: string = 'NewValue';

        // Setup. Create dictionary and add item.
        const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
        lDictionary.set(lKey, 'OldValue');

        // Process.
        lDictionary.set(lKey, lNewValue);

        // Evaluation.
        expect(lDictionary.get(lKey)).toBe(lNewValue);
    });

    describe('Method: delete', () => {
        it('-- Delete existant item', () => {
            // Setup. Specify values. 
            const lKey: string = 'Key';

            // Setup. Create dictionary and add item.
            const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
            lDictionary.set(lKey, 'Value');

            // Process
            const lRemovedResult: boolean = lDictionary.delete(lKey);

            // Evaluation
            expect(lDictionary.get(lKey)).toBeUndefined();
            expect(lRemovedResult).toBeTruthy();
        });

        it('-- Delete none existant item', () => {
            // Setup. Specify values. 
            const lKey: string = 'Key';

            // Setup. Create dictionary and add item.
            const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();

            // Process
            const lRemovedResult: boolean = lDictionary.delete(lKey);

            // Evaluation
            expect(lDictionary.get(lKey)).toBeUndefined();
            expect(lRemovedResult).toBeFalsy();
        });
    });

    it('Method: getAllKeysOfValue', () => {
        // Setup. Specify values. 
        const lKey1: string = 'Key1';
        const lKey2: string = 'Key2';
        const lKey3: string = 'Key3';
        const lValue1: string = 'Value1';
        const lValue2: string = 'Value2';

        // Setup. Create dictionary and add item.
        const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
        lDictionary.set(lKey1, lValue1);
        lDictionary.set(lKey2, lValue2);
        lDictionary.set(lKey3, lValue1);

        // Process.
        const lKeyOfValue1List: Array<string> = lDictionary.getAllKeysOfValue(lValue1);

        // Evaluation.
        expect(lKeyOfValue1List).toDeepEqual([lKey1, lKey3]);
    });

    it('Method: getOrDefault', () => {
        // Setup.
        const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
        lDictionary.add('SetKey', 'SetValue');

        // Process.
        const lDefaultValue: string = lDictionary.getOrDefault('NotSetKey', 'DefaultValue');
        const lFoundValue: string = lDictionary.getOrDefault('SetKey', 'DefaultValue');

        // Evaluation.
        expect(lDefaultValue).toBe('DefaultValue');
        expect(lFoundValue).toBe('SetValue');
    });

    it('Method: map', () => {
        // Setup.
        const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
        lDictionary.set('Key1', 'Value1');
        lDictionary.set('Key2', 'Value2');

        // Process.
        const lMappedList: Array<string> = lDictionary.map((pKey: string, pValue: string): string => {
            return pKey + pValue;
        });

        // Evaluation.
        expect(lMappedList).toDeepEqual(['Key1Value1', 'Key2Value2']);
    });

    it('Method: has', () => {
        // Setup.
        const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
        lDictionary.set('Key', 'Value');

        // Process.
        const lHasValue: boolean = lDictionary.has('Key');

        // Evaluation.
        expect(lHasValue).toBeTruthy();
    });

    it('Functionality: Copy', () => {
        // Setup.
        const lValue1: string = 'Value1';
        const lValue2: string = 'Value2';

        const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
        lDictionary.set('Key1', lValue1);
        lDictionary.set('Key2', lValue2);

        // Process.
        const lCopiedDictionary: Dictionary<string, string> = new Dictionary<string, string>(lDictionary);

        // Evaluation.
        expect(lCopiedDictionary.get('Key1')).toBe(lDictionary.get('Key1'));
        expect(lCopiedDictionary.get('Key2')).toBe(lDictionary.get('Key2'));
    });

    it('Functionality: Clone', () => {
        // Setup.
        const lDictionary: Dictionary<string, string> = new Dictionary<string, string>();
        lDictionary.set('Key1', 'Value1');
        lDictionary.set('Key2', 'Value2');

        // Process.
        const lClonedDictionary: Dictionary<string, string> = lDictionary.clone();

        // Evaluation.
        expect(lClonedDictionary.get('Key1')).toBe(lDictionary.get('Key1'));
        expect(lClonedDictionary.get('Key2')).toBe(lDictionary.get('Key2'));
    });
});