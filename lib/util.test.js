const { isJs, isPlugin, toModuleName, stripNumberPrefix, combineFilters, getTargetDir, getHapiPluginObject } = require("./util");
const { join } = require("path");

describe("util module", () => {
  describe("isJs()", () => {
    it("should return true for js file", () => {
      const file = { path: "a.js", stats: { isFile: () => true } };
      expect(isJs(file)).toBe(true);
    });

    it("should return false for non js file", () => {
      const file = { path: "a", stats: { isFile: () => true } };
      expect(isJs(file)).toBe(false);
    });

    it("should return false for directories", () => {
      const file = { path: "a", stats: { isFile: () => false } };
      expect(isJs(file)).toBe(false);
    });
  });

  describe("isPlugin()", () => {
    it("should return true for plugin object", () => {
      const candidate = { name: "x", register: () => 1 };
      expect(isPlugin(candidate)).toBe(true);
    });

    it("should return false for non-plugin object", () => {
      const candidate = "a";
      expect(isPlugin(candidate)).toBe(false);
    });

    it("should return true for object containing object", () => {
      const candidate = { plugins: { plugin: {} } };
      expect(isPlugin(candidate)).toBe(true);
    });
  });

  describe("toModuleName()", () => {
    it("should return file name without extension for non-scoped path", () => {
      expect(toModuleName("a/b/c/d.js")).toBe("d");
    });

    it("should return file name without extension for scoped path", () => {
      expect(toModuleName("a/b/@c/d.js")).toBe(`@c/d`);
    });

    it("should return file name without number prefix with dot", () => {
      expect(toModuleName("a/b/@c/001.d.js")).toBe(`@c/001.d`);
    });
  });

  describe("stripNumberPrefix()", () => {
    it("should return file name in deep path without number prefix with dot", () => {
      expect(stripNumberPrefix("a/b/001-@c/001.d.js")).toBe("a/b/@c/d.js");
    });

    it("should return file name in deep path without number prefix with dash", () => {
      expect(stripNumberPrefix("a/b/001-@c/001-d.js")).toBe("a/b/@c/d.js");
    });

    it("should not remove numbers from deep path which are not prefix ", () => {
      expect(stripNumberPrefix("a/b/001-@c/d001-e.js")).toBe("a/b/@c/d001-e.js");
    });

    it("should return file name without number prefix with dot", () => {
      expect(stripNumberPrefix("001.d.js")).toBe("d.js");
    });

    it("should return file name without number prefix with dash", () => {
      expect(stripNumberPrefix("001-d.js")).toBe("d.js");
    });

    it("should return file name if no prefix presents", () => {
      expect(stripNumberPrefix("d.js")).toBe("d.js");
    });

    it("should return file name (dir with prefix, file without prefix))", () => {
      expect(stripNumberPrefix("001-@a/d.js")).toBe("@a/d.js");
    });

    it("should return file name (dir without prefix, file with prefix))", () => {
      expect(stripNumberPrefix("@a/001-d.js")).toBe("@a/d.js");
    });
  });

  describe("combineFilters()", () => {
    it("combine given filter functions", () => {
      const filter = combineFilters([item => item >= 2, item => item <= 3]);
      expect([1, 2, 3, 4].filter(filter)).toEqual([2, 3]);
    });
  });

  describe("getTargetDir()", () => {
    it("return relative target dir", () => {
      expect(getTargetDir("/a/b", ".")).toEqual("/a/b");
    });

    it("return relative target dir - 2", () => {
      expect(getTargetDir("/a/b", "c")).toEqual("/a/b/c");
    });

    it("return absolute target dir", () => {
      expect(getTargetDir("/a/b", "/x")).toEqual("/x");
    });
  });

  describe("getHapiPluginObject()", () => {
    it("return object after stripping number from file", () => {
      const item = { path: join(__dirname, "__test_helpers__/001-hapi-auth-basic.js"), stats: { isFile: () => true } };
      const { name } = getHapiPluginObject(true)(item).plugins.plugin.plugin.pkg;
      expect(name).toEqual("hapi-auth-basic");
    });

    it("return object from file", () => {
      const item = { path: join(__dirname, "__test_helpers__/subfolder/hapi-auth-basic.js"), stats: { isFile: () => true } };
      const { name } = getHapiPluginObject(false)(item).plugins.plugin.plugin.pkg;
      expect(name).toEqual("hapi-auth-basic");
    });
  });
});
