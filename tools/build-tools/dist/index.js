'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dts = require('rollup-plugin-dts');
var clear = require('rollup-plugin-clear');
var rollupPluginString = require('rollup-plugin-string');
var rollupPluginTerser = require('rollup-plugin-terser');
var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var nodePolyfills = require('rollup-plugin-polyfill-node');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dts__default = /*#__PURE__*/_interopDefaultLegacy(dts);
var clear__default = /*#__PURE__*/_interopDefaultLegacy(clear);
var commonjs__default = /*#__PURE__*/_interopDefaultLegacy(commonjs);
var nodePolyfills__default = /*#__PURE__*/_interopDefaultLegacy(nodePolyfills);

/**
 * @param {object} opts 
 * @param {object} opts.packageJson
 * @param {string} opts.input
 * @param {string} opts.moduleName
 * @returns {object}
 */
function configure({ packageJson, input, moduleName })
{
    return [
        {
            input: input,
            output: [
                packageJson.module && {
                    file: packageJson.module,
                    format: 'esm'
                },
                packageJson.main && {
                    file: packageJson.main,
                    format: 'cjs'
                }
            ].filter(ifDefined),
            plugins: [
                clear__default['default']({
                    targets: ['out', 'dist']
                }),
                rollupPluginString.string({
                    include: [
                        '**/*.html',
                        '**/*.css',
                    ]
                }),
            ].filter(ifDefined)
        },
        packageJson.browser && {
            input: input,
            output: {
                file: packageJson.browser,
                name: moduleName,
                format: 'umd',
            },
            plugins: [
                // TODO: https://github.com/micromatch/picomatch/pull/73
                nodePolyfills__default['default'](),
                pluginNodeResolve.nodeResolve({ preferBuiltins: false }),
                commonjs__default['default'](),
                rollupPluginTerser.terser(),
                rollupPluginString.string({
                    include: [
                        '**/*.html',
                        '**/*.css',
                    ]
                }),
            ],
        },
        packageJson.types && {
            input: input,
            output: {
                file: packageJson.types,
                format: 'esm'
            },
            plugins: [
                dts__default['default']({
                    compilerOptions: {
                        allowJs: true,
                        declaration: true,
                        emitDeclarationOnly: true,
                        esModuleInterop: true
                    }
                })
            ],
        }
    ].filter(ifDefined);
}

function ifDefined(value)
{
    return typeof value !== 'undefined';
}

exports.configure = configure;
