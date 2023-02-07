let fs = require("fs");
let pup = require("puppeteer");
let sharp = require("sharp");

const docs = "dist/docs";
const imgs = "dist/imgs";

function setup() {
  [docs, imgs].forEach((d) => {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  });
}

function shouldBuildDocs(files) {
  return files.includes("docs");
}

async function buildPdf(src, dest) {
  let browser = await pup.launch({ headless: true });
  let page = await browser.newPage();
  let html = fs.readFileSync("docs/" + src, "utf8");
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ path: "docs/style.css" });

  await page.pdf({
    format: "A4",
    path: docs + "/" + dest,
    printBackground: true,
  });
  await browser.close();
}

async function buildDocs() {
  setup();

  await buildPdf("cv.html", "bruno-roque-cv.pdf");
  await buildPdf("cover.html", "bruno-roque-cover.pdf");
}

async function buildFavicons() {
  setup();

  let svg = sharp("imgs/logo.svg");

  await svg
    .resize(192)
    .png()
    .toFile(imgs + "/favicon-192.png");
}

function pass() {
  let p = {};
  p[docs] = "docs";
  p[imgs] = "imgs";
  return p;
}

module.exports = {
  shouldBuildDocs,
  buildDocs,
  buildFavicons,
  pass,
};
