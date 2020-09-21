#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");
const fs = require ("fs");

const options = yargs
    .usage("Usage: -n <name>")
    .option("n", { alias: "name", describe: "Your name", type: "string", demandOption: true })
    .argv;

fs.readfile(options.name, function(err, data){
    if (err){
        console.log(err);
    } else {
        console.log("Data is retreived, file is: " + data.toString());
    }
});

var greeting = chalk.white.bold(`Hello, ${options.name}!`);
//greeting = chalk.white.bold(greeting);

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    backgroundColor: "#555555"
};
const msgBox = boxen(greeting, boxenOptions);

console.log(msgBox);