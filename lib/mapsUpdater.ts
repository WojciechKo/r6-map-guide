import Bottleneck from "bottleneck";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import yaml from "js-yaml";
import { Listr } from "listr2";
import puppeteer, { Browser } from "puppeteer";

type MapUrl = {
  id: string;
  url: string;
};

type MapData = {
  id: string;
  name: string;
  blueprints: { name: string; url: string }[];
};

class R6Api {
  #browser: Browser | undefined;

  fetchAvailableMaps = async (): Promise<MapUrl[]> => {
    const url = "https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/maps";
    const page = await this.#gotoPage(url);

    await page.click(".privacy__modal__accept");

    const urls = await page.$$eval(".maplist__cards__wrapper a[href]", (elements) => elements.map((el) => el.href));

    const maps = urls.map((url) => {
      const id = url.split("/").at(-1);
      if (typeof id === "undefined") {
        throw Error(`Map id not found url=${url}`);
      }
      return { id, url };
    });

    return maps;
  };

  fetchMapData = async (map: MapUrl): Promise<MapData> => {
    const mapPage = await this.#gotoPage(map.url);

    const titleContent = await mapPage.$eval(".map-details__info__title", (el) => el.textContent);
    if (!titleContent) {
      throw Error(`Map title not found url=${map.url}`);
    }
    const name = R6Api.#toTitleCase(titleContent);

    const blueprintsNames = await mapPage
      .$$eval(".map-details__gallery .gallery__item span", (elements) => elements.map((el) => el.textContent))
      .then((names) => names.filter((m): m is string => typeof m == "string").map(R6Api.#toTitleCase));

    await mapPage.click(".map-details__gallery .gallery__item img");

    const blueprintUrls = await mapPage.$$eval(".react-images__view > img", (elements) => elements.map((el) => el.src));
    const blueprints = blueprintsNames.map((name, index) => ({
      name,
      url: blueprintUrls[index],
    }));

    await mapPage.close();

    return { id: map.id, name, blueprints };
  };

  close = () => this.#getBrowser().then((b) => b.close());

  #gotoPage = async (url: string) => {
    const browser = await this.#getBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    return page;
  };

  #getBrowser = async () => {
    if (this.#browser) {
      return this.#browser;
    }
    this.#browser = await puppeteer.launch({ headless: true });
    return this.#browser;
  };

  static #toTitleCase = (phrase: string) =>
    phrase
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}

const fetchMapsList = async (r6Api: R6Api): Promise<MapUrl[]> => {
  const { maps } = await new Listr<{ maps: MapUrl[] }>([
    {
      title: "Fetch maps list",
      task: async (ctx) => {
        ctx.maps = await r6Api.fetchAvailableMaps();
      },
    },
  ]).run();
  return maps;
};

const updateMaps = async (r6Api: R6Api, maps: MapUrl[]) => {
  const limiter = new Bottleneck({ maxConcurrent: 8, minTime: 1000 });

  const writeToFile = (mapData: MapData) => {
    const filename = `data/maps/${mapData.id}.yaml`;
    return fs.writeFile(filename, yaml.dump(mapData));
  };

  const buildFetchMapTask = async (map: MapUrl, setTitle: (title?: string) => void) => {
    let startAt: number;
    const mapData = await limiter.schedule(async () => {
      startAt = performance.now();
      setTitle(`Fetching...`);
      return r6Api.fetchMapData(map);
    });

    setTitle(`Storing...`);
    await writeToFile(mapData);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const elapsed = (performance.now() - startAt!) / 1000;
    setTitle(`${elapsed.toFixed(2)}s`);
  };

  await new Listr(
    [
      {
        title: `Fetch maps data`,
        task: (_, mainTask) =>
          mainTask.newListr(
            maps.map((map) => ({
              title: map.id,
              task: (_, task) =>
                buildFetchMapTask(map, (subtitle) => (task.title = subtitle ? `${map.id}: ${subtitle}` : map.id)),
            })),
            { concurrent: true }
          ),
      },
    ],
    { rendererOptions: { collapse: false } }
  ).run();
};

type Command = [string, string[]];

const createGitCommit = () => {
  const printCommand = (command: Command) => console.log("$", command[0], ...command[1]);

  console.log("");
  console.log("# Add maps to stage");
  const gitAddCommand: Command = ["git", ["add", "-v", "data"]];
  printCommand(gitAddCommand);
  const gitAdd = spawn(...gitAddCommand);

  let gitAddOutput = "";
  gitAdd.stdout.on("data", function (data) {
    gitAddOutput += data;
  });
  gitAdd.stderr.pipe(process.stderr);

  gitAdd.on("close", function () {
    console.log("");
    if (gitAddOutput === "") {
      console.log("# Nothing new to commit");
    } else {
      console.log("# Commit new maps");
      const gitCommitCommand: Command = ["git", ["commit", "-m", "[recurring] Update maps"]];
      printCommand(gitCommitCommand);
      spawn(...gitCommitCommand, { stdio: "inherit" });
    }
  });
};
const main = async () => {
  console.time("Maps fetched");

  const r6Api = new R6Api();
  const maps = await fetchMapsList(r6Api);
  await updateMaps(r6Api, maps);
  r6Api.close();

  console.timeEnd("Maps fetched");

  createGitCommit();
};

main();
