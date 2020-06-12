import { Plugin } from 'rollup';
import { dirname, resolve } from 'path';
import { createFilter } from '@rollup/pluginutils';
import postcssScss from 'postcss-scss';
import postcssImport from 'postcss-import';
import postcssSmartAsset from 'postcss-smart-asset';
import { readFile, writeFile, mkdir } from 'fs-extra';
import postcss, { LazyResult } from 'postcss';
import chalk from 'chalk';
import fileSize from 'filesize';

import { compileScssToCss, getDest } from './utils';

export interface RollupPluginMultiScssOptions {
    //include SCSS/CSS file you want to include, like ['/**/*.css', '/**/*.scss'], if you pass include, the default list will be overwrite
    include?: string[]; // default to ['/**/*.css', '/**/*.scss']

    // File you want to exclude, like ['src/useless/useless.scss']
    exclude?: string[]; // default to []

    // SCSS bundling include path, which is used to find required scss file
    includePaths?: string[]; // default to ['node_modules'] and current cwd

    // Output path. default to same as js output
    output?: string;

    // Assets storage folder
    assetsPath?: string; // default to 'img'

    // Prefix content which need add to each scss file. default to empty
    prefix?: string;

    // Custom processor function. default to undefined.
    processor?: (styles: LazyResult[], css: string) => void;

    // Keep assets name with hash. default to true
    keepName?: boolean;
}

const jsFilter = createFilter(
    ['/**/*.js', '/**/*.jsx', '/**/*.ts', '/**/*.tsx'],
    []
);

async function resolveAssets({
    id,
    dest,
    extensions = ['scss', 'css'],
    url = 'copy',
    assetsPath = 'assets',
    keepName = true,
    useHash = true,
}): Promise<LazyResult> {
    const content = await readFile(id);
    const parser = postcssScss;
    const processor = postcss([
        postcssImport(),
        postcssSmartAsset({
            url,
            useHash,
            assetsPath,
            keepName,
        }),
    ]);

    return processor.process(content.toString(), {
        from: id,
        to: dest,
        extensions,
        map: { inline: false },
        // @ts-ignore
        parser,
    });
}

export default function multiScss({
    include = ['/**/*.css', '/**/*.scss'],
    includePaths = ['node_modules/'],
    exclude = [],
    prefix,
    processor,
    assetsPath = 'assets',
    keepName = true,
}: RollupPluginMultiScssOptions = {}): Plugin {
    const options: RollupPluginMultiScssOptions = {
        include,
        exclude,
        prefix,
        processor,
        assetsPath,
        includePaths,
        keepName,
    };
    const xxssFilter = createFilter(options.include, options.exclude);

    let _includePaths = [...(options.includePaths || []), process.cwd()];
    let xxssDeps = {};

    return {
        name: 'rollup-plugin-multi-scss',
        resolveId(source, importer) {
            if (importer && jsFilter(importer)) {
                const xxssId = resolve(dirname(importer), source);
                if (xxssFilter(xxssId)) {
                    if (Array.isArray(xxssDeps[importer])) {
                        xxssDeps[importer].push(xxssId);
                    } else {
                        xxssDeps[importer] = [xxssId];
                    }
                }
            }
            return null;
        },
        transform(code, id) {
            if (!xxssFilter(id)) {
                return;
            }

            // Add all id to includePaths
            _includePaths.push(dirname(id));

            return '';
        },
        generateBundle(opts, bundles) {
            try {
                Object.keys(bundles).forEach(async (bundleName) => {
                    const bundle = bundles[bundleName];
                    let dest = getDest(opts, bundleName);
                    if ('modules' in bundle) {
                        for (const moduleId in bundle.modules) {
                            let styles: LazyResult[] = await Promise.all(
                                xxssDeps[moduleId].map((id) =>
                                    resolveAssets({ id, dest, ...options })
                                )
                            );
                            let scss = styles.map(({ css }) => css).join('');
                            const css = compileScssToCss(
                                scss,
                                styles,
                                options,
                                _includePaths
                            );

                            if (typeof css !== 'string' || !css.length) {
                                return;
                            }

                            await mkdir(dirname(dest), { recursive: true });
                            // @ts-ignore
                            if (opts.verbose !== false) {
                                console.log(
                                    chalk.green(dest),
                                    chalk.bgGreen(fileSize(css.length))
                                );
                            }
                            await writeFile(dest, css);
                        }
                    }
                });
            } catch (e) {
                // @ts-ignore Verbose can be undefined
                if (opts.verbose !== false) {
                    console.log(chalk.red(e));
                }
            }
        },
    };
}
