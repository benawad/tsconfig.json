#!/usr/bin/env node
const inquirer = require("inquirer");
const { writeFileSync } = require("fs");
const tsconfigNode = require("./config/tsconfig.node.json");
const tsconfigReact = require("./config/tsconfig.react.json");
const tsconfigReactNative = require("./config/tsconfig.react-native.json");

const tsconfigs = {
  "node": tsconfigNode,
  "react": tsconfigReact,
  "react-native": tsconfigReactNative,
};

(async () => {
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      message: "Pick the framework you're using:",
      name: "framework",
      choices: ["react", "react-native", "node"]
    }
  ]);

  const cwd = process.cwd();

  writeFileSync(`${cwd}/tsconfig.json`, JSON.stringify(tsconfigs[framework], null, 2));

  console.log("tsconfig.json successfully created");
})()
