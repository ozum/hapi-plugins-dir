// Require all modules including scoped modules such as @somescope/somepackagename

const parentModule = require("parent-module");
const klaw = require("klaw-sync");
const { dirname } = require("path");
const { isJs, combineFilters, getTargetDir, getHapiPluginObject } = require("./util");

/**
 * File object.
 * @typedef {Object}  File
 * @property {string}   path  - Absolute path of the file.
 * @property {fs.stats} stats - [fs.stats](https://nodejs.org/api/fs.html#fs_class_fs_stats) object of the file.
 */

/**
 * Filter function to exclude files.
 * @typedef {function}  FilterFunction
 * @param {File[]} - Array of klaw result items. Path of file and `fs.stats` object.
 */

/**
 * Traverses given direcotry (absolute or relative to caller file) for hapi plugins options file and returns them ready to feed
 * Hapi's [`server.register(plugins, [options])`](https://github.com/hapijs/hapi/blob/master/API.md#server.register()) function.
 * @param   {Object}                          [options]                         - Options
 * @param   {dir}                             [options.dir=__dirname]           - Directory to look plugins. Can be relative or absolute. Default is current file's directory.
 * @param   {boolean}                         [options.recursive=true]          - Traverse directory recursively.
 * @param   {boolean}                         [options.stripNumberPrefix=true]  - Strip number prefixes from beginnings. (Numbers appended by dash or dot (. or -))
 * @param   {FilterFunction|FilterFunction[]} [options.filter]                  - Optional extra filter funtion or functions to exclude some files. (They are applied before builtin number filter)
 * @returns {Object[]}                                                          - Array of objects to feed Hapi's [`server.register(plugins, [options])`](https://github.com/hapijs/hapi/blob/master/API.md#server.register()) function.
 * @example
 * const plugins = getHapiPluginsFromDir();
 * // ./001-a.js        -> a
 * // ./002-@scope/b.js -> scope/b
 * // ./@other/c.js     -> other/c
 * await server.register(plugins)
 */
function getHapiPlugins({ dir = ".", recursive = true, stripNumber = true, filter = [] } = {}) {
  const callerFile = parentModule();
  const userFilters = Array.isArray(filter) ? filter : [filter];
  const combinedFilter = combineFilters(userFilters.concat([isJs, item => item.path !== callerFile]));

  const files = klaw(getTargetDir(dirname(callerFile), dir), { depthLimit: recursive ? -1 : 0 })
    .filter(combinedFilter)
    .map(getHapiPluginObject(stripNumber));

  return files;
}

module.exports = getHapiPlugins;
