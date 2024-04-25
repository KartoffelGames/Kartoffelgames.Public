import { expect } from 'chai';
import { DecorationReplacementHistory } from '../../source/decoration-history/decoration-history';
import { InjectionConstructor } from '../../source/type';

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
        expect(lRootConstructor).to.equal(TestLayer1);
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
        expect(lRootConstructor).to.equal(TestLayer1);
    });
});