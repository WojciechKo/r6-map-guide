/* eslint-disable no-console */
import { Browser, chromium, errors, Page } from "playwright";

export type MapUrl = {
  slug: string;
  url: string;
};

export type MapData = Pick<MapUrl, "slug"> & {
  name: string;
  blueprints: { name: string; url: string }[];
};

let browser: Browser | undefined;
const MapsListUrl = "https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/maps";

export const fetchMapsList = async (): Promise<MapUrl[]> => {
  return retryOnTimeout(_fetchMapsList);
};

export const fetchMapData = async (map: MapUrl): Promise<MapData> => {
  return retryOnTimeout(_fetchMapData.bind(this, map));
};

export const close = async (): Promise<void> => {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
};

const _fetchMapsList = async (): Promise<MapUrl[]> => {
  return withLoadedPage(MapsListUrl, async (page) => {
    await page.click(".privacy__modal__accept");

    const urls = await page
      .locator(".maplist__cards__wrapper a[href]")
      .evaluateAll((anchors: HTMLAnchorElement[]) => anchors.map((a) => a.href));

    const maps = urls.map((url) => ({
      url,
      slug: extractSlug(url),
    }));

    return maps;
  });
};

const _fetchMapData = async (map: MapUrl): Promise<MapData> => {
  return withLoadedPage(map.url, async (mapPage) => {
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

const retryOnTimeout = async <T>(fun: () => Promise<T>): Promise<T> => {
  try {
    return await fun();
  } catch (error) {
    if (error instanceof errors.TimeoutError) {
      return retryOnTimeout(fun);
    }
    throw error;
  }
};

const withLoadedPage = async <T>(url: string, callback: (page: Page) => Promise<T>) => {
  let page;
  try {
    page = await loadPage(url);
    return await callback(page);
  } finally {
    await page?.close();
  }
};

const loadPage = async (url: string): Promise<Page> => {
  if (!browser) {
    browser = await chromium.launch({ headless: true, logger: undefined });
    await browser.newContext();
  }
  const page = await browser.contexts()[0].newPage();
  try {
    page.setDefaultTimeout(10000);
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    return page;
  } catch {
    return page;
  }
};

const extractSlug = (url: string): string => {
  const slug = url.split("/").at(-1);
  if (typeof slug === "undefined") {
    throw Error(`Map slug not found url=${url}`);
  }
  return slug;
};

const toTitleCase = (phrase: string) => {
  return phrase
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
