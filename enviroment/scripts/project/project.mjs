import { createPackage } from './commands/create-package.mjs';
import { updateDependencyVersions } from './commands/update-dependency-versions.mjs';
import { Out } from './helper/out.mjs';

// Main.
await (async() => {
    const lOut = new Out();

    // Header
    lOut.writeLine('////------------------////');
    lOut.writeLine('//// Project Settings ////');
    lOut.writeLine('////------------------////');
    lOut.writeLine('');

    const lValue = await lOut.selectBox('Select options:', [
        { name: 'Create', value: 1 },
        { name: 'Update local dependency versions', value: 2 },
        { name: 'Update package dependencies', value: 3 },
    ]);

    lOut.writeLine('');

    switch (lValue) {
        case 1:
            {
                await createPackage();
                break;
            }
        case 2:
            {
                await updateDependencyVersions();
                break;
            }
    }

    process.exit();
})();