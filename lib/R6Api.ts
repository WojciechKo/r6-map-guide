/* eslint-disable no-console */
import puppeteer, { Browser, Page, TimeoutError } from "puppeteer";

export type MapId = {
  slug: string;
  url: string;
};

export type MapData = Pick<MapId, "slug"> & {
  name: string;
  blueprints: { name: string; url: string }[];
};

const toTitleCase = (phrase: string) => {
  return phrase
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export class R6Api {
  #browser: Browser | undefined;

  fetchMapsList = async (): Promise<MapId[]> => {
    const url = "https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/maps";
    const page = await this.#openNewPage(url);

    await page.click(".privacy__modal__accept");

    const urls = await page.$$eval(".maplist__cards__wrapper a[href]", (elements) => elements.map((el) => el.href));
    const maps = urls.map(this.#buildMapPage);

    await page.close();

    return maps;
  };

  fetchMapData = async (map: MapId): Promise<MapData> => {
    let mapPage;
    try {
      mapPage = await this.#openNewPage(map.url);

      const titleContent = await mapPage.$eval(".map-details__info__title", (el) => el.textContent);
      if (!titleContent) {
        throw Error(`Map title not found url=${map.url}`);
      }
      const name = toTitleCase(titleContent);

      const blueprintsNames = await mapPage
        .$$eval(".map-details__gallery .gallery__item span", (elements) => elements.map((el) => el.textContent))
        .then((names) => names.filter((m): m is string => typeof m == "string").map(toTitleCase));

      await mapPage.click(".map-details__gallery .gallery__item img");

      const blueprintUrls = await mapPage.$$eval(".react-images__view > img", (elements) =>
        elements.map((el) => el.src)
      );
      const blueprints = blueprintsNames.map((name, index) => ({
        name,
        url: blueprintUrls[index],
      }));

      return { slug: map.slug, name, blueprints };
    } catch (e) {
      if (e instanceof TimeoutError) {
        return this.fetchMapData(map);
      }
      throw e;
    } finally {
      await mapPage?.close();
    }
  };

  retryOnTimeout = async (fun: () => Promise<any>) => {
    try {
      return fun();
    } catch (e) {
      if (e instanceof TimeoutError) {
        console.log("TIMEOUT");
        return fun();
      }
      throw e;
    }
  };

  fetchMapData2 = async (map: MapId): Promise<MapData> => {
    return this.retryOnTimeout(async () => {
      let mapPage;
      try {
        mapPage = await this.#openNewPage(map.url);

        const titleContent = await mapPage.$eval(".map-details__info__title", (el) => el.textContent);
        if (!titleContent) {
          throw Error(`Map title not found url=${map.url}`);
        }
        const name = toTitleCase(titleContent);

        const blueprintsNames = await mapPage
          .$$eval(".map-details__gallery .gallery__item span", (elements) => elements.map((el) => el.textContent))
          .then((names) => names.filter((m): m is string => typeof m == "string").map(toTitleCase));

        await mapPage.click(".map-details__gallery .gallery__item img");

        const blueprintUrls = await mapPage.$$eval(".react-images__view > img", (elements) =>
          elements.map((el) => el.src)
        );
        const blueprints = blueprintsNames.map((name, index) => ({
          name,
          url: blueprintUrls[index],
        }));

        return { slug: map.slug, name, blueprints };
      } finally {
        await mapPage?.close();
      }
    });
  };

  close = async (): Promise<void> => {
    return this.#getBrowser().then((b) => b.close());
  };

  #buildMapPage = (url: string): MapId => {
    const slug = url.split("/").at(-1);
    if (typeof slug === "undefined") {
      throw Error(`Map slug not found url=${url}`);
    }
    return { slug, url };
  };

  #openNewPage = async (url: string): Promise<Page> => {
    const browser = await this.#getBrowser();
    const page = await browser.newPage();
    page.setDefaultTimeout(3000);
    await page.goto(url, { waitUntil: "networkidle0" });
    return page;
  };

  #getBrowser = async (): Promise<Browser> => {
    if (this.#browser) {
      return this.#browser;
    }
    this.#browser = await puppeteer.launch({ headless: true });
    return this.#browser;
  };
}
