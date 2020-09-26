# lFinder
An open source command line interface link checker written in node.js that will look for dead links with support for .txt, .html and .doc files.  

---
# Features
- Coloured text cleanly shows what urls are good or bad in your system
  - Good links (200 status) are in green
  - Checks for bad 404 and 400 errors in bright red
  - Unknown errors (not a 404 or 400) are in grey
  - Timeouts and DNS resolution are in dark red
- Shows number of lines in file, number of lines with URLs, and number of unique URLs
- Asyncronous functionality speeds up checking

---
# Installation
1. Ensure you have node.js installed on your computer
2. Download the tool as a zip or clone it
3. Open up a command line terminal and go into the folder with the tool
4. Run command npm -install -g to install globally while inside the folder  
**===ALTERNATIVLEY===**   
Run command npm install -g https://github.com/Supercraft888/lFinder.git which should install it from github itself globally

**To uninstall use a command line terminal and enter npm uninstall -g lFinder**

---
# Instructions

To run in your command window type: ```lFinder -n <name of the file>```  Replace <name of file> with the location of file from current directory if necessary.  Other viable prompts are --name.
  
To see which version type ```lFinder --version```

To see viable commands type ```lFinder --help```

You can ignore the testing files, they are not necessary.

# License
ISC License
Copyright (c) 2020, Alexander Hugh

**PLEASE READ LICENCE.md FOR MORE INFORMATION**
