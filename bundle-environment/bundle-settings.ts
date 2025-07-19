import { EnvironmentBundleOptions } from 'jsr:@kartoffelgames/environment-bundle@4.1.2';

export default () => {
    return {
        loader: {
            '.css': 'text',
        '.html': 'text',
        '.png': 'dataurl',
        '.jpeg': 'dataurl',
        '.jpg': 'dataurl',
        '.wgsl': 'text',
        '.pgsl': 'text'
        }
    } satisfies Partial<EnvironmentBundleOptions>;
};