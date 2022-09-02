#! /usr/bin/env node

import * as path from 'path';
import { BuildCommand } from './commands/build-command';
import { PackageCommand } from './commands/package-command';
import { Console } from './helper/console';
import { Parameter } from './helper/parameter';
import { Workspace } from './helper/workspace';



(async () => {
    const lConsole: Console = new Console();
    const lParameter: Parameter = new Parameter();
    const lWorkspace: Workspace = new Workspace(process.cwd());

    // Wrap error.
    try {
        // Get paths.
        const lCliRootPath: string = path.resolve(__dirname, '..', '..'); // Called from /library/source

        // Output main banner.
        lConsole.banner('------ KG CLI ------');

        // Execute functions based on path.
        if (lParameter.isPath('create *')) {
            const lBlueprintType: string = lParameter.getPath(1);
            await new PackageCommand(lCliRootPath, lWorkspace.root).create(lBlueprintType);
        } else if (lParameter.isPath('sync')) {
            await new PackageCommand(lCliRootPath, lWorkspace.root).sync();
        } else if (lParameter.isPath('build *')) {
            const lPackageName: string = lParameter.getPath(1);
            await new BuildCommand(lCliRootPath, lWorkspace.root).build(lPackageName);
        } else if (lParameter.isPath('test *')) {
            const lPackageName: string = lParameter.getPath(1);
            const lOptionList: Array<string> = lParameter.getPathRange(2, 4).map(pItem => pItem.substring(2));
            await new BuildCommand(lCliRootPath, lWorkspace.root).test(lPackageName, lOptionList);
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