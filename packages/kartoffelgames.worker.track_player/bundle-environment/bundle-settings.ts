import { EnvironmentBundleOptions } from 'jsr:@kartoffelgames/environment-bundle@4.0.1';

export default () => {
    return {
        loader: {
            '.css': 'text',
            '.html': 'text',
            '.png': 'dataurl',
            '.jpeg': 'dataurl',
            '.jpg': 'dataurl',
            '.jsworker': 'dataurl',
        },
        files: [
            {
                inputFilePath: './source/index.ts',
                outputBasename: '<packagename>',
                outputExtension: 'jsworker'
            }
        ],
        mimeTypes: {
            '.jsworker': 'application/javascript'
        }
    } satisfies Partial<EnvironmentBundleOptions>;
};