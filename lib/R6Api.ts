/* eslint-disable no-console */
import { Browser, chromium, errors, Page } from "playwright";

export type MapId = {
  slug: string;
  url: string;
};

export type MapData = Pick<MapId, "slug"> & {
  name: string;
  blueprints: { name: string; url: string }[];
};

export class R6Api {
  #browser: Browser | undefined;
  MapsListUrl = "https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/maps";

  fetchMapsList = async (): Promise<MapId[]> => {
    return this.#retryOnTimeout(this.#fetchMapsList);
  };

  fetchMapData = async (map: MapId): Promise<MapData> => {
    return this.#retryOnTimeout(() => this.#fetchMapData(map));
  };

  #fetchMapsList = async (): Promise<MapId[]> => {
    return this.#withLoadedPage(this.MapsListUrl, async (page) => {
      await page.click(".privacy__modal__accept");

      const urls = await page
        .locator(".maplist__cards__wrapper a[href]")
        .evaluateAll((anchors: HTMLAnchorElement[]) => anchors.map((a) => a.href));

      const maps = urls.map((url) => ({ url, slug: this.#extractSlug(url) }));

      return maps;
    });
  };

  #fetchMapData = async (map: MapId): Promise<MapData> => {
    return this.#withLoadedPage(map.url, async (mapPage) => {
      const titleContent = await mapPage.locator(".map-details__info__title").textContent();
      if (!titleContent) {
        throw Error(`Map title not found url=${map.url}`);
      }
      const name = toTitleCase(titleContent);

      const blueprintsNames = await mapPage
        .locator(".map-details__gallery .gallery__item span")
        .allTextContents()
        .then((names) => names.map(toTitleCase));

      await mapPage.click(".map-details__gallery .gallery__item img");

      const blueprintUrls = await mapPage
        .locator(".react-images__view > img")
        .all()
        .then((images) => Promise.all(images.map(async (image) => (await image.getAttribute("src")) || "")));

      const blueprints = blueprintsNames.map((name, index) => ({
        name,
        url: blueprintUrls[index],
      }));

      return { slug: map.slug, name, blueprints };
    });
  };

  close = async (): Promise<void> => {
    if (this.#browser) {
      await this.#browser.close();
      this.#browser = undefined;
    }
  };

  #retryOnTimeout = async <T>(fun: () => Promise<T>): Promise<T> => {
    try {
      return await fun();
    } catch (error) {
      if (error instanceof errors.TimeoutError) {
        return this.#retryOnTimeout(fun);
      }
      throw error;
    }
  };

  #extractSlug = (url: string): string => {
    const slug = url.split("/").at(-1);
    if (typeof slug === "undefined") {
      throw Error(`Map slug not found url=${url}`);
    }
    return slug;
  };

  #withLoadedPage = async <T>(url: string, callback: (page: Page) => Promise<T>) => {
    let page;
    try {
      page = await this.#loadPage(url);
      return await callback(page);
    } finally {
      await page?.close();
    }
  };

  #loadPage = async (url: string): Promise<Page> => {
    if (!this.#browser) {
      this.#browser = await chromium.launch({ headless: true, logger: undefined });
      await this.#browser.newContext();
    }
    const page = await this.#browser.contexts()[0].newPage();
    try {
      page.setDefaultTimeout(5000);
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      return page;
    } catch {
      return page;
    }
  };
}

const toTitleCase = (phrase: string) => {
  return phrase
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
