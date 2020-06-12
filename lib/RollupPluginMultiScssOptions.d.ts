import { LazyResult } from 'postcss';
export default interface RollupPluginMultiScssOptions {
    include?: string[];
    exclude?: string[];
    includePaths?: string[];
    output?: string;
    assetsPath?: string;
    prefix?: string;
    processor?: (styles: LazyResult[], css: string) => void;
    keepName?: boolean;
}
