#!/usr/bin/env node
import inquirer from "inquirer";
import { resolve, join, dirname } from "path";
import { promises } from "fs";
import { fileURLToPath } from "url";

const { writeFile, readdir, readFile } = promises;
const { prompt } = inquirer;
const __dirname = dirname(fileURLToPath(import.meta.url));

const configFiles = {};
const configFolderPath = resolve(__dirname, "config");

(async () => {
  const files = await readdir(configFolderPath).catch(console.log);

  for (let i of files) {
    // framework name is situated between 2 dots eg- react between 2 '.'(s)
    const frameworkName = i.split(".")[1];
    configFiles[frameworkName] = join(configFolderPath, i);
  }

  const { framework } = await prompt([
    {
      type: "list",
      message: "Pick the framework you're using:",
      name: "framework",
      choices: Object.keys(configFiles),
    },
  ]);

  let config = await readFile(configFiles[framework]).catch(console.log);

  const tsconfig = join(process.cwd(), "tsconfig.json");

  if (framework === "node") {
    const reg = new RegExp(/(?<=v)(\d+)/);
    const version = parseInt(reg.exec(process.version)[0]);

    if (version >= 14) {
      // Optimal config for Node v14.0.0 (full ES2020)
      const updateConfig = {
        allowSyntheticDefaultImports: true,
        lib: ["es2020"],
        module: "es2020",
        moduleResolution: "node",
        target: "es2020",
      };

      const configObj = Object.keys(updateConfig).reduce((prev, curr) => {
        return {
          ...prev,
          compilerOptions: {
            ...prev.compilerOptions,
            [curr]: updateConfig[curr],
          },
        };
      }, JSON.parse(config.toString()));

      config = JSON.stringify(configObj, null, 2);
    }
  }

  await writeFile(tsconfig, config.toString());

  console.log("tsconfig.json successfully created");
})();
