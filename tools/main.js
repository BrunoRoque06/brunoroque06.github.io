let fs = require("fs");
let playwright = require("playwright");
let sharp = require("sharp");

const docs = "src/assets/docs";
const imgs = "src/assets/imgs";

/**
 * @param {string} src
 * @param {string} dest
 * @returns {Promise<void>}
 */
async function buildPdf(src, dest) {
  let browser = await playwright.chromium.launch();
  let page = await browser.newPage();
  let html = fs.readFileSync(`tools/${src}`, "utf8");
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ path: "tools/style.css" });
  await page.pdf({ format: "A4", path: `${docs}/${dest}` });
  await browser.close();
}

/**
 * @returns {Promise<void>}
 */
async function buildFavicons() {
  let svg = sharp("tools/logo.svg");
  await svg.resize(192).png().toFile(`${imgs}/favicon-192.png`);
}

[docs, imgs].forEach((d) => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

buildPdf("cover.html", "bruno-roque-cover.pdf")
  .then(() => buildPdf("cv.html", "bruno-roque-cv.pdf"))
  .then(buildFavicons)
  .catch((e) => console.error(e));
