#! /usr/bin/env node

import * as path from 'node:path';
import { PackageCommand } from './commands/package-command';
import { Console } from './helper/console';
import { Parameter } from './helper/parameter';

(async () => {
    const lConsole: Console = new Console();
    const lParameter: Parameter = new Parameter();

    // Get paths.
    const lCliRootPath: string = path.resolve(__dirname, '..', '..'); // Called from /library/source
    const lWorkspaceRootPath: string = process.cwd();

    // Output main banner.
    lConsole.banner('Project Settings');

    // Wrap error.
    try {
        // Execute functions based on path.
        if (lParameter.isPath('create *')) {
            const lBlueprintType: string = lParameter.getPath(1);
            await new PackageCommand(lCliRootPath, lWorkspaceRootPath).create(lBlueprintType);
        } else {
            throw `Command not found.`;
        }
    } catch (e) {
        lConsole.writeLine((<any>e).toString(), 'red');
    }

    process.exit(0);
})();