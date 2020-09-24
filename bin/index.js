#!/usr/bin/env node

/*
1: loop thorugh lineArray and use regex to get urls
    1.1: push those individual urls into urlArray
2: use fetch() to get the url
    2.1: use code below
3: print the status with chalk

fetch(url).then(res => {
  if (res.status_code === 200) {
    console.log(url is good in green color)
  } else if (res.status_code === 404 or res.status_code === 400) {
    console.log(url is broken in red color)
  } else {
    console.log(url is unknown in grey color)
  }
  .catch(err => {
    throw new Error(invalid input!  Stopping the CLI before you break it more!)
  }
}
*/

const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");
const fs = require("fs");
const fetch = require("node-fetch");
const { url } = require("inspector");
const { count } = require("console");

const regexForURLs = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

let urlLinks = [];

//This is the argument passer
const options = yargs
  .usage("Usage: -n <name>")
  .option("n", { alias: "name", describe: "Your name", type: "string", demandOption: true })
  .argv;

//how to read the file entered in the argument
fs.readFile(options.name, 'utf8', function (err, data) {
  if (err) {
    console.log(err);
  } else {
    let lineArray = data.toString().split("\n");
    console.log("Number of lines in file is: ", lineArray.length);

    let urlArray = lineArray.filter(line => line.includes("https:") || line.includes("http:") || line.includes("HTTPS:") || line.includes("HTTP:"));
    console.log("The number of URLs in this file: ", urlArray.length);

    for (let i = 0; i < urlArray.length; i++) {
      let res = urlArray[i].match(regexForURLs);
      if (res) {
        urlLinks = urlLinks.concat(res);
      }
    };
    console.log(urlLinks);
    
    urlLinks.forEach(async url => {
      try {
        const urlIndiv = await fetch(url, {method: "head", timeout: 1500});
        if (urlIndiv.status === 200) {
          console.log(chalk.greenBright("good: ", url));
        }
        else if (urlIndiv.status === 400 || urlIndiv.status === 404) {
          console.log(chalk.redBright("bad: ", url));
        }
        else {
          console.log(chalk.grey("unknown: ", url));
        }
      } catch (err) {
        console.log(chalk.redBright("bad: ", url));;
      }
    });
  }
});







var greeting = chalk.white.bold(`${options.name}!`);

//Making box for text, not necessary in the long run.
const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
  backgroundColor: "#555555"
};
const msgBox = boxen(greeting, boxenOptions);

//code for displaying the statuses above

console.log(msgBox);