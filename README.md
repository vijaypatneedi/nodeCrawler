# Web-Crawler

## Requirements

Recursively crawl popular blogging website https://medium.com using Node.js and harvest all possible hyperlinks that belong to medium.com and store them in a database.

What is needed to be stored?
1. Every unique URL encountered.
2. The total reference count of every URL.
3. A complete unique list of parameters associated with this URL

## Assumption
1. Let’s say the first request to medium.com gives a 100 links
2. We’ll fire the first 5 requests using the 1st 5 links (concurrency of 5 requests)
3. Now one of them finishes (concurrency = 4), but because we need 5 concurrent requests at all time, you’ll fire one more request with the 6th url in the list, making the concurrency = 5 again.
4. This goes on till all the links in the list are exhausted.

# Instructions to install on local machine 

    1. Run Command - git clone https://github.com/vijaypatneedi/nodeCrawler.git
    2. Run npm install
    3. node app.js

# Environment Variable
   1. PORT -- Port for running server (default: 3000)
   2. MONGO_URL  -- Url for mongo connection (default:  'mongodb://localhost:27017')
   3. DB -- Name of DataBase (default: "crawler")
   4. MONGO_RECONN_TRIES -- Mongo reconnection tries (default: 0)
   4. MONGO_RECONN_TIME -- Mongo reconnection time (default: 0)


# To Retrieve the already parsed urls-
   Hit the URL in your browser - localhost:`${portOnWhichYourLocalServerIsRunning}`/getData

# To Start the Process of Scraping afresh-
   Hit the URL in your browser - localhost:`${portOnWhichYourLocalServerIsRunning}`/crawl

   And after 1-2 minutes again hit the URl - localhost:`${portOnWhichYourLocalServerIsRunning}`/getData
    to see the parsed urls


