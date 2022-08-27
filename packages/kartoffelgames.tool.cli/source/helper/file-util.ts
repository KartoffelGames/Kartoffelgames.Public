import * as path from 'node:path';
import * as filereader from 'node:fs';

export class FileUtil {
    /**
     * Copy directory with all files into destination
     * and replace text in files.
     * @param pSource - The path to the thing to copy.
     * @param pDestination - The path to the new copy.
     */
    public static copyDirectory(pSource: string, pDestination: string, pOverride: boolean, pReplacementMap: Map<RegExp, string>): void {
        // Source and destination path resolved to absolute paths.
        const lSourceItem = path.resolve(pSource);
        const lDestinationItem = path.resolve(pDestination);

        // Existance status.
        const lSourceExists = filereader.existsSync(lSourceItem);
        const lDestinationExists = filereader.existsSync(lDestinationItem);

        // Source file status.
        let lFileStatus: filereader.Stats | null;
        let lSourceIsDirectory: boolean;
        if (lSourceExists) {
            lFileStatus = filereader.statSync(lSourceItem);
            lSourceIsDirectory = lFileStatus.isDirectory();
        } else {
            lFileStatus = null;
            lSourceIsDirectory = false;
        }

        // Recursion on directories.
        if (lSourceIsDirectory) {
            // Create destination directory.
            if (!lDestinationExists) {
                filereader.mkdirSync(lDestinationItem);
            }

            // Copy each item into new directory.
            for (const lChildItemName of filereader.readdirSync(lSourceItem)) {
                FileUtil.copyDirectory(path.join(lSourceItem, lChildItemName), path.join(lDestinationItem, lChildItemName), pOverride, pReplacementMap);
            }
        } else if (!lDestinationExists || pOverride) {
            filereader.copyFileSync(lSourceItem, lDestinationItem);

            // Read file text.
            const lFileText = filereader.readFileSync(lDestinationItem, { encoding: 'utf8' });

            // Replace each replacement pattern.
            let lAlteredFileText = lFileText;
            for (const [lReplacementRegex, lReplacementValue] of pReplacementMap) {
                lAlteredFileText = lAlteredFileText.replace(lReplacementRegex, lReplacementValue);
            }

            // Update file with altered file text.
            filereader.writeFileSync(lDestinationItem, lAlteredFileText, { encoding: 'utf8' });
        }
    }

    /**
     * Create directory.
     * @param pPath - Path.
     */
    public static createDirectory(pPath: string): void {
        filereader.mkdirSync(pPath);
    }

    /**
     * Check path or file existance.
     * @param pPath - Path.
     */
    public static exists(pPath: string): boolean {
        return filereader.existsSync(pPath);
    }

    /**
     * Get all file paths of given file name.
     * @param pStartDestination - Starting destination of search.
     * @param pFileName - File name that should be searched.
     * @param pSearchDepth - How deep should be searched.
     */
    public static getAllFilesOfName(pStartDestination: string, pFileName: string, pSearchDepth: number): Array<string> {
        const lAbsoulteStartDestination = path.resolve(pStartDestination);

        // Check start directory existence.
        if (!filereader.existsSync(lAbsoulteStartDestination)) {
            throw `"${lAbsoulteStartDestination}" does not exists.`;
        }

        // Check if start directory is a directory.
        const lDirectoryStatus = filereader.statSync(lAbsoulteStartDestination);
        if (!lDirectoryStatus.isDirectory()) {
            throw `"${lAbsoulteStartDestination}" is not a directory.`;
        }

        const lResultPathList = new Array<string>();

        // Check every file.
        // Copy each item into new directory.
        for (const lChildItemName of filereader.readdirSync(pStartDestination)) {
            const lItemPath = path.join(lAbsoulteStartDestination, lChildItemName);
            const lItemStatus = filereader.statSync(lItemPath);

            // Check if file or directory. Only search for files in found directory if depth is available.
            // Add item path to results if file name matches seached file name.
            if (lItemStatus.isDirectory() && (pSearchDepth - 1) > -1) {
                // Search for files in  directory.
                lResultPathList.push(...FileUtil.getAllFilesOfName(lItemPath, pFileName, pSearchDepth - 1));
            } else if (lChildItemName.toLowerCase() === pFileName.toLowerCase()) {
                lResultPathList.push(lItemPath);
            }
        }

        return lResultPathList;
    }

    /**
     * Read file content.
     * @param pPath - Path to file.
     */
    public static read(pPath: string): string {
        return filereader.readFileSync(pPath, { encoding: 'utf8' });
    }

    /**
     * Read file content.
     * @param pPath - Path to file.
     * @param pContent - File content.
     */
    public static write(pPath: string, pContent: string): void {
        filereader.writeFileSync(pPath, pContent, { encoding: 'utf8' });
    }
}