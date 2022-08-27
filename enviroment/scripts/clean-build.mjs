// Load dependencies.
import * as path from 'path';
import * as filereader from 'fs';

/**
 * Clear build directory.
 */
(() => {
    const lLibraryPath = path.resolve("./library");
    const lLibraryExists = filereader.existsSync(lLibraryPath);
    const lLibraryStatus = lLibraryExists && filereader.statSync(lLibraryPath);
    const lLibraryIsDirectory = lLibraryExists && lLibraryStatus.isDirectory();

    // Start delete.
    if (lLibraryIsDirectory) {

        // Copy each item into new directory.
        for (const lChildItemName of filereader.readdirSync(lLibraryPath)) {
            const lRemovePath = path.join(lLibraryPath, lChildItemName);
            const lRemoveFileStatus = filereader.statSync(lRemovePath);

            // Remove file or directory.
            if (lRemoveFileStatus.isDirectory()) {
                // Delete everything except the build directory.
                if (lChildItemName.toLowerCase() !== 'build') {
                    filereader.rmSync(lRemovePath, { recursive: true, force: true });
                }
            } else {
                filereader.rmSync(lRemovePath);
            }
        }
    }
})();