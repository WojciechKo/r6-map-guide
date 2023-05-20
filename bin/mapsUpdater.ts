/* eslint-disable no-console */
import Bottleneck from "bottleneck";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import yaml from "js-yaml";
import { Listr } from "listr2";

import { MapData, MapId, R6Api } from "../lib/R6Api";

const writeToFile = (mapData: MapData) => {
  const filename = `data/maps/${mapData.slug}.yaml`;
  return fs.writeFile(filename, yaml.dump(mapData));
};

const fetchMapsList = async (r6Api: R6Api): Promise<MapId[]> => {
  const { maps } = await new Listr<{ maps: MapId[] }>([
    {
      title: "Fetch maps list",
      task: async (ctx) => {
        ctx.maps = await r6Api.fetchMapsList();
      },
    },
  ]).run();
  return maps;
};

const updateMapsData = async (r6Api: R6Api, maps: MapId[]) => {
  const limiter = new Bottleneck({ maxConcurrent: 12, minTime: 0 });

  const updateMapData = async (map: MapId, setStatus: (title: string) => void) => {
    let startAt: number;
    const mapData = await limiter.schedule(async () => {
      startAt = performance.now();
      setStatus(`Fetching...`);
      return r6Api.fetchMapData(map);
    });

    setStatus(`Storing...`);
    await writeToFile(mapData);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const elapsed = (performance.now() - startAt!) / 1000;
    setStatus(`${elapsed.toFixed(2)}s`);
  };

  await new Listr(
    [
      {
        title: "Update maps data",
        task: (_, mainTask) =>
          mainTask.newListr(
            maps.map((map) => ({
              title: map.slug,
              task: async (_, task) => {
                const setStatus = (status: string) => (task.title = `${map.slug}: ${status}`);
                await updateMapData(map, setStatus);
              },
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
  const r6Api = new R6Api();

  console.time("Maps fetched");
  const maps = await fetchMapsList(r6Api);
  await updateMapsData(r6Api, maps);
  r6Api.close();

  console.timeEnd("Maps fetched");

  createGitCommit();
};

main();
