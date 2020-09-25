# lFinder
An open source command line interface link checker written in node.js that will look for dead links in your .txt, .html and .doc files.  

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
# Instructions

To run in your command window type: ```lFinder -n <name of the file>```  Replace <name of file> with the location of file from current directory if necessary.  Other viable prompts are --name.
  
To see which version type ```lFinder --version```

To see viable commands type ```lFinder --help```
