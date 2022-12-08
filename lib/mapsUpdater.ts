import puppeteer, { Browser } from "puppeteer";
import yaml from "js-yaml";
import fs from "fs";
import PromisePool from "@supercharge/promise-pool";

const toTitleCase = (phrase: string) =>
  phrase
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const fetchMapsUrls = async (browser: Browser) => {
  const page = await browser.newPage();
  await page.goto("https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/maps", {
    waitUntil: "networkidle0",
  });

  await page.click(".privacy__modal__accept");

  const urls = page.$$eval(".maplist__cards__wrapper a[href]", (elements) => elements.map((el) => el.href));
  return urls;
};

type MapData = {
  id: string;
  name: string;
  blueprints: { name: string; url: string }[];
};

const fetchMapData = async (browser: Browser, url: string): Promise<MapData> => {
  const id = url.split("/").at(-1);

  if (typeof id === "undefined") {
    throw Error(`Map id not found url=${url}`);
  }

  console.log(`MapFetching - ${id}`);
  console.time(`MapFetching - ${id}`);

  const mapPage = await browser.newPage();
  await mapPage.goto(url, { waitUntil: "networkidle0" });

  const titleContent = await mapPage.$eval(".map-details__info__title", (el) => el.textContent);
  if (!titleContent) {
    throw Error(`Map title not found url=${url}`);
  }
  const name = toTitleCase(titleContent);

  const blueprintsNames = await mapPage
    .$$eval(".map-details__gallery .gallery__item span", (elements) => elements.map((el) => el.textContent))
    .then((names) => names.filter((m): m is string => typeof m == "string").map(toTitleCase));

  await mapPage.click(".map-details__gallery .gallery__item img");
  // await mapPage.waitForSelector('.react-images__dialog')

  const blueprintUrls = await mapPage.$$eval(".react-images__view > img", (elements) => elements.map((el) => el.src));
  const blueprints = blueprintsNames.map((name, index) => ({
    name,
    url: blueprintUrls[index],
  }));

  await mapPage.close();

  console.timeEnd(`MapFetching - ${id}`);

  return { id, name, blueprints };
};

const writeToFile = (mapData: MapData) => {
  try {
    const filename = `data/maps/${mapData.id}.yaml`;
    fs.writeFileSync(filename, yaml.dump(mapData));

    console.log(`MapSaved - ${filename}`);
  } catch (e) {
    console.log(e);
  }
};

(async () => {
  console.log("Fetching maps...");
  console.time("Fetching maps...");

  const browser = await puppeteer.launch({ headless: true });

  const mapsUrls = await fetchMapsUrls(browser);

  await PromisePool.withConcurrency(6)
    .for(mapsUrls)
    .process((url) => fetchMapData(browser, url).then(writeToFile));

  await browser.close();

  console.timeEnd("Fetching maps...");
})();
