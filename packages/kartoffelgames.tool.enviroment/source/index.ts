#! /usr/bin/env node

import * as path from 'path';
import { BuildCommand } from './commands/build-command';
import { PackageCommand } from './commands/package-command';
import { Console } from './helper/console';
import { FileUtil } from './helper/file-util';
import { Parameter } from './helper/parameter';

const gGetWorkspaceRootPath = (pCurrentPath: string) => {
    const lAllFiles: Array<string> = FileUtil.getAllFilesBackwards(pCurrentPath, 'package.json');

    for (const lFile of lAllFiles) {
        const lFileContent: string = FileUtil.read(lFile);
        const lFileJson: any = JSON.parse(lFileContent);

        if (lFileJson['kg.root'] || lFileJson['kg']?.['root']) {
            return path.dirname(lFile);
        }
    }

    return pCurrentPath;
};

(async () => {
    const lConsole: Console = new Console();
    const lParameter: Parameter = new Parameter();

    // Wrap error.
    try {
        // Get paths.
        const lCliRootPath: string = path.resolve(__dirname, '..', '..'); // Called from /library/source
        const lWorkspaceRootPath: string = gGetWorkspaceRootPath(process.cwd());

        // Output main banner.
        lConsole.banner('------ KG CLI ------');

        // Execute functions based on path.
        if (lParameter.isPath('create *')) {
            const lBlueprintType: string = lParameter.getPath(1);
            await new PackageCommand(lCliRootPath, lWorkspaceRootPath).create(lBlueprintType);
        } else if (lParameter.isPath('sync')) {
            await new PackageCommand(lCliRootPath, lWorkspaceRootPath).sync();
        } else if (lParameter.isPath('build *')) {
            const lPackageName: string = lParameter.getPath(1);
            await new BuildCommand(lCliRootPath, lWorkspaceRootPath).build(lPackageName);
        } else if (lParameter.isPath('test *')) {
            const lPackageName: string = lParameter.getPath(1);
            const lOptionList: Array<string> = lParameter.getPathRange(2, 4).map(pItem => pItem.substring(2));
            await new BuildCommand(lCliRootPath, lWorkspaceRootPath).test(lPackageName, lOptionList);
        } else if (lParameter.isPath('help')) {
            // List all commands.
            lConsole.writeLine('Available commands:');
            lConsole.writeLine('    kg help                                                - This');
            lConsole.writeLine('    kg create <blueprint name>                             - Create new project');
            lConsole.writeLine('    kg sync                                                - Sync all local dependency verions');
            lConsole.writeLine('    kg build <project name>                                - Build project');
            lConsole.writeLine('    kg test <project name> [--coverage] [-- no-timeout]    - Build project');
        } else {
            throw `Command not found.`;
        }
    } catch (e) {
        lConsole.writeLine((<any>e).toString(), 'red');
    }

    process.exit(0);
})();