import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { PgslStruct } from '../commands/type/pgsl-struct';

/**
 * Line by line interpreter.
 */
export class PgslInterpreter {
    private mCurrentObject: PgslObject | null;

    public constructor(pSource: string) {

    }

    private convertBlock(pSource: string): PgslBlock {
        // Convert document into lines.
        const lLineList: Array<PgslCodePart> = pSource.split(/\n\|r/)
            .map<PgslCodePart>((pLine: string, pLineNumber: number) => { return { line: pLineNumber, content: pLine, column: 0 }; })
            .filter((pLine: PgslCodePart) => { return pLine.content.trim() !== ''; });


        const lBlockSplitRegex: RegExp = /{|}|[^{}]+/g;

        // Loop blocks.
        let result;
        while ((result = reg.exec(targetText)) !== null) {
            doSomethingWith(result);
        }


        for (const lBlockMatch of pSource.matchAll(lBlockSplitRegex)) {
            const lLine: number = lBlockMatch.index;
        }

    }
}

type PgslObject = PgslStruct;

type PgslBlock = {
    line: number;
    column: number;
    content: Array<PgslLine | PgslBlock>;
};
type PgslCodePart = {
    line: number;
    column: number;
    content: string;
};