export default {
    loader: {
        '.css': 'text',
        '.html': 'text',
        '.png': 'dataurl',
        '.jpeg': 'dataurl',
        '.jpg': 'dataurl'
    }
} satisfies EnvironmentBundleOptions;

type EnvironmentBundleExtentionLoader = { [extension: string]: 'base64' | 'dataurl' | 'empty' | 'js' | 'json' | 'text' | 'ts'; };

type EnvironmentBundleInputFiles = Array<{
    inputFilePath: string;
    outputBasename: string;
    outputExtension: string;
}>;

type EnvironmentBundleInputContent = {
    inputResolveDirectory: string;
    inputFileContent: string;
    outputBasename: string;
    outputExtension: string;
};

type EnvironmentBundleOptions = {
    plugins?: Array<any>;
    loader?: EnvironmentBundleExtentionLoader;
    entry?: {
        files?: EnvironmentBundleInputFiles;
        content?: EnvironmentBundleInputContent;
    };
};