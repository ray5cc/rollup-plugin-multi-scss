import { LazyResult } from 'postcss';

export default interface RollupPluginMultiScssOptions {
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
    processor?: { processCSS: (css: string) => string };

    // Keep assets name with hash. default to true
    keepName?: boolean;
}
