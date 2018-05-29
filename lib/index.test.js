const getHapiPlugins = require("./index");

describe("hapi-plugins-dir", () => {
  describe("getHapiPlugins()", () => {
    const plugins = getHapiPlugins({ dir: "./__test_helpers__" });
    const noPlugins = getHapiPlugins({ filter: () => false, recursive: false });

    it("should throw if no module found", () => {
      expect(() => getHapiPlugins()).toThrow("Cannot find module");
    });

    it("import all plugins", () => {
      expect(plugins).toHaveLength(2);
    });

    it("apply custom filter", () => {
      expect(noPlugins).toHaveLength(0);
    });

    describe("imported plugin", () => {
      it("should have name", () => {
        const { name } = plugins[0].plugins.plugin.plugin.pkg;
        expect(name).toBe("hapi-auth-basic");
      });
    });
  });
});
