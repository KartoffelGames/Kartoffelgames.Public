import { expect } from 'chai';
import { ParserException } from '../../source/exception/parser-exception';

describe('ParserException', () => {
    it('Method: columnEnd', () => {
        // Process.
        const lValue: number = 5505;
        const lError: ParserException<null> = new ParserException('Message', null, 11, 22, lValue, 44);

        // Process.
        const lColumnEnd: number = lError.columnEnd;

        // Evaluation.
        expect(lColumnEnd).to.equal(lValue);
    });

    it('Method: columnStart', () => {
        // Process.
        const lValue: number = 5505;
        const lError: ParserException<null> = new ParserException('Message', null, lValue, 22, 33, 44);

        // Process.
        const lColumnStart: number = lError.columnStart;

        // Evaluation.
        expect(lColumnStart).to.equal(lValue);
    });

    it('Method: lineEnd', () => {
        // Process.
        const lValue: number = 5505;
        const lError: ParserException<null> = new ParserException('Message', null, 11, 22, 33, lValue);

        // Process.
        const lLineEnd: number = lError.lineEnd;

        // Evaluation.
        expect(lLineEnd).to.equal(lValue);
    });

    it('Method: lineStart', () => {
        // Process.
        const lValue: number = 5505;
        const lError: ParserException<null> = new ParserException('Message', null, 11, lValue, 33, 44);

        // Process.
        const lLineStart: number = lError.lineStart;

        // Evaluation.
        expect(lLineStart).to.equal(lValue);
    });
});