import { Plugin } from 'rollup';
import RollupPluginMultiScssOptions from './RollupPluginMultiScssOptions';
export { RollupPluginMultiScssOptions };
export default function multiScss({ include, includePaths, exclude, prefix, processor, assetsPath, keepName, }?: RollupPluginMultiScssOptions): Plugin;
