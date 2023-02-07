let tools = require("./tools.js");
let sass = require("sass");

module.exports = function(config) {
  config.on("eleventy.before", async () => {
    await tools.buildDocs();
    await tools.buildFavicons();
  });

  config.on("eleventy.beforeWatch", async (files) => {
    if (tools.shouldBuildDocs(files)) {
      await tools.buildDocs();
    }
  });

  config.addFilter("scss2css", function(content) {
    return sass.compileString(content, {
      sourceMap: false,
      style: "compressed"
    }).css;
  });

  config.addPassthroughCopy("docs");
  config.addPassthroughCopy("imgs");

  config.addPassthroughCopy(tools.pass());

  return {};
};
