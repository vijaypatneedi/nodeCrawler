const saveData = require('./crud');
const urlModel = require('../Models/urlModel');
var cheerio = require('cheerio');
var request = require('request');
const util = require('util');
var urlsArray = [
    'https://medium.com/'
];

class processQueue {

    constructor(urls = [], concurrentCount = 1) {
        this.concurrent = concurrentCount - 1;
        this.todo = urls;
        this.running = [];
        this.complete = [];
        this.completedUrls = {};
    }

    get runAnotherProcess() {
        return (this.running.length < this.concurrent && this.todo.length > 0);
    }

    validateUrl(url) {
        const pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return !!pattern.test(url);
    }

    validateForMediumUrl(url) {
        let pattern = 'medium.com';
        pattern = new RegExp(pattern);
        return pattern.test(url);

    }
    //
    removeDuplicateUrls(taskUrls, completedUrlsObject, callback) {
        return new Promise(async (resolve, reject) => {
            let updatedUrls = []
            updatedUrls = taskUrls.filter(url => {
                let u = url;
                if (completedUrlsObject[u] != true && this.validateUrl(url)) { return true; }
                return false;
            })
            resolve(updatedUrls);
        })
    }

    Scrapping() {
        while (this.runAnotherProcess) {
            var url = this.todo.shift();
            if (!this.completedUrls[url] && this.validateUrl(url) && this.validateForMediumUrl(url)) {
                this.completedUrls[url] = true;//mark as completed

                scrape(url).then((taskUrls) => {
                    if (taskUrls.length > 0) {
                        this.removeDuplicateUrls(taskUrls, this.completedUrls).then(uniqueUrls => {
                            this.todo = [...this.todo, ...uniqueUrls]
                            this.complete.push(this.running.shift());

                            if (this.todo.length == 0 || this.complete.length == 50) {
                                scrapingDone(this.complete)
                                this.complete.length = 0;
                            }
                            this.Scrapping();
                        }).catch(err => {
                            scrapingDone(this.complete);
                        })

                    } else {
                        this.todo = [...this.todo, ...taskUrls];
                        this.complete.push(this.running.shift());

                        if (this.todo.length == 0 || this.complete.length == 50) {
                            scrapingDone(this.complete)
                            this.complete.length = 0;
                        }
                        this.Scrapping();
                    }

                }).catch(err => {
                    this.Scrapping();

                    scrapingDone(this.complete)
                })
                this.running.push(url);
            }
        }
    }
}

var startQueue = new processQueue(urlsArray, 5);

const scrape = (url) => {
    return new Promise((resolve, reject) => {
        let taskUrls = [];
        request(url, (err, res, body) => {
            if (err) resolve([]);
            if (body) {
                $ = cheerio.load(body);
                links = $('a');
                $(links).each(function (i, link) {
                    taskUrls.push($(link).attr('href'));
                }, resolve(taskUrls));
            } else {
                resolve(taskUrls)
            }
        })
    })
}

function scrapingDone(urlsArray) {
    saveData.insertInDB(urlsArray);
}

function start(req, res) {
    startQueue.Scrapping();
    res.json({
        msg: 'Scraping is started'
    })

    dropCollectionAsync();
}

const dropCollection = () => {
    urlModel.find({}).then(ifExists => {
        if (ifExists.length > 0) {
            urlModel.collection.drop();
        }
    });

}
const dropCollectionAsync = util.promisify(dropCollection);


process.on('uncaughtException', function (err) {
    console.log(err)
})

module.exports = { start };
