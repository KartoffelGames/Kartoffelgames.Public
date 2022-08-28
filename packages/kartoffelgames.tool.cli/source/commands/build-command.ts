import * as path from 'node:path';
import { Console } from '../helper/console.js';
import { FileUtil } from '../helper/file-util.js';
import { Shell } from '../helper/shell.js';
import { Workspace } from '../helper/workspace.js';


export class BuildCommand {
    private readonly mCliRootPath: string;
    private readonly mWorkspaceHelper: Workspace;
    private readonly mWorkspaceRootPath: string;

    /**
     * Constructor.
     * @param pCliRootPath - Cli project root.
     * @param pWorkspaceRootPath - Workspace root path.
     */
    public constructor(pCliRootPath: string, pWorkspaceRootPath: string) {
        this.mCliRootPath = path.resolve(pCliRootPath);
        this.mWorkspaceRootPath = path.resolve(pWorkspaceRootPath);
        this.mWorkspaceHelper = new Workspace(pWorkspaceRootPath);
    }

    /**
     * Build package depending on package kg.configuration.
     * @param pPackageName - Package name.
     */
    public async build(pPackageName: string): Promise<void> {
        const lConsole = new Console();

        // Construct paths.
        const lPackagePath: string = this.mWorkspaceHelper.getProjectDirectory(pPackageName);
        const lWebpackConfig: string = path.resolve(this.mCliRootPath, 'configuration', 'webpack.config.js');

        // TODO: Read package configuration.

        // Clear output.
        await this.clear(pPackageName);

        // Create shell command executor.
        const lShell: Shell = new Shell(lPackagePath);

        // Run tsc.
        lConsole.writeLine('Build typescript');
        lShell.call('npx tsc --project tsconfig.json --noemit false');
    }

    /**
     * Clear package library.
     * @param pPackageName - Package name.
     */
    public async clear(pPackageName: string): Promise<void> {
        const lConsole = new Console();

        // Output heading.
        lConsole.writeLine('Clear build output...');

        // Construct paths.
        const lPackagePath: string = this.mWorkspaceHelper.getProjectDirectory(pPackageName);
        const lPackageLibraryPath: string = path.resolve(lPackagePath, 'library');

        // Force delete directory.
        FileUtil.deleteDirectory(lPackageLibraryPath);

        // Success message.
        lConsole.writeLine('Clear successful');
    }
}