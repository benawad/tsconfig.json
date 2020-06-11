#!/usr/bin/env node
const inquirer = require("inquirer");
const path = require('path');
const { writeFile, readdir, readFile } = require("fs").promises;

const configFiles = {};
const configFolderPath = path.resolve(__dirname, 'config');


(async () => {

  const files = await readdir(configFolderPath).catch(console.log);

  for (let i of files) {
    // framework name is situated between 2 dots eg- react between 2 '.'(s)
    const [start, end] = getAllRegexIndexes(i, /\./g);
    const prop = i.slice(start + 1, end);
    configFiles[prop] = path.join(configFolderPath, i);
  }

  const { framework } = await inquirer.prompt([
    {
      type: "list",
      message: "Pick the framework you're using:",
      name: "framework",
      choices: Object.keys(configFiles),
    }
  ]);

  const config = await readFile(configFiles[framework]).catch(console.log);

  const tsconfig = path.join(process.cwd(), 'tsconfig.json');

  await writeFile(tsconfig, JSON.stringify(config.toString(), null, 2));
 
  console.log("tsconfig.json successfully created");
})()



// should we just call /\./g twice ?
function getAllRegexIndexes(str, regexp) {
  let container = [];
  while(container[container.length - 1] !== null) {
    let index = regexp.exec(str); // .exec returns null when no match is found to we have to watch out for it to avoid error without executing .exec twice
    index = (index) ? index.index : null ;
    container.push(index);
  }
  return container.slice(0, container.length - 1);
}
