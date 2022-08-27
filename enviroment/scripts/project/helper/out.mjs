import { stdin, stdout } from 'node:process';
import * as readline from 'node:readline';

export class Out {
    mOut;
    mIn;

    constructor() {
        this.mOut = stdout;
        this.mIn = stdin;

        // Exit on cntr+c
        readline.emitKeypressEvents(this.mIn);
        this.mIn.setRawMode(true);
        this.mIn.resume();
        this.mIn.on('keypress', (_chunk, key) => {
            if (key && key.ctrl && key.name === 'c') {
                process.exit();
            }
        });
    }

    /**
     * Output text.
     * @param {string} pText 
     */
    writeLine(pText) {
        this.mOut.write(pText + '\n');
    }

    /**
     * Clear n lines of output.
     * @param {number} count 
     */
    clearLines(count) {
        this.mOut.moveCursor(0, count * -1); // moving two lines up
        this.mOut.cursorTo(0); // then getting cursor at the begining of the line
        this.mOut.clearScreenDown();
    }

    /**
     * Output selection line.
     * @param {string} pTitle 
     * @param {object} pOptionList 
     */
    async selectBox(pTitle, pOptionList) {
        let lSelectedIndex = 0;

        // Set selected value to first option and define draw   
        const lOutPutSelection = (pFirstDraw = false) => {
            // Clear drawn lines.
            if (!pFirstDraw) {
                this.clearLines(pOptionList.length + 1);
            }

            const lSelectedValue = pOptionList[lSelectedIndex].value;

            // Redraw options with highlighted selected.
            this.writeLine(pTitle);
            for (const lOption of pOptionList) {
                this.writeLine((lOption.value === lSelectedValue ? '>' : ' ') + '   ' + lOption.name);
            }
        };

        return new Promise((pResolve) => {
            const lKeyListener = (_chunk, key) => {
                switch (key.name) {
                    case 'up':
                        {
                            lSelectedIndex = Math.min(Math.max(lSelectedIndex - 1, 0), pOptionList.length - 1);
                            lOutPutSelection();
                            break;
                        }
                    case 'down':
                        {
                            lSelectedIndex = Math.min(Math.max(lSelectedIndex + 1, 0), pOptionList.length - 1);
                            lOutPutSelection();
                            break;
                        }
                    case 'return':
                        {
                            this.mIn.off('keypress', lKeyListener);
                            this.mIn.setRawMode(false);
                            pResolve(pOptionList[lSelectedIndex].value);
                            break;
                        }
                }
            };

            // Register key listener.
            this.mIn.on('keypress', lKeyListener);

            lOutPutSelection(true);
        });
    }

    /**
     * Open promt and validate answer.
     * @param pQuestion = Input question. 
     * @param pValidationRegex - Validation for input.
     */
    async promt(pQuestion, pValidationRegex) {
        // Initialize readline.
        const lReadLine = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Async.
        const lAnswer = await new Promise((pResolve) => {
            let lInput = '';

            lReadLine.question(pQuestion, (pAnswer) => {
                lInput = pAnswer;
                lReadLine.close();
            });

            // Resolve promise on input close.
            lReadLine.on("close", () => {
                pResolve(lInput);
            });
        });

        // Validate answer.
        if (pValidationRegex && !pValidationRegex.test(lAnswer)) {
            // Output error message and retry promt.
            this.writeLine(`Answer musst match ${pValidationRegex.toString()}`);
            return await this.promt(pQuestion, pValidationRegex);
        } else {
            return lAnswer;
        }
    };
}