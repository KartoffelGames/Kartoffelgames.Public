import * as path from 'path';
import { Console } from '../helper/console.js';
import { FileUtil } from '../helper/file-util.js';
import { Shell } from '../helper/shell.js';
import { Workspace, WorkspaceConfiguration } from '../helper/workspace.js';


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
        const lPackageSourcePath: string = path.resolve(lPackagePath, 'source');
        const lPackageLibrarySourcePath: string = path.resolve(lPackagePath, 'library', 'source');
        const lWebpackConfigPath: string = path.resolve(this.mCliRootPath, 'enviroment', 'configuration', 'webpack.config.js');

        // Read package configuration.
        const lConfiguration: WorkspaceConfiguration = this.mWorkspaceHelper.getProjectConfiguration(pPackageName);

        // Clear output.
        await this.clear(pPackageName);

        // Create shell command executor.
        const lShell: Shell = new Shell(lPackagePath);

        // Load command from local node-modules.
        const lTypescriptCli: string = require.resolve('typescript/lib/tsc.js');
        const lWebpackCli: string = require.resolve('webpack-cli/bin/cli.js');

        // Run tsc.
        lConsole.writeLine('Build typescript');
        lShell.call(`node ${lTypescriptCli} --project tsconfig.json --noemit false`);
        lConsole.clearLines(1); // Empty typescript file.

        // Copy external files.
        lConsole.writeLine('Copy external files');
        FileUtil.copyDirectory(lPackageSourcePath, lPackageLibrarySourcePath, true, new Map<RegExp, string>(), ['.ts']);

        // Build typescript when configurated.
        if (lConfiguration.pack) {
            lConsole.writeLine('Build Webpack');
            const lWebpackCommand: string = `node ${lWebpackCli} --config ${lWebpackConfigPath} --env=buildType=release`;
            lShell.call(lWebpackCommand);
        }
    }

    /**
     * Clear package library.
     * @param pPackageName - Package name.
     */
    public async clear(pPackageName: string): Promise<void> {
        const lConsole = new Console();

        // Output heading.
        lConsole.writeLine('Clear build output');

        // Construct paths.
        const lPackagePath: string = this.mWorkspaceHelper.getProjectDirectory(pPackageName);
        const lPackageLibraryPath: string = path.resolve(lPackagePath, 'library');

        // Force delete directory.
        FileUtil.deleteDirectory(lPackageLibraryPath);
    }
}