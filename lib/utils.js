"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileScssToCss = exports.getDest = void 0;
const path_1 = require("path");
const node_sass_1 = __importDefault(require("node-sass"));
/**
 * Generate target dest path
 * @param options {NormalizedOutputOptions}
 * @param bundleName {string}
 */
function getDest(options, bundleName) {
    let dest;
    if (options.dir) {
        dest = path_1.resolve(options.dir, bundleName);
    }
    else {
        dest = options.file || 'bundle.js';
    }
    if (dest.endsWith('.js')) {
        dest = dest.slice(0, -3);
    }
    return dest + '.css';
}
exports.getDest = getDest;
/**
 * Compile scss content to css
 * @param scss {string}
 * @param styles {LazyResult[]}
 * @param options {RollupPluginMultiScssOptions}
 * @param includePaths {string[]}
 */
function compileScssToCss(scss, styles, options, includePaths) {
    const prefix = options.prefix ? options.prefix + '\n' : '';
    if (scss.length) {
        try {
            const css = node_sass_1.default
                .renderSync(Object.assign({ data: prefix + scss, includePaths: includePaths }, options))
                .css.toString();
            if (typeof options.processor === 'function') {
                return options.processor(styles, css);
            }
            return css;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.compileScssToCss = compileScssToCss;
//# sourceMappingURL=utils.js.map