// @ts-check

// Load dependencies.
const gPath = require('path');
const gFilereader = require('fs');

/**
 * Load default loader from module declaration file.
 */
const gGetDefaultFileLoader = () => {
    // Read module declaration file.
    const lDeclarationFilepath = gPath.resolve(__dirname, '..', 'declaration', 'module-declaration.d.ts');
    const lFileContent = gFilereader.readFileSync(lDeclarationFilepath, 'utf8');

    const lFileExtensionRegex = /declare\s+module\s+(?:"|')\*([.a-zA-Z0-9]+)(?:"|')\s*{.*?\/\*\s*LOADER::([a-zA-Z-]+)\s*\*\/.*?}/gms;

    // Get all declaration informations by reading the extension and the loader information from the comment.
    const lDefaultLoader = [];
    let lMatch;
    while (lMatch = lFileExtensionRegex.exec(lFileContent)) {
        const lExtension = lMatch[1];
        const lLoaderType = lMatch[2];

        // Create regex from extension.
        const lExtensionRegex = new RegExp(lExtension.replace('.', '\\.') + '$');

        // Add loader config.
        lDefaultLoader.push({
            test: lExtensionRegex,
            use: lLoaderType
        });
    }

    return lDefaultLoader;
};

/**
 * Get default loader for typescript files. 
 * @param pIncludeCoverage - Include coverage loader.
 */
const gGetDefaultTypescriptLoader = (pIncludeCoverage) => {
    const lTsLoader = new Array();

    // KEEP LOADER-ORDER!!!

    // Add coverage loader if coverage is enabled.
    if (pIncludeCoverage) {
        lTsLoader.push({ loader: '@jsdevtools/coverage-istanbul-loader' });
    }

    // Add default typescript loader.
    lTsLoader.push({
        loader: 'babel-loader',
        options: {
            plugins: ['@babel/plugin-transform-async-to-generator'],
            presets: [
                ['@babel/preset-env', { targets: { esmodules: true } }]
            ]
        }
    });
    lTsLoader.push({
        loader: 'ts-loader',
    });

    return lTsLoader;
};

/**
 * Get project name.
 */
const gGetProjectName = () => {
    const lFilePath = gPath.resolve('package.json');
    const lFileContent = gFilereader.readFileSync(lFilePath, 'utf8');
    const lFileJson = JSON.parse(lFileContent);

    return lFileJson.projectName;
};

/**
 * Get webpack config.
 * @param pEnviroment - { buildType: 'release' | 'debug' | 'test' | 'scratchpad'; coverage: boolan; }
 */
module.exports = (pEnviroment) => {
    const lProjectName = gGetProjectName().toLowerCase();

    // Set variable configuration default values.
    let lEntryFile = '';
    let lBuildMode = 'none';
    let lFileName = 'script.js';
    let lOutputDirectory = './library/build';

    switch (pEnviroment.buildType) {
        case 'release':
            lEntryFile = './source/index.ts';
            lBuildMode = 'production';
            lFileName = `${lProjectName}.js`;
            lOutputDirectory = './library/build';
            break;

        case 'debug':
            lEntryFile = './source/index.ts';
            lBuildMode = 'development';
            lFileName = `${lProjectName}.debug.js`;
            lOutputDirectory = './library/build';
            break;

        case 'test':
            lEntryFile = './test/index.ts';
            lBuildMode = 'development';
            lFileName = `${lProjectName}.test.js`;
            lOutputDirectory = './library/build';
            break;

        case 'scratchpad':
            lEntryFile = './scratchpad/source/index.ts';
            lBuildMode = 'development';
            lFileName = `scratchpad.js`;
            lOutputDirectory = 'dist';
            break;
    }

    return {
        devtool: 'source-map',
        target: 'web',
        entry: lEntryFile,
        mode: lBuildMode,
        output: {
            filename: `../${lOutputDirectory}/${lFileName}` // ".." because Dist is the staring directory.
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        context: gPath.resolve('./'),
        module: {
            rules: [{
                    test: /\.ts?$/,
                    use: gGetDefaultTypescriptLoader(!!pEnviroment.coverage)
                },
                ...gGetDefaultFileLoader()
            ]
        },
        watch: false,
        watchOptions: {
            aggregateTimeout: 1000,
            ignored: /node_modules/,
            poll: 1000
        },
        devServer: {
            open: true,
            liveReload: true,
            static: {
                directory: "./scratchpad",
                watch: true
            },
            compress: true,
            port: 5500,
            client: {
                logging: 'info',
                overlay: true,
            }
        },
    };
};