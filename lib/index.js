"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const pluginutils_1 = require("@rollup/pluginutils");
const postcss_scss_1 = __importDefault(require("postcss-scss"));
const postcss_import_1 = __importDefault(require("postcss-import"));
const postcss_smart_asset_1 = __importDefault(require("postcss-smart-asset"));
const fs_extra_1 = require("fs-extra");
const postcss_1 = __importDefault(require("postcss"));
const chalk_1 = __importDefault(require("chalk"));
const filesize_1 = __importDefault(require("filesize"));
const utils_1 = require("./utils");
const jsFilter = pluginutils_1.createFilter(['/**/*.js', '/**/*.jsx', '/**/*.ts', '/**/*.tsx'], []);
function resolveAssets({ id, dest, extensions = ['scss', 'css'], url = 'copy', assetsPath = 'assets', keepName = true, useHash = true, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fs_extra_1.readFile(id);
        const parser = postcss_scss_1.default;
        const processor = postcss_1.default([
            postcss_import_1.default(),
            postcss_smart_asset_1.default({
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
    });
}
function multiScss({ include = ['/**/*.css', '/**/*.scss'], includePaths = ['node_modules/'], exclude = [], prefix, processor, assetsPath = 'assets', keepName = true, } = {}) {
    const options = {
        include,
        exclude,
        prefix,
        processor,
        assetsPath,
        includePaths,
        keepName,
    };
    const xxssFilter = pluginutils_1.createFilter(options.include, options.exclude);
    let _includePaths = [...(options.includePaths || []), process.cwd()];
    let xxssDeps = {};
    return {
        name: 'rollup-plugin-multi-scss',
        resolveId(source, importer) {
            if (importer && jsFilter(importer)) {
                const xxssId = path_1.resolve(path_1.dirname(importer), source);
                if (xxssFilter(xxssId)) {
                    if (Array.isArray(xxssDeps[importer])) {
                        xxssDeps[importer].push(xxssId);
                    }
                    else {
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
            _includePaths.push(path_1.dirname(id));
            return '';
        },
        generateBundle(opts, bundles) {
            try {
                Object.keys(bundles).forEach((bundleName) => __awaiter(this, void 0, void 0, function* () {
                    const bundle = bundles[bundleName];
                    let dest = utils_1.getDest(opts, bundleName);
                    if ('modules' in bundle) {
                        for (const moduleId in bundle.modules) {
                            let styles = yield Promise.all(xxssDeps[moduleId].map((id) => resolveAssets(Object.assign({ id, dest }, options))));
                            let scss = styles.map(({ css }) => css).join('');
                            const css = utils_1.compileScssToCss(scss, styles, options, _includePaths);
                            if (typeof css !== 'string' || !css.length) {
                                return;
                            }
                            yield fs_extra_1.mkdir(path_1.dirname(dest), { recursive: true });
                            // @ts-ignore
                            if (opts.verbose !== false) {
                                console.log(chalk_1.default.green(dest), chalk_1.default.bgGreen(filesize_1.default(css.length)));
                            }
                            yield fs_extra_1.writeFile(dest, css);
                        }
                    }
                }));
            }
            catch (e) {
                // @ts-ignore Verbose can be undefined
                if (opts.verbose !== false) {
                    console.log(chalk_1.default.red(e));
                }
            }
        },
    };
}
exports.default = multiScss;
//# sourceMappingURL=index.js.map