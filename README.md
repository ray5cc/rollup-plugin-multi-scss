# rollup-plugin-multi-scss ![build](https://github.com/luvies/node-evaluator/workflows/Node%20CI/badge.svg)
The rollup plugin compile scss to css which required by your JavaScript, and copy the assets required by scss/css file to your target folder.
## Installation
```console
$ npm install --save-dev rollup-plugin-multi-scss
```
Or 
```console
$ yarn add --dev rollup-plugin-multi-scss
```
## Usage

```javascript
import scss from 'rollup-plugin-multi-scss';

export default {
    input: ['./src/input/index.js', './src/input2/index.js'],
    output: {
        dir: './dist/',
        format: 'esm',
        sourcemap: true
    },
    // If preserveModules were false, the bundled css file share the same name with bundled js file
    preserveModules: true,
    plugins: [
        scss(),
    ]
}
```

## Options (all optional)
- `include` SCSS/CSS file you want to include, like ['/**/*.css', '/**/*.scss'], if you pass this option, the `default` list will be over write. default to `['/**/*.css', '/**/*.scss']`.
- `exclude` Files you want to exclude, like ['src/useless/useless.scss']. `default` to `[]`.
-`includePaths` SCSS bundling include path, which is used to find required scss files. `default` to `['node_modules']` and current cwd.
- `output` Output path. `default` to same as js output;
- `assetsPath` Assets storage folder. `default` to `'img'`.
- `prefix` Prefix content which need add to each scss file. `default` to `empty`.
- `processor` Custom processor function. `default` to `undefined`.
- `keepName` Keep assets name with hash. `default` to `true`
