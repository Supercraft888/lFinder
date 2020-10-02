#!/usr/bin/env node

/*===================================================
  Written by: Alexander Hugh
  Date of: September 25th, 2020
  Title: lFinder
=====================================================*/

const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");
const fs = require("fs");
const fetch = require("node-fetch");
const v = require("../package.json").version;

//Making box for text, not necessary in the long run.
const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
  backgroundColor: "#555555",
};

const regexForURLs = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

let lineArray = []; //Array for each line of the file
let lineWithURLArray = []; //Array for lines with URLs
let onlyURLArray = []; //Array for each individual url
let uniqueURLArray = []; //Array for unique urls from onlyURLArray

//Array for urls that
//THIS CAN BE UPDATED AT ANYTIME
let systemURLs = [
  "http://schemas.microsoft.com/office/2004/12/omml",
  "http://www.w3.org/TR/REC-html40",
  "http://schemas.openxmlformats.org/drawingml/2006/main",
];

//Customize tool name and version inside the box
const vmessage = chalk.white.bold(`lFinder version: ${v}`);
const versionBox = boxen(vmessage, boxenOptions);

//This is the argument passer
const options = yargs
  .usage("Usage: -n <name>")
  .option("n", {
    alias: "name",
    describe: "enter the full name of the file including file type for one or more file",
    type: "array", 
  })
  .option("d", {
    alias: "dir",
    describe: "enter the directory paths",
    type: "array", 
  })
  .check((options)=>{
    if(options.d || options.n){
        handleOptions(options);
        return true;
    }
    console.log("At least one argument is required.")
    return false;
    
  })
  .alias("v", "version")
  .version(`${versionBox}`)
  .alias("h", "help")
  .help("h", "Show help")
  .describe("version", "show version information").argv;
  //to manage different options
  function handleOptions(options){
    if(options.d){
      //passing mutiple directories
      options.d.forEach(i => {
        fs.readdir(i, (err, files)=>{
          if(err){
            console.log(err);
          }else{
            //processing file one by one
            files.forEach(file=>{
              processFile(file);
            })
          }
        })
      });
      
    //passing one or more file name  
    }else if(options.n){
      options.n.forEach(i => {
        processFile(i);
      });
    }

  }
  // process the file and check the url
  function processFile(file){
    fs.readFile(file, "utf8", function(err, data){
      if(err){
          console.log(err)
      }else{
        lineArray = data.toString().split("\n");
        console.log("Number of lines in file is: ", lineArray.length, "\n");
        //goes through "lineArray" and uses the filter method to find lines with http and https in them.
        //Also removes lines that do NOT have urls in them so that we wont wate time on those using our regex on them.
        //Then puts the lines with http and https (with all capitals too) in "lineWithURLArray"
        lineWithURLArray = lineArray.filter(
          (line) =>
            line.includes("https:") ||
            line.includes("http:") ||
            line.includes("HTTPS:") ||
            line.includes("HTTP:")
        );
        console.log("The number of lines with URLs in this file: ",lineWithURLArray.length,"\n");
        console.log("Checking for the number of URL's in this file...\n");
        //goes through the "lineWithURLArray" and finds things that match the regex.  Then puts them into onlyURLArray made at line 21-ish
        for (let i = 0; i < lineWithURLArray.length; i++) {
          let res = lineWithURLArray[i].match(regexForURLs);
          if (res) {
            onlyURLArray = onlyURLArray.concat(res);
          }
        }
        console.log("The number of URLs in this file: ", onlyURLArray.length, "\n");
    
        //goes through onlyURLArray and checks for unique URLs and puts them into uniqueURLArray
        for (i = 0; i < onlyURLArray.length; i++) {
          if (uniqueURLArray.indexOf(onlyURLArray[i]) === -1) {
            uniqueURLArray.push(onlyURLArray[i]);
          }
        }
        //a nested forloop that checks for system urls (things that html and pdf files need to open) and removes them
        for (j = 0; j < systemURLs.length; j++) {
          for (i = 0; i < uniqueURLArray.length; i++) {
            if (uniqueURLArray[i] === systemURLs[j]) {
              uniqueURLArray.splice(i, 1);
            }
          }
        }
        console.log(
          "The number of UNIQUE URLs in this file: ",
          uniqueURLArray.length,
          "\n"
        );

        uniqueURLArray.forEach(async (url) => {
          try {
            const urlIndiv = await fetch(url, { method: "head", timeout: 13000 });
            if (urlIndiv.status === 200) {
              console.log(chalk.green("good: ", url));
            } else if (urlIndiv.status === 400 || urlIndiv.status === 404) {
              console.log(chalk.redBright("bad: ", url));
            } else {
              console.log(chalk.grey("unknown: ", url));
            }
          } catch (err) {
            console.log(chalk.rgb(210, 0, 0)("bad (other): ", url));
          }
        });
        var greeting = chalk.white.bold("lFinder is now testing: ", `${file}!`);
        const msgBox = boxen(greeting, boxenOptions);
        //code for displaying the statuses above
        console.log(msgBox);

      }
    })
  }
//handling directory paths
// fs.readdir(options.dir, (err, files) =>{
//   files.forEach(file =>{
//     console.log(file);
//     //Goes through entered file and puts each line into an element inside "lineArray"
//       fs.readFile(file, "utf8", function(err, data){
//         if(err){
//           console.log(err)
//         }else{
//           lineArray = data.toString().split("\n");
//           console.log("Number of lines in file is: ", lineArray.length, "\n");
  
