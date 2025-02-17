import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { DecorationReplacementHistory } from '../source/decoration-history/decoration-history.ts';
import { InjectionConstructor } from '../source/type.ts';

describe('DecorationHistory', () => {
    it('Static Method: addHistory', () => {
        // Setup. Create classes.
        class TestLayer1 { }
        class TestLayer2 { }
        class TestLayer3 { }

        // Process. Add history and read hisory.
        DecorationReplacementHistory.add(TestLayer1, TestLayer2);
        DecorationReplacementHistory.add(TestLayer2, TestLayer3);
        const lRootConstructor: InjectionConstructor = DecorationReplacementHistory.getOriginalOf(TestLayer3);

        // Evaluation.
        expect(lRootConstructor).toBe(TestLayer1);
    });

    it('Static Method: getRootOf', () => {
        // Setup. Create classes.
        class TestLayer1 { }
        class TestLayer2 { }
        class TestLayer3 { }

        // Process. Add history and read hisory.
        DecorationReplacementHistory.add(TestLayer1, TestLayer2);
        DecorationReplacementHistory.add(TestLayer2, TestLayer3);
        const lRootConstructor: InjectionConstructor = DecorationReplacementHistory.getOriginalOf(TestLayer3);

        // Evaluation.
        expect(lRootConstructor).toBe(TestLayer1);
    });
});