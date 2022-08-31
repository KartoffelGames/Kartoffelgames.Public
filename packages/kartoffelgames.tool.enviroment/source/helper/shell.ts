import { spawn } from 'child_process';
import { Console } from './console';

export class Shell {
    private readonly mWorkingDirectory: string;

    /**
     * Constructor.
     * @param pWorkingDirectory - Shell working directory.
     */
    public constructor(pWorkingDirectory: string) {
        this.mWorkingDirectory = pWorkingDirectory;
    }

    /**
     * Execute command.
     * @param pCommand - Command.
     */
    public async call(pCommand: string): Promise<void> {
        const lConsole: Console = new Console();

        // Split command into parts.
        const lCommandPartRegex: RegExp = /"[^"\s]*"|[^\s]+/g;
        const lCommandPartList: Array<string> = [...pCommand.matchAll(lCommandPartRegex)].map(pMatch => {
            const lCommandPart: string = pMatch[0];

            // Remove "" from command.
            if (lCommandPart.startsWith('"') && lCommandPart.endsWith('"')) {
                return lCommandPart.slice(1, lCommandPart.length - 1);
            } else {
                return lCommandPart;
            }
        });

        // Call command.
        const lChildProcess = spawn(lCommandPartList[0], lCommandPartList.slice(1), { cwd: this.mWorkingDirectory });

        // Rewrite output
        lChildProcess.stdout.on('data', (pData) => {
            lConsole.write(pData);
        });
        lChildProcess.stderr.on('data', (pData) => {
            lConsole.write(pData);
        });

        // Wait for process to finish.
        return new Promise<void>((pResolve, pReject) => {
            lChildProcess.on('close', (pCode) => {
                if (pCode === 0) {
                    pResolve();
                } else {
                    pReject('Error executing command: ' + lCommandPartList.join(' '));
                }
            });
        });
    }
}