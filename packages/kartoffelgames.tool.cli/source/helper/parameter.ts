export class Parameter {
    private readonly mParameters: Map<string, CommandParameter>;
    private readonly mPath: Array<string>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mParameters = new Map<string, CommandParameter>();
        this.mPath = new Array<string>();

        // Read parameter.
        process.argv.forEach((pValue: string, pIndex: number) => {
            const lParameterRegex = /^([^=]+)=(.+)$/g;

            // Check if value is a parameter. 
            if (lParameterRegex.test(pValue)) {
                // Find all parameter.
                const lMatch: RegExpExecArray = <RegExpExecArray>lParameterRegex.exec(pValue);

                // Get parameter value. Remove start and end quotation mark.
                let lParameterValue: string = lMatch[2]; // Second group.
                if (lParameterValue.startsWith('"')) {
                    lParameterValue = lParameterValue.substring(1, lParameterValue.length - 1);
                }

                // Create parameter.
                const lParameter: CommandParameter = {
                    name: lMatch[1], // First group.
                    value: lParameterValue,
                };

                // Register parameter.
                this.mParameters.set(lParameter.name, lParameter);
            }

            // Add value to path. Ignore the two first values. [node.exe, jsPath]
            if (pIndex > 1) {
                this.mPath.push(pValue);
            }
        });
    }

    /**
     * Get parameter value.
     * @param pName - Parameter name.
     */
    public getParameter(pName: string): string {
        return this.mParameters.get(pName)?.value ?? '';
    }

    /**
     * Get path part by index.
     * @param pIndex - Path part index.
     */
    public getPath(pIndex: number): string {
        return this.mPath[pIndex] ?? '';
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
            const lPath: string | undefined = this.mPath[lIndex]?.toLowerCase() ?? '';

            if (lPattern === '*' && lPath) {
                continue;
            } else if (lPattern === lPath) {
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
    value: string;
};