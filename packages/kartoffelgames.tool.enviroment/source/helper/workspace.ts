import * as path from 'path';
import { FileUtil } from './file-util';
import { WorkspacePath } from './workspace-path';

export class Workspace {
    public static readonly PACKAGE_SETTING_KEY: string = 'kg.options';

    private readonly mRootPath: string;

    /**
     * Get workspace root path. 
     */
    public get root(): string {
        return this.mRootPath;
    }

    /**
     * Constructor.
     * @param pCurrentPath - Project root path.
     */
    public constructor(pCurrentPath: string) {
        this.mRootPath = this.getWorkspaceRootPath(pCurrentPath);
    }

    /**
     * Add packages as vs code workspace to workspace settings.
     * @param pWorkspaceName - Name of workspace. 
     * @param pWorkspaceFolder - Folder name of workspace.
     */
    public createVsWorkspace(pWorkspaceName: string): void {
        const lWorkspaceFilePath: string = path.resolve(this.mRootPath, WorkspacePath.WorkspaceFile);
        const lWorkspaceFolder: string = pWorkspaceName.toLowerCase();

        // Read workspace file json.
        const lFileText = FileUtil.read(lWorkspaceFilePath);
        const lPackageJson = JSON.parse(lFileText);

        // Add new folder to folder list.
        const lFolderList: Array<{ name: string, path: string; }> = lPackageJson['folders'];
        lFolderList.push({
            name: pWorkspaceName,
            path: `./packages/${lWorkspaceFolder}`
        });

        // Sort folder alphabeticaly.
        lFolderList.sort((pFirst, pSecond) => {
            if (pFirst.name < pSecond.name) { return -1; }
            if (pFirst.name > pSecond.name) { return 1; }
            return 0;
        });

        // Update workspace file.
        const lPackageJsonText = JSON.stringify(lPackageJson, null, 4);
        FileUtil.write(lWorkspaceFilePath, lPackageJsonText);
    }

    /**
     * Get package name.
     * @param pName - Package name of project name.
     */
    public getPackageName(pName: string): string {
        const lPackageRegex: RegExp = /^@[a-zA-Z0-9]+\/[a-zA-Z0-9.-]+$/;

        // Check if name is already the package name.
        if (lPackageRegex.test(pName)) {
            return pName.toLowerCase();
        }

        const lPartList: Array<string> = pName.split('.');

        // Try to parse name.
        let lPackageName: string = `@${lPartList[0]}/${lPartList.slice(1).join('.')}`;
        lPackageName = lPackageName.replace(/_/g, '-');
        lPackageName = lPackageName.toLowerCase();

        // Validate parsed name.
        if (!lPackageRegex.test(lPackageName)) {
            throw `Project name "${pName}" cant be parsed to a package name.`;
        }

        return lPackageName;
    }

    /**
     * Read project configuration.
     * @param pName - Project name.
     */
    public getProjectConfiguration(pName: string): WorkspaceConfiguration {
        // Construct paths.
        const lProjectPath: string = this.getProjectDirectory(pName);
        const lPackageJsonPath: string = path.resolve(lProjectPath, 'package.json');

        // Read and parse package.json
        const lFile: string = FileUtil.read(lPackageJsonPath);
        const lJson: any = JSON.parse(lFile);

        // Read project config.
        const lConfiguration: WorkspaceConfiguration = lJson[Workspace.PACKAGE_SETTING_KEY];

        // Fill config defaults.
        return {
            blueprint: lConfiguration.blueprint ?? '',
            pack: lConfiguration.pack ?? false
        };
    }

    /**
     * Get project directory.
     * @param pName - Package name.
     */
    public getProjectDirectory(pName: string): string {
        const lPackageName: string = this.getPackageName(pName);

        // Get all package.json files.
        const lPackageFileList = FileUtil.findFiles(path.resolve(this.mRootPath, WorkspacePath.PackageDirectory), 'package.json', 1);

        // Read files and convert json.
        for (const lPackageFile of lPackageFileList) {
            const lFileText = FileUtil.read(lPackageFile);
            const lFileJson = JSON.parse(lFileText);

            // Check dublicate project name and package name.
            if (lFileJson['name'].toLowerCase() === lPackageName.toLowerCase()) {
                return path.dirname(lPackageFile);
            }
        }

        throw 'Package does not exist.';
    }

    /**
     * Check if package exists.
     * @param pPackageName - Package name.
     */
    public projectExists(pPackageName: string): boolean {
        const lPackageName: string = this.getPackageName(pPackageName);

        // Get all package.json files.
        const lPackageFileList = FileUtil.findFiles(path.resolve(this.mRootPath, WorkspacePath.PackageDirectory), 'package.json', 1);

        // Read files and convert json.
        for (const lPackageFile of lPackageFileList) {
            const lFileText = FileUtil.read(lPackageFile);
            const lFileJson = JSON.parse(lFileText);

            // Check dublicate project name and package name.
            if (lFileJson['name'].toLowerCase() === lPackageName.toLowerCase()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Find workspace root path.
     * @param pCurrentPath - Current path.
     */
    private getWorkspaceRootPath(pCurrentPath: string): string {
        const lAllFiles: Array<string> = FileUtil.findFilesReverse(pCurrentPath, 'package.json');

        for (const lFile of lAllFiles) {
            const lFileContent: string = FileUtil.read(lFile);
            const lFileJson: any = JSON.parse(lFileContent);

            if (lFileJson['kg.root'] || lFileJson['kg']?.['root']) {
                return path.dirname(lFile);
            }
        }

        return pCurrentPath;
    }
}

export type WorkspaceConfiguration = {
    blueprint: string;
    pack: boolean;
};