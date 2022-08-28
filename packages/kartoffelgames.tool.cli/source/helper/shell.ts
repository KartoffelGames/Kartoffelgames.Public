import { execSync, SpawnSyncReturns } from 'child_process';
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

        // Execute command.
        try {
            const lCommandResult = execSync(pCommand, { cwd: this.mWorkingDirectory });
            lConsole.writeLine(lCommandResult.toString());
        } catch (e) {
            const lErrorBuffer: SpawnSyncReturns<Buffer> = <any>e;

            // Get execution error result.
            const lError: string = lErrorBuffer.stderr.toString();
            const lResult: string = lErrorBuffer.stdout.toString();

            // Output error result
            lConsole.writeLine(lResult);

            // Throw error.
            throw lError;
        }
    }
}