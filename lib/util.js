const { extname, parse, sep, isAbsolute, join, relative } = require("path");

/* eslint-disable global-require, import/no-dynamic-require */

/**
 * Returns whether given item is a hapi plugin
 * @param   {Object}  item  - Object to test.
 * @returns {boolean}       - Whether given object is a hapi plugin.
 * @private
 */
function isPlugin(item) {
  const isPluginObject = typeof item === "object" && typeof item.name === "string" && typeof item.register === "function";
  const isObjectWithPlugin =
    typeof item === "object" && typeof item.plugins === "object" && Object.prototype.hasOwnProperty.call(item.plugins, "plugin");
  return isPluginObject || isObjectWithPlugin;
}

/**
 * Tests whether given item which is returned by klaw module is a .js file.
 * @param   {Object}  item  - Item to test.
 * @returns {boolean}       - Whether given item is a .js file.
 * @private
 */
function isJs(item) {
  return extname(item.path) === ".js" && item.stats.isFile();
}

/**
 * Returns module name for given path. If file is in a direcory starting with `@` symbol,
 * returns scoped module name (i.e. @somescope/somepackagename), otherwise returns file name without extension.
 * @param   {string} path - Path to get module name from.
 * @returns {string}      - Module name for given path.
 * @private
 * @example
 * toModuleName("a/b/@c/d.js"); // "@c/d"
 * toModuleName("a/b/c/d.js"); // "d"
 */
function toModuleName(path) {
  const { dir, name } = parse(path);
  const scopeCandidate = dir.split(sep).pop();
  return scopeCandidate[0] === "@" ? `${scopeCandidate}/${name}` : name;
}

/**
 * Strips numbers appended dot or dash (. or -) from beginning of file name and returs given path. (i.e 001-module.js or 001.module.js).
 * Numbers in file names may be used for hapi plugins loading order.
 * @param   {string} path - Path to strip number prefix from.
 * @returns {string}      - Path without number prefix.
 * @private
 * @example
 * toModuleName("a/b/@c/001-d.js"); // "a/b/@c/d.js"
 * toModuleName("a/b/c/001.d.js"); // "a/b/c/d.js"
 * toModuleName("a/b/001-c/001.d.js"); // "a/b/c/d.js"
 */
function stripNumberPrefix(path) {
  const { dir, base } = parse(path);
  const dirs = dir.split(sep);
  const nameWithoutNumber = base.replace(/^\d+?[-.]/, "");
  const scopeCandidate = dirs.pop().replace(/^\d+?[-.]/, "");
  if (scopeCandidate) {
    dirs.push(scopeCandidate);
  }
  dirs.push(nameWithoutNumber);

  return dirs.join(sep);
}

/**
 * Creates single filter function by combining given filter functions.
 * @param   {FilterFunction[]} filters  - Filter functions to combine.
 * @returns {FilterFunction}            - Combined filter function.
 * @private
 */
function combineFilters(filters) {
  return item => filters.every(filter => filter(item));
}

/**
 * Returns absolute path of target dir. Target dir may be absolute, or relative to caller dir.
 * @param   {string} callerDir    - Path of the caller function's directory.
 * @param   {string} [targetDir]  - Path of the target directory (absolute or relative to caller dir.)
 * @returns {string}              - Absolute target dir.
 * @private
 */
function getTargetDir(callerDir, targetDir) {
  return isAbsolute(targetDir) ? targetDir : join(callerDir, targetDir);
}

/**
 * Returns function which transforms given File items into Hapi plugin objects.
 * @function
 * @param   {boolean} stripNumber         - Whether to strip number prefixes from file names before requiring them.
 * @returns {function(File):HapiObject}   - Hapi object ready to feed to Hapi.
 * @private
 */
const getHapiPluginObject = stripNumber => item => {
  const obj = require(`.${sep}${relative(__dirname, item.path)}`);
  const moduleName = toModuleName(stripNumber ? stripNumberPrefix(item.path) : item.path);
  return isPlugin(obj) ? obj : { ...obj, plugins: { ...obj.plugins, plugin: require(moduleName) } };
};

module.exports = { isJs, isPlugin, toModuleName, stripNumberPrefix, combineFilters, getTargetDir, getHapiPluginObject };
