const puppeteer = require('puppeteer');
const yaml = require('js-yaml');
const fs = require('fs');
const PromisePool = require('@supercharge/promise-pool')

const toTitleCase = (phrase) => phrase.trim()
  .toLowerCase()
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const fetchMapsUrls = async (browser) => {
  const page = await browser.newPage();
  await page.goto('https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/maps', {
    waitUntil: 'networkidle0',
  });

  await page.click('.privacy__modal__accept');

  return page.$$eval('.maplist__cards__wrapper a[href]', elements => elements.map(el => el.href));
}

const fetchMapData = (browser, url) => new Promise(async (resolve) => {
  const id = url.split('/').at(-1);

  console.log(`[MapFetch] - ${id}`);
  console.time(`[MapFetch] - ${id}`);

  const mapPage = await browser.newPage();
  await mapPage.goto(url, { waitUntil: 'networkidle0' });
  // await mapPage.waitForSelector('.map-details__gallery')


  const name = await mapPage.$eval('.map-details__info__title', el => el.textContent)
    .then(toTitleCase)

  const blueprintsName = await mapPage.$$eval('.map-details__gallery .gallery__item span', elements => elements.map(el => el.textContent))
    .then(names => names.map(toTitleCase))

  await mapPage.click('.map-details__gallery .gallery__item img')
  // await mapPage.waitForSelector('.react-images__dialog')

  const blueprintUrls = await mapPage.$$eval('.react-images__view > img', elements => elements.map(el => el.src))
  const blueprints = blueprintsName.map((name, index) => ({ name, url: blueprintUrls[index] }))

  console.timeEnd(`[MapFetch] - ${id}`);

  resolve({ id, name, blueprints });
  await mapPage.close();
})

const fetchMapsData = async () => {
  const browser = await puppeteer.launch({ headless: true });

  const mapsUrls = await fetchMapsUrls(browser);

  const { results: maps } = await PromisePool
    .withConcurrency(8)
    .for(mapsUrls)
    .process((url) => fetchMapData(browser, url))

  await browser.close();
  return maps;
}

(async () => {
  console.log("[AllMapsFetch]");
  console.time("[AllMapsFetch]");
  const maps = await fetchMapsData()
  console.timeEnd("[AllMapsFetch]");

  for (mapData of maps) {
    try {
      const filename = `data/maps/${mapData.id}.yaml`
      fs.writeFileSync(filename, yaml.dump(mapData));

      console.log(`[UpdateMapFile] - ${filename}`);
    } catch (e) {
      console.log(e);
    }
  }
})();
