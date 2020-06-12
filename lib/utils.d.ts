import { NormalizedOutputOptions } from 'rollup';
import RollupPluginMultiScssOptions from './RollupPluginMultiScssOptions';
import { LazyResult } from 'postcss';
/**
 * Generate target dest path
 * @param options {NormalizedOutputOptions}
 * @param bundleName {string}
 */
export declare function getDest(options: NormalizedOutputOptions, bundleName: string): string;
/**
 * Compile scss content to css
 * @param scss {string}
 * @param styles {LazyResult[]}
 * @param options {RollupPluginMultiScssOptions}
 * @param includePaths {string[]}
 */
export declare function compileScssToCss(scss: string, styles: LazyResult[], options: RollupPluginMultiScssOptions, includePaths: string[]): any;
