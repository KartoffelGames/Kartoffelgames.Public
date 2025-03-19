/**
 * Code parser exceptions that aborts the parsing process.
 * Can be used in coverter functions to abort the parsing process.
 * Other exceptions do not abort the parsing process.
 */
export class CodeParserException extends Error {
    /**
     * Constructor.
     * 
     * @param pErrorMessage - Error message.
     */
    public constructor(pMessage: string) {
        super(pMessage);
    }
}