//          //goes through "lineArray" and uses the filter method to find lines with http and https in them.
//         //Also removes lines that do NOT have urls in them so that we wont wate time on those using our regex on them.
//         //Then puts the lines with http and https (with all capitals too) in "lineWithURLArray"
//         lineWithURLArray = lineArray.filter(
//           (line) =>
//             line.includes("https:") ||
//             line.includes("http:") ||
//             line.includes("HTTPS:") ||
//             line.includes("HTTP:")
//         );
//         console.log(
//           "The number of lines with URLs in this file: ",
//           lineWithURLArray.length,
//           "\n"
//         );
    
//         console.log("Checking for the number of URL's in this file...\n");
    
//         //goes through the "lineWithURLArray" and finds things that match the regex.  Then puts them into onlyURLArray made at line 21-ish
//         for (let i = 0; i < lineWithURLArray.length; i++) {
//           let res = lineWithURLArray[i].match(regexForURLs);
//           if (res) {
//             onlyURLArray = onlyURLArray.concat(res);
//           }
//         }
//         console.log("The number of URLs in this file: ", onlyURLArray.length, "\n");
    
//         //goes through onlyURLArray and checks for unique URLs and puts them into uniqueURLArray
//         for (i = 0; i < onlyURLArray.length; i++) {
//           if (uniqueURLArray.indexOf(onlyURLArray[i]) === -1) {
//             uniqueURLArray.push(onlyURLArray[i]);
//           }
//         }
//         //a nested forloop that checks for system urls (things that html and pdf files need to open) and removes them
//         for (j = 0; j < systemURLs.length; j++) {
//           for (i = 0; i < uniqueURLArray.length; i++) {
//             if (uniqueURLArray[i] === systemURLs[j]) {
//               uniqueURLArray.splice(i, 1);
//             }
//           }
//         }
//         console.log(
//           "The number of UNIQUE URLs in this file: ",
//           uniqueURLArray.length,
//           "\n"
//         );
    
//         uniqueURLArray.forEach(async (url) => {
//           try {
//             const urlIndiv = await fetch(url, { method: "head", timeout: 13000 });
//             if (urlIndiv.status === 200) {
//               console.log(chalk.green("good: ", url));
//             } else if (urlIndiv.status === 400 || urlIndiv.status === 404) {
//               console.log(chalk.redBright("bad: ", url));
//             } else {
//               console.log(chalk.grey("unknown: ", url));
//             }
//           } catch (err) {
//             console.log(chalk.rgb(210, 0, 0)("bad (other): ", url));
//           }
//         });

//       }
        
//     })
      
//       var greeting = chalk.white.bold("lFinder is now testing: ", `${file}!`);
  
// //   const msgBox = boxen(greeting, boxenOptions);
  
// //   //code for displaying the statuses above
// //   console.log(msgBox);

//   })

// })


// //handling multiple file names in the argument
// for( let i = 0; i < options.name.length; i++){
//   //how to read the file entered in the argument one by one
//   fs.readFile(options.name[i], "utf8", function (err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       //Goes through entered file and puts each line into an element inside "lineArray"
//       lineArray = data.toString().split("\n");
//       console.log("Number of lines in file is: ", lineArray.length, "\n");
  
//       //goes through "lineArray" and uses the filter method to find lines with http and https in them.
//       //Also removes lines that do NOT have urls in them so that we wont wate time on those using our regex on them.
//       //Then puts the lines with http and https (with all capitals too) in "lineWithURLArray"
//       lineWithURLArray = lineArray.filter(
//         (line) =>
//           line.includes("https:") ||
//           line.includes("http:") ||
//           line.includes("HTTPS:") ||
//           line.includes("HTTP:")
//       );
//       console.log(
//         "The number of lines with URLs in this file: ",
//         lineWithURLArray.length,
//         "\n"
//       );
  
//       console.log("Checking for the number of URL's in this file...\n");
  
//       //goes through the "lineWithURLArray" and finds things that match the regex.  Then puts them into onlyURLArray made at line 21-ish
//       for (let i = 0; i < lineWithURLArray.length; i++) {
//         let res = lineWithURLArray[i].match(regexForURLs);
//         if (res) {
//           onlyURLArray = onlyURLArray.concat(res);
//         }
//       }
//       console.log("The number of URLs in this file: ", onlyURLArray.length, "\n");
  
//       //goes through onlyURLArray and checks for unique URLs and puts them into uniqueURLArray
//       for (i = 0; i < onlyURLArray.length; i++) {
//         if (uniqueURLArray.indexOf(onlyURLArray[i]) === -1) {
//           uniqueURLArray.push(onlyURLArray[i]);
//         }
//       }
//       //a nested forloop that checks for system urls (things that html and pdf files need to open) and removes them
//       for (j = 0; j < systemURLs.length; j++) {
//         for (i = 0; i < uniqueURLArray.length; i++) {
//           if (uniqueURLArray[i] === systemURLs[j]) {
//             uniqueURLArray.splice(i, 1);
//           }
//         }
//       }
//       console.log(
//         "The number of UNIQUE URLs in this file: ",
//         uniqueURLArray.length,
//         "\n"
//       );
  
//       uniqueURLArray.forEach(async (url) => {
//         try {
//           const urlIndiv = await fetch(url, { method: "head", timeout: 13000 });
//           if (urlIndiv.status === 200) {
//             console.log(chalk.green("good: ", url));
//           } else if (urlIndiv.status === 400 || urlIndiv.status === 404) {
//             console.log(chalk.redBright("bad: ", url));
//           } else {
//             console.log(chalk.grey("unknown: ", url));
//           }
//         } catch (err) {
//           console.log(chalk.rgb(210, 0, 0)("bad (other): ", url));
//         }
//       });
//     }
//   });
  
//   var greeting = chalk.white.bold("lFinder is now testing: ", `${options.name[i]}!`);
  
//   const msgBox = boxen(greeting, boxenOptions);
  
//   //code for displaying the statuses above
//   console.log(msgBox);
  

// }
