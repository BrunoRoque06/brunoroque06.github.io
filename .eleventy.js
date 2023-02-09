let tools = require("./tools.js");
let sass = require("sass");

module.exports = function (cfg) {
  cfg.on("eleventy.before", async () => {
    await tools.buildDocs();
    await tools.buildFavicons();
  });

  cfg.on("eleventy.beforeWatch", async (files) => {
    if (tools.shouldBuildDocs(files)) {
      await tools.buildDocs();
    }
  });

  cfg.addAsyncFilter("scss2css", async function (cnt) {
    return (
      await sass.compileStringAsync(cnt, {
        sourceMap: false,
        style: "compressed",
      })
    ).css;
  });

  cfg.addPassthroughCopy("docs");
  cfg.addPassthroughCopy("imgs");

  cfg.addPassthroughCopy(tools.pass());

  return {};
};
