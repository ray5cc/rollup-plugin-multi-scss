import { resolve } from 'path';
import sass from 'node-sass';
import { NormalizedOutputOptions } from 'rollup';
import { RollupPluginMultiScssOptions } from './index';
import { LazyResult } from 'postcss';

/**
 * Generate target dest path
 * @param options {NormalizedOutputOptions}
 * @param bundleName {string}
 */
export function getDest(options: NormalizedOutputOptions, bundleName: string) {
    let dest;
    if (options.dir) {
        dest = resolve(options.dir, bundleName);
    } else {
        dest = options.file || 'bundle.js';
    }
    if (dest.endsWith('.js')) {
        dest = dest.slice(0, -3);
    }
    return dest + '.css';
}

/**
 * Compile scss content to css
 * @param scss {string}
 * @param styles {LazyResult[]}
 * @param options {RollupPluginMultiScssOptions}
 * @param includePaths {string[]}
 */
export function compileScssToCss(
    scss: string,
    styles: LazyResult[],
    options: RollupPluginMultiScssOptions,
    includePaths: string[]
) {
    const prefix = options.prefix ? options.prefix + '\n' : '';
    if (scss.length) {
        try {
            const css = sass
                .renderSync({
                    data: prefix + scss,
                    includePaths: includePaths,
                    ...options,
                })
                .css.toString();
            if (typeof options.processor === 'function') {
                return options.processor(styles, css);
            }
            return css;
        } catch (e) {
            throw e;
        }
    }
}
