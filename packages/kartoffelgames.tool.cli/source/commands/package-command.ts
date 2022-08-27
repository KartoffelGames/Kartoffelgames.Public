// Load dependencies.
import * as path from 'node:path';
import { Console } from '../helper/console.js';
import { FileUtil } from '../helper/file-util.js';
import { WorkspacePath } from '../helper/workspace-path.js';
import { Workspace } from '../helper/workspace.js';

export class PackageCommand {
    private static readonly PACKAGE_SETTING_KEY: string = 'kg.options';

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
     * Create project based on blueprint.
     * @param pBlueprintType - Blueprint type.
     */
    public async create(pBlueprintType: string): Promise<void> {
        const lConsole = new Console();
        const lBlueprintPath = path.resolve(this.mCliRootPath, 'blueprints', pBlueprintType.toLowerCase());

        // Output heading.
        lConsole.writeLine('// Create Project');

        // Check correct blueprint.
        if (!FileUtil.exists(lBlueprintPath)) {
            throw `Blueprint "${pBlueprintType}" does not exist.`;
        }

        // Needed questions.
        const lProjectName = await lConsole.promt('Project Name: ', /^[a-zA-Z]+\.[a-zA-Z_.]+$/);
        const lPackageName = this.mWorkspaceHelper.getPackageName(lProjectName);
        const lProjectFolder = lProjectName.toLowerCase();

        // Create new package path. 
        const lPackagePath = path.resolve(this.mWorkspaceRootPath, WorkspacePath.PackageDirectory, lProjectFolder);
        const lPackageJsonPath = path.resolve(lPackagePath, 'package.json');

        // Get all package.json files.
        if (this.mWorkspaceHelper.packageExists(lPackageName)) {
            throw 'Package already exists.';
        }

        lConsole.writeLine('');
        lConsole.writeLine('Create project...');

        // Check if project directory already exists.
        if (FileUtil.exists(lPackagePath)) {
            throw 'Project directory already exists.';
        } else {
            // Create package folder.
            FileUtil.createDirectory(lPackagePath);
        }

        // Copy all files from blueprint folder.
        const lReplacementMap: Map<RegExp, string> = new Map<RegExp, string>();
        lReplacementMap.set(/{{PROJECT_NAME}}/g, lProjectName);
        lReplacementMap.set(/{{PACKAGE_NAME}}/g, lPackageName);
        lReplacementMap.set(/{{PROJECT_FOLDER}}/g, lProjectFolder);
        FileUtil.copyDirectory(lBlueprintPath, lPackagePath, false, lReplacementMap);

        // Add package to workspace.
        this.mWorkspaceHelper.createVsWorkspace(lProjectName);

        // Update package.json custom settings.
        const lCustomSettings = {
            blueprint: pBlueprintType.toLowerCase()
        };
        const lPackageJsonContent: string = FileUtil.read(lPackageJsonPath);
        const lPackageJsonJson: any = JSON.parse(lPackageJsonContent);
        lPackageJsonJson[PackageCommand.PACKAGE_SETTING_KEY] = lCustomSettings;
        FileUtil.write(lPackageJsonPath, JSON.stringify(lPackageJsonJson, null, 4));

        // Display init information.
        lConsole.writeLine('Project successfull created.');
        lConsole.writeLine(`Call "npm install" to initialize this project`);
    }

    /**
     * Sync all local dependency verions.
     */
    public async sync(): Promise<void> {
        // Get all package.json files.
        const lPackageFolderPath = path.resolve(this.mWorkspaceRootPath, WorkspacePath.PackageDirectory);
        const lPackageFileList = FileUtil.getAllFilesOfName(lPackageFolderPath, 'package.json', 1);

        // Map each package.json with its path.
        const lPackageInformations: Map<string, PackageChangeInformation> = new Map<string, PackageChangeInformation>();
        for (const lPackageFilePath of lPackageFileList) {
            const lFileText = FileUtil.read(lPackageFilePath);
            const lPackageJson = JSON.parse(lFileText);

            // Map package information.
            lPackageInformations.set(lPackageJson['name'], {
                name: lPackageJson['name'],
                path: path.dirname(lPackageFilePath),
                json: lPackageJson,
                changed: false
            });
        }

        // Replace local dependencies.
        for (const lPackageInformation of lPackageInformations.values()) {
            const lPackageJson = lPackageInformation.json;

            // Devlopment and productive dependencies.
            const lDependencyTypeList = ['devDependencies', 'dependencies'];
            for (const lDependencyType of lDependencyTypeList) {
                // Replace dependencies.
                if (lDependencyType in lPackageJson) {
                    for (const lDependencyName in lPackageJson[lDependencyType]) {
                        // On local package exists.
                        if (lDependencyName in lPackageInformations) {
                            const lOldDependency = lPackageJson[lDependencyType][lDependencyName];
                            const lNewDependency = `^${(<PackageChangeInformation>lPackageInformations.get(lDependencyName)).json['version']}`;

                            // Check for possible changes before applying.
                            if (lNewDependency !== null && lNewDependency !== lOldDependency) {
                                lPackageJson[lDependencyType][lDependencyName] = lNewDependency;
                                lPackageInformation['changed'] = true;
                            }
                        }
                    }
                }
            }
        }

        // Replace json files with altered jsons.
        for (const lPackageInformation of lPackageInformations.values()) {
            if (lPackageInformation.changed) {
                const lPackageJsonText = JSON.stringify(lPackageInformation.json, null, 4);
                const lPackageFilePath = path.resolve(lPackageInformation.path, 'package.json');

                // Write altered data to package.json.
                FileUtil.write(lPackageFilePath, lPackageJsonText);
            }
        }
    }
}

type PackageChangeInformation = {
    name: string;
    path: string;
    json: any;
    changed: boolean;
};