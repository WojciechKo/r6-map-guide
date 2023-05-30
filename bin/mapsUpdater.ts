/* eslint-disable no-console */
import Bottleneck from "bottleneck";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import yaml from "js-yaml";
import { Listr } from "listr2";

import { close, fetchMapData, fetchMapsList } from "../lib/R6Api";

import type { MapData, MapUrl } from "../lib/R6Api";

const writeToFile = (mapData: MapData) => {
  const filename = `data/maps/${mapData.slug}.yaml`;
  return fs.writeFile(filename, yaml.dump(mapData));
};

const fetchMapsListTask = async (): Promise<MapUrl[]> => {
  const { maps } = await new Listr<{ maps: MapUrl[] }>([
    {
      title: "Fetch maps list",
      task: async (ctx) => {
        ctx.maps = await fetchMapsList();
      },
    },
  ]).run();
  return maps;
};

const updateMapsDataTask = async (maps: MapUrl[]) => {
  const limiter = new Bottleneck({ maxConcurrent: 6, minTime: 1000 });

  const updateMapData = async (map: MapUrl, setStatus: (title: string) => void) => {
    let startAt: number;
    const mapData = await limiter.schedule(async () => {
      startAt = performance.now();
      setStatus(`Fetching...`);
      return fetchMapData(map);
    });

    setStatus(`Storing...`);
    await writeToFile(mapData);

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
    { rendererOptions: { collapseSubtasks: false } }
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
  const maps = await fetchMapsListTask();
  await updateMapsDataTask(maps);
  close();

  console.timeEnd("Maps fetched");

  createGitCommit();
};

main();
