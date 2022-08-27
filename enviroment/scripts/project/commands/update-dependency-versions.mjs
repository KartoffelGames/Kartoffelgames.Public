// Toggle between local and git dependencies for all packages located in this repository.
// Get remote from git information and branch from current activated branch.

// Check everything is local. :: Boolan
// Check everything is remote. :: Boolean
// Toggle everything to local.
// Toggle everything to remote.

// Load dependencies.
import * as path from 'path';
import * as filereader from 'fs';
import { Out } from '../helper/out.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(
    import.meta.url));
// Global paths.
const gPackageFolderPath = path.resolve(__dirname, '../../../../packages');

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
 * Change all local dependencies to callbacks return value.
 * @param pCallback - Callback(ThisPackageInformation, ReplacementpackageInformation) => string.
 */
const gChangeLocalDependenciesTo = (pCallback) => {
    // Get all package.json files.
    const lPackageFileList = gGetAllFilesOfName(gPackageFolderPath, 'package.json', 1);

    // Map each package.json with its path.
    const lPackageInformations = {}; // PackageName : {path, json, changed}
    for (const lPackageFilePath of lPackageFileList) {
        const lFileText = filereader.readFileSync(lPackageFilePath, { encoding: 'utf8' });
        const lPackageJson = JSON.parse(lFileText);

        // Map package information.
        lPackageInformations[lPackageJson['name']] = {
            path: path.dirname(lPackageFilePath),
            json: lPackageJson,
            changed: false
        };
    }

    // Replace local dependencies.
    for (const lLocalPathName in lPackageInformations) {
        const lPackageInformation = lPackageInformations[lLocalPathName];
        const lPackageJson = lPackageInformation['json'];

        // Devlopment and productive dependencies.
        const lDependencyTypeList = ['devDependencies', 'dependencies'];
        for (const lDependencyType of lDependencyTypeList) {
            // Replace dependencies.
            if (lDependencyType in lPackageJson) {
                for (const lDependencyName in lPackageJson[lDependencyType]) {
                    // On local package exists.
                    if (lDependencyName in lPackageInformations) {
                        const lOldDependency = lPackageJson[lDependencyType][lDependencyName];
                        const lNewDependency = pCallback(lPackageInformation, lPackageInformations[lDependencyName]);

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
    for (const lLocalPathName in lPackageInformations) {
        const lPackageInformation = lPackageInformations[lLocalPathName];
        if (lPackageInformation['changed']) {
            const lPackageJsonText = JSON.stringify(lPackageInformation['json'], null, 4);
            const lPackageFilePath = path.resolve(lPackageInformation['path'], 'package.json');;

            // Write altered data to package.json.
            filereader.writeFileSync(lPackageFilePath, lPackageJsonText, { encoding: 'utf8' });
        }
    }
};

/**
 * Toggle all local available dependencies to remote files.
 */
const gUpdateDependencyVersions = () => {
    const lOut = new Out();

    lOut.writeLine('////-----------------////');
    lOut.writeLine('//// Update Versions ////');
    lOut.writeLine('////-----------------////');

    gChangeLocalDependenciesTo((_pThispackageInformation, pReplacementPackageInformation) => {
        return `^${pReplacementPackageInformation['json']['version']}`;
    });
    lOut.writeLine('Versions updated.');

};

// Export.
export const updateDependencyVersions = gUpdateDependencyVersions;