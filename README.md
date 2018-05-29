# hapi-plugins-dir

# Description

Traverse directory recursively and get array of Hapi plugins ready to feed Hapi's
[`server.register(plugins, [options])`](https://github.com/hapijs/hapi/blob/master/API.md#server.register()) function.

# Synopsis

**Plugins in same directory with file**
```js
const getHapiPlugins = require("hapi-plugins-dir");
const plugins = getHapiPlugins();
await server.register(plugins); // Hapi server object...
```

**Custom directory**
```js
const getHapiPlugins = require("hapi-plugins-dir");
const plugins = getHapiPlugins({ dir: "plugins" }); // Dir may be relative or absolute
await server.register(plugins); // Hapi server object...
```

**With [haute-couture](https://github.com/hapipal/haute-couture): plugins/index.js**
```js
module.exports = require("hapi-plugins-dir")();
```


# Details

* Traverses recursively given directory. (Defaults to caller file's directory)
* If a plugin isn't specified in `plugins` key, it will be required using filename.
* If a directory name starts with `@`, it is treated as package scope. (i.e. `plugins/@name/some-plugin.js` -> `@name/some-plugin`)
* Files can be ordered using number prefixes appended dot or dash (. or -). Numbers are stripped when requesting plugin. (i.e. `plugins/001-hapi-auth-basic` requires `hapi-auth-basic`).
* Scope directory names can be prefixed with numbers too. (i.e. `plugins/001-@scope/001-module.js` requires `@scope/module`).
* Result array must be registered using [`server.register(plugins, [options])`](https://github.com/hapijs/hapi/blob/master/API.md#server.register()). It is not automatically registered.


# API
## Functions

<dl>
<dt><a href="#getHapiPlugins">getHapiPlugins([options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Traverses given direcotry (absolute or relative to caller file) for hapi plugins options file and returns them ready to feed
Hapi&#39;s <a href="https://github.com/hapijs/hapi/blob/master/API.md#server.register("><code>server.register(plugins, [options])</code></a>) function.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#File">File</a> : <code>Object</code></dt>
<dd><p>File object.</p>
</dd>
<dt><a href="#FilterFunction">FilterFunction</a> : <code>function</code></dt>
<dd><p>Filter function to exclude files.</p>
</dd>
</dl>

<a name="getHapiPlugins"></a>

## getHapiPlugins([options]) ⇒ <code>Array.&lt;Object&gt;</code>
Traverses given direcotry (absolute or relative to caller file) for hapi plugins options file and returns them ready to feed
Hapi's [`server.register(plugins, [options])`](https://github.com/hapijs/hapi/blob/master/API.md#server.register()) function.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - - Array of objects to feed Hapi's [`server.register(plugins, [options])`](https://github.com/hapijs/hapi/blob/master/API.md#server.register()) function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Options |
| [options.dir] | <code>dir</code> | <code>__dirname</code> | Directory to look plugins. Can be relative or absolute. Default is current file's directory. |
| [options.recursive] | <code>boolean</code> | <code>true</code> | Traverse directory recursively. |
| [options.stripNumberPrefix] | <code>boolean</code> | <code>true</code> | Strip number prefixes from beginnings. (Numbers appended by dash or dot (. or -)) |
| [options.filter] | [<code>FilterFunction</code>](#FilterFunction) \| [<code>Array.&lt;FilterFunction&gt;</code>](#FilterFunction) |  | Optional extra filter funtion or functions to exclude some files. (They are applied before builtin number filter) |

**Example**  
```js
const plugins = getHapiPluginsFromDir();
// ./001-a.js        -> a
// ./002-@scope/b.js -> scope/b
// ./@other/c.js     -> other/c
await server.register(plugins)
```
<a name="File"></a>

## File : <code>Object</code>
File object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Absolute path of the file. |
| stats | <code>fs.stats</code> | [fs.stats](https://nodejs.org/api/fs.html#fs_class_fs_stats) object of the file. |

<a name="FilterFunction"></a>

## FilterFunction : <code>function</code>
Filter function to exclude files.

**Kind**: global typedef  

| Type | Description |
| --- | --- |
| [<code>Array.&lt;File&gt;</code>](#File) | Array of klaw result items. Path of file and `fs.stats` object. |

