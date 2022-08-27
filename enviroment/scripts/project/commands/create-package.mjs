// Load dependencies.
import * as path from 'node:path';
import * as filereader from 'node:fs';
import * as readline from 'node:readline';
import { Out } from '../helper/out.mjs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(
    import.meta.url));

/**
 * Copy directory with all files into destination
 * and replace text in files.
 * @param pSource - The path to the thing to copy.
 * @param pDestination - The path to the new copy.
 */
const gCopyDirectory = (pSource, pDestination, pOverride, pReplacementMap) => {
    const lSourceItem = path.resolve(pSource);
    const lDestinationItem = path.resolve(pDestination);

    let lSourceExists = filereader.existsSync(lSourceItem);
    let lDestinationExists = filereader.existsSync(lDestinationItem);
    let lFileStatus = lSourceExists && filereader.statSync(lSourceItem);
    let lSourceIsDirectory = lSourceExists && lFileStatus.isDirectory();

    if (lSourceIsDirectory) {
        // Create destination directory.
        if (!lDestinationExists) {
            filereader.mkdirSync(lDestinationItem);
        }

        // Copy each item into new directory.
        for (const lChildItemName of filereader.readdirSync(lSourceItem)) {
            gCopyDirectory(path.join(lSourceItem, lChildItemName), path.join(lDestinationItem, lChildItemName), pOverride, pReplacementMap);
        }
    } else if (!lDestinationExists || pOverride) {
        filereader.copyFileSync(lSourceItem, lDestinationItem);

        // Read file text.
        const lFileText = filereader.readFileSync(lDestinationItem, { encoding: 'utf8' });

        // Replace each replacement pattern.
        let lAlteredFileText = lFileText;
        for (const lReplacement in pReplacementMap) {
            const lReplacementRegex = pReplacementMap[lReplacement];
            lAlteredFileText = lAlteredFileText.replace(lReplacementRegex, lReplacement);
        }

        // Update file with altered file text.
        filereader.writeFileSync(lDestinationItem, lAlteredFileText, { encoding: 'utf8' });
    }
};

/**
 * Get all file paths of given file name.
 * @param pStartDestination - Starting destination of search.
 * @param pFileName - File name that should be searched.
 * @param pSearchDepth - How deep should be searched.
 */
const gGetAllFilesOfName = (pStartDestination, pFileName, pSearchDepth) => {
    const lAbsoulteStartDestination = path.resolve(pStartDestination);

    // Check start directory existence.
    if (!filereader.existsSync(lAbsoulteStartDestination)) {
        throw `"${lAbsoulteStartDestination}" does not exists.`;
    }

    // Check if start directory is a directory.
    let lDirectoryStatus = filereader.statSync(lAbsoulteStartDestination);
    if (!lDirectoryStatus.isDirectory()) {
        throw `"${lAbsoulteStartDestination}" is not a directory.`;
    }

    const lResultPathList = new Array();

    // Check every file.
    // Copy each item into new directory.
    for (const lChildItemName of filereader.readdirSync(pStartDestination)) {
        const lItemPath = path.join(lAbsoulteStartDestination, lChildItemName);
        const lItemStatus = filereader.statSync(lItemPath);

        // Check if file or directory. Only search for files in found directory if depth is available.
        // Add item path to results if file name matches seached file name.
        if (lItemStatus.isDirectory() && (pSearchDepth - 1) > -1) {
            // Search for files in  directory.
            lResultPathList.push(...gGetAllFilesOfName(lItemPath, pFileName, pSearchDepth - 1));
        } else if (lChildItemName.toLowerCase() === pFileName.toLowerCase()) {
            lResultPathList.push(lItemPath);
        }
    }

    return lResultPathList;
};

/**
 * Add packages as vs code workspace to workspace settings.
 * @param pWorkspaceFile - Workspace setting file.
 * @param pWorkspaceName - Name of workspace. 
 * @param pWorkspaceFolder - Folder name of workspace.
 */
const gAddVSWorkspace = (pWorkspaceFile, pWorkspaceName, pWorkspaceFolder) => {
    // Read workspace file json.
    const lFileText = filereader.readFileSync(pWorkspaceFile, { encoding: 'utf8' });
    const lPackageJson = JSON.parse(lFileText);

    // Add new folder to folder list.
    const lFolderList = lPackageJson['folders'];
    lFolderList.push({
        'name': pWorkspaceName,
        'path': `./packages/${pWorkspaceFolder}`
    });

    // Sort folder alphabeticaly.
    lFolderList.sort((pFirst, pSecond) => {
        if (pFirst.name < pSecond.name) { return -1; }
        if (pFirst.name > pSecond.name) { return 1; }
        return 0;
    });

    // Update workspace file.
    const lPackageJsonText = JSON.stringify(lPackageJson, null, 4);
    filereader.writeFileSync(pWorkspaceFile, lPackageJsonText, { encoding: 'utf8' });
};


export const createPackage = async() => {
    const lOut = new Out();

    lOut.writeLine('////----------------////');
    lOut.writeLine('//// Create Project ////');
    lOut.writeLine('////----------------////');

    // Needed questions.
    const lProjectName = await lOut.promt('Project Name: ', /^[a-zA-Z\_\.]+$/);
    const lPackageName = await lOut.promt('Package Name: ', /^(@[a-z]+\/)?[a-z\.\-]+$/);
    const lProjectFolder = lProjectName.toLowerCase();

    try {
        // Create paths.
        const lPackagePath = path.resolve(__dirname, '../../../../packages', lProjectFolder);
        const lBlueprintPath = path.resolve(__dirname, '../../../project_blueprint');
        const lPackageFolderPath = path.resolve(__dirname, '../../../../packages');
        const lWorkspaceFile = path.resolve(__dirname, '../../../../kartoffelgames.public.code-workspace');

        // Get all package.json files.
        const lPackageFileList = gGetAllFilesOfName(lPackageFolderPath, 'package.json', 1);

        // Read files and convert json.
        for (const lPackageFile of lPackageFileList) {
            const lFileText = filereader.readFileSync(lPackageFile, { encoding: 'utf8' });
            const lFileJson = JSON.parse(lFileText);

            // Check dublicate project name and package name.
            if (lFileJson['name'].toLowerCase() === lPackageName.toLowerCase()) {
                console.error('Package name already exists.');
                return;
            } else if (lFileJson['projectName'] && lFileJson['projectName'].toLowerCase() === lProjectName.toLowerCase()) {
                console.error('Project name already exists.');
                return;
            }
        }

        lOut.writeLine('');
        lOut.writeLine('Create project');

        // Check if project directory already exists.
        if (filereader.existsSync(lPackagePath)) {
            throw 'Project directory already exists.';
        } else {
            // Create package folder.
            filereader.mkdirSync(lPackagePath);
        }

        // Copy all files from blueprint folder.
        gCopyDirectory(lBlueprintPath, lPackagePath, false, {
            [lProjectName]: /{{PROJECT_NAME}}/g,
            [lPackageName]: /{{PACKAGE_NAME}}/g,
            [lProjectFolder]: /{{PROJECT_FOLDER}}/g,
        });

        // Add package to workspace.
        gAddVSWorkspace(lWorkspaceFile, lProjectName, lProjectFolder);

        lOut.writeLine('Project successfull created.', `Call "npm install -w ${lPackageName}" to initialize this project`);

    } catch (e) {
        console.error(e);
    }
};;