export class Parameter {
    private readonly mFullPath: Array<string>;
    private readonly mParameters: Map<string, CommandParameter>;
    private readonly mPath: Array<string>;

    /**
     * Get full path.
     */
    public get fullPath(): Array<string> {
        return this.mFullPath;
    }

    /**
     * Get parameters.
     */
    public get parameter(): Map<string, CommandParameter> {
        return this.mParameters;
    }

    /**
     * Get path.
     */
    public get path(): Array<string> {
        return this.mPath;
    }

    /**
     * Constructor.
     * @param pStartingCommand - Starting command path part. Part of a command that initializes the real command start.
     */
    public constructor(pStartingCommand: string) {
        this.mParameters = new Map<string, CommandParameter>();
        this.mPath = new Array<string>();
        this.mFullPath = new Array<string>();

        const lParameterName: RegExp = /^--(.+)$/;

        // Next parameter buffer.
        let lNextParameterIsValue: boolean = false;
        let lNextParameterName: string = '';

        // Read parameter.
        let lCommandStarted: boolean = false;
        let lCommandParameterStarted: boolean = false;
        process.argv.forEach((pValue: string) => {
            // Process command only when starting command has reached.
            if (!lCommandStarted) {
                // Check if path started.
                if (pValue.toLowerCase().includes(pStartingCommand.toLowerCase())) {
                    lCommandStarted = true;
                } else {
                    return;
                }
            } else {
                if (lParameterName.test(pValue)) {
                    // Set area as parameter started.
                    lCommandParameterStarted = true;

                    // Process as parameter name.
                    const lParameterNameMatch = <RegExpExecArray>lParameterName.exec(pValue);
                    lNextParameterName = lParameterNameMatch[1]; // First group. Name without "--"
                    lNextParameterIsValue = true;

                    // Set empty parameter.
                    this.mParameters.set(lNextParameterName, {
                        name: lNextParameterName,
                        value: null
                    });
                } else if (lNextParameterIsValue) {
                    // Process parameter value.
                    (<CommandParameter>this.mParameters.get(lNextParameterName)).value = pValue;

                    // Reset parameter flags.
                    lNextParameterIsValue = false;
                    lNextParameterName = '';
                } else if (!lCommandParameterStarted) {
                    // Process as path.
                    this.mPath.push(pValue);
                } else {
                    throw 'Wrong command syntax';
                }

                // Add value to full path.
                this.mFullPath.push(pValue);
            }
        });
    }

    /**
     * Check if parameter are on path.
     * Pattern is case insensitive.
     * Widcards are set with "*".
     * 
     * Exmpl: "create element *"
     * @param pPathPattern - Pattern.
     */
    public isPath(pPathPattern: string): boolean {
        const lPatternList: Array<string> = pPathPattern.split(' ');

        for (let lIndex: number = 0; lIndex < lPatternList.length; lIndex++) {
            const lPattern: string = <string>lPatternList[lIndex].toLowerCase();
            const lPath: string = <string>this.mFullPath[lIndex].toLowerCase();

            if (lPattern === '*' || lPattern === lPath) {
                continue;
            } else {
                return false;
            }
        }

        return true;
    }
}

type CommandParameter = {
    name: string;
    value: string | null;
};