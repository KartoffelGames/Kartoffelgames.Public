import { EnvironmentBundleOptions } from 'jsr:@kartoffelgames/environment-bundle@4.0.1';

export default () => {
    return {
        loader: {
            '.css': 'text',
            '.html': 'text',
            '.png': 'dataurl',
            '.jpeg': 'dataurl',
            '.jpg': 'dataurl'
        }
    } satisfies Partial<EnvironmentBundleOptions>;
};